export function encodeBase64Url(input: string): string {
  // Convert input string to a Base64 string
  const base64 = Buffer.from(input).toString('base64')

  // Replace + with -, / with _, and remove any trailing =
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeBase64Url(encoded: string): string {
  // Add back padding if necessary
  const base64 = encoded
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), '=')

  // Convert from Base64 to string
  return Buffer.from(base64, 'base64').toString('utf-8')
}
