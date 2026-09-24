import Image from 'next/image'

import StoryInteractionClient from './StoryInteractionClient'

type Story = {
  id: number
  title: string
  subtitle: string
  image: string
  accent: string
}

const STORIES: Story[] = [
  {
    id: 1,
    title: 'سنگ‌های خاص',
    subtitle: 'انتخابی برای پروژه‌های خاص',
    image: '/images/home/product-placeholder.webp',
    accent: '#B79464',
  },
  {
    id: 2,
    title: 'پروژه‌های اجرا شده',
    subtitle: 'سنگ در معماری واقعی',
    image: '/images/home/product-placeholder.webp',
    accent: '#112F50',
  },
  {
    id: 3,
    title: 'راهنمای انتخاب سنگ',
    subtitle: 'قبل از خرید چه بدانیم؟',
    image: '/images/home/product-placeholder.webp',
    accent: '#08B981',
  },
  {
    id: 4,
    title: 'مرمریت',
    subtitle: 'ظرافتی ماندگار برای فضا',
    image: '/images/home/product-placeholder.webp',
    accent: '#B79464',
  },
  {
    id: 5,
    title: 'گرانیت',
    subtitle: 'مقاومت برای استفاده سنگین',
    image: '/images/home/product-placeholder.webp',
    accent: '#112F50',
  },
  {
    id: 6,
    title: 'سنگ نما',
    subtitle: 'نمایی که دیده می‌شود',
    image: '/images/home/product-placeholder.webp',
    accent: '#08B981',
  },
  {
    id: 7,
    title: 'ترندهای جدید',
    subtitle: 'انتخاب‌های محبوب این روزها',
    image: '/images/home/product-placeholder.webp',
    accent: '#B79464',
  },
  {
    id: 8,
    title: 'مشاوره تخصصی',
    subtitle: 'برای انتخاب بهتر همراهتان هستیم',
    image: '/images/home/product-placeholder.webp',
    accent: '#112F50',
  },
]

