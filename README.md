## JSON Unpacker

### Overview

Simple library for unpacking JSON objects, 
e.g. transforming multi-level nested objects to plain objects, keeping the paths preserved.

For example, given a nested JSON object as such

```json
{
  "key1": "val1",
  "key2": {
    "key3": {
      "key4": "val2",
      "key5": [1, 2, 3],
      "key6": [
        {
          "key7": "val3"
        }
      ]
    },
    "key8": 100
  }
}
```

The library will "unpack" it to

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


## Usage

```typescript
import { unpack } from 'json-unpacker';

unpack(<my-object>, <my-delimiter>);
```

where 

`<my-object>` is the JSON object or array you want to unpack

`<my-delimiter>` (string) is the delimiter you want the keys to be separated with (default is `.`)

