import { blob } from '@nuxthub/blob'
export default eventHandler(async (event) => {
  const { pathname } = event.context.params || {}

  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')
  return blob.serve(event, pathname)
})
