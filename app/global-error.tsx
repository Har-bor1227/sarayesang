'use client'

interface GlobalErrorProps {
  error: Error & {
    digest?: string
  }
  unstable_retry: () => void
}

export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorProps) {
  return (
    <html
      lang="fa"
      dir="rtl"
    >
      <body>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'sans-serif',
            background: '#ffffff',
            color: '#112F50',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '56px',
                marginBottom: '24px',
              }}
              aria-hidden="true"
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: '28px',
                fontWeight: 800,
                marginBottom: '16px',
              }}
            >
              خطای غیرمنتظره‌ای رخ داد
            </h1>

            <p
              style={{
                color: '#6b7280',
                lineHeight: 1.8,
                marginBottom: '28px',
              }}
            >
              لطفاً دوباره تلاش کنید.
            </p>

            <button
              type="button"
              onClick={() =>
                unstable_retry()
              }
              style={{
                border: 0,
                borderRadius: '10px',
                background: '#112F50',
                color: '#ffffff',
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              تلاش مجدد
            </button>

            {process.env.NODE_ENV !==
              'production' &&
              error?.message && (
                <pre
                  style={{
                    marginTop: '24px',
                    padding: '16px',
                    overflowX: 'auto',
                    textAlign: 'left',
                    direction: 'ltr',
                    background: '#f3f4f6',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#374151',
                  }}
                >
                  {error.message}
                </pre>
              )}
          </div>
        </main>
      </body>
    </html>
  )
}