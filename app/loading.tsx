import Container from '@/components/ui/container'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Container className="py-8 md:py-12">
      <div className="space-y-8">
        <section className="rounded-2xl overflow-hidden bg-gray-50">
          <Skeleton className="h-56 md:h-72 w-full" />

          <div className="p-6 md:p-8 space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-5 w-2/3 mx-auto" />

            <div className="flex justify-center gap-3 pt-2">
              <Skeleton className="h-11 w-36 rounded-md" />
              <Skeleton className="h-11 w-32 rounded-md" />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-5 w-20" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
                >
                  <Skeleton className="aspect-square w-full" />

                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-2/5" />
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-5 w-20" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
                >
                  <Skeleton className="aspect-square w-full" />

                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-2/5" />
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </Container>
  )
}