## JSON Unpacker

### Overview

----
Simple library for packing/unpacking JSON objects: transforming multi-level nested objects to plain objects, keeping the paths preserved.

`unpack(object: JsonObject | JsonObject[], delimiter = '.'): PlainJsonObject | PlainJsonObject[]`

Unpacks the object or array of objects, returns plain json object(s) (without nested attributes),
with each key representing a path to its final value.

`pack(object: PlainJsonObject | PlainJsonObject[], delimiter = '.'): JsonObject | JsonObject[]`

Packs a plain json object(s) back to original form.

----

### Examples

Say you want to transform the object called `myObject`:

```typescript
import { unpack } from 'json-unpacker';

const myObject = {
  key1: 'val1',
  key2: {
    key3: {
      key4: 'val2',
      key5: [1, 2, 3],
      key6: [
        {
          key7: 'val3'
        }
      ]
    },
    key8: 100
  }
}

const unpackedObject = unpack(myObject);
```

The resulting value stored in`unpackedObject` is as follows:

```json
{
  "key1": "val1",
  "key2.key3.key4": "val2",
  "key2.key3.key5[0]": 1,
  "key2.key3.key5[1]": 2,
  "key2.key3.key5[2]": 3,
  "key2.key3.key6[0].key7": "val3",
  "key2.key8": 100
}
```

In the same way, you can use the `pack` function to restore the original object from the `unpacked` version:

```typescript
import { pack } from 'json-unpacker';

const originalMyObject = pack({
    key1: 'val1',
    'key2.key3.key4': 'val2',
    'key2.key3.key5[0]': 1,
    'key2.key3.key5[1]': 2,
    'key2.key3.key5[2]': 3,
    'key2.key3.key6[0].key7': 'val3',
    'key2.key8': 100
});
```

As a result, you will get the initial JSON object (which we originally named `myObject`) back.

----