export default function StoryShowcase() {
  return (
    <section
      aria-label="استوری‌های سرای‌سنگ"
      dir="rtl"
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-[#E9E3D8]
        bg-[linear-gradient(180deg,#FCFCFB_0%,#F8F5EF_48%,#FCFCFB_100%)]
        py-6
        sm:py-8
        md:py-10
        lg:py-12
      "
    >
      {/* Decorative top line */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[2px]
          bg-gradient-to-r
          from-transparent
          via-[#B79464]
          to-transparent
          opacity-60
        "
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          top-0
          h-72
          w-72
          rounded-full
          bg-[#B79464]/[0.075]
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-20
          bottom-0
          h-72
          w-72
          rounded-full
          bg-[#112F50]/[0.055]
          blur-3xl
        "
      />

      <StoryInteractionClient stories={STORIES}>
        {/* Header */}
        <div
          className="
            relative
            mb-5
            flex
            min-h-[52px]
            items-center
            justify-center
            sm:mb-6
            md:mb-7
          "
        >
          {/* Center title */}
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              text-center
            "
          >
            <h2
              className="
                text-center
                text-[24px]
                font-black
                leading-none
                tracking-[-0.04em]
                text-[#112F50]
                sm:text-[29px]
                md:text-[33px]
              "
            >
              داستان‌های سرای‌سنگ
            </h2>

            <span
              aria-hidden="true"
              className="
                hidden
                h-2
                w-2
                shrink-0
                rounded-full
                bg-[#B79464]
                shadow-[0_0_0_5px_rgba(183,148,100,0.08)]
                sm:block
              "
            />
          </div>

          {/* Desktop navigation */}
          <div
            className="
              absolute
              left-0
              top-1/2
              hidden
              -translate-y-1/2
              items-center
              gap-2
              sm:flex
            "
          >
            <button
              type="button"
              data-story-scroll="previous"
              aria-label="حرکت به سمت قبلی"
              className="
                group/nav
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#D8DEE4]
                bg-white/90
                text-[#112F50]
                shadow-[0_5px_16px_rgba(17,47,80,0.06)]
                backdrop-blur
                transition-all
                duration-300
                hover:border-[#B79464]/50
                hover:bg-[#112F50]
                hover:text-white
                hover:shadow-[0_8px_20px_rgba(17,47,80,0.12)]
                active:scale-95
              "
            >
              <span
                aria-hidden="true"
                className="
                  relative
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  transition-transform
                  duration-300
                  group-hover/nav:translate-x-0.5
                "
              >
                <span
                  className="
                    absolute
                    h-2.5
                    w-2.5
                    rotate-45
                    border-b
                    border-r
                    border-current
                  "
                />
              </span>
            </button>

            <button
              type="button"
              data-story-scroll="next"
              aria-label="حرکت به سمت بعدی"
              className="
                group/nav
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#D8DEE4]
                bg-white/90
                text-[#112F50]
                shadow-[0_5px_16px_rgba(17,47,80,0.06)]
                backdrop-blur
                transition-all
                duration-300
                hover:border-[#B79464]/50
                hover:bg-[#112F50]
                hover:text-white
                hover:shadow-[0_8px_20px_rgba(17,47,80,0.12)]
                active:scale-95
              "
            >
              <span
                aria-hidden="true"
                className="
                  relative
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  transition-transform
                  duration-300
                  group-hover/nav:-translate-x-0.5
                "
              >
                <span
                  className="
                    absolute
                    h-2.5
                    w-2.5
                    -rotate-[135deg]
                    border-b
                    border-r
                    border-current
                  "
                />
              </span>
            </button>
          </div>
        </div>

        {/* Stories */}
        <div className="relative">
          {/* Mobile fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-20
              w-8
              bg-gradient-to-r
              from-[#F8F5EF]
              to-transparent
              sm:hidden
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-20
              w-8
              bg-gradient-to-l
              from-[#F8F5EF]
              to-transparent
              sm:hidden
            "
          />

          <div
            id="stone-story-rail"
            className="
              flex
              w-full
              snap-x
              snap-mandatory
              gap-4
              overflow-x-auto
              scroll-smooth
              pb-4
              pt-2
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              sm:gap-6
              md:gap-7
              lg:gap-8
            "
          >
            {STORIES.map(
              (story, index) => (
                <button
                  key={story.id}
                  type="button"
                  data-story-index={index}
                  className="
                    group
                    relative
                    flex
                    w-[108px]
                    min-w-[108px]
                    shrink-0
                    snap-center
                    flex-col
                    items-center
                    outline-none
                    sm:w-[120px]
                    sm:min-w-[120px]
                    md:w-[132px]
                    md:min-w-[132px]
                    lg:w-[140px]
                    lg:min-w-[140px]
                  "
                >
                  {/* Glow */}
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      top-1/2
                      h-[88px]
                      w-[88px]
                      -translate-y-[58%]
                      rounded-full
                      bg-[#B79464]/0
                      blur-2xl
                      transition-all
                      duration-500
                      group-hover:bg-[#B79464]/10
                      sm:h-[102px]
                      sm:w-[102px]
                      md:h-[114px]
                      md:w-[114px]
                    "
                  />

                  {/* Ring */}
                  <div
                    className="
                      relative
                      flex
                      h-[96px]
                      w-[96px]
                      items-center
                      justify-center
                      rounded-full
                      transition-all
                      duration-500
                      ease-[cubic-bezier(.22,1,.36,1)]
                      group-hover:-translate-y-1
                      sm:h-[108px]
                      sm:w-[108px]
                      md:h-[120px]
                      md:w-[120px]
                      lg:h-[128px]
                      lg:w-[128px]
                    "
                  >
                    {/* Gradient ring */}
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        inset-0
                        rounded-full
                        bg-[conic-gradient(from_210deg,#B79464,#D8BF99,#112F50,#B79464)]
                        p-[2px]
                        opacity-80
                        transition-all
                        duration-500
                        group-hover:p-[3px]
                        group-hover:opacity-100
                        group-hover:rotate-[18deg]
                      "
                    >
                      <span
                        className="
                          block
                          h-full
                          w-full
                          rounded-full
                          bg-[#F8F5EF]
                        "
                      />
                    </span>

                    {/* Inner border */}
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        inset-[6px]
                        rounded-full
                        border
                        border-[#112F50]/10
                        transition-all
                        duration-500
                        group-hover:inset-[4px]
                        group-hover:border-[#B79464]/20
                      "
                    />

                    {/* Image */}
                    <div
                      className="
                        relative
                        h-[80px]
                        w-[80px]
                        overflow-hidden
                        rounded-full
                        border-[3px]
                        border-[#FCFCFB]
                        bg-[#ECEAE5]
                        shadow-[0_9px_25px_rgba(17,47,80,0.12)]
                        sm:h-[92px]
                        sm:w-[92px]
                        md:h-[104px]
                        md:w-[104px]
                        lg:h-[110px]
                        lg:w-[110px]
                      "
                    >
                      <Image
                        src={story.image}
                        alt=""
                        fill
                        sizes="
                          (max-width: 639px) 80px,
                          (max-width: 767px) 92px,
                          (max-width: 1023px) 104px,
                          110px
                        "
                        className="
                          object-cover
                          transition-transform
                          duration-1000
                          ease-[cubic-bezier(.22,1,.36,1)]
                          group-hover:scale-[1.1]
                        "
                      />

                      <div
                        aria-hidden="true"
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-[#0A1929]/25
                          via-transparent
                          to-white/10
                        "
                      />
                    </div>

                    {/* Accent marker */}
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        bottom-[2px]
                        right-[4px]
                        h-4
                        w-4
                        rounded-full
                        border-[3px]
                        border-[#F8F5EF]
                        shadow-[0_3px_10px_rgba(10,25,41,0.12)]
                        transition-transform
                        duration-300
                        group-hover:scale-125
                      "
                      style={{
                        backgroundColor:
                          story.accent,
                      }}
                    />
                  </div>

                  {/* Title pill */}
                  <span
                    className="
                      mt-3
                      max-w-full
                      truncate
                      rounded-full
                      border
                      border-[#DCE3E8]
                      bg-white/80
                      px-3
                      py-1.5
                      text-center
                      text-[10px]
                      font-black
                      tracking-[-0.01em]
                      text-[#112F50]
                      shadow-[0_4px_12px_rgba(17,47,80,0.045)]
                      backdrop-blur
                      transition-all
                      duration-300
                      group-hover:border-[#B79464]/35
                      group-hover:bg-[#112F50]
                      group-hover:text-white
                      sm:text-[11px]
                      md:text-[12px]
                    "
                  >
                    {story.title}
                  </span>

                  <span
                    className="
                      mt-1.5
                      line-clamp-1
                      w-full
                      px-1
                      text-center
                      text-[8px]
                      font-medium
                      leading-5
                      text-[#82909D]
                      sm:text-[9px]
                    "
                  >
                    {story.subtitle}
                  </span>
                </button>
              ),
            )}
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div
          className="
            mt-1
            flex
            items-center
            justify-center
            gap-2
            sm:hidden
          "
        >
          <span
            aria-hidden="true"
            className="
              h-px
              w-8
              bg-gradient-to-r
              from-transparent
              to-[#B79464]/50
            "
          />

          <span
            className="
              text-[8px]
              font-bold
              text-[#9A8A74]
            "
          >
            برای مشاهده بیشتر به طرفین بکشید
          </span>

          <span
            aria-hidden="true"
            className="
              h-px
              w-8
              bg-gradient-to-l
              from-transparent
              to-[#B79464]/50
            "
          />
        </div>
      </StoryInteractionClient>
    </section>
  )
}