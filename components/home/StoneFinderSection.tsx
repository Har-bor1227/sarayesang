'use client'

import StoneFinderDialog from './stone-finder/StoneFinderDialog'
import StoneFinderHero from './stone-finder/StoneFinderHero'
import { useStoneFinder } from './stone-finder/useStoneFinder'

export default function StoneFinderSection() {
  const controller =
    useStoneFinder()

  return (
    <>
      <StoneFinderHero
        onOpen={
          controller.openFinder
        }
        openerRef={
          controller.openerRef
        }
      />

      <StoneFinderDialog
        controller={controller}
      />
    </>
  )
}