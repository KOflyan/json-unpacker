import { JsonObject, PlainJsonObject } from "./types";
import { DelimiterNotSpecifiedException, InvalidJsonObjectException } from "./errors";
import { getNestedValue } from "./utils";

export function unpack<T>(input: T[], delimiter?: string): PlainJsonObject[];
export function unpack<T>(input: T, delimiter?: string): PlainJsonObject;
export function unpack<T>(input: T | T[], delimiter = '.'): PlainJsonObject | PlainJsonObject[] {

    if (!delimiter || !delimiter.trim().length) {
        throw new DelimiterNotSpecifiedException();
    }

    if (Array.isArray(input)) {
        return unpackList(input, delimiter);
    }

    return unpackObject(input, delimiter);
}

function unpackList(objects: JsonObject[], delimiter: string): PlainJsonObject[] {
    return objects.map(o => unpackObject(o, delimiter));
}

function unpackObject(object: JsonObject, delimiter: string): PlainJsonObject {

    if (!object || Array.isArray(object) || typeof object !== 'object') {
        throw new InvalidJsonObjectException();
    }

    let keys = Object.keys(object);
    let result = {} as PlainJsonObject;

    while (keys.length) {
        let key = keys.pop()!;
        let value = getNestedValue(object, key, delimiter);

        if (typeof value !== "object" || value === null) {
            result[key] = value;
            continue;
        }

        if (Array.isArray(value)) {
            value.forEach((_, i) => keys.push(`${key}[${i}]`));
            continue;
        }

        Object.keys(value).forEach(k => keys.push(`${key}${delimiter}${k}`));
    }

    return result;
}
