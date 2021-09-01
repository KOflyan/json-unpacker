import { JsonObject, PlainJsonObjectValue } from "./types"
import { DelimiterNotSpecifiedException } from "./errors"


export function getNestedValue(
    object: JsonObject,
    key: string,
    delimiter = '.'
): JsonObject | undefined {
    const pathArray = key.match(new RegExp(`([^[${delimiter}\\]])+`, 'gi'))

    if (!pathArray) {
        return undefined
    }

    return pathArray.reduce((prevObj, key) => prevObj && prevObj[key], object)
}

export function assignNestedValue(
    finalValue: PlainJsonObjectValue,
    path: string,
    object: JsonObject = {},
    delimiter = '.'
): JsonObject {

    if (!delimiter) {
        throw new DelimiterNotSpecifiedException()
    }

    if (!path || !path.trim().length) {
        return object
    }

    const items = path.split(delimiter)

    let ref = object

    while (items.length) {
        let key = items.shift()!
        const arrayIndexMatch = key.match(/(?<=\[)(.*?)(?=])/g) || []
        const idx = parseInt(arrayIndexMatch[0]!, 10)

        key = key.replace(/(\[.*])/g, '')

        let value = Array.isArray(ref[key]) ? ref[key][idx] : ref[key]

        if (!items.length) {
            value = finalValue
        }

        if  (!arrayIndexMatch.length) {
            ref[key] = value !== undefined ? value : {}
            ref = ref[key]
            continue
        }

        ref[key] = (ref[key] || [])
        ref[key][idx] = value !== undefined ? value : {}
        ref = ref[key][idx]
    }

    return object
}
