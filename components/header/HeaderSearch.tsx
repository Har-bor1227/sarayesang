import LiveSearch from '@/components/search/LiveSearch'

export default function HeaderSearch() {
  return (
    <div
      className="
        w-[220px]
        xl:w-[260px]
        2xl:w-[290px]
      "
    >
      <LiveSearch />
    </div>
  )
}