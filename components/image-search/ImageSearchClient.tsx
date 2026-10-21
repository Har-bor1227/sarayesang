'use client'

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowLeft,
  Camera,
  Check,
  ImageIcon,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'

type SearchResult = {
  product_id: string
  title: string
  slug?: string | null
  product_url?: string | null
  image_url: string
  similarity: number
}

type SearchResponse = {
  model: string
  results: SearchResult[]
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const ACCEPT_ATTRIBUTE =
  'image/jpeg,image/png,image/webp'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

function formatSimilarity(
  similarity: number,
) {
  const safeValue = Math.max(
    0,
    Math.min(1, Number(similarity) || 0),
  )

  return safeValue.toLocaleString(
    'fa-IR',
    {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  )
}

function validateFile(
  file: File,
): string | null {
  if (
    !ALLOWED_MIME_TYPES.has(
      file.type,
    )
  ) {
    return 'فقط تصاویر JPG، PNG و WebP قابل استفاده هستند.'
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return 'حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.'
  }

  if (file.size <= 0) {
    return 'فایل انتخاب‌شده خالی است.'
  }

  return null
}

function formatFileSize(
  bytes: number,
) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(
      1,
      Math.round(bytes / 1024),
    ).toLocaleString('fa-IR')} KB`
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toLocaleString('fa-IR', {
    maximumFractionDigits: 1,
  })} MB`
}

