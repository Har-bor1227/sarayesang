import {
  ArrowLeft,
  Check,
} from 'lucide-react'

import SmartSearchSelectionSummary from './SmartSearchSelectionSummary'

const APPLICATIONS = [
  'نما',
  'کف',
  'پله',
  'دیوار',
  'محوطه',
  'آشپزخانه',
]

const COLORS = [
  {
    name: 'سفید',
    swatch: '#F4F1EA',
  },
  {
    name: 'کرم',
    swatch: '#D9C5A5',
  },
  {
    name: 'طوسی',
    swatch: '#8C9297',
  },
  {
    name: 'مشکی',
    swatch: '#202428',
  },
  {
    name: 'قهوه‌ای',
    swatch: '#80624D',
  },
  {
    name: 'سبز',
    swatch: '#617667',
  },
]

export default function SmartSearchSection() {
  return (
    <section
      id="smart-search"
      dir="rtl"
      className="
        w-full
        bg-[#FCFCFB]
        px-3
        py-4
        sm:px-4
        sm:py-6
        md:px-6
        md:py-7
        lg:px-8
        lg:py-8
      "
    >
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1280px]
          overflow-hidden
          rounded-[22px]
          border
          border-[#1D354C]
          bg-[#0A1929]
          shadow-[0_18px_45px_rgba(10,25,41,0.12)]
          sm:rounded-[26px]
          lg:rounded-[30px]
        "
      >
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              -right-24
              -top-28
              h-64
              w-64
              rounded-full
              bg-[#B79464]/[0.10]
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -left-24
              h-72
              w-72
              rounded-full
              bg-[#557A9F]/[0.08]
              blur-3xl
            "
          />

          <div
            className="
              absolute
              right-[22%]
              top-0
              h-px
              w-[38%]
              bg-gradient-to-l
              from-transparent
              via-[#B79464]/40
              to-transparent
            "
          />
        </div>

        <div
          className="
            relative
            z-10
            px-4
            py-5
            sm:px-6
            sm:py-6
            md:px-8
            md:py-7
            lg:px-10
            lg:py-8
          "
        >
          {/* Header */}
          <div
            className="
              mx-auto
              max-w-[760px]
              text-center
            "
          >
            <h2
              className="
                mt-2.5
                text-[22px]
                font-black
                leading-[1.2]
                tracking-[-0.045em]
                text-white
                sm:mt-3
                sm:text-[27px]
                md:text-[30px]
                lg:text-[33px]
              "
            >
              سنگ مناسب پروژه‌ات را پیدا کن
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-[560px]
                text-[9px]
                font-medium
                leading-5
                text-white/45
                sm:text-[10px]
                md:text-[11px]
              "
            >
              فقط کاربرد و رنگ موردنظرت را انتخاب کن؛
              انتخاب‌های مناسب پروژه‌ات را پیدا می‌کنیم.
            </p>
          </div>

          {/* Main form */}
          <form
            id="smart-search-form"
            action="/smart-search"
            method="GET"
            className="
              mt-5
              sm:mt-6
              md:mt-7
            "
          >
            <div
              className="
                grid
                gap-3
                lg:grid-cols-2
                lg:gap-4
              "
            >
              {/* Application */}
              <fieldset
                className="
                  min-w-0
                  rounded-[17px]
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-3
                  sm:p-3.5
                  md:p-4
                "
              >
                <div
                  className="
                    mb-2.5
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <legend
                    className="
                      text-[10px]
                      font-black
                      text-white
                      sm:text-[11px]
                    "
                  >
                    کاربرد پروژه
                  </legend>

                  <span
                    className="
                      text-[8px]
                      font-medium
                      text-white/30
                      sm:text-[9px]
                    "
                  >
                    یک مورد انتخاب کن
                  </span>
                </div>

                <div
                  className="
                    grid
                    grid-cols-3
                    gap-1.5
                    sm:gap-2
                  "
                >
                  {APPLICATIONS.map(
                    (application) => (
                      <div
                        key={application}
                        className="relative"
                      >
                        <input
                          id={`application-${application}`}
                          name="application"
                          value={application}
                          type="radio"
                          required
                          className="peer sr-only"
                        />

                        <label
                          htmlFor={`application-${application}`}
                          className="
                            flex
                            min-h-[44px]
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-[11px]
                            border
                            border-white/[0.07]
                            bg-white/[0.025]
                            px-2
                            text-center
                            text-[9px]
                            font-bold
                            text-white/60
                            transition-all
                            duration-200
                            hover:border-white/[0.14]
                            hover:bg-white/[0.05]
                            sm:min-h-[46px]
                            sm:text-[10px]
                            peer-checked:border-[#B79464]/55
                            peer-checked:bg-[#B79464]/[0.11]
                            peer-checked:text-[#E7D5B5]
                            peer-focus-visible:ring-2
                            peer-focus-visible:ring-[#B79464]/40
                          "
                        >
                          {application}
                        </label>

                        <span
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute
                            left-1.5
                            top-1/2
                            flex
                            h-4
                            w-4
                            -translate-y-1/2
                            scale-75
                            items-center
                            justify-center
                            rounded-full
                            bg-[#B79464]
                            text-[#112F50]
                            opacity-0
                            transition-all
                            duration-200
                            peer-checked:scale-100
                            peer-checked:opacity-100
                          "
                        >
                          <Check
                            className="h-2.5 w-2.5"
                            strokeWidth={3}
                          />
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </fieldset>

              {/* Colors */}
              <fieldset
                className="
                  min-w-0
                  rounded-[17px]
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-3
                  sm:p-3.5
                  md:p-4
                "
              >
                <div
                  className="
                    mb-2.5
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <legend
                    className="
                      text-[10px]
                      font-black
                      text-white
                      sm:text-[11px]
                    "
                  >
                    رنگ سنگ
                  </legend>

                  <span
                    className="
                      text-[8px]
                      font-medium
                      text-white/30
                      sm:text-[9px]
                    "
                  >
                    یک مورد انتخاب کن
                  </span>
                </div>

                <div
                  className="
                    grid
                    grid-cols-3
                    gap-1.5
                    sm:gap-2
                  "
                >
                  {COLORS.map((color) => (
                    <div
                      key={color.name}
                      className="relative"
                    >
                      <input
                        id={`color-${color.name}`}
                        name="color"
                        value={color.name}
                        type="radio"
                        required
                        className="peer sr-only"
                      />

                      <label
                        htmlFor={`color-${color.name}`}
                        className="
                          flex
                          min-h-[44px]
                          cursor-pointer
                          items-center
                          justify-center
                          gap-1.5
                          rounded-[11px]
                          border
                          border-white/[0.07]
                          bg-white/[0.025]
                          px-2
                          text-center
                          text-[9px]
                          font-bold
                          text-white/60
                          transition-all
                          duration-200
                          hover:border-white/[0.14]
                          hover:bg-white/[0.05]
                          sm:min-h-[46px]
                          sm:text-[10px]
                          peer-checked:border-[#B79464]/55
                          peer-checked:bg-[#B79464]/[0.11]
                          peer-checked:text-[#E7D5B5]
                          peer-focus-visible:ring-2
                          peer-focus-visible:ring-[#B79464]/40
                        "
                      >
                        <span
                          aria-hidden="true"
                          className="
                            h-3.5
                            w-3.5
                            shrink-0
                            rounded-full
                            border
                            border-white/20
                            shadow-[0_1px_5px_rgba(0,0,0,0.18)]
                            sm:h-4
                            sm:w-4
                          "
                          style={{
                            backgroundColor:
                              color.swatch,
                          }}
                        />

                        <span>
                          {color.name}
                        </span>
                      </label>

                      <span
                        aria-hidden="true"
                        className="
                          pointer-events-none
                          absolute
                          left-1.5
                          top-1/2
                          flex
                          h-4
                          w-4
                          -translate-y-1/2
                          scale-75
                          items-center
                          justify-center
                          rounded-full
                          bg-[#B79464]
                          text-[#112F50]
                          opacity-0
                          transition-all
                          duration-200
                          peer-checked:scale-100
                          peer-checked:opacity-100
                        "
                      >
                        <Check
                          className="h-2.5 w-2.5"
                          strokeWidth={3}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Bottom action */}
            <div
              className="
                mt-3
                rounded-[17px]
                border
                border-[#B79464]/10
                bg-white/[0.025]
                p-2.5
                sm:mt-4
                sm:p-3
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-2.5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:gap-4
                "
              >
                <SmartSearchSelectionSummary />

                {/* CTA */}
                <button
                  type="submit"
                  className="
                    group
                    flex
                    min-h-[46px]
                    w-full
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-[12px]
                    border
                    border-[#D8BC8D]/30
                    bg-gradient-to-b
                    from-[#D9BF92]
                    to-[#BE9A63]
                    px-5
                    text-[10px]
                    font-black
                    text-[#112F50]
                    shadow-[0_7px_18px_rgba(183,148,100,0.14)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:from-[#E2CCA7]
                    hover:to-[#C9A773]
                    hover:shadow-[0_10px_24px_rgba(183,148,100,0.20)]
                    active:translate-y-0
                    active:scale-[0.985]
                    sm:w-auto
                    sm:min-w-[190px]
                  "
                >
                  <span>
                    جستجوی پیشرفته
                  </span>

                  <ArrowLeft
                    aria-hidden="true"
                    className="
                      h-3.5
                      w-3.5
                      transition-transform
                      duration-300
                      group-hover:-translate-x-1
                    "
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}