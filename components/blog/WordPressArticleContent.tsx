'use client'

import {
  useEffect,
  useRef,
} from 'react'

interface WordPressArticleContentProps {
  /** HTML must be sanitized in a Server Component before it is passed here. */
  sanitizedHtml: string
  className?: string
}

const FAQ_ITEM_SELECTOR = [
  '.wp-block-rank-math-faq-block .rank-math-faq-item',
  '.rank-math-faq-item',
  '.rank-math-list .rank-math-list-item',
  '.wp-block-yoast-faq-block .schema-faq-section',
  '.schema-faq-section',
].join(', ')

const TABLE_SCROLL_CLASS = 'sarayesang-table-scroll'

export default function WordPressArticleContent({
  sanitizedHtml,
  className,
}: WordPressArticleContentProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const tables = root.querySelectorAll<HTMLTableElement>('table')

    tables.forEach((table) => {
      if (table.parentElement?.classList.contains(TABLE_SCROLL_CLASS)) {
        return
      }

      const wrapper = document.createElement('div')
      wrapper.className = [
        TABLE_SCROLL_CLASS,
        'my-5',
        'w-full',
        'max-w-full',
        'min-w-0',
        'overflow-x-auto',
        'overscroll-x-contain',
        'touch-pan-x',
        'rounded-[14px]',
        'border',
        'border-[#112F50]/[0.08]',
        'bg-white',
        'sm:my-6',
        'sm:rounded-[16px]',
      ].join(' ')
      wrapper.dir = 'rtl'

      table.parentNode?.insertBefore(wrapper, table)
      wrapper.appendChild(table)
      table.classList.add('w-max', 'min-w-full', 'max-w-none')
    })

    const items = root.querySelectorAll<HTMLElement>(FAQ_ITEM_SELECTOR)
    const cleanup: Array<() => void> = []

    items.forEach((item, index) => {
      if (item.dataset.sarayesangFaqEnhanced === 'true') {
        return
      }

      const question = item.querySelector<HTMLElement>(
        '.rank-math-question, .schema-faq-question',
      )
      const answer = item.querySelector<HTMLElement>(
        '.rank-math-answer, .schema-faq-answer',
      )

      if (!question || !answer) {
        return
      }

      const answerId = `sarayesang-faq-answer-${index + 1}`

      item.dataset.sarayesangFaqEnhanced = 'true'
      item.classList.add('sarayesang-faq-item')
      question.classList.add('sarayesang-faq-question')
      answer.classList.add('sarayesang-faq-answer')
      question.setAttribute('role', 'button')
      question.setAttribute('tabindex', '0')
      question.setAttribute('aria-expanded', 'false')
      question.setAttribute('aria-controls', answerId)
      answer.id = answerId
      answer.hidden = true

      const toggle = () => {
        const isOpen = item.classList.toggle('is-open')
        question.setAttribute('aria-expanded', String(isOpen))
        answer.hidden = !isOpen
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggle()
        }
      }

      question.addEventListener('click', toggle)
      question.addEventListener('keydown', handleKeyDown)

      cleanup.push(() => {
        question.removeEventListener('click', toggle)
        question.removeEventListener('keydown', handleKeyDown)

        // Allow the FAQ to be initialized again after effect cleanup.
        delete item.dataset.sarayesangFaqEnhanced
      })
    })

    return () => {
      cleanup.forEach((remove) => remove())
    }
  }, [sanitizedHtml])

  return (
    <div
      ref={rootRef}
      className={[
        'wordpress-content',
        'w-full',
        'min-w-0',
        'max-w-full',
        'overflow-x-clip',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}