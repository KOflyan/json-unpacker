import { JsonObject, PlainJsonObjectValue } from './types'
import { DelimiterNotSpecifiedException } from './errors'

export const DEFAULT_DELIMITER = '.'

export function getNestedValue<T = JsonObject>(
  object: T,
  key: string,
  delimiter = DEFAULT_DELIMITER
): T | undefined {
  const pathArray = key
    .split(delimiter)
    .flatMap((pathPart) => pathPart.match(new RegExp(`([^[\\]])+`, 'gi')) ?? [])

  if (!pathArray) {
    return undefined
  }

  return pathArray.reduce<T>(
    (prevObj, key) => prevObj && (prevObj[key as keyof T] as unknown as T),
    object
  )
}

export function setNestedValue<T = JsonObject>(
  value: PlainJsonObjectValue,
  path: string,
  object: T,
  delimiter = DEFAULT_DELIMITER
): T {
  if (!delimiter) {
    throw new DelimiterNotSpecifiedException()
  }

  if (!path || !path.trim().length) {
    return object
  }

  const remainingKeys = path.split(delimiter)

  let ref: T = object

  while (remainingKeys.length) {
    const key = remainingKeys.shift() as string
    const arrayIndexMatch = key.match(/(?<=\[)(.*?)(?=])/g) || []
    const isLastKey = remainingKeys.length === 0

    if (arrayIndexMatch.length) {
      ref = setArrayValue(ref, key, value, isLastKey, arrayIndexMatch)
    } else {
      ref = setObjectValue(ref, key, value, isLastKey)
    }
  }

  return object
}

function setArrayValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any,
  key: string,
  value: PlainJsonObjectValue,
  isLastKey: boolean,
  arrayIndexMatch: string[]
) {
  const keyWithoutBrackets = key.replace(/(\[.*])/g, '')

  for (let i = 0; i < arrayIndexMatch.length; i++) {
    const indexAsString = arrayIndexMatch[i]
    const isArrayPathExhausted = i === arrayIndexMatch.length - 1

    if (indexAsString == undefined) {
      throw new Error(
        'RegExp match array contains nullish values, this should not happen'
      )
    }

    const index = parseInt(indexAsString, 10)

    if (!Array.isArray(ref[keyWithoutBrackets]) && !Array.isArray(ref)) {
      ref[keyWithoutBrackets] = []
    }

    if (!Array.isArray(ref)) {
      ref = ref[keyWithoutBrackets]
    }

    const placeholderValue = isArrayPathExhausted ? {} : []

    if (isArrayPathExhausted && isLastKey) {
      ref[index] = value
    } else {
      ref[index] = ref[index] == undefined ? placeholderValue : ref[index]
      ref = ref[index]
    }
  }

  return ref
}

function setObjectValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any,
  key: string,
  value: PlainJsonObjectValue,
  isLastKey: boolean
) {
  let valueToSet = ref[key]

  if (isLastKey) {
    valueToSet = value
  }

  ref[key] = valueToSet !== undefined ? valueToSet : {}

  return ref[key]
}
