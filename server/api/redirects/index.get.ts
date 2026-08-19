import { kv } from '@nuxthub/kv'
export default eventHandler(async () => {
  return (await kv.get('redirects') || {})
})
