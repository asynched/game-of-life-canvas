export function* enumerate(source) {
  let i = 0

  for (const item of source) {
    yield [i++, item]
  }
}
