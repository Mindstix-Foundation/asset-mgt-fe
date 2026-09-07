import axios from 'axios'

export interface PublicAssetInfo {
  assetId: string
  serialNumber: string | null
  status: string
  condition: string
  location: string | null
  assetType: {
    name: string
    category: { name: string } | null
  }
  brand: { name: string }
  model: { name: string }
  currentOwner: string | null
}

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

export async function fetchPublicAsset(token: string): Promise<PublicAssetInfo> {
  const response = await publicApi.get<{
    message: string
    data: { asset: PublicAssetInfo }
  }>(`/public/assets/${encodeURIComponent(token)}`)
  return response.data.data.asset
}
