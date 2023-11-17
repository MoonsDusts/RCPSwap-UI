import { useSearchParams } from 'next/navigation'
import { parse, ParsedQs } from 'qs'
import { useMemo } from 'react'

export default function useParsedQueryString(): ParsedQs {
  const search = useSearchParams().toString()

  return useMemo(
    () => (search && search.length > 1 ? parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}),
    [search]
  )
}