export default function ImageSearchClient() {
  const galleryInputRef =
    useRef<HTMLInputElement>(null)

  const cameraInputRef =
    useRef<HTMLInputElement>(null)

  const resultsRef =
    useRef<HTMLElement>(null)

  const previewObjectUrlRef =
    useRef<string | null>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null)

  const [results, setResults] =
    useState<SearchResult[]>([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [isDragging, setIsDragging] =
    useState(false)

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(
          previewObjectUrlRef.current,
        )

        previewObjectUrlRef.current = null
      }
    }
  }, [])

  function clearPreviewUrl() {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(
        previewObjectUrlRef.current,
      )

      previewObjectUrlRef.current = null
    }

    setPreviewUrl(null)
  }

  function setPreviewForFile(
    file: File,
  ) {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(
        previewObjectUrlRef.current,
      )
    }

    const objectUrl =
      URL.createObjectURL(file)

    previewObjectUrlRef.current =
      objectUrl

    setPreviewUrl(objectUrl)
  }

  useEffect(() => {
    if (!results.length) {
      return
    }

    const frame =
      window.requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [results.length])

  function applyFile(
    file: File,
  ) {
    const validationError =
      validateFile(file)

    setError(validationError)
    setResults([])

    if (validationError) {
      setSelectedFile(null)
      clearPreviewUrl()

      if (galleryInputRef.current) {
        galleryInputRef.current.value = ''
      }

      if (cameraInputRef.current) {
        cameraInputRef.current.value = ''
      }

      return
    }

    setSelectedFile(file)
    setPreviewForFile(file)
  }

  function handleGalleryChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    applyFile(file)
  }

  function handleCameraChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    applyFile(file)
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault()
    setIsDragging(false)

    const file =
      event.dataTransfer.files?.[0]

    if (!file) {
      return
    }

    applyFile(file)
  }

  function openGallery() {
    galleryInputRef.current?.click()
  }

  function openCamera() {
    cameraInputRef.current?.click()
  }

  function clearSearch() {
    if (loading) {
      return
    }

    setSelectedFile(null)
    clearPreviewUrl()
    setResults([])
    setError(null)
    setIsDragging(false)

    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function searchByImage() {
    if (!selectedFile || loading) {
      return
    }

    setLoading(true)
    setError(null)
    setResults([])

    try {
      const formData =
        new FormData()

      formData.append(
        'file',
        selectedFile,
      )

      const response =
        await fetch(
          '/api/image-search',
          {
            method: 'POST',
            body: formData,
            cache: 'no-store',
          },
        )

      let data:
        | SearchResponse
        | {
            error?: string
          }
        | null = null

      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (!response.ok) {
        const errorMessage =
          typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof data.error === 'string'
            ? data.error
            : 'جستجوی تصویری با خطا مواجه شد.'

        throw new Error(errorMessage)
      }

      const payload =
        data as SearchResponse

      setResults(
        Array.isArray(
          payload?.results,
        )
          ? payload.results
          : [],
      )
    } catch (requestError) {
      console.error(
        '[ImageSearchClient]',
        requestError,
      )

      setResults([])

      setError(
        requestError instanceof Error
          ? requestError.message
          : 'جستجو انجام نشد. لطفاً دوباره تلاش کنید.',
      )
    } finally {
      setLoading(false)
    }
  }

  const hasResults =
    results.length > 0

  const hasSelection =
    Boolean(
      selectedFile &&
        previewUrl,
    )

  return (
    <div
      dir="rtl"
      className="min-h-[calc(100vh-64px)] w-full overflow-x-clip bg-[#FCFCFB]"
    >
      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden border-b border-[#112F50]/[0.07]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-120px] top-[-150px] h-[360px] w-[360px] rounded-full bg-[#B79464]/[0.07] blur-3xl" />

          <div className="absolute left-[-160px] bottom-[-180px] h-[420px] w-[420px] rounded-full bg-[#112F50]/[0.055] blur-3xl" />

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#B79464]/35 to-transparent" />
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-[920px] px-0 pb-10 pt-8 text-center sm:pb-16 sm:pt-14 lg:pb-18 lg:pt-16">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#B79464]/20 bg-white/85 px-4 py-2 shadow-[0_8px_30px_rgba(17,47,80,0.04)] backdrop-blur">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FBF6ED] text-[#B79464]">
                <Sparkles
                  className="h-3.5 w-3.5"
                  strokeWidth={2.2}
                />
              </span>

              <span className="text-[10px] font-black tracking-[0.08em] text-[#9E7F50] sm:text-[11px]">
                جستجوی هوشمند سنگ
              </span>
            </div>

            <h1 className="mx-auto max-w-[800px] text-[31px] font-black leading-[1.45] tracking-[-0.045em] text-[#112F50] sm:text-[46px] lg:text-[58px]">
              سنگ موردنظرت را
              <span className="text-[#B79464]">
                {' '}
                از روی عکس
              </span>{' '}
              پیدا کن
            </h1>

            <p className="mx-auto mt-5 max-w-[700px] text-[12px] font-medium leading-8 text-[#667085] sm:text-[14px] sm:leading-9 lg:text-[15px]">
              یک عکس از سنگ بگیر یا از
              گالری انتخاب کن؛ سرای سنگ
              تصویر را با نمونه‌های موجود
              در کاتالوگ مقایسه می‌کند و
              نزدیک‌ترین گزینه‌ها را نشان
              می‌دهد.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#112F50]/[0.07] bg-white px-3.5 py-2 text-[9px] font-bold text-[#667085]">
                <ShieldCheck
                  className="h-3.5 w-3.5 text-[#B79464]"
                  strokeWidth={2}
                />
                تصویر فقط برای جستجو استفاده می‌شود
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-[#112F50]/[0.07] bg-white px-3.5 py-2 text-[9px] font-bold text-[#667085]">
                <ImageIcon
                  className="h-3.5 w-3.5 text-[#B79464]"
                  strokeWidth={2}
                />
                JPG / PNG / WEBP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN SEARCH AREA
      ========================================================== */}

      <section className="w-full pb-14 pt-7 sm:pb-18 sm:pt-10 lg:pb-24 lg:pt-12">
        <div className="container">
          <div className="mx-auto max-w-[1120px]">
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
              {/* ===================================================
                  UPLOAD PANEL
              ==================================================== */}

              <div className="rounded-[28px] border border-[#112F50]/[0.08] bg-white p-4 shadow-[0_20px_60px_rgba(17,47,80,0.06)] sm:rounded-[34px] sm:p-6 lg:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#B79464] sm:text-[10px]">
                        STEP 01
                      </span>
                    </div>

                    <h2 className="text-[18px] font-black leading-7 text-[#112F50] sm:text-[22px]">
                      عکس سنگ را انتخاب کن
                    </h2>

                    <p className="mt-1.5 max-w-[540px] text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px] sm:leading-7">
                      عکس واضح و نزدیک، معمولاً
                      اطلاعات بصری بهتری برای
                      مقایسه فراهم می‌کند.
                    </p>
                  </div>

                  <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#FBF6ED] text-[#B79464] sm:flex">
                    <ImageIcon
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </span>
                </div>

                {!hasSelection ? (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="انتخاب تصویر برای جستجوی سنگ"
                    onClick={openGallery}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          'Enter' ||
                        event.key === ' '
                      ) {
                        event.preventDefault()
                        openGallery()
                      }
                    }}
                    onDragEnter={(event) => {
                      event.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragOver={(event) => {
                      event.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault()
                      setIsDragging(false)
                    }}
                    onDrop={handleDrop}
                    className={`
                      group
                      flex
                      min-h-[350px]
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-[24px]
                      border
                      border-dashed
                      px-4
                      py-8
                      text-center
                      transition-all
                      duration-300
                      sm:min-h-[390px]
                      sm:rounded-[28px]
                      sm:px-5
                      sm:py-10
                      ${
                        isDragging
                          ? 'border-[#B79464] bg-[#FBF6ED] shadow-[inset_0_0_0_1px_rgba(183,148,100,0.12)]'
                          : 'border-[#112F50]/[0.12] bg-[#FCFCFB] hover:border-[#B79464]/50 hover:bg-[#FBF9F5]'
                      }
                    `}
                  >
                    <span
                      className={`
                        mb-5
                        flex
                        h-[74px]
                        w-[74px]
                        items-center
                        justify-center
                        rounded-[22px]
                        border
                        border-[#B79464]/20
                        bg-white
                        text-[#B79464]
                        shadow-[0_14px_35px_rgba(183,148,100,0.10)]
                        transition-all
                        duration-300
                        group-hover:-translate-y-1
                        group-hover:shadow-[0_18px_42px_rgba(183,148,100,0.15)]
                        sm:h-20
                        sm:w-20
                        sm:rounded-[24px]
                        ${
                          isDragging
                            ? '-translate-y-1'
                            : ''
                        }
                      `}
                    >
                      <UploadCloud
                        className="h-8 w-8"
                        strokeWidth={1.65}
                      />
                    </span>

                    <strong className="text-[15px] font-black text-[#112F50] sm:text-[17px]">
                      تصویر را اینجا رها کن
                    </strong>

                    <span className="mt-2 text-[10px] font-medium leading-6 text-[#98A2B3] sm:text-[11px]">
                      یا یکی از روش‌های زیر را
                      انتخاب کن
                    </span>

                    {/* Mobile actions */}

                    <div
                      className="mt-6 grid w-full max-w-[430px] grid-cols-2 gap-2.5 sm:hidden"
                      onClick={(event) => {
                        event.stopPropagation()
                      }}
                    >
                      <button
                        type="button"
                        onClick={openCamera}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[17px] bg-[#112F50] px-3 text-[10px] font-black text-white shadow-[0_10px_24px_rgba(17,47,80,0.14)] transition-all active:scale-[0.98]"
                      >
                        <Camera
                          className="h-4 w-4"
                          strokeWidth={2.1}
                        />
                        گرفتن عکس
                      </button>

                      <button
                        type="button"
                        onClick={openGallery}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[17px] border border-[#112F50]/[0.10] bg-white px-3 text-[10px] font-black text-[#112F50] transition-all active:scale-[0.98]"
                      >
                        <ImageIcon
                          className="h-4 w-4 text-[#B79464]"
                          strokeWidth={2}
                        />
                        انتخاب از گالری
                      </button>
                    </div>

                    <div className="mt-5 hidden items-center gap-2 rounded-full border border-[#112F50]/[0.07] bg-white px-4 py-2.5 sm:inline-flex">
                      <span className="text-[9px] font-bold text-[#667085]">
                        JPG
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#B79464]" />

                      <span className="text-[9px] font-bold text-[#667085]">
                        PNG
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#B79464]" />

                      <span className="text-[9px] font-bold text-[#667085]">
                        WEBP
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#D0D5DD]" />

                      <span className="text-[9px] font-bold text-[#98A2B3]">
                        حداکثر ۱۰MB
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-2 sm:hidden">
                      <span className="text-[8px] font-bold text-[#98A2B3]">
                        JPG
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#D0D5DD]" />

                      <span className="text-[8px] font-bold text-[#98A2B3]">
                        PNG
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#D0D5DD]" />

                      <span className="text-[8px] font-bold text-[#98A2B3]">
                        WEBP
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#D0D5DD]" />

                      <span className="text-[8px] font-bold text-[#98A2B3]">
                        ۱۰MB
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-[24px] border border-[#112F50]/[0.08] bg-[#0A1929] sm:rounded-[28px]">
                    <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
                      {previewUrl && (
                        <Image
                          src={previewUrl}
                          alt="تصویر انتخاب‌شده برای جستجوی سنگ"
                          fill
                          unoptimized
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 55vw"
                        />
                      )}

                      <div className="absolute left-3 top-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#112F50]/75 px-3 py-1.5 text-[9px] font-black text-white backdrop-blur-md">
                          <Check
                            className="h-3 w-3 text-[#C6A87E]"
                            strokeWidth={2.5}
                          />
                          آماده جستجو
                        </span>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07111D] via-[#07111D]/72 to-transparent px-4 pb-4 pt-20 sm:px-5 sm:pb-5">
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-black text-white sm:text-[12px]">
                              {selectedFile?.name}
                            </p>

                            <p className="mt-1 text-[9px] font-medium text-white/55">
                              {selectedFile
                                ? formatFileSize(
                                    selectedFile.size,
                                  )
                                : ''}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={clearSearch}
                            aria-label="حذف تصویر"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition-all hover:bg-white/15 active:scale-95"
                          >
                            <X
                              className="h-4 w-4"
                              strokeWidth={2}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden camera input */}

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept={ACCEPT_ATTRIBUTE}
                  capture="environment"
                  onChange={handleCameraChange}
                  className="hidden"
                />

                {/* Hidden gallery input */}

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept={ACCEPT_ATTRIBUTE}
                  onChange={handleGalleryChange}
                  className="hidden"
                />

                {error && (
                  <div className="mt-4 rounded-[18px] border border-[#DC3545]/15 bg-[#FFF7F7] px-4 py-3 text-[10px] font-bold leading-6 text-[#B42318]">
                    {error}
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    disabled={
                      !selectedFile ||
                      loading
                    }
                    onClick={searchByImage}
                    className="
                      inline-flex
                      min-h-12
                      flex-1
                      items-center
                      justify-center
                      gap-2.5
                      rounded-full
                      bg-[#112F50]
                      px-5
                      text-[11px]
                      font-black
                      text-white
                      shadow-[0_12px_28px_rgba(17,47,80,0.15)]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#0A1929]
                      active:scale-[0.99]
                      disabled:cursor-not-allowed
                      disabled:translate-y-0
                      disabled:opacity-45
                      disabled:shadow-none
                    "
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                        در حال مقایسه تصاویر...
                      </>
                    ) : (
                      <>
                        <Search
                          className="h-4 w-4"
                          strokeWidth={2.3}
                        />
                        جستجوی سنگ مشابه
                        <ArrowLeft
                          className="h-4 w-4"
                          strokeWidth={2.3}
                        />
                      </>
                    )}
                  </button>

                  {hasSelection &&
                    !loading && (
                      <div className="grid grid-cols-2 gap-2.5 sm:flex sm:shrink-0">
                        <button
                          type="button"
                          onClick={openGallery}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#112F50]/[0.10] bg-white px-4 text-[10px] font-black text-[#112F50] transition-all hover:border-[#B79464]/40 hover:bg-[#FBF6ED] active:scale-[0.98]"
                        >
                          <ImageIcon
                            className="h-4 w-4 text-[#B79464]"
                            strokeWidth={2}
                          />
                          عکس جدید
                        </button>

                        <button
                          type="button"
                          onClick={clearSearch}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#112F50]/[0.10] bg-white px-4 text-[10px] font-black text-[#112F50] transition-all hover:border-[#B79464]/40 hover:bg-[#FBF6ED] active:scale-[0.98]"
                        >
                          <RotateCcw
                            className="h-4 w-4"
                            strokeWidth={2}
                          />
                          پاک کردن
                        </button>
                      </div>
                    )}
                </div>
              </div>

              {/* ===================================================
                  INFO PANEL
              ==================================================== */}

              <div className="relative overflow-hidden rounded-[28px] bg-[#112F50] p-6 text-white shadow-[0_22px_65px_rgba(17,47,80,0.15)] sm:rounded-[34px] sm:p-8 lg:p-9">
                <div className="pointer-events-none absolute right-[-100px] top-[-110px] h-[300px] w-[300px] rounded-full bg-[#B79464]/15 blur-3xl" />

                <div className="pointer-events-none absolute bottom-[-140px] left-[-120px] h-[340px] w-[340px] rounded-full bg-white/[0.04] blur-3xl" />

                <div className="relative flex h-full flex-col">
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.06] text-[#C6A87E]">
                        <Sparkles
                          className="h-4.5 w-4.5"
                          strokeWidth={1.7}
                        />
                      </span>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#C6A87E]">
                          Visual Match
                        </p>

                        <p className="mt-1 text-[10px] font-bold text-white/55">
                          مقایسه هوشمند تصاویر سنگ
                        </p>
                      </div>
                    </div>

                    <h2 className="max-w-[480px] text-[24px] font-black leading-[1.55] tracking-[-0.025em] sm:text-[30px]">
                      فقط عکس را بده؛
                      <span className="text-[#C6A87E]">
                        {' '}
                        بقیه را بسپار
                      </span>
                      {' '}به ما
                    </h2>

                    <p className="mt-4 max-w-[500px] text-[11px] font-medium leading-8 text-white/60 sm:text-[12px]">
                      موتور جستجوی تصویری، الگوی
                      بصری تصویر را بررسی می‌کند
                      و نزدیک‌ترین نمونه‌های موجود
                      در کاتالوگ سرای سنگ را
                      پیدا می‌کند.
                    </p>
                  </div>

                  <div className="mt-7 space-y-3 lg:mt-auto">
                    {[
                      {
                        number: '01',
                        title: 'عکس بگیر یا انتخاب کن',
                        text: 'با دوربین موبایل یا گالری شروع کن.',
                        icon: Camera,
                      },
                      {
                        number: '02',
                        title: 'تصویر تحلیل می‌شود',
                        text: 'ویژگی‌های بصری تصویر استخراج می‌شوند.',
                        icon: Sparkles,
                      },
                      {
                        number: '03',
                        title: 'سنگ‌های مشابه را ببین',
                        text: 'محصولات بر اساس شباهت تصویری مرتب می‌شوند.',
                        icon: Search,
                      },
                    ].map((item) => {
                      const Icon =
                        item.icon

                      return (
                        <div
                          key={item.number}
                          className="flex gap-3 rounded-[20px] border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-sm"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#B79464] text-white">
                            <Icon
                              className="h-4 w-4"
                              strokeWidth={1.9}
                            />
                          </span>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-black tracking-[0.12em] text-[#C6A87E]">
                                {item.number}
                              </span>

                              <p className="text-[11px] font-black text-white">
                                {item.title}
                              </p>
                            </div>

                            <p className="mt-1 text-[9px] font-medium leading-5 text-white/45">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                RESULTS
            ====================================================== */}

            {(loading ||
              hasResults ||
              (Boolean(error) &&
                Boolean(selectedFile))) && (
              <section
                ref={resultsRef}
                aria-live="polite"
                className="mt-8 scroll-mt-24 sm:mt-10"
              >
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#B79464] sm:text-[10px]">
                        Search Results
                      </span>
                    </div>

                    <h2 className="text-[21px] font-black tracking-[-0.025em] text-[#112F50] sm:text-[28px]">
                      نزدیک‌ترین سنگ‌ها
                    </h2>
                  </div>

                  {hasResults && (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#112F50]/[0.07] bg-white px-3.5 py-2 text-[9px] font-bold text-[#667085] shadow-[0_6px_20px_rgba(10,25,41,0.035)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

                      {results.length.toLocaleString(
                        'fa-IR',
                      )}{' '}
                      نتیجه
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from(
                      {
                        length: 3,
                      },
                    ).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-[26px] border border-[#112F50]/[0.07] bg-white shadow-[0_10px_30px_rgba(17,47,80,0.035)]"
                        >
                          <div className="aspect-[4/3] animate-pulse bg-[#EEF1F4]" />

                          <div className="space-y-3 p-5">
                            <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#EEF1F4]" />

                            <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#F2F4F7]" />

                            <div className="h-1.5 w-full animate-pulse rounded-full bg-[#F2F4F7]" />

                            <div className="h-10 w-full animate-pulse rounded-full bg-[#F2F4F7]" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : hasResults ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map(
                      (
                        result,
                        index,
                      ) => {
                        const score =
                          Math.max(
                            0,
                            Math.min(
                              1,
                              Number(
                                result.similarity,
                              ) || 0,
                            ),
                          )

                        return (
                          <article
                            key={`${result.product_id}-${result.image_url}`}
                            className="group overflow-hidden rounded-[26px] border border-[#112F50]/[0.08] bg-white shadow-[0_12px_38px_rgba(17,47,80,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(17,47,80,0.075)]"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-[#F2F0EC]">
<Image
  src={result.image_url}
  alt={result.title || 'محصول سنگ'}
  fill
  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
  className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
  loading={index < 2 ? 'eager' : 'lazy'}
  unoptimized
  referrerPolicy="no-referrer"
/>

                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1929]/80 via-[#0A1929]/20 to-transparent px-4 pb-4 pt-16">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-black text-white backdrop-blur-md">
                                  <Check
                                    className="h-3 w-3 text-[#C6A87E]"
                                    strokeWidth={2.5}
                                  />
                                  شباهت{' '}
                                  {formatSimilarity(
                                    score,
                                  )}
                                </span>
                              </div>

                              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#112F50]/75 text-[9px] font-black text-white backdrop-blur-md">
                                {(
                                  index + 1
                                )
                                  .toLocaleString(
                                    'fa-IR',
                                  )
                                  .padStart(
                                    2,
                                    '۰',
                                  )}
                              </span>
                            </div>

                            <div className="p-5">
                              <h3 className="line-clamp-2 min-h-[52px] text-[15px] font-black leading-7 text-[#112F50]">
                                {
                                  result.title
                                }
                              </h3>

                              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#EEF1F4]">
                                <div
                                  className="h-full rounded-full bg-[#B79464] transition-all duration-700"
                                  style={{
                                    width: `${
                                      Math.round(
                                        score *
                                          10000,
                                      ) / 100
                                    }%`,
                                  }}
                                />
                              </div>

                              {result.product_url ? (
                                <Link
                                  href={
                                    result.product_url
                                  }
                                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#112F50] px-4 text-[10px] font-black text-white transition-all duration-300 hover:bg-[#0A1929] active:scale-[0.99]"
                                >
                                  مشاهده محصول
                                  <ArrowLeft
                                    className="h-3.5 w-3.5"
                                    strokeWidth={
                                      2.4
                                    }
                                  />
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#F2F4F7] px-4 text-[10px] font-black text-[#98A2B3]"
                                >
                                  اطلاعات محصول موجود نیست
                                </button>
                              )}
                            </div>
                          </article>
                        )
                      },
                    )}
                  </div>
                ) : (
                  <div className="rounded-[28px] border border-dashed border-[#112F50]/[0.10] bg-white px-6 py-14 text-center shadow-[0_10px_35px_rgba(10,25,41,0.035)]">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#FBF6ED] text-[#B79464]">
                      <Search
                        className="h-6 w-6"
                        strokeWidth={1.7}
                      />
                    </span>

                    <h3 className="mt-4 text-[16px] font-black text-[#112F50]">
                      نتیجه‌ای پیدا نشد
                    </h3>

                    <p className="mx-auto mt-2 max-w-[430px] text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px]">
                      یک تصویر متفاوت با کادر
                      نزدیک‌تر یا نور مناسب‌تر
                      امتحان کن.
                    </p>

                    <button
                      type="button"
                      onClick={openGallery}
                      className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#112F50] px-5 text-[10px] font-black text-white transition-all hover:bg-[#0A1929] active:scale-[0.98]"
                    >
                      <ImageIcon
                        className="h-4 w-4"
                        strokeWidth={2}
                      />
                      انتخاب تصویر دیگر
                    </button>
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-[18px] border border-[#DC3545]/15 bg-[#FFF7F7] px-4 py-3 text-[10px] font-bold leading-6 text-[#B42318]">
                    {error}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}