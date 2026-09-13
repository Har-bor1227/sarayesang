// ============================
// توابع کمکی فرمت اعداد، قیمت و تاریخ
// ============================

/**
 * جدا کردن سه‌رقم سه‌رقم اعداد با جداکننده هزارگان
 * @param value - عدد یا رشته عددی
 * @returns رشته فرمت‌شده
 */
export function formatNumber(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '0'
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return '0'
    return num.toLocaleString('fa-IR')
  }
  
  /**
   * نمایش قیمت با واحد تومان
   * @param price - قیمت (عدد یا رشته)
   * @returns رشته قیمت فرمت‌شده با واحد تومان، یا «تماس بگیرید» در صورت نبود قیمت
   */
  export function formatPrice(price: string | number | null | undefined): string {
    if (price === null || price === undefined || price === '') {
      return 'تماس بگیرید'
    }
    const num = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(num) || num <= 0) {
      return 'تماس بگیرید'
    }
    return `${num.toLocaleString('fa-IR')} تومان`
  }
  
  /**
   * تبدیل تاریخ میلادی به تاریخ شمسی خوانا
   * @param date - تاریخ (رشته ISO یا قابل تبدیل به Date)
   * @returns تاریخ شمسی (مثلاً: ۱۵ مرداد ۱۴۰۳)
   */
  export function formatDate(date: string | null | undefined): string {
    if (!date) return ''
    try {
      const d = new Date(date)
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(d)
    } catch {
      return date
    }
  }
  
  /**
   * تبدیل تاریخ میلادی به تاریخ شمسی به صورت کوتاه (مثلاً: ۱۴۰۳/۰۵/۱۵)
   */
  export function formatShortDate(date: string | null | undefined): string {
    if (!date) return ''
    try {
      const d = new Date(date)
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d)
    } catch {
      return date
    }
  }