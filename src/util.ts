import algosdk from 'algosdk'
import { sha256 as nobleSHA256 } from '@noble/hashes/sha2'

export const sha256 = nobleSHA256

export function base64ToBase64url(base64: string): string {
  return base64
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=+$/, '') // Remove any trailing '=' padding characters
}

export function bufferToBase64url(buffer: Uint8Array | ArrayBuffer): string {
  return base64ToBase64url(Buffer.from(buffer).toString('base64'))
}

// Function to convert base64-url encoded string to Buffer
export function base64urlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (base64url.length % 4)) % 4)
  const buf = Buffer.from(base64, 'base64')
  return Uint8Array.from(buf)
}


export async function getNonce(sessionPK: Uint8Array, expValidity: number): Promise<string> {
  const structABICodec: algosdk.ABIType = algosdk.ABIType.from('(byte[32],uint64)')
  const unhashedNonce: Uint8Array = structABICodec.encode([sessionPK, expValidity])
  const nonce = sha256(unhashedNonce)
  const nonceAsBase64Url = bufferToBase64url(nonce)
  return nonceAsBase64Url

}

export function Assert(value: boolean, message: string): asserts value is true {
  if (!value) {
    throw new Error(message)
  }
}
export function AssertDefined<T>(value: T | undefined | null, message: string): asserts value is T {
  if (value === undefined || value === null) {
    throw new Error(message)
  }
}

export function getTealInstanceFromTemplateMap(
  templateMap: Record<string, string>,
  source: string
): string {
  // get copy of source
  let instance = source.slice()

  // Check all template values are strings
  for (const key in templateMap) {
    if (typeof templateMap[key] !== 'string') {
      throw new Error('Template value is not a string')
    }
  }

  // Check the template provided keys are completely contained in the source
  const regex = /^\s*(byte|int) *TMPL_.*$/gm
  const matches = instance.match(regex) ?? []
  const templateKeys = matches.map((t) => t.trim().split(' ').pop() ?? '')

  if (templateKeys === null) {
    throw new Error('No template keys found in source')
  }
  const templateKeysSet = new Set(templateKeys)
  const templateMapKeysSet = new Set(Object.keys(templateMap))
  if (templateKeysSet.size !== templateMapKeysSet.size) {
    throw new Error(
      'Number of template keys in source does not match number of template keys in map'
    )
  }
  for (const key of templateKeysSet) {
    if (!templateMapKeysSet.has(key)) {
      throw new Error('Template key not found in template map')
    }
  }

  // fill out template variables
  for (const key in templateMap) {
    const regex = new RegExp(key, 'g')
    const templateValue = templateMap[key]
    AssertDefined(templateValue, "templateMap[key] must be defined")
    instance = instance.replaceAll(regex, templateValue)
  }

  return instance
}
