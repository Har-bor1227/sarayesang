'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  PackageSearch,
  Search,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/format'

import type { ProductSummary } from '@/types/wordpress'

interface SearchApiResponse {
  products?: ProductSummary[]
  error?: string
}

const MIN_SEARCH_LENGTH = 2
const DEBOUNCE_MS = 300
const SEARCH_LISTBOX_ID = 'live-search-results'

export default function LiveSearch() {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<
    ProductSummary[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(
    null,
  )
  const [activeIndex, setActiveIndex] =
    useState(-1)

  const debounceRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    )

  const requestRef =
    useRef<AbortController | null>(null)

  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const inputRef =
    useRef<HTMLInputElement | null>(null)

  const performSearch = useCallback(
    async (value: string) => {
      const term = value.trim()

      requestRef.current?.abort()

      if (term.length < MIN_SEARCH_LENGTH) {
        setResults([])
        setIsOpen(false)
        setIsLoading(false)
        setError(null)
        setActiveIndex(-1)
        return
      }

      const controller = new AbortController()
      requestRef.current = controller

      setIsLoading(true)
      setIsOpen(true)
      setError(null)
      setActiveIndex(-1)

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(term)}`,
          {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          },
        )

        if (!response.ok) {
          throw new Error(
            'خطا در جستجوی محصولات',
          )
        }

        const json: SearchApiResponse =
          await response.json()

        if (controller.signal.aborted) {
          return
        }

        if (json.error) {
          throw new Error(json.error)
        }

        setResults(json.products ?? [])
        setIsOpen(true)
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        if (controller.signal.aborted) {
          return
        }

        setResults([])
        setIsOpen(false)
        setError(
          err instanceof Error
            ? err.message
            : 'خطا در جستجو',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    },
    [],
  )

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      void performSearch(query)
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, performSearch])

  useEffect(() => {
    return () => {
      requestRef.current?.abort()

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleOutside = (
  event: globalThis.MouseEvent,
) => {
      const target = event.target

      if (
        containerRef.current &&
        target instanceof Node &&
        !containerRef.current.contains(target)
      ) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutside,
      )
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      setIsOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    }

    document.addEventListener(
      'keydown',
      handleEscape,
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape,
      )
    }
  }, [])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value)
    setActiveIndex(-1)

    if (
      event.target.value.trim().length <
      MIN_SEARCH_LENGTH
    ) {
      requestRef.current?.abort()
      setResults([])
      setIsOpen(false)
      setError(null)
      setIsLoading(false)
    }
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }

    if (!results.length || !isOpen) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()

      setActiveIndex((current) =>
        current >= results.length - 1
          ? 0
          : current + 1,
      )

      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()

      setActiveIndex((current) =>
        current <= 0
          ? results.length - 1
          : current - 1,
      )

      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(results.length - 1)
      return
    }

    if (event.key === 'Enter') {
      if (
        activeIndex < 0 ||
        activeIndex >= results.length
      ) {
        return
      }

      event.preventDefault()

      setIsOpen(false)
      setActiveIndex(-1)

      router.push(
        `/products/${results[activeIndex].slug}`,
      )
    }
  }

  const showResults =
    isOpen && results.length > 0

  const showEmpty =
    isOpen &&
    !isLoading &&
    !error &&
    query.trim().length >= MIN_SEARCH_LENGTH &&
    results.length === 0

  const showPanel =
    showResults ||
    showEmpty ||
    Boolean(error) ||
    isLoading

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      dir="rtl"
    >
      {/* Input */}
      <div className="group relative">
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (
              results.length ||
              showEmpty ||
              error ||
              isLoading
            ) {
              setIsOpen(true)
            }
          }}
          placeholder="جستجوی سنگ و محصول..."
          className="
            h-11
            w-full
            rounded-full
            border
            border-[#E1DDD4]
            bg-[#F7F4EE]
            px-11
            text-[11px]
            font-semibold
            text-[#112F50]
            shadow-none
            outline-none
            placeholder:text-[#9AA0A7]
            transition-all
            duration-200
            hover:border-[#D5CABB]
            hover:bg-white
            focus:border-[#B79464]/55
            focus:bg-white
            focus-visible:ring-0
            focus-visible:ring-offset-0
            focus-visible:shadow-[0_7px_22px_rgba(10,25,41,0.06)]
            [&::-webkit-search-cancel-button]:appearance-none
            sm:text-[12px]
          "
          role="combobox"
          aria-label="جستجوی محصولات"
          aria-expanded={
            showResults
          }
          aria-haspopup="listbox"
          aria-controls={
            showResults
              ? SEARCH_LISTBOX_ID
              : undefined
          }
          aria-activedescendant={
            activeIndex >= 0
              ? `live-search-option-${activeIndex}`
              : undefined
          }
          aria-autocomplete="list"
          autoComplete="off"
        />

        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            flex
            h-7
            w-7
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#8E7958]
            shadow-[0_2px_7px_rgba(10,25,41,0.05)]
            transition-all
            duration-200
            group-focus-within:bg-[#B79464]/[0.10]
            group-focus-within:text-[#B79464]
          "
        >
          {isLoading ? (
            <Loader2
              className="h-3.5 w-3.5 animate-spin"
              strokeWidth={2}
            />
          ) : (
            <Search
              className="h-3.5 w-3.5"
              strokeWidth={1.9}
            />
          )}
        </span>
      </div>

      {/* Dropdown */}
      {showPanel && (
        <div
          className="
            absolute
            right-0
            top-[calc(100%+8px)]
            z-[80]
            w-full
            overflow-hidden
            rounded-[19px]
            border
            border-[#E6E0D6]
            bg-[#FCFCFB]
            shadow-[0_22px_58px_rgba(10,25,41,0.14),0_4px_12px_rgba(10,25,41,0.04)]
            backdrop-blur-2xl
          "
        >
          {/* Loading */}
          {isLoading && !results.length ? (
            <div className="flex min-h-[150px] flex-col items-center justify-center">
              <Loader2
                className="h-5 w-5 animate-spin text-[#B79464]"
                strokeWidth={1.8}
              />

              <span className="mt-3 text-[10px] font-bold text-[#667085]">
                در حال جستجو...
              </span>
            </div>
          ) : null}

          {/* Results */}
          {showResults && (
            <>
              <div className="flex items-center justify-between border-b border-[#ECE8E1] px-3.5 py-2.5">
                <span className="text-[9px] font-black text-[#667085]">
                  نتایج جستجو
                </span>

                <span className="rounded-full bg-[#B79464]/[0.10] px-2 py-1 text-[8px] font-black text-[#76582F]">
                  {results.length} نتیجه
                </span>
              </div>

              <ul
                id={SEARCH_LISTBOX_ID}
                role="listbox"
                aria-label="نتایج جستجوی محصولات"
                className="max-h-[360px] overflow-y-auto p-1.5"
              >
                {results.map(
                  (product, index) => {
                    const active =
                      activeIndex === index

                    return (
                      <li
                        key={product.id}
                        id={`live-search-option-${index}`}
                        role="option"
                        aria-selected={active}
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            setIsOpen(false)
                            setActiveIndex(-1)
                          }}
                          onMouseEnter={() =>
                            setActiveIndex(index)
                          }
                          className={[
                            'group flex min-h-[68px] items-center gap-2.5 rounded-[14px] px-2 py-2',
                            'transition-all duration-150',
                            active
                              ? 'bg-[#F5F1E9]'
                              : 'hover:bg-[#F8F6F2]',
                          ].join(' ')}
                        >
                          {product.image?.sourceUrl ? (
                            <div
                              className="
                                relative
                                h-11
                                w-11
                                shrink-0
                                overflow-hidden
                                rounded-[11px]
                                bg-[#F1EEE7]
                                ring-1
                                ring-black/[0.04]
                              "
                            >
                              <Image
                                src={
                                  product.image
                                    .sourceUrl
                                }
                                alt={
                                  product.image
                                    .altText ||
                                  product.name
                                }
                                fill
                                sizes="44px"
                                className="
                                  object-cover
                                  transition-transform
                                  duration-300
                                  group-hover:scale-105
                                "
                              />
                            </div>
                          ) : (
                            <span
                              aria-hidden="true"
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-[11px]
                                bg-[#F1EEE7]
                                text-[#9A8D79]
                              "
                            >
                              <PackageSearch
                                className="h-4.5 w-4.5"
                                strokeWidth={1.5}
                              />
                            </span>
                          )}

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[11px] font-black text-[#21364D]">
                              {product.name}
                            </span>

                            <span className="mt-0.5 block text-[9px] font-bold text-[#9E7F50]">
                              {formatPrice(
                                product.price,
                              )}
                            </span>
                          </span>

                          <span
                            className={[
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200',
                              active
                                ? 'bg-white text-[#B79464] shadow-[0_2px_7px_rgba(10,25,41,0.06)]'
                                : 'text-[#B5AA9C] group-hover:bg-white group-hover:text-[#B79464]',
                            ].join(' ')}
                            aria-hidden="true"
                          >
                            <ArrowLeft
                              className="h-3 w-3"
                              strokeWidth={1.8}
                            />
                          </span>
                        </Link>
                      </li>
                    )
                  },
                )}
              </ul>
            </>
          )}

          {/* Empty */}
          {showEmpty && (
            <div
              className="
                flex
                min-h-[155px]
                flex-col
                items-center
                justify-center
                px-5
                text-center
              "
              role="status"
              aria-live="polite"
            >
              <span
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#B79464]/[0.09]
                  text-[#9E7F50]
                "
              >
                <PackageSearch
                  className="h-5 w-5"
                  strokeWidth={1.5}
                />
              </span>

              <p className="mt-3 text-[11px] font-black text-[#112F50]">
                محصولی پیدا نشد
              </p>

              <p className="mt-1 text-[9px] font-medium text-[#98A0A8]">
                عبارت دیگری را امتحان کنید
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex min-h-[105px] items-center gap-3 px-4"
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-red-50
                  text-red-500
                "
              >
                <AlertCircle
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-black text-red-700">
                  جستجو انجام نشد
                </p>

                <p className="mt-1 truncate text-[9px] font-medium text-red-500/75">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}