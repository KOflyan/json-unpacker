import {
  DelimiterNotSpecifiedException,
  InvalidPlainJsonObjectException,
} from './errors'
import { DEFAULT_DELIMITER, setNestedValue } from './utils'
import { JsonObject, PlainJsonObject } from './types'

export function pack<T = JsonObject>(
  input: PlainJsonObject[],
  delimiter?: string
): T[]
export function pack<T = JsonObject>(
  input: PlainJsonObject,
  delimiter?: string
): T
export function pack<T = JsonObject>(
  input: PlainJsonObject | PlainJsonObject[],
  delimiter = DEFAULT_DELIMITER
): T | T[] {
  if (!delimiter || !delimiter.trim().length) {
    throw new DelimiterNotSpecifiedException()
  }

  if (Array.isArray(input)) {
    return packList<T>(input, delimiter)
  }

  return packObject<T>(input, delimiter)
}

function packList<T = JsonObject>(
  objects: PlainJsonObject[],
  delimiter: string
): T[] {
  return objects.map((o) => packObject(o, delimiter))
}

function packObject<T = JsonObject>(
  object: PlainJsonObject,
  delimiter: string
): T {
  if (!object || Array.isArray(object) || typeof object !== 'object') {
    throw new InvalidPlainJsonObjectException()
  }

  const result = {} as T

  for (const [k, v] of Object.entries(object)) {
    if (typeof v === 'object' && v !== null) {
      throw new InvalidPlainJsonObjectException()
    }

    setNestedValue(v, k, result, delimiter)
  }

  return result
}
