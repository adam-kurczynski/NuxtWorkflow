export default eventHandler(async (event) => {
  const { name, phone, address } = await readBody(event)
  console.log(name, phone, address)
  const client = await useDrizzle().insert(tables.clients).values({
    name: name,
    address: address,
    phone: phone,
  }).returning().get()

  return client
})