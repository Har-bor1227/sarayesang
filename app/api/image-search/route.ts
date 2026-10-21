import { NextResponse } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const MAX_REQUEST_BYTES = MAX_UPLOAD_BYTES + 256 * 1024
const MAX_UPSTREAM_RESPONSE_BYTES = 512 * 1024
const MAX_IMAGE_PIXELS = 25_000_000
const MAX_IMAGE_SIDE = 12_000
const MAX_RESULTS = 50

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

const CONTENT_TYPE_BY_FORMAT = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
} as const

type ImageFormat = keyof typeof CONTENT_TYPE_BY_FORMAT

type VerifiedImage = {
  mimeType: (typeof CONTENT_TYPE_BY_FORMAT)[ImageFormat]
  fileName: string
  format: ImageFormat
}

type VisionSearchResult = {
  product_id: string
  title: string
  slug?: string | null
  product_url?: string | null
  image_url: string
  similarity: number
}

type VisionSearchResponse = {
  model: string
  results: VisionSearchResult[]
}

class RequestBodyTooLargeError extends Error {
  constructor() {
    super('Request body exceeded the configured limit.')
    this.name = 'RequestBodyTooLargeError'
  }
}

class UpstreamResponseTooLargeError extends Error {
  constructor() {
    super('Upstream response exceeded the configured limit.')
    this.name = 'UpstreamResponseTooLargeError'
  }
}

/**
 * Copy bytes into a standalone ArrayBuffer.
 *
 * Using a fresh ArrayBuffer avoids TypeScript incompatibilities
 * between Node.js Buffer<ArrayBufferLike> and the Fetch BodyInit type.
 */
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const result = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(result).set(bytes)
  return result
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )
}

function isSameOriginRequest(request: Request): boolean {
  const fetchSite = request.headers
    .get('sec-fetch-site')
    ?.toLowerCase()

  if (fetchSite === 'cross-site') {
    return false
  }

  const origin = request.headers.get('origin')

  // Non-browser clients may omit Origin.
  // If supplied, it must match the request origin.
  if (!origin) {
    return true
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

function getVisionConfig():
  | {
      baseUrl: string
      adminApiKey: string
    }
  | null {
  const rawBaseUrl = process.env.STONE_VISION_API_URL?.trim()
  const adminApiKey = process.env.STONE_VISION_ADMIN_API_KEY?.trim()

  if (!rawBaseUrl || !adminApiKey) {
    return null
  }

  try {
    const url = new URL(rawBaseUrl)

    const isLocalDevelopmentHost =
      process.env.NODE_ENV !== 'production' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(
        url.hostname,
      )

    if (
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.protocol !== 'https:' &&
        !(url.protocol === 'http:' && isLocalDevelopmentHost))
    ) {
      return null
    }

    return {
      baseUrl: url.toString().replace(/\/+$/, ''),
      adminApiKey,
    }
  } catch {
    return null
  }
}

function hasValidContentLength(
  request: Request,
):
  | { ok: true; length: number | null }
  | { ok: false; status: number } {
  const header = request.headers.get('content-length')

  if (header === null) {
    return {
      ok: true,
      length: null,
    }
  }

  if (!/^\d+$/.test(header)) {
    return {
      ok: false,
      status: 400,
    }
  }

  const length = Number(header)

  if (!Number.isSafeInteger(length) || length < 0) {
    return {
      ok: false,
      status: 400,
    }
  }

  if (length > MAX_REQUEST_BYTES) {
    return {
      ok: false,
      status: 413,
    }
  }

  return {
    ok: true,
    length,
  }
}

async function readRequestBodyWithLimit(
  request: Request,
  limit: number,
): Promise<Buffer> {
  if (!request.body) {
    return Buffer.alloc(0)
  }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      totalBytes += value.byteLength

      if (totalBytes > limit) {
        await reader.cancel().catch(() => undefined)
        throw new RequestBodyTooLargeError()
      }

      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  return Buffer.concat(chunks, totalBytes)
}

async function readResponseTextWithLimit(
  response: Response,
  limit: number,
): Promise<string> {
  if (!response.body) {
    return ''
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      totalBytes += value.byteLength

      if (totalBytes > limit) {
        await reader.cancel().catch(() => undefined)
        throw new UpstreamResponseTooLargeError()
      }

      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const responseBytes = Buffer.concat(chunks, totalBytes)

  return new TextDecoder('utf-8', {
    fatal: true,
  }).decode(responseBytes)
}

function detectImageSignature(
  bytes: Buffer,
): VerifiedImage | null {
  // JPEG
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return {
      format: 'jpeg',
      mimeType: CONTENT_TYPE_BY_FORMAT.jpeg,
      fileName: 'image-search-upload.jpg',
    }
  }

  // PNG
  const pngSignature = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
  ])

  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(pngSignature)
  ) {
    return {
      format: 'png',
      mimeType: CONTENT_TYPE_BY_FORMAT.png,
      fileName: 'image-search-upload.png',
    }
  }

  // WebP
  if (
    bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return {
      format: 'webp',
      mimeType: CONTENT_TYPE_BY_FORMAT.webp,
      fileName: 'image-search-upload.webp',
    }
  }

  return null
}

