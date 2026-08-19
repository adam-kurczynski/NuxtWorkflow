import { kv } from '@nuxthub/kv'
export default eventHandler(async (event) => {
  const body = await readBody(event)

  // Used in server/routes/redirects.ts
  await kv.set('redirects', body)

  return body
})
