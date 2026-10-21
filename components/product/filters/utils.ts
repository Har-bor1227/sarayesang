import type {
  CatalogFilterSelection,
} from '@/types/catalog'

export function getActiveFilterCount(
  selection: CatalogFilterSelection,
): number {
  return Object.values(selection).filter(
    Boolean,
  ).length
}