async function verifyImage(
  bytes: Buffer,
): Promise<VerifiedImage | null> {
  const signature = detectImageSignature(bytes)

  if (!signature) {
    return null
  }

  try {
    const image = sharp(bytes, {
      failOn: 'warning',
      limitInputPixels: MAX_IMAGE_PIXELS,
      limitInputChannels: 4,
      sequentialRead: true,
    })

    const metadata = await image.metadata()

    if (
      metadata.format !== signature.format ||
      !metadata.width ||
      !metadata.height ||
      metadata.width > MAX_IMAGE_SIDE ||
      metadata.height > MAX_IMAGE_SIDE ||
      metadata.width * metadata.height > MAX_IMAGE_PIXELS ||
      (metadata.pages ?? 1) > 1
    ) {
      return null
    }

    // Force decoding so a forged image header is not sufficient.
    await sharp(bytes, {
      failOn: 'warning',
      limitInputPixels: MAX_IMAGE_PIXELS,
      limitInputChannels: 4,
      sequentialRead: true,
    })
      .resize({
        width: 1,
        height: 1,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer()

    return signature
  } catch {
    return null
  }
}

function isSafeHttpUrl(
  value: string,
  allowRelative = false,
): boolean {
  if (
    !value ||
    value.length > 2_048 ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return false
  }

  if (
    allowRelative &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\')
  ) {
    return true
  }

  try {
    const url = new URL(value)

    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}

function isVisionSearchResponse(
  value: unknown,
): value is VisionSearchResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as {
    model?: unknown
    results?: unknown
  }

  if (
    typeof candidate.model !== 'string' ||
    candidate.model.length === 0 ||
    candidate.model.length > 120 ||
    !Array.isArray(candidate.results) ||
    candidate.results.length > MAX_RESULTS
  ) {
    return false
  }

  return candidate.results.every((result) => {
    if (typeof result !== 'object' || result === null) {
      return false
    }

    const item = result as {
      product_id?: unknown
      title?: unknown
      slug?: unknown
      product_url?: unknown
      image_url?: unknown
      similarity?: unknown
    }

    return (
      typeof item.product_id === 'string' &&
      item.product_id.length > 0 &&
      item.product_id.length <= 128 &&
      typeof item.title === 'string' &&
      item.title.length <= 500 &&
      typeof item.image_url === 'string' &&
      isSafeHttpUrl(item.image_url) &&
      typeof item.similarity === 'number' &&
      Number.isFinite(item.similarity) &&
      (item.slug === undefined ||
        item.slug === null ||
        (typeof item.slug === 'string' &&
          item.slug.length <= 512)) &&
      (item.product_url === undefined ||
        item.product_url === null ||
        (typeof item.product_url === 'string' &&
          isSafeHttpUrl(item.product_url, true)))
    )
  })
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return jsonError('درخواست معتبر نیست.', 403)
  }

  const contentEncoding = request.headers
    .get('content-encoding')
    ?.toLowerCase()

  if (
    contentEncoding &&
    contentEncoding !== 'identity'
  ) {
    return jsonError('نوع درخواست پشتیبانی نمی‌شود.', 415)
  }

  const contentLength = hasValidContentLength(request)

  if (!contentLength.ok) {
    const message =
      contentLength.status === 413
        ? 'حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.'
        : 'اندازه درخواست معتبر نیست.'

    return jsonError(message, contentLength.status)
  }

  const contentType = request.headers.get('content-type') ?? ''

  if (
    !/^multipart\/form-data\s*;/i.test(contentType) ||
    !/\bboundary=(?:"[^"]+"|[^;\s]+)/i.test(contentType)
  ) {
    return jsonError('فرمت درخواست معتبر نیست.', 415)
  }

  const config = getVisionConfig()

  if (!config) {
    console.error(
      '[POST /api/image-search] Stone Vision configuration is invalid or missing.',
    )

    return jsonError(
      'سرویس جستجوی تصویری در حال حاضر در دسترس نیست.',
      503,
    )
  }

  let rawBody: Buffer
  let formData: FormData

  try {
    rawBody = await readRequestBodyWithLimit(
      request,
      MAX_REQUEST_BYTES,
    )

    const replayHeaders = new Headers(request.headers)

    replayHeaders.delete('content-length')
    replayHeaders.delete('transfer-encoding')

    const replayRequest = new Request(request.url, {
      method: 'POST',
      headers: replayHeaders,

      // Convert Buffer to a standalone ArrayBuffer for BodyInit.
      body: toArrayBuffer(rawBody),
    })

    formData = await replayRequest.formData()
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return jsonError(
        'حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.',
        413,
      )
    }

    console.warn(
      '[POST /api/image-search] Request body rejected.',
    )

    return jsonError('فایل تصویر قابل دریافت نیست.', 400)
  }

  const entries = Array.from(formData.entries())

  if (
    entries.length !== 1 ||
    entries[0]?.[0] !== 'file'
  ) {
    return jsonError(
      'درخواست باید فقط شامل یک فایل تصویر باشد.',
      400,
    )
  }

  const value = formData.get('file')

  if (!(value instanceof File)) {
    return jsonError('لطفاً یک تصویر انتخاب کنید.', 400)
  }

  if (value.size <= 0) {
    return jsonError('فایل تصویر خالی است.', 400)
  }

  if (value.size > MAX_UPLOAD_BYTES) {
    return jsonError(
      'حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.',
      413,
    )
  }

  if (
    value.type &&
    !ALLOWED_MIME_TYPES.has(value.type)
  ) {
    return jsonError(
      'فقط تصاویر JPG، PNG و WebP قابل استفاده هستند.',
      415,
    )
  }

  let imageBytes: Buffer

  try {
    imageBytes = Buffer.from(await value.arrayBuffer())
  } catch {
    return jsonError('خواندن فایل تصویر ناموفق بود.', 400)
  }

  const verifiedImage = await verifyImage(imageBytes)

  if (!verifiedImage) {
    return jsonError(
      'فایل تصویر معتبر نیست یا ابعاد آن بیش از حد مجاز است. از تصویر JPG، PNG یا WebP استفاده کنید.',
      415,
    )
  }

  if (
    value.type &&
    value.type !== verifiedImage.mimeType
  ) {
    return jsonError(
      'نوع واقعی فایل با نوع اعلام‌شده آن مطابقت ندارد.',
      415,
    )
  }

  // File receives a standalone ArrayBuffer, avoiding Buffer type issues.
  const verifiedFile = new File(
    [toArrayBuffer(imageBytes)],
    verifiedImage.fileName,
    {
      type: verifiedImage.mimeType,
    },
  )

  const outgoingFormData = new FormData()

  outgoingFormData.append(
    'file',
    verifiedFile,
    verifiedImage.fileName,
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
        redirect: 'error',
        signal: AbortSignal.timeout(35_000),
      },
    )

    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined)

      console.error(
        '[POST /api/image-search] Vision service returned status:',
        response.status,
      )

      return jsonError(
        'جستجوی تصویری با خطا مواجه شد. لطفاً دوباره تلاش کنید.',
        502,
      )
    }

    const upstreamContentType = response.headers
      .get('content-type')
      ?.split(';', 1)[0]
      ?.trim()
      .toLowerCase()

    if (upstreamContentType !== 'application/json') {
      await response.body?.cancel().catch(() => undefined)

      console.error(
        '[POST /api/image-search] Vision service returned a non-JSON response.',
      )

      return jsonError(
        'پاسخ موتور جستجوی تصویری معتبر نیست.',
        502,
      )
    }

    let data: unknown

    try {
      const rawResponse = await readResponseTextWithLimit(
        response,
        MAX_UPSTREAM_RESPONSE_BYTES,
      )

      data = JSON.parse(rawResponse) as unknown
    } catch (error) {
      const isOversized =
        error instanceof UpstreamResponseTooLargeError

      console.error(
        '[POST /api/image-search] Vision response could not be parsed or exceeded the limit.',
        isOversized ? 'ResponseTooLarge' : 'InvalidResponse',
      )

      return jsonError(
        'پاسخ موتور جستجوی تصویری معتبر نیست.',
        502,
      )
    }

    if (!isVisionSearchResponse(data)) {
      console.error(
        '[POST /api/image-search] Vision response failed schema validation.',
      )

      return jsonError(
        'پاسخ موتور جستجوی تصویری معتبر نیست.',
        502,
      )
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'TimeoutError'
    ) {
      console.error(
        '[POST /api/image-search] Vision request timed out.',
      )

      return jsonError(
        'پاسخ سرویس جستجوی تصویری بیش از حد طول کشید.',
        504,
      )
    }

    console.error(
      '[POST /api/image-search] Vision request failed:',
      error instanceof Error
        ? error.name
        : 'UnknownError',
    )

    return jsonError(
      'ارتباط با موتور جستجوی تصویری برقرار نشد. لطفاً دوباره تلاش کنید.',
      502,
    )
  }
}