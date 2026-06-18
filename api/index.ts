import type { IncomingMessage, ServerResponse } from 'node:http'

type ExpressApp = (req: IncomingMessage, res: ServerResponse) => void

let appPromise: Promise<ExpressApp> | undefined

function loadApp(): Promise<ExpressApp> {
  if (!appPromise) {
    appPromise = import('../server/dist/app.js').then((mod) => mod.default)
  }
  return appPromise
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const app = await loadApp()
  app(req, res)
}
