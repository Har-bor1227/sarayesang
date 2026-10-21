import Image from 'next/image'

import HeroSlider from './HeroSlider'

const banners = [
  {
    src: '/images/home/banner1.webp',
    alt: 'سرای سنگ - بنر اول',
  },
  {
    src: '/images/home/banner2.webp',
    alt: 'سرای سنگ - بنر دوم',
  },
  {
    src: '/images/home/banner3.webp',
    alt: 'سرای سنگ - بنر سوم',
  },
]

export default function HeroSection() {
  return (
    <section
      dir="rtl"
      className="
        w-full
        bg-[#fcfcfb]
        py-1
        sm:py-1.5
        lg:py-2
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1360px]
          px-3
          sm:px-5
          lg:px-8
          xl:px-10
        "
      >
        <div className="relative isolate">
          {/* Soft shadow */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-[6%]
              bottom-[-10px]
              h-[18px]
              rounded-[50%]
              bg-black/20
              blur-[14px]
              sm:bottom-[-11px]
              sm:h-[20px]
              sm:blur-[15px]
              lg:bottom-[-12px]
              lg:h-[22px]
              lg:blur-[17px]
            "
          />

          {/* Main card */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[16px]
              border
              border-black/[0.045]
              bg-[#0a1929]
              shadow-[0_14px_34px_-14px_rgba(0,0,0,0.22)]
              select-none
              sm:rounded-[19px]
              sm:shadow-[0_18px_42px_-16px_rgba(0,0,0,0.24)]
              lg:rounded-[22px]
              lg:shadow-[0_22px_50px_-18px_rgba(0,0,0,0.25)]
            "
          >
            <HeroSlider>
              {banners.map((banner, index) => (
                <div
                  key={banner.src}
                  className="absolute inset-0"
                >
                  <div
                    className="
                      absolute
                      inset-0
                      overflow-hidden
                      rounded-[inherit]
                      bg-[#0a1929]
                    "
                  >
                    <Image
                      src={banner.src}
                      alt={banner.alt}
                      fill
                      unoptimized
                      preload={index === 0}
                      sizes="(max-width: 639px) calc(100vw - 24px), (max-width: 1023px) calc(100vw - 40px), (max-width: 1279px) calc(100vw - 64px), (max-width: 1535px) calc(100vw - 80px), 1280px"
                      draggable={false}
                      className="
                        object-cover
                        object-center
                      "
                    />

                    {/* Surface highlight */}
                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-br
                        from-white/[0.035]
                        via-transparent
                        to-black/[0.08]
                      "
                    />

                    {/* Bottom depth */}
                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0
                        h-[18%]
                        bg-gradient-to-t
                        from-black/[0.10]
                        to-transparent
                      "
                    />
                  </div>
                </div>
              ))}
            </HeroSlider>
          </div>
        </div>
      </div>
    </section>
  )
}