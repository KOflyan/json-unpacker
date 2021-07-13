export interface JsonObject<T = any> {
    [key: string]: T;
}


export interface PlainJsonObject {
    [key: string]: string | number | boolean | null | undefined;
}
