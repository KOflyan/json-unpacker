export type JsonObject<V = unknown> = Record<string | symbol, V>
export type PlainJsonObject = JsonObject<PlainJsonObjectValue>
export type PlainJsonObjectValue =
  | symbol
  | string
  | number
  | boolean
  | null
  | undefined
