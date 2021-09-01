import { DelimiterNotSpecifiedException, InvalidJsonObjectException } from "./errors"
import { getNestedValue } from "./utils"
import { JsonArray, JsonObject, PlainJsonObject, PlainJsonObjectValue } from "./types"

export function unpack<T>(input: JsonArray<T>, delimiter?: string): PlainJsonObject[];
export function unpack<T>(input: JsonObject<T>, delimiter?: string): PlainJsonObject;
export function unpack<T>(input: JsonObject<T> | JsonArray<T>, delimiter = '.'): PlainJsonObject | PlainJsonObject[] {

    if (!delimiter || !delimiter.trim().length) {
        throw new DelimiterNotSpecifiedException()
    }

    if (Array.isArray(input)) {
        return unpackList(input, delimiter)
    }

    return unpackObject(input, delimiter)
}

function unpackList<T>(objects: JsonArray<T>, delimiter: string): PlainJsonObject[] {
    return objects.map(o => unpackObject(o, delimiter))
}

function unpackObject<T>(object: JsonObject<T>, delimiter: string): PlainJsonObject {

    if (!object || Array.isArray(object) || typeof object !== 'object') {
        throw new InvalidJsonObjectException()
    }

    const keys = Object.keys(object)
    const result = {} as PlainJsonObject

    while (keys.length) {
        const key = keys.pop()!
        const value = getNestedValue(object, key, delimiter)

        if (typeof value !== "object" || value === null) {
            result[key] = value as PlainJsonObjectValue
            continue
        }

        if (Array.isArray(value)) {
            value.forEach((_, i) => keys.push(`${key}[${i}]`))
            continue
        }

        Object.keys(value).forEach(k => keys.push(`${key}${delimiter}${k}`))
    }

    return result
}
