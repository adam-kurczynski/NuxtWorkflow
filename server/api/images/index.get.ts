import { blob } from '@nuxthub/blob'
export default eventHandler(async () => {
  const { blobs } = await blob.list()

  return blobs
})
