import { useMemo } from 'react'
import contenthashToUri from '../utils1/contenthashToUri'
import { parseENSAddress } from '../utils1/parseENSAddress'
import uriToHttp from '../utils1/uriToHttp'
import useENSContentHash from './useENSContentHash'

export default function useHttpLocations(uri: string | undefined): string[] {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri])
  const resolvedContentHash = useENSContentHash(ens?.ensName)
  return useMemo(() => {
    if (ens) {
      return resolvedContentHash.contenthash ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash)) : []
    } else {
      return uri ? uriToHttp(uri) : []
    }
  }, [ens, resolvedContentHash.contenthash, uri])
}
