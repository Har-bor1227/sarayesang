import type {
  FinderApiResponse,
  FinderProduct,
} from '../stone-finder/types'

export type CompareSlot =
  | 'first'
  | 'second'

export type ApiStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'error'

export type ComparisonState = {
  data: FinderApiResponse | null
  status: ApiStatus
  error: string
  firstProduct: FinderProduct | null
  secondProduct: FinderProduct | null
  pickerSlot: CompareSlot | null
  query: string
}

export type ProductSlotProps = {
  product: FinderProduct | null
  slot: CompareSlot
  onOpenPicker: (
    slot: CompareSlot,
  ) => void
  onClear: (slot: CompareSlot) => void
}

export type ProductPickerProps = {
  open: boolean
  slot: CompareSlot | null
  products: FinderProduct[]
  query: string
  loading: boolean
  error: string
  selectedFirstId?: string
  selectedSecondId?: string
  onQueryChange: (
    value: string,
  ) => void
  onSelect: (
    product: FinderProduct,
  ) => void
  onClose: () => void
}

export type ComparisonShowcaseProps = {
  first: FinderProduct | null
  second: FinderProduct | null
}