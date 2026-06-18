const CATALOG_ASSETS_BUCKET = 'catalog-assets'

export function resolveAssetUrl(
  url: string | null,
  supabaseUrl: string,
): string | null {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('/')) return url
  const base = supabaseUrl.replace(/\/$/, '')
  return `${base}/storage/v1/object/public/${CATALOG_ASSETS_BUCKET}/${url}`
}
