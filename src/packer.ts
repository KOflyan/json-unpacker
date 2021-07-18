import { JsonObject, PlainJsonObject } from "./types";
import { DelimiterNotSpecifiedException, InvalidPlainJsonObjectException } from "./errors";
import { assignNestedValue } from "./utils";

export function pack(input: PlainJsonObject[], delimiter?: string): JsonObject[];
export function pack(input: PlainJsonObject, delimiter?: string): JsonObject;
export function pack(input: PlainJsonObject | PlainJsonObject[], delimiter = '.'): JsonObject | JsonObject[] {

    if (!delimiter || !delimiter.trim().length) {
        throw new DelimiterNotSpecifiedException();
    }

    if (Array.isArray(input)) {
        return packList(input, delimiter);
    }

    return packObject(input, delimiter);
}

function packList(objects: PlainJsonObject[], delimiter: string): JsonObject[] {
    return objects.map(o => packObject(o, delimiter));
}

function packObject(object: PlainJsonObject, delimiter: string): JsonObject {

    if (!object || Array.isArray(object) || typeof object !== 'object') {
        throw new InvalidPlainJsonObjectException();
    }

    const result = {} as JsonObject;

    for (const [k, v] of Object.entries(object)) {

        if (typeof v === 'object' && v !== null) {
            throw new InvalidPlainJsonObjectException();
        }

        assignNestedValue(v, k, result, delimiter);
    }

    return result;
}