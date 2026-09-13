'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Search,
  Loader2,
  PackageSearch,
  AlertCircle,
  ArrowLeft,
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
  const [results, setResults] = useState<ProductSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const debounceRef =
    useRef<ReturnType<typeof setTimeout> | null>(null)

  const requestControllerRef =
    useRef<AbortController | null>(null)

  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const inputRef =
    useRef<HTMLInputElement | null>(null)

  const performSearch = useCallback(
    async (searchTerm: string): Promise<void> => {
      const trimmedTerm = searchTerm.trim()

      if (trimmedTerm.length < MIN_SEARCH_LENGTH) {
        requestControllerRef.current?.abort()

        setResults([])
        setIsOpen(false)
        setIsLoading(false)
        setError(null)
        setActiveIndex(-1)

        return
      }

      requestControllerRef.current?.abort()

      const controller = new AbortController()

      requestControllerRef.current = controller

      setIsLoading(true)
      setError(null)
      setActiveIndex(-1)

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedTerm)}`,
          {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          throw new Error('خطا در جستجوی محصولات')
        }

        const json: SearchApiResponse =
          await response.json()

        if (controller.signal.aborted) {
          return
        }

        if (json.error) {
          throw new Error(json.error)
        }

        const products = json.products ?? []

        setResults(products)
        setIsOpen(true)
        setActiveIndex(-1)
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
        setActiveIndex(-1)

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
      requestControllerRef.current?.abort()

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setActiveIndex(-1)
        inputRef.current?.blur()
      }
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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value

    setQuery(value)
    setActiveIndex(-1)

    if (
      value.trim().length < MIN_SEARCH_LENGTH
    ) {
      requestControllerRef.current?.abort()

      setResults([])
      setIsOpen(false)
      setError(null)
      setIsLoading(false)
    }
  }

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!isOpen || results.length === 0) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setActiveIndex(-1)
      }

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
        activeIndex >= 0 &&
        activeIndex < results.length
      ) {
        event.preventDefault()

        const product = results[activeIndex]

        setIsOpen(false)
        setActiveIndex(-1)

        router.push(
          `/products/${product.slug}`,
        )
      }
    }
  }

  const hasResults = results.length > 0

  const isExpanded = isOpen && hasResults

  const showEmptyState =
    isOpen &&
    !isLoading &&
    query.trim().length >= MIN_SEARCH_LENGTH &&
    !hasResults &&
    !error

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      {/* Search field */}
      <div className="group relative">
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => {
            if (
              hasResults ||
              showEmptyState ||
              error
            ) {
              setIsOpen(true)
            }
          }}
          placeholder="جستجوی سنگ، محصول یا..."
          className="
            h-11
            w-full
            rounded-full
            border
            border-[#e3ddd2]
            bg-[#f5f2ec]/85
            px-11
            text-[13px]
            font-medium
            text-primary
            shadow-none
            outline-none
            placeholder:text-[#98a0aa]
            transition-all
            duration-250
            hover:border-[#d6c9b7]
            hover:bg-white
            focus:border-accent/60
            focus:bg-white
            focus-visible:ring-0
            focus-visible:ring-offset-0
            focus-visible:shadow-[0_8px_28px_rgba(10,25,41,0.075)]
            [&::-webkit-search-cancel-button]:appearance-none
          "
          aria-label="جستجوی محصولات"
          role="combobox"
          aria-expanded={isExpanded}
          aria-haspopup="listbox"
          aria-controls={
            isExpanded
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

        {/* Search / loading icon */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-3.5
            flex
            items-center
            justify-center
          "
          aria-hidden="true"
        >
          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-white/85
              shadow-[0_2px_7px_rgba(10,25,41,0.05)]
              transition-all
              duration-200
              group-focus-within:bg-accent/[0.10]
            "
          >
            {isLoading ? (
              <Loader2
                className="
                  h-[15px]
                  w-[15px]
                  animate-spin
                  text-accent
                "
                strokeWidth={2}
              />
            ) : (
              <Search
                className="
                  h-[15px]
                  w-[15px]
                  text-[#8f7b5b]
                  transition-colors
                  duration-200
                  group-focus-within:text-accent
                "
                strokeWidth={1.9}
              />
            )}
          </span>
        </div>

        {/* Keyboard hint */}
        {!query && (
          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-3.5
              hidden
              items-center
              xl:flex
            "
            aria-hidden="true"
          >
            <span
              className="
                rounded-full
                border
                border-[#e3ddd2]
                bg-white/75
                px-2
                py-1
                text-[9px]
                font-semibold
                text-[#a7a098]
              "
            >
              جستجو
            </span>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {(isExpanded || showEmptyState || error) && (
        <div
          className="
            absolute
            right-0
            top-[calc(100%+10px)]
            z-[80]
            w-full
            overflow-hidden
            rounded-[20px]
            border
            border-[#e8e1d7]
            bg-[#fcfcfb]/[0.97]
            shadow-[0_20px_60px_rgba(10,25,41,0.13),0_3px_12px_rgba(10,25,41,0.04)]
            backdrop-blur-2xl
            animate-in
            fade-in-0
            slide-in-from-top-1
            duration-150
          "
        >
          {/* Results header */}
          {isExpanded && (
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#ece7df]
                px-4
                py-3
              "
            >
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#8a8f97]
                "
              >
                نتایج جستجو
              </span>

              <span
                className="
                  rounded-full
                  bg-accent/[0.10]
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  text-accent-dark
                "
              >
                {results.length} نتیجه
              </span>
            </div>
          )}

          {/* Results */}
          {isExpanded && (
            <ul
              id={SEARCH_LISTBOX_ID}
              role="listbox"
              aria-label="نتایج جستجوی محصولات"
              className="
                max-h-[390px]
                overflow-y-auto
                overscroll-contain
                py-1.5
              "
            >
              {results.map((product, index) => {
                const isActive =
                  activeIndex === index

                return (
                  <li
                    key={product.id}
                    id={`live-search-option-${index}`}
                    role="option"
                    aria-selected={isActive}
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
                        'group/item mx-1.5 flex',
                        'min-h-[74px] items-center gap-3',
                        'rounded-[15px] px-2.5 py-2',
                        'transition-all duration-150',
                        isActive
                          ? 'bg-[#f3efe7]'
                          : 'hover:bg-[#f7f4ee]',
                      ].join(' ')}
                    >
                      {/* Product image */}
                      {product.image?.sourceUrl ? (
                        <div
                          className="
                            relative
                            h-12
                            w-12
                            shrink-0
                            overflow-hidden
                            rounded-[12px]
                            bg-[#f2eee7]
                            ring-1
                            ring-black/[0.045]
                          "
                        >
                          <Image
                            src={
                              product.image.sourceUrl
                            }
                            alt={
                              product.image.altText ||
                              product.name
                            }
                            fill
                            sizes="48px"
                            className="
                              object-cover
                              transition-transform
                              duration-400
                              group-hover/item:scale-105
                            "
                          />
                        </div>
                      ) : (
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-[12px]
                            bg-[#f2eee7]
                            text-[#a39786]
                          "
                          aria-hidden="true"
                        >
                          <PackageSearch
                            className="h-5 w-5"
                            strokeWidth={1.5}
                          />
                        </div>
                      )}

                      {/* Product info */}
                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            truncate
                            text-[13px]
                            font-bold
                            leading-6
                            text-[#21364d]
                            transition-colors
                            duration-150
                            group-hover/item:text-primary
                          "
                        >
                          {product.name}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[11px]
                            font-bold
                            text-accent-dark
                          "
                        >
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      {/* Arrow */}
                      <span
                        className={[
                          'hidden sm:flex',
                          'h-7 w-7 shrink-0',
                          'items-center justify-center',
                          'rounded-full',
                          'transition-all duration-200',
                          isActive
                            ? 'bg-white text-accent shadow-[0_2px_8px_rgba(10,25,41,0.06)]'
                            : 'bg-transparent text-[#b6ac9e] group-hover/item:bg-white group-hover/item:text-accent',
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        <ArrowLeft
                          className="h-3.5 w-3.5"
                          strokeWidth={1.8}
                        />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Empty state */}
          {showEmptyState && (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                px-5
                py-9
                text-center
              "
              role="status"
              aria-live="polite"
            >
              <div
                className="
                  mb-3
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-accent/10
                  bg-accent/[0.08]
                  text-accent-dark
                "
              >
                <PackageSearch
                  className="h-5 w-5"
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[13px] font-bold text-primary">
                محصولی پیدا نشد
              </p>

              <p className="mt-1 text-[11px] text-[#92979f]">
                عبارت دیگری را امتحان کنید
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="
                flex
                items-center
                gap-3
                px-4
                py-4
                text-right
              "
            >
              <div
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
              </div>

              <div className="min-w-0">
                <p className="text-[12px] font-bold text-red-700">
                  جستجو انجام نشد
                </p>

                <p className="mt-0.5 truncate text-[11px] text-red-500/80">
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