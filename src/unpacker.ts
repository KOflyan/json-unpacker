import {
  DelimiterNotSpecifiedException,
  InvalidJsonObjectException,
  KeyNameContainsDelimiterException,
} from './errors'
import { DEFAULT_DELIMITER, getNestedValue } from './utils'
import { JsonObject, PlainJsonObject, PlainJsonObjectValue } from './types'

export function unpack<T = JsonObject>(
  input: T,
  delimiter?: string
): PlainJsonObject[]
export function unpack<T = JsonObject[]>(
  input: T[],
  delimiter?: string
): PlainJsonObject
export function unpack<T = JsonObject | JsonObject[]>(
  input: T,
  delimiter = DEFAULT_DELIMITER
): PlainJsonObject | PlainJsonObject[] {
  if (!delimiter || !delimiter.trim().length) {
    throw new DelimiterNotSpecifiedException()
  }

  if (Array.isArray(input)) {
    return unpackList(input, delimiter)
  }

  return unpackObject(input, delimiter)
}

function unpackList<T = JsonObject>(
  objects: T[],
  delimiter: string
): PlainJsonObject[] {
  return objects.map((o) => unpackObject(o, delimiter))
}

function unpackObject<T = JsonObject>(
  object: T,
  delimiter: string
): PlainJsonObject {
  try {
    JSON.stringify(object)
  } catch (e) {
    if (!(e instanceof TypeError)) {
      throw e
    }

    if (e.message.includes('Converting circular structure to JSON')) {
      throw new InvalidJsonObjectException(
        'Provided JSON object contains circular structure'
      )
    }
  }

  if (!object || Array.isArray(object) || typeof object !== 'object') {
    throw new InvalidJsonObjectException()
  }

  const keys = Object.keys(object)
  const result = {} as PlainJsonObject

  validateKeys(keys, delimiter)

  while (keys.length) {
    const key = keys.pop()!
    const value = getNestedValue(object, key, delimiter)

    if (typeof value !== 'object' || value === null) {
      result[key] = value as PlainJsonObjectValue
      continue
    }

    if (Array.isArray(value)) {
      value.forEach((_, i) => keys.push(`${key}[${i}]`))
      continue
    }

    Object.keys(value).forEach((k) => keys.push(`${key}${delimiter}${k}`))
  }

  return result
}

function validateKeys(keys: string[], delimiter: string): void {
  for (const key of keys) {
    if (key.includes(delimiter)) {
      throw new KeyNameContainsDelimiterException(key, delimiter)
    }
  }
}
