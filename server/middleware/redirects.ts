import { parseURL } from 'ufo'
import { kv } from '@nuxthub/kv'

export default eventHandler(async (event) => {
  // Skip during prerendering
  if (import.meta.prerender) return

  const { pathname } = parseURL(event.path)
  const redirects = await kv.get<{ [key: string]: string }>('redirects')

  if (redirects?.[pathname]) {
    return sendRedirect(event, redirects[pathname])
  }
})
