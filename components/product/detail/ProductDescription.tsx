type ProductDescriptionProps = {
  description?: string | null
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  if (!description) {
    return null
  }

  return (
    <section
      className="
        mt-14
        border-t
        border-[#112F50]/[0.07]
        pt-12
        sm:mt-18
        sm:pt-14
        lg:mt-20
        lg:pt-16
      "
      aria-labelledby="product-description-title"
    >
      <div
        className="
          grid
          gap-8
          lg:grid-cols-[0.32fr_0.68fr]
          lg:gap-16
        "
      >
        <div className="lg:pt-2">
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              aria-hidden="true"
              className="
                h-px
                w-9
                bg-[#B79464]
                sm:w-11
              "
            />

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.22em]
                text-[#B79464]
                sm:text-[9px]
              "
            >
              Product Story
            </span>
          </div>

          <h2
            id="product-description-title"
            className="
              mt-4
              text-[27px]
              font-black
              leading-[1.45]
              tracking-[-0.035em]
              text-[#112F50]
              sm:text-[32px]
              lg:text-[36px]
            "
          >
            درباره این سنگ
          </h2>

          <p
            className="
              mt-3
              max-w-[340px]
              text-[10px]
              font-medium
              leading-7
              text-[#6C7680]
              sm:text-[11px]
              sm:leading-8
            "
          >
            ویژگی‌ها و جزئیات این محصول
            را بررسی کنید تا انتخابی
            هماهنگ با فضای پروژه خود
            داشته باشید.
          </p>
        </div>

        <div
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-[#112F50]/[0.07]
            bg-white
            px-5
            py-7
            shadow-[0_14px_40px_rgba(10,25,41,0.04)]
            sm:px-8
            sm:py-9
            lg:px-10
            lg:py-10
          "
        >
          <div
            className="
              wordpress-content
              text-[11px]
              leading-8
              text-[#5E6873]
              sm:text-[12px]
              sm:leading-9
            "
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </div>
      </div>
    </section>
  )
}