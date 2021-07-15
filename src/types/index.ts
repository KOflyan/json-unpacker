export interface JsonObject<T = any> {
    [key: string]: T;
}


export interface PlainJsonObject extends JsonObject<string | number | boolean | null | undefined> {
}
