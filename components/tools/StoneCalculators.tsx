'use client'

import {
  Building2,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  Grid2X2,
  Layers3,
  Move3D,
  Ruler,
  ShieldCheck,
  Truck,
  Scissors,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import Container from '@/components/ui/container'

type CalculatorId =
  | 'facade'
  | 'stairs'
  | 'tiles'
  | 'linear'
  | 'slab'
  | 'waste'
  | 'materials'
  | 'nano'
  | 'weight'

type Inputs = Record<string, string>

interface CalculatorDefinition {
  id: CalculatorId
  title: string
  shortTitle: string
  description: string
  icon: LucideIcon
}

const CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'facade',
    title: 'تخمین سنگ نمای ساختمان',
    shortTitle: 'سنگ نما',
    description:
      'برآورد متراژ سنگ موردنیاز نما با درنظرگرفتن بازشوها و میزان پرت.',
    icon: Building2,
  },
  {
    id: 'stairs',
    title: 'محاسبه سنگ راه‌پله',
    shortTitle: 'راه‌پله',
    description:
      'محاسبه تقریبی سنگ کف پله، پیشانی و پاگردها.',
    icon: Layers3,
  },
  {
    id: 'tiles',
    title: 'محاسبه تعداد تایل',
    shortTitle: 'تایل',
    description:
      'تبدیل متراژ پروژه به تعداد قطعات موردنیاز با احتساب پرت.',
    icon: Grid2X2,
  },
  {
    id: 'linear',
    title: 'تبدیل مترطول به مترمربع',
    shortTitle: 'مترطول',
    description:
      'مناسب قرنیز، ابزار، نوار و قطعات با عرض مشخص.',
    icon: Ruler,
  },
  {
    id: 'slab',
    title: 'محاسبه‌گر اسلب',
    shortTitle: 'اسلب',
    description:
      'تبدیل تعداد اسلب به مساحت و برعکس.',
    icon: Move3D,
  },
  {
    id: 'waste',
    title: 'محاسبه پرت و ضایعات',
    shortTitle: 'پرت',
    description:
      'محاسبه مقدار اضافه‌ای که برای برش و پرت باید در نظر بگیرید.',
    icon: Scissors,
  },
  {
    id: 'materials',
    title: 'مصالح نصب و بندکشی',
    shortTitle: 'مصالح نصب',
    description:
      'تخمین چسب و پودر بندکشی بر اساس شرایط اجرا.',
    icon: Calculator,
  },
  {
    id: 'nano',
    title: 'مواد ضدآب و نانو',
    shortTitle: 'نانو',
    description:
      'تخمین مقدار نانو بر اساس مساحت و میزان تخلخل سنگ.',
    icon: ShieldCheck,
  },
  {
    id: 'weight',
    title: 'وزن بار و ماشین حمل',
    shortTitle: 'وزن بار',
    description:
      'محاسبه وزن تقریبی سنگ و پیشنهاد ظرفیت ناوگان.',
    icon: Truck,
  },
]

const FACADE_WASTE: Record<string, number> = {
  simple: 10,
  combined: 15,
  complex: 20,
}

const LAYOUT_WASTE: Record<string, number> = {
  straight: 10,
  diagonal: 15,
  complex: 20,
}

const NANO_COVERAGE: Record<string, number> = {
  low: 12,
  medium: 8,
  high: 5,
}

const STONE_DENSITIES: Record<string, number> = {
  travertine: 2400,
  marble: 2500,
  granite: 2700,
  limestone: 2200,
  crystal: 2700,
}

const TRUCKS = [
  {
    name: 'وانت نیسان',
    capacity: 2,
  },
  {
    name: 'کامیونت',
    capacity: 3,
  },
  {
    name: 'خاور',
    capacity: 4,
  },
  {
    name: 'کامیون ۹۱۱',
    capacity: 6,
  },
  {
    name: 'کامیون تک',
    capacity: 10,
  },
  {
    name: 'کامیون جفت',
    capacity: 15,
  },
  {
    name: 'تریلر',
    capacity: 23,
  },
]

const INITIAL_INPUTS: Inputs = {
  facadeWidth: '',
  facadeHeight: '',
  facadeOpenings: '',
  facadeStyle: 'simple',

  stairSteps: '',
  stairTread: '',
  stairWidth: '',
  stairRiser: '',
  stairLanding: '',
  stairWaste: '10',

  tileArea: '',
  tileLength: '',
  tileWidth: '',
  tileWaste: '10',
  tilesPerBox: '',

  linearLength: '',
  linearWidth: '',

  slabLength: '',
  slabWidth: '',
  slabMode: 'area-to-slabs',
  slabValue: '',

  wasteArea: '',
  wasteLayout: 'straight',

  materialArea: '',
  adhesiveRate: '5',
  adhesiveBag: '25',
  groutTileLength: '',
  groutTileWidth: '',
  groutThickness: '',
  groutJoint: '',
  groutDensity: '1.6',
  groutBag: '5',
  materialWaste: '5',

  nanoArea: '',
  nanoPorosity: 'medium',
  nanoCoats: '1',

  weightArea: '',
  weightThickness: '',
  weightStone: 'marble',
}

