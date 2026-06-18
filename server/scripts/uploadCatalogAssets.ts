import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

const BUCKET = 'catalog-assets'
const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

dotenv.config()

const scriptDir = fileURLToPath(new URL('.', import.meta.url))
const assetsRoot = join(scriptDir, '../../client/public/assets')

async function collectFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }

  return files
}

function contentType(filePath: string): string {
  const ext = filePath.slice(filePath.lastIndexOf('.'))
  return MIME_BY_EXT[ext] ?? 'application/octet-stream'
}

async function uploadCatalogAssets(): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in server/.env',
    )
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const folders = ['products', 'steps'] as const

  for (const folder of folders) {
    const localDir = join(assetsRoot, folder)
    const files = await collectFiles(localDir)

    for (const filePath of files) {
      const storagePath = relative(assetsRoot, filePath).replace(/\\/g, '/')
      const body = await readFile(filePath)

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, body, {
          contentType: contentType(filePath),
          upsert: true,
        })

      if (error) {
        throw new Error(`Failed to upload ${storagePath}: ${error.message}`)
      }

      console.log(`Uploaded ${storagePath}`)
    }
  }

  console.log('Catalog assets upload complete.')
}

uploadCatalogAssets().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
