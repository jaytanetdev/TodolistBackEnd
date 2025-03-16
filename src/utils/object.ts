export function assignIgnoreUndefined(target: any, ...sources: any) {
  sources.forEach((source) => {
    for (const key in source) {
      if (source[key] !== undefined) {
        target[key] = source[key]
      }
    }
  })
  return target
}
