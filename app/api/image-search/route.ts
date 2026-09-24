import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

type VisionSearchResponse = {
  model: string
  results: Array<{
    product_id: string
    title: string
    slug?: string | null
    product_url?: string | null
    image_url: string
    similarity: number
  }>
}

function getVisionConfig() {
  const baseUrl =
    process.env.STONE_VISION_API_URL?.trim().replace(
      /\/+$/,
      '',
    )

  const adminApiKey =
    process.env.STONE_VISION_ADMIN_API_KEY?.trim()

  if (!baseUrl || !adminApiKey) {
    return null
  }

  return {
    baseUrl,
    adminApiKey,
  }
}

function jsonError(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status,
    },
  )
}

export async function POST(
  request: Request,
) {
  const config = getVisionConfig()

  if (!config) {
    console.error(
      '[POST /api/image-search] Missing Stone Vision configuration.',
    )

    return jsonError(
      'سرویس جستجوی تصویری در حال حاضر پیکربندی نشده است.',
      503,
    )
  }

  let formData: FormData

  try {
    formData = await request.formData()
  } catch (error) {
    console.error(
      '[POST /api/image-search] Invalid multipart form.',
      error,
    )

    return jsonError(
      'فایل تصویر قابل دریافت نیست.',
      400,
    )
  }

  const value = formData.get('file')

  if (!(value instanceof File)) {
    return jsonError(
      'لطفاً یک تصویر انتخاب کنید.',
      400,
    )
  }

  if (value.size <= 0) {
    return jsonError(
      'فایل تصویر خالی است.',
      400,
    )
  }

  if (value.size > MAX_UPLOAD_BYTES) {
    return jsonError(
      'حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.',
      413,
    )
  }

  if (!ALLOWED_MIME_TYPES.has(value.type)) {
    return jsonError(
      'فقط تصاویر JPG، PNG و WebP قابل استفاده هستند.',
      415,
    )
  }

  const outgoingFormData = new FormData()

  outgoingFormData.append(
    'file',
    value,
    value.name || 'image-search-upload',
  )

  try {
    const response = await fetch(
      `${config.baseUrl}/v1/search/image`,
      {
        method: 'POST',

        headers: {
          Accept: 'application/json',
          'X-Admin-Key': config.adminApiKey,
        },

        body: outgoingFormData,

        cache: 'no-store',

        signal: AbortSignal.timeout(35_000),
      },
    )

    const rawBody =
      await response.text()

    let data:
      | VisionSearchResponse
      | { detail?: string; error?: string }
      | null = null

    if (rawBody) {
      try {
        data = JSON.parse(rawBody)
      } catch {
        data = null
      }
    }

    if (!response.ok) {
      console.error(
        '[POST /api/image-search] Vision service error:',
        response.status,
        data,
      )

      return jsonError(
        typeof data === 'object' &&
          data !== null &&
          'detail' in data &&
          typeof data.detail === 'string'
          ? data.detail
          : 'جستجوی تصویری با خطا مواجه شد.',
        response.status >= 400 &&
          response.status < 500
          ? response.status
          : 502,
      )
    }

    if (
      !data ||
      typeof data !== 'object' ||
      !Array.isArray(
        (data as VisionSearchResponse).results,
      )
    ) {
      console.error(
        '[POST /api/image-search] Invalid Vision response.',
        data,
      )

      return jsonError(
        'پاسخ موتور جستجوی تصویری معتبر نیست.',
        502,
      )
    }

    return NextResponse.json(
      data,
      {
        headers: {
          'Cache-Control':
            'no-store, max-age=0',
        },
      },
    )
  } catch (error) {
    console.error(
      '[POST /api/image-search] Vision request failed.',
      error,
    )

    return jsonError(
      'ارتباط با موتور جستجوی تصویری برقرار نشد. لطفاً دوباره تلاش کنید.',
      502,
    )
  }
}