export type PlainJsonObjectValue = string | number | boolean | null | undefined;

export interface JsonObject<T = any> {
    [key: string]: T;
}

export interface PlainJsonObject extends JsonObject<PlainJsonObjectValue> {
}