function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)),
    )
    .replace(/[٠-٩]/g, (digit) =>
      String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)),
    )
    .replace(/٬/g, '')
    .replace(/٫/g, '.')
}

function toNumber(value: string) {
  const normalized = toEnglishDigits(value)
    .replace(/,/g, '')
    .replace(/[^\d.-]/g, '')

  const number = Number(normalized)

  return Number.isFinite(number)
    ? number
    : 0
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 2,
  }).format(value)
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  suffix,
  type = 'text',
}: {
  label: string
  name: string
  value: string
  onChange: (
    name: string,
    value: string,
  ) => void
  placeholder?: string
  suffix?: string
  type?: 'text' | 'number'
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-center text-[16px] font-black leading-6 text-[#344054] sm:text-[17px]">
        {label}
      </span>

      <div className="relative">
        <input
          type={type}
          inputMode={
            type === 'number'
              ? 'decimal'
              : 'text'
          }
          value={value}
          onChange={(event) =>
            onChange(
              name,
              event.target.value,
            )
          }
          placeholder={placeholder}
          className="
            h-14
            w-full
            rounded-[15px]
            border
            border-[#DFDDD7]
            bg-[#FCFCFB]
            px-4
            text-center
            text-[17px]
            font-black
            leading-none
            text-[#112F50]
            outline-none
            transition-all
            placeholder:text-[#9AA1A9]
            placeholder:font-bold
            hover:border-[#CFCAC0]
            focus:border-[#B79464]/70
            focus:bg-white
            focus:ring-2
            focus:ring-[#B79464]/10
          "
        />

        {suffix ? (
          <span
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-center
              text-[14px]
              font-black
              text-[#7E8791]
            "
          >
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string
  name: string
  value: string
  onChange: (
    name: string,
    value: string,
  ) => void
  options: {
    value: string
    label: string
  }[]
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-center text-[16px] font-black leading-6 text-[#344054] sm:text-[17px]">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              name,
              event.target.value,
            )
          }
          className="
            h-14
            w-full
            appearance-none
            rounded-[15px]
            border
            border-[#DFDDD7]
            bg-[#FCFCFB]
            px-4
            pl-11
            text-center
            text-[17px]
            font-black
            leading-none
            text-[#112F50]
            outline-none
            transition-all
            hover:border-[#CFCAC0]
            focus:border-[#B79464]/70
            focus:ring-2
            focus:ring-[#B79464]/10
          "
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronLeft
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            h-5
            w-5
            -translate-y-1/2
            rotate-[-90deg]
            text-[#667085]
          "
        />
      </div>
    </label>
  )
}

function ResultCard({
  label,
  value,
  unit,
  primary = false,
}: {
  label: string
  value: string
  unit?: string
  primary?: boolean
}) {
  return (
    <div
      className={[
        'rounded-[18px] border p-4 text-center shadow-[0_6px_18px_rgba(10,25,41,0.035)] transition-shadow',
        primary
          ? 'border-[#B79464]/35 bg-gradient-to-br from-[#B79464]/[0.14] via-[#FCFAF6] to-white shadow-[0_8px_22px_rgba(183,148,100,0.10)]'
          : 'border-[#E8E5DE] bg-white',
      ].join(' ')}
    >
      <span className="block text-center text-[14px] font-black leading-6 text-[#727A84] sm:text-[15px]">
        {label}
      </span>

      <div className="mt-3 flex flex-wrap items-baseline justify-center gap-2 text-center">
        <strong
          className={[
            'min-w-0 break-words text-[32px] font-black leading-none tracking-[-0.03em] sm:text-[38px]',
            primary
              ? 'text-[#112F50]'
              : 'text-[#263C52]',
          ].join(' ')}
        >
          {value}
        </strong>

        {unit ? (
          <span className="text-center text-[14px] font-black text-[#858C95] sm:text-[15px]">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function ResultPanel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="
        rounded-[20px]
        border
        border-[#1D354C]/10
        bg-[#F8F6F1]
        p-5
        sm:p-6
      "
    >
      <div className="mb-5 flex flex-col items-center justify-center gap-2.5 text-center">
        <span
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-[#112F50]
            text-[#D8BC8D]
          "
        >
          <CheckCircle2
            className="h-[18px] w-[18px]"
            strokeWidth={1.8}
          />
        </span>

        <div>
          <p className="text-center text-[16px] font-black leading-6 text-[#112F50] sm:text-[17px]">
            نتیجه محاسبه
          </p>

          <p className="text-center text-[13px] font-bold leading-6 text-[#858C95] sm:text-[14px]">
            مقدار تقریبی برای برنامه‌ریزی پروژه
          </p>
        </div>
      </div>

      {children}
    </div>
  )
}

export default function StoneCalculators() {
  const [activeId, setActiveId] =
    useState<CalculatorId>('facade')

  const [inputs, setInputs] =
    useState<Inputs>(INITIAL_INPUTS)

  const activeCalculator = useMemo(
    () =>
      CALCULATORS.find(
        (item) => item.id === activeId,
      ) ?? CALCULATORS[0],
    [activeId],
  )

  function updateInput(
    name: string,
    value: string,
  ) {
    setInputs((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function selectCalculator(
    id: CalculatorId,
  ) {
    setActiveId(id)
    window.requestAnimationFrame(() => {
      document
        .getElementById('calculator-workspace')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    })
  }

  function renderForm() {
    switch (activeId) {
      case 'facade':
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="عرض نما"
              name="facadeWidth"
              value={inputs.facadeWidth}
              onChange={updateInput}
              placeholder="مثلاً ۱۰"
              suffix="متر"
              type="number"
            />

            <Field
              label="ارتفاع نما"
              name="facadeHeight"
              value={inputs.facadeHeight}
              onChange={updateInput}
              placeholder="مثلاً ۱۵"
              suffix="متر"
              type="number"
            />

            <Field
              label="مجموع مساحت بازشوها"
              name="facadeOpenings"
              value={inputs.facadeOpenings}
              onChange={updateInput}
              placeholder="در صورت وجود"
              suffix="مترمربع"
              type="number"
            />

            <SelectField
              label="پیچیدگی نما"
              name="facadeStyle"
              value={inputs.facadeStyle}
              onChange={updateInput}
              options={[
                {
                  value: 'simple',
                  label: 'ساده — ۱۰٪ پرت',
                },
                {
                  value: 'combined',
                  label: 'ترکیبی — ۱۵٪ پرت',
                },
                {
                  value: 'complex',
                  label: 'پیچیده — ۲۰٪ پرت',
                },
              ]}
            />
          </div>
        )

      case 'stairs':
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="تعداد پله"
              name="stairSteps"
              value={inputs.stairSteps}
              onChange={updateInput}
              placeholder="مثلاً ۲۴"
              suffix="عدد"
              type="number"
            />

            <Field
              label="عمق کف پله"
              name="stairTread"
              value={inputs.stairTread}
              onChange={updateInput}
              placeholder="مثلاً ۳۰"
              suffix="سانتی‌متر"
              type="number"
            />

            <Field
              label="عرض پله"
              name="stairWidth"
              value={inputs.stairWidth}
              onChange={updateInput}
              placeholder="مثلاً ۱۲۰"
              suffix="سانتی‌متر"
              type="number"
            />

            <Field
              label="ارتفاع پیشانی"
              name="stairRiser"
              value={inputs.stairRiser}
              onChange={updateInput}
              placeholder="مثلاً ۱۷"
              suffix="سانتی‌متر"
              type="number"
            />

            <Field
              label="مساحت پاگردها"
              name="stairLanding"
              value={inputs.stairLanding}
              onChange={updateInput}
              placeholder="در صورت وجود"
              suffix="مترمربع"
              type="number"
            />

            <SelectField
              label="حاشیه پرت"
              name="stairWaste"
              value={inputs.stairWaste}
              onChange={updateInput}
              options={[
                {
                  value: '5',
                  label: '۵٪',
                },
                {
                  value: '10',
                  label: '۱۰٪',
                },
                {
                  value: '15',
                  label: '۱۵٪',
                },
              ]}
            />
          </div>
        )

      case 'tiles':
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="مساحت پروژه"
              name="tileArea"
              value={inputs.tileArea}
              onChange={updateInput}
              placeholder="مثلاً ۵۰"
              suffix="مترمربع"
              type="number"
            />

            <Field
              label="طول تایل"
              name="tileLength"
              value={inputs.tileLength}
              onChange={updateInput}
              placeholder="مثلاً ۶۰"
              suffix="سانتی‌متر"
              type="number"
            />

            <Field
              label="عرض تایل"
              name="tileWidth"
              value={inputs.tileWidth}
              onChange={updateInput}
              placeholder="مثلاً ۶۰"
              suffix="سانتی‌متر"
              type="number"
            />

            <SelectField
              label="درصد پرت"
              name="tileWaste"
              value={inputs.tileWaste}
              onChange={updateInput}
              options={[
                {
                  value: '5',
                  label: '۵٪',
                },
                {
                  value: '10',
                  label: '۱۰٪ — معمولی',
                },
                {
                  value: '15',
                  label: '۱۵٪ — برش بیشتر',
                },
                {
                  value: '20',
                  label: '۲۰٪ — طرح پیچیده',
                },
              ]}
            />

            <Field
              label="تعداد تایل در هر بسته"
              name="tilesPerBox"
              value={inputs.tilesPerBox}
              onChange={updateInput}
              placeholder="اختیاری"
              suffix="عدد"
              type="number"
            />
          </div>
        )

      case 'linear':
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="طول کل"
              name="linearLength"
              value={inputs.linearLength}
              onChange={updateInput}
              placeholder="مثلاً ۱۲۰"
              suffix="مترطول"
              type="number"
            />

            <Field
              label="عرض سنگ"
              name="linearWidth"
              value={inputs.linearWidth}
              onChange={updateInput}
              placeholder="مثلاً ۲۰"
              suffix="سانتی‌متر"
              type="number"
            />
          </div>
        )

      case 'slab':
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="طول هر اسلب"
              name="slabLength"
              value={inputs.slabLength}
              onChange={updateInput}
              placeholder="مثلاً ۳"
              suffix="متر"
              type="number"
            />

            <Field
              label="عرض هر اسلب"
              name="slabWidth"
              value={inputs.slabWidth}
              onChange={updateInput}
              placeholder="مثلاً ۱.۶"
              suffix="متر"
              type="number"
            />

            <SelectField
              label="نوع محاسبه"
              name="slabMode"
              value={inputs.slabMode}
              onChange={updateInput}
              options={[
                {
                  value: 'area-to-slabs',
                  label:
                    'مساحت دارم ← تعداد اسلب',
                },
                {
                  value: 'slabs-to-area',
                  label:
                    'تعداد اسلب دارم ← مساحت',
                },
              ]}
            />

            <Field
              label={
                inputs.slabMode ===
                'area-to-slabs'
                  ? 'مساحت موردنیاز'
                  : 'تعداد اسلب'
              }
              name="slabValue"
              value={inputs.slabValue}
              onChange={updateInput}
              placeholder={
                inputs.slabMode ===
                'area-to-slabs'
                  ? 'مثلاً ۵۰'
                  : 'مثلاً ۱۰'
              }
              suffix={
                inputs.slabMode ===
                'area-to-slabs'
                  ? 'مترمربع'
                  : 'عدد'
              }
              type="number"
            />
          </div>
        )

      case 'waste':
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="متراژ خالص پروژه"
              name="wasteArea"
              value={inputs.wasteArea}
              onChange={updateInput}
              placeholder="مثلاً ۱۰۰"
              suffix="مترمربع"
              type="number"
            />

            <SelectField
              label="نوع چیدمان"
              name="wasteLayout"
              value={inputs.wasteLayout}
              onChange={updateInput}
              options={[
                {
                  value: 'straight',
                  label: 'چیدمان مستقیم — ۱۰٪',
                },
                {
                  value: 'diagonal',
                  label: 'چیدمان مورب — ۱۵٪',
                },
                {
                  value: 'complex',
                  label: 'چیدمان پیچیده — ۲۰٪',
                },
              ]}
            />
          </div>
        )

      case 'materials':
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="مساحت اجرا"
              name="materialArea"
              value={inputs.materialArea}
              onChange={updateInput}
              placeholder="مثلاً ۸۰"
              suffix="مترمربع"
              type="number"
            />

            <SelectField
              label="مصرف چسب"
              name="adhesiveRate"
              value={inputs.adhesiveRate}
              onChange={updateInput}
              options={[
                {
                  value: '3',
                  label: '۳ کیلوگرم / مترمربع',
                },
                {
                  value: '5',
                  label: '۵ کیلوگرم / مترمربع',
                },
                {
                  value: '10.5',
                  label: '۱۰.۵ — اجرای سنگ/تایل بزرگ',
                },
              ]}
            />

            <Field
              label="وزن هر کیسه چسب"
              name="adhesiveBag"
              value={inputs.adhesiveBag}
              onChange={updateInput}
              suffix="کیلوگرم"
              type="number"
            />

            <Field
              label="طول تایل برای بندکشی"
              name="groutTileLength"
              value={inputs.groutTileLength}
              onChange={updateInput}
              placeholder="مثلاً ۶۰۰"
              suffix="میلی‌متر"
              type="number"
            />

            <Field
              label="عرض تایل برای بندکشی"
              name="groutTileWidth"
              value={inputs.groutTileWidth}
              onChange={updateInput}
              placeholder="مثلاً ۶۰۰"
              suffix="میلی‌متر"
              type="number"
            />

            <Field
              label="ضخامت / عمق بند"
              name="groutThickness"
              value={inputs.groutThickness}
              onChange={updateInput}
              placeholder="مثلاً ۱۰"
              suffix="میلی‌متر"
              type="number"
            />

            <Field
              label="عرض بند"
              name="groutJoint"
              value={inputs.groutJoint}
              onChange={updateInput}
              placeholder="مثلاً ۳"
              suffix="میلی‌متر"
              type="number"
            />

            <Field
              label="وزن هر بسته بندکشی"
              name="groutBag"
              value={inputs.groutBag}
              onChange={updateInput}
              suffix="کیلوگرم"
              type="number"
            />

            <SelectField
              label="حاشیه اطمینان"
              name="materialWaste"
              value={inputs.materialWaste}
              onChange={updateInput}
              options={[
                {
                  value: '0',
                  label: 'بدون اضافه',
                },
                {
                  value: '5',
                  label: '۵٪',
                },
                {
                  value: '10',
                  label: '۱۰٪',
                },
              ]}
            />
          </div>
        )

      case 'nano':
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="متراژ کل سنگ"
              name="nanoArea"
              value={inputs.nanoArea}
              onChange={updateInput}
              placeholder="مثلاً ۱۰۰"
              suffix="مترمربع"
              type="number"
            />

            <SelectField
              label="تخلخل سنگ"
              name="nanoPorosity"
              value={inputs.nanoPorosity}
              onChange={updateInput}
              options={[
                {
                  value: 'low',
                  label:
                    'کم — حدود ۱۲ مترمربع / لیتر',
                },
                {
                  value: 'medium',
                  label:
                    'متوسط — حدود ۸ مترمربع / لیتر',
                },
                {
                  value: 'high',
                  label:
                    'زیاد — حدود ۵ مترمربع / لیتر',
                },
              ]}
            />

            <SelectField
              label="تعداد لایه"
              name="nanoCoats"
              value={inputs.nanoCoats}
              onChange={updateInput}
              options={[
                {
                  value: '1',
                  label: '۱ لایه',
                },
                {
                  value: '2',
                  label: '۲ لایه',
                },
              ]}
            />
          </div>
        )

      case 'weight':
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="کل متراژ خرید"
              name="weightArea"
              value={inputs.weightArea}
              onChange={updateInput}
              placeholder="مثلاً ۲۰۰"
              suffix="مترمربع"
              type="number"
            />

            <Field
              label="ضخامت سنگ"
              name="weightThickness"
              value={inputs.weightThickness}
              onChange={updateInput}
              placeholder="مثلاً ۲"
              suffix="سانتی‌متر"
              type="number"
            />

            <SelectField
              label="نوع سنگ"
              name="weightStone"
              value={inputs.weightStone}
              onChange={updateInput}
              options={[
                {
                  value: 'travertine',
                  label:
                    'تراورتن — ۲۴۰۰ kg/m³',
                },
                {
                  value: 'marble',
                  label:
                    'مرمریت — ۲۵۰۰ kg/m³',
                },
                {
                  value: 'granite',
                  label:
                    'گرانیت — ۲۷۰۰ kg/m³',
                },
                {
                  value: 'limestone',
                  label:
                    'سنگ آهکی — ۲۲۰۰ kg/m³',
                },
                {
                  value: 'crystal',
                  label:
                    'چینی/کریستال — ۲۷۰۰ kg/m³',
                },
              ]}
            />
          </div>
        )
    }
  }

  function renderResults() {
    switch (activeId) {
      case 'facade': {
        const width =
          toNumber(inputs.facadeWidth)
        const height =
          toNumber(inputs.facadeHeight)
        const openings =
          toNumber(inputs.facadeOpenings)
        const waste =
          FACADE_WASTE[
            inputs.facadeStyle
          ] ?? 10

        const grossArea =
          width > 0 && height > 0
            ? width * height
            : 0

        const netArea = Math.max(
          0,
          grossArea - openings,
        )

        const extra =
          netArea * (waste / 100)

        const total = netArea + extra

        return (
          <ResultPanel>
            <div className="grid grid-cols-2 gap-2">
              <ResultCard
                label="متراژ خالص"
                value={formatNumber(netArea)}
                unit="م²"
              />

              <ResultCard
                label={`پرت ${formatNumber(waste)}٪`}
                value={formatNumber(extra)}
                unit="م²"
              />

              <div className="col-span-2">
                <ResultCard
                  label="سنگ پیشنهادی برای سفارش"
                  value={formatNumber(total)}
                  unit="مترمربع"
                  primary
                />
              </div>
            </div>
          </ResultPanel>
        )
      }

      case 'stairs': {
        const steps =
          Math.floor(
            toNumber(inputs.stairSteps),
          )
        const tread =
          toNumber(inputs.stairTread) / 100
        const width =
          toNumber(inputs.stairWidth) / 100
        const riser =
          toNumber(inputs.stairRiser) / 100
        const landing =
          toNumber(inputs.stairLanding)
        const waste =
          toNumber(inputs.stairWaste)

        const treadArea =
          steps > 0
            ? steps * tread * width
            : 0

        const riserArea =
          steps > 0
            ? steps * riser * width
            : 0

        const base =
          treadArea +
          riserArea +
          landing

        const total =
          base * (1 + waste / 100)

        return (
          <ResultPanel>
            <div className="grid grid-cols-2 gap-2">
              <ResultCard
                label="کف پله"
                value={formatNumber(
                  treadArea,
                )}
                unit="م²"
              />

              <ResultCard
                label="پیشانی"
                value={formatNumber(
                  riserArea,
                )}
                unit="م²"
              />

              <ResultCard
                label="مجموع پایه"
                value={formatNumber(base)}
                unit="م²"
              />

              <ResultCard
                label="سفارش با پرت"
                value={formatNumber(total)}
                unit="م²"
                primary
              />
            </div>
          </ResultPanel>
        )
      }

      case 'tiles': {
        const area =
          toNumber(inputs.tileArea)
        const length =
          toNumber(inputs.tileLength)
        const width =
          toNumber(inputs.tileWidth)
        const waste =
          toNumber(inputs.tileWaste)
        const perBox =
          Math.floor(
            toNumber(inputs.tilesPerBox),
          )

        const tileArea =
          length > 0 && width > 0
            ? (length * width) / 10000
            : 0

        const requiredArea =
          area * (1 + waste / 100)

        const count =
          tileArea > 0
            ? Math.ceil(
                requiredArea /
                  tileArea,
              )
            : 0

        const boxes =
          perBox > 0
            ? Math.ceil(count / perBox)
            : 0

        return (
          <ResultPanel>
            <div className="grid grid-cols-2 gap-2">
              <ResultCard
                label="مساحت هر تایل"
                value={formatNumber(
                  tileArea,
                )}
                unit="م²"
              />

              <ResultCard
                label="مساحت خرید"
                value={formatNumber(
                  requiredArea,
                )}
                unit="م²"
              />

              <ResultCard
                label="تعداد تایل"
                value={formatNumber(count)}
                unit="عدد"
                primary
              />

              {perBox > 0 ? (
                <ResultCard
                  label="تعداد بسته"
                  value={formatNumber(
                    boxes,
                  )}
                  unit="بسته"
                />
              ) : null}
            </div>
          </ResultPanel>
        )
      }

      case 'linear': {
        const length =
          toNumber(inputs.linearLength)
        const width =
          toNumber(inputs.linearWidth)

        const area =
          length > 0 && width > 0
            ? length * (width / 100)
            : 0

        return (
          <ResultPanel>
            <ResultCard
              label="معادل مترمربع"
              value={formatNumber(area)}
              unit="مترمربع"
              primary
            />
          </ResultPanel>
        )
      }

      case 'slab': {
        const length =
          toNumber(inputs.slabLength)
        const width =
          toNumber(inputs.slabWidth)
        const value =
          toNumber(inputs.slabValue)

        const slabArea =
          length > 0 && width > 0
            ? length * width
            : 0

        if (
          inputs.slabMode ===
          'slabs-to-area'
        ) {
          const area =
            slabArea > 0
              ? value * slabArea
              : 0

          return (
            <ResultPanel>
              <div className="grid grid-cols-2 gap-2">
                <ResultCard
                  label="مساحت هر اسلب"
                  value={formatNumber(
                    slabArea,
                  )}
                  unit="م²"
                />

                <ResultCard
                  label="تعداد اسلب"
                  value={formatNumber(
                    value,
                  )}
                  unit="عدد"
                />

                <div className="col-span-2">
                  <ResultCard
                    label="مساحت کل"
                    value={formatNumber(
                      area,
                    )}
                    unit="مترمربع"
                    primary
                  />
                </div>
              </div>
            </ResultPanel>
          )
        }

        const count =
          slabArea > 0 && value > 0
            ? Math.ceil(
                value / slabArea,
              )
            : 0

        const covered =
          count * slabArea

        return (
          <ResultPanel>
            <div className="grid grid-cols-2 gap-2">
              <ResultCard
                label="مساحت هر اسلب"
                value={formatNumber(
                  slabArea,
                )}
                unit="م²"
              />

              <ResultCard
                label="مساحت هدف"
                value={formatNumber(value)}
                unit="م²"
              />

              <ResultCard
                label="تعداد اسلب"
                value={formatNumber(count)}
                unit="عدد"
                primary
              />

              <ResultCard
                label="مساحت پوشش داده‌شده"
                value={formatNumber(
                  covered,
                )}
                unit="م²"
              />
            </div>
          </ResultPanel>
        )
      }

      case 'waste': {
        const area =
          toNumber(inputs.wasteArea)

        const waste =
          LAYOUT_WASTE[
            inputs.wasteLayout
          ] ?? 10

        const extra =
          area * (waste / 100)

        const total =
          area + extra

        return (
          <ResultPanel>
            <div className="grid grid-cols-2 gap-2">
              <ResultCard
                label="متراژ خالص"
                value={formatNumber(area)}
                unit="م²"
              />

              <ResultCard
                label="مقدار پرت"
                value={formatNumber(extra)}
                unit="م²"
              />

              <div className="col-span-2">
                <ResultCard
                  label="متراژ پیشنهادی خرید"
                  value={formatNumber(total)}
                  unit="مترمربع"
                  primary
                />
              </div>
            </div>
          </ResultPanel>
        )
      }

      case 'materials': {
        const area =
          toNumber(inputs.materialArea)

        const adhesiveRate =
          toNumber(inputs.adhesiveRate)

        const adhesiveBag =
          toNumber(inputs.adhesiveBag)

        const waste =
          toNumber(inputs.materialWaste)

        const adhesiveBase =
          area * adhesiveRate

        const adhesiveTotal =
          adhesiveBase *
          (1 + waste / 100)

        const adhesiveBags =
          adhesiveBag > 0
            ? Math.ceil(
                adhesiveTotal /
                  adhesiveBag,
              )
            : 0

        const tileLength =
          toNumber(
            inputs.groutTileLength,
          )

        const tileWidth =
          toNumber(
            inputs.groutTileWidth,
          )

        const groutThickness =
          toNumber(
            inputs.groutThickness,
          )

        const joint =
          toNumber(inputs.groutJoint)

        const density =
          toNumber(
            inputs.groutDensity,
          ) || 1.6

        const groutRate =
          tileLength > 0 &&
          tileWidth > 0 &&
          groutThickness > 0 &&
          joint > 0
            ? ((tileLength +
                tileWidth) /
                (tileLength *
                  tileWidth)) *
              groutThickness *
              joint *
              density
            : 0

        const groutTotal =
          area *
          groutRate *
          (1 + waste / 100)

        const groutBag =
          toNumber(inputs.groutBag)

        const groutBags =
          groutBag > 0
            ? Math.ceil(
                groutTotal /
                  groutBag,
              )
            : 0

        return (
          <ResultPanel>
            <div className="grid grid-cols-2 gap-2">
              <ResultCard
                label="چسب موردنیاز"
                value={formatNumber(
                  adhesiveTotal,
                )}
                unit="کیلوگرم"
                primary
              />

              <ResultCard
                label="تعداد کیسه چسب"
                value={formatNumber(
                  adhesiveBags,
                )}
                unit="کیسه"
              />

              {groutRate > 0 ? (
                <>
                  <ResultCard
                    label="مصرف بندکشی"
                    value={formatNumber(
                      groutRate,
                    )}
                    unit="kg/m²"
                  />

                  <ResultCard
                    label="پودر بندکشی"
                    value={formatNumber(
                      groutTotal,
                    )}
                    unit="کیلوگرم"
                  />

                  <div className="col-span-2">
                    <ResultCard
                      label="تعداد بسته بندکشی"
                      value={formatNumber(
                        groutBags,
                      )}
                      unit="بسته"
                    />
                  </div>
                </>
              ) : null}
            </div>
          </ResultPanel>
        )
      }

      case 'nano': {
        const area =
          toNumber(inputs.nanoArea)

        const coverage =
          NANO_COVERAGE[
            inputs.nanoPorosity
          ] ?? 8

        const coats =
          Math.max(
            1,
            Math.floor(
              toNumber(
                inputs.nanoCoats,
              ),
            ),
          )

        const liters =
          area > 0
            ? (area /
                coverage) *
              coats
            : 0

        return (
          <ResultPanel>
            <div className="grid grid-cols-2 gap-2">
              <ResultCard
                label="پوشش فرضی"
                value={formatNumber(
                  coverage,
                )}
                unit="م² / لیتر"
              />

              <ResultCard
                label="تعداد لایه"
                value={formatNumber(
                  coats,
                )}
                unit="لایه"
              />

              <div className="col-span-2">
                <ResultCard
                  label="نانو موردنیاز"
                  value={formatNumber(
                    liters,
                  )}
                  unit="لیتر"
                  primary
                />
              </div>
            </div>
          </ResultPanel>
        )
      }

      case 'weight': {
        const area =
          toNumber(inputs.weightArea)

        const thickness =
          toNumber(
            inputs.weightThickness,
          ) / 100

        const density =
          STONE_DENSITIES[
            inputs.weightStone
          ] ?? 2500

        const kgPerM2 =
          thickness > 0
            ? thickness * density
            : 0

        const weightKg =
          area * kgPerM2

        const tons =
          weightKg / 1000

        const truck =
          TRUCKS.find(
            (item) =>
              tons <= item.capacity,
          ) ?? null

        return (
          <ResultPanel>
            <div className="grid grid-cols-2 gap-2">
              <ResultCard
                label="وزن هر مترمربع"
                value={formatNumber(
                  kgPerM2,
                )}
                unit="کیلوگرم"
              />

              <ResultCard
                label="وزن کل"
                value={formatNumber(
                  weightKg,
                )}
                unit="کیلوگرم"
                primary
              />

              <ResultCard
                label="تناژ تقریبی"
                value={formatNumber(tons)}
                unit="تن"
              />

              <ResultCard
                label="ظرفیت پیشنهادی"
                value={
                  truck
                    ? truck.name
                    : 'بیش از ظرفیت فهرست'
                }
                unit={
                  truck
                    ? `${formatNumber(
                        truck.capacity,
                      )} تن`
                    : undefined
                }
              />
            </div>
          </ResultPanel>
        )
      }
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FCFCFB] pb-12 text-center"
    >
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A1929]">
        <div
          aria-hidden="true"
          className="
            absolute
            -right-28
            -top-32
            h-72
            w-72
            rounded-full
            bg-[#B79464]/[0.10]
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            -bottom-36
            left-[18%]
            h-80
            w-80
            rounded-full
            bg-[#466987]/[0.08]
            blur-3xl
          "
        />

        <Container>
          <div
            className="
              relative
              py-10
              sm:py-12
              md:py-14
              lg:py-16
            "
          >
            <div className="mx-auto max-w-[780px] text-center">

              <h1
                className="
                  mt-4
                  text-[36px]
                  font-black
                  leading-[1.2]
                  tracking-[-0.04em]
                  text-white
                  sm:text-[44px]
                  md:text-[52px]
                "
              >
                ابزارهای محاسبات سنگ
              </h1>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-[680px]
                  text-[16px]
                  font-bold
                  leading-8
                  text-white/60
                  sm:text-[17px]
                  sm:leading-9
                "
              >
                محاسبه متراژ، پرت، اسلب، پله،
                مصالح نصب، نانو و وزن بار؛
                همه در یک فضای سریع و کاربردی.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        {/* Calculator navigation */}
        <div
          className="
            relative
            z-20
            -mt-4
            lg:-mt-6
          "
        >
          <div
            className="
              rounded-[22px]
              border
              border-[#E7E5DF]
              bg-white
              p-2
              shadow-[0_14px_40px_rgba(10,25,41,0.08)]
              lg:p-3
            "
          >
            <div
              className="
                flex
                gap-1.5
                overflow-x-auto
                pb-0.5
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                lg:grid
                lg:grid-cols-9
                lg:overflow-visible
              "
            >
              {CALCULATORS.map((calculator) => {
                const Icon = calculator.icon
                const active =
                  calculator.id ===
                  activeId

                return (
                  <button
                    key={calculator.id}
                    type="button"
                    onClick={() =>
                      selectCalculator(
                        calculator.id,
                      )
                    }
                    className={[
                      'group flex min-w-[132px] shrink-0 flex-col items-center justify-center',
                      'rounded-[16px] px-3 py-3',
                      'transition-all duration-200',
                      'lg:min-w-0 lg:py-3.5',
                      active
                        ? 'bg-[#112F50] text-white shadow-[0_7px_18px_rgba(17,47,80,0.12)]'
                        : 'text-[#667085] hover:bg-[#F7F4EE] hover:text-[#112F50]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        active
                          ? 'bg-white/[0.08] text-[#D8BC8D]'
                          : 'bg-[#F5F2EC] text-[#76582F]',
                      ].join(' ')}
                    >
                      <Icon
                        className="h-6 w-6"
                        strokeWidth={
                          active ? 2 : 1.7
                        }
                      />
                    </span>

                    <span
                      className="
                        mt-1.5
                        whitespace-nowrap
                        text-[14px]
                        font-black
                        leading-6
                        lg:text-[15px]
                      "
                    >
                      {calculator.shortTitle}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Workspace */}
        <section
          id="calculator-workspace"
          className="
            scroll-mt-24
            pt-5
            sm:pt-6
            lg:pt-8
          "
        >
          <div
            className="
              overflow-hidden
              rounded-[25px]
              border
              border-[#E5E3DD]
              bg-white
              shadow-[0_14px_40px_rgba(10,25,41,0.055)]
            "
          >
            {/* Calculator header */}
            <div
              className="
                border-b
                border-[#ECEAE5]
                px-5
                py-5
                sm:px-7
                sm:py-6
                lg:px-7
              "
            >
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <span
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-[15px]
                    bg-[#112F50]
                    text-[#D8BC8D]
                  "
                >
                  <activeCalculator.icon
                    className="h-6 w-6"
                    strokeWidth={1.7}
                  />
                </span>

                <div className="min-w-0 text-center">
                  <h2 className="text-[26px] font-black leading-8 tracking-[-0.025em] text-[#112F50] sm:text-[30px]">
                    {activeCalculator.title}
                  </h2>

                  <p className="mt-2 text-[15px] font-bold leading-7 text-[#7E8791] sm:text-[16px]">
                    {activeCalculator.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Form + result */}
            <div
              className="
                grid
                gap-6
                p-5
                sm:p-7
                lg:grid-cols-[1fr_350px]
                lg:gap-8
                lg:p-8
              "
            >
              <div>
                <div className="mb-6 flex flex-col items-center justify-center gap-2 text-center">
                  <div className="text-center">
                    <h3 className="text-[17px] font-black leading-7 text-[#112F50] sm:text-[18px]">
                      اطلاعات پروژه
                    </h3>

                    <p className="mt-1 text-[13px] font-bold leading-6 text-[#8E969F] sm:text-[14px]">
                      مقادیر را وارد کنید تا نتیجه محاسبه شود.
                    </p>
                  </div>

                  <Calculator
                    aria-hidden="true"
                    className="h-5 w-5 text-[#B79464]"
                    strokeWidth={1.7}
                  />
                </div>

                {renderForm()}

                <div
                  className="
                    mt-5
                    rounded-[14px]
                    border
                    border-[#B79464]/15
                    bg-[#FAF7F1]
                    px-4
                    py-3
                    text-center
                    text-[14px]
                    font-bold
                    leading-7
                    text-[#7A6B57]
                  "
                >
                  این ابزار برای برآورد اولیه
                  است. ابعاد واقعی، پرت برش،
                  روش اجرا و دیتاشیت محصول می‌تواند
                  مقدار نهایی را تغییر دهد.
                </div>
              </div>

              <div className="lg:sticky lg:top-24 lg:self-start">
                {renderResults()}

                <div className="mt-4 rounded-[15px] bg-[#112F50]/[0.045] px-4 py-3 text-center text-[13px] font-bold leading-7 text-[#737D89]">
                  نتیجه‌ها تقریبی‌اند و برای
                  سفارش نهایی باید با اندازه‌گیری
                  پروژه و مشخصات محصول بررسی شوند.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom note */}
        <div className="mx-auto mt-5 flex max-w-[700px] items-center justify-center gap-2 text-center">
          <span className="h-px flex-1 bg-[#112F50]/[0.07]" />

          <span className="shrink-0 text-[11px] font-black tracking-[0.12em] text-[#8C949D]">
            CALCULATE / PLAN / BUILD
          </span>

          <span className="h-px flex-1 bg-[#112F50]/[0.07]" />
        </div>
      </Container>
    </div>
  )
}