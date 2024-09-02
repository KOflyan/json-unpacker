import {
    unpack,
    JsonObject,
    DelimiterNotSpecifiedException,
    InvalidJsonObjectException,
    KeyNameContainsDelimiterException
} from "../src"
import arrays1 from './data/arrays-1.json'
import complex1 from './data/complex-1.json'
import complexWithNestedArrays1 from './data/complex-nested-arrays-1.json'
import complexWithNestedArrays2 from './data/complex-nested-arrays-2.json'

describe("Test unpack()", () => {

    it("Should return empty object if called with empty object", () => {
        expect(unpack({})).toEqual({})
    })

    it('Should throw if called with null/undefined', () => {
        expect(() => unpack(null as unknown as JsonObject)).toThrow(InvalidJsonObjectException)
        expect(() => unpack(undefined as unknown as JsonObject)).toThrow(InvalidJsonObjectException)
        expect(() => unpack("hello" as unknown as JsonObject)).toThrow(InvalidJsonObjectException)
    })

    it('Should throw if no delimiter is specified', () => {
        expect(() => unpack({}, null as unknown as string)).toThrow(DelimiterNotSpecifiedException)
        expect(() => unpack({}, '')).toThrow(DelimiterNotSpecifiedException)
        expect(() => unpack({}, '     ')).toThrow(DelimiterNotSpecifiedException)
    })

    it('Should return same object if no nested attributes exist', () => {
       const o = {
           key1: 'val1',
           key2: null
       }

       expect(unpack(o)).toEqual(o)
    })

    it('Should use default delimiter and properly unpack', () => {
        const o = {
            key1: 'val1',
            key2: {
                key3: 'val3'
            }
        }
        expect(unpack(o)).toEqual({
            key1: 'val1',
            'key2.key3': 'val3'
        })
    })

    it('Should use custom delimiter and properly unpack', () => {
        const o = {
            key1: 'val1',
            key2: {
                key3: 'val3'
            }
        }

        expect(unpack(o, '~')).toEqual({
            key1: 'val1',
            'key2~key3': 'val3'
        })
    })

    it('Should work with arrays of json objects', () => {

        expect(unpack(arrays1)).toEqual([
            {
                key1: 'val1',
                'key2.key3': 'val3'
            },
            {
                key1: 'val45',
                'key2.key4': 'val456'
            }
        ])
    })

    it('Should unpack complex json object', () => {

        expect(unpack(complex1)).toEqual({
            key1: 'val1',
            'key2.key3.key4': 'val2',
            'key2.key3.key5[0]': 1,
            'key2.key3.key5[1]': 2,
            'key2.key3.key5[2]': 3,
            'key2.key3.key6[0].key7': 'val3',
            'key2.key8': 100,
        })
    })

    it('Should unpack complex json object with nested arrays', () => {
        expect(unpack(complexWithNestedArrays1)).toEqual(    {
            'key1.key2[0].key3': 'hello',
            'key1.key2[0].key4[0].key5': 0.3333,
            'key1.key2[1].key3': 'hello-uuuu',
            'key1.key2[1].key4[0].key5': 0.7777,
            'key1.key2[1].key5.key6': null,
            'key2.key3.key4': 'val2',
            'key2.key3.key5[0]': 1,
            'key2.key3.key5[1]': 2,
            'key2.key3.key5[2]': 3,
            'key2.key5': 100,
        })
    })

    it('Should unpack complex json object with nested^2 arrays', () => {
        expect(unpack(complexWithNestedArrays2)).toEqual([
            {
                'children[2].children[1].key2': '7sdsdfs',
                'children[2].children[1].key1': 'g',
                'children[2].children[0].key2': 'csdf',
                'children[2].children[0].key1': 'zxczx',
                'children[2].key4': 'val',
                'children[2].key3': 'val',
                'children[1].key4': 'val3',
                'children[1].key3': 'val2',
                'children[0].children[0].key2': 'b',
                'children[0].children[0].key1': 'a',
                'children[0].key4': 'val',
                'children[0].key3': 'val',
                key2: 'value2',
                key1: 'value'
            },
            {
                'children[0].children[1].key2': '7',
                'children[0].children[1].key1': 'g',
                'children[0].children[0].key2': 'c',
                'children[0].children[0].key1': 'b',
                'children[0].key4': 'val2',
                'children[0].key3': 'val1',
                key2: 'value2',
                key1: 'value1'
            }
        ])
    })

    it('Should throw if key names contain delimiter in their names', () => {
        const delimiter = '.'
        const key = 'ke.y'
        const o = {
            [key]: {
                key: 'abc'
            }
        }

        expect(() => unpack(o, delimiter)).toThrow(new KeyNameContainsDelimiterException(key, delimiter))
    })

    it('Should throw if circular JSON is provided', () => {
        const delimiter = '.'
        const o = {
            key: 'abc',
            object: {},
        }

        o.object = o

        expect(() => unpack(o, delimiter)).toThrow("Provided JSON object contains circular structure")
    })

    it('Should handle BigInt values correctly', () => {
        const delimiter = '.'
        const o = {
            key: 'abc',
            bigint: BigInt(2),
        }

        expect(unpack(o, delimiter)).toEqual({bigint: BigInt(2), key: "abc"})
    })
})
