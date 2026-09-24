'use client'

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'

type Story = {
  id: number
  title: string
  subtitle: string
  image: string
  accent: string
}

interface StoryInteractionClientProps {
  children: ReactNode
  stories: Story[]
}

export default function DeferredStoryInteraction({
  children,
  stories,
}: StoryInteractionClientProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const [
    StoryInteractionClient,
    setStoryInteractionClient,
  ] = useState<
    ComponentType<StoryInteractionClientProps> | null
  >(null)

  useEffect(() => {
    const node = containerRef.current

    if (!node) {
      return
    }

    let cancelled = false

    const loadInteraction = async () => {
      try {
        const module = await import(
          './StoryInteractionClient'
        )

        if (!cancelled) {
          setStoryInteractionClient(
            () => module.default,
          )
        }
      } catch {
        // Keep the server-rendered story rail usable
        // even if the optional interaction chunk fails.
      }
    }

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window)
    ) {
      void loadInteraction()

      return () => {
        cancelled = true
      }
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0]

          if (!entry?.isIntersecting) {
            return
          }

          observer.disconnect()
          void loadInteraction()
        },
        {
          rootMargin: '400px 0px',
          threshold: 0,
        },
      )

    observer.observe(node)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  if (StoryInteractionClient) {
    return (
      <StoryInteractionClient
        stories={stories}
      >
        {children}
      </StoryInteractionClient>
    )
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12"
    >
      {children}
    </div>
  )
}