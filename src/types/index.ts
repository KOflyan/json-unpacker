/* eslint-disable @typescript-eslint/no-explicit-any */

export type JsonObject<T = any> = {
    [key: string]: T;
}
export type JsonArray<T = any> = JsonObject<T | unknown>[]
export type PlainJsonObject = JsonObject<PlainJsonObjectValue>
export type PlainJsonObjectValue = string | number | boolean | null | undefined

