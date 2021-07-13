import { unpack } from "../src/main";
import { JsonObject } from "../src/types";
import { DelimiterNotSpecifiedException, InvalidJsonObjectException } from "../src/errors";

describe("Test unpack()", () => {

    it("Should return empty object if called with empty object", () => {
        expect(unpack({})).toEqual({});
    });

    it('Should throw if called with null/undefined', () => {
        expect(() => unpack(null as unknown as JsonObject)).toThrow(InvalidJsonObjectException);
        expect(() => unpack(undefined as unknown as JsonObject)).toThrow(InvalidJsonObjectException);
        expect(() => unpack("hello" as unknown as JsonObject)).toThrow(InvalidJsonObjectException);
    });

    it('Should throw if no delimiter is specified', () => {
        expect(() => unpack({}, null as unknown as string)).toThrow(DelimiterNotSpecifiedException);
        expect(() => unpack({}, '')).toThrow(DelimiterNotSpecifiedException);
        expect(() => unpack({}, '     ')).toThrow(DelimiterNotSpecifiedException);
    });

    it('Should return same object if no nested attributes exist', () => {
       const o = {
           key1: 'val1',
           key2: 'val2'
       };

       expect(unpack(o)).toEqual(o);
    });

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
        });
    });

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
        });
    });

    it('Should work with arrays of json objects', () => {
        const objects = [
            {
                key1: 'val1',
                key2: {
                    key3: 'val3'
                }
            },
            {
                key1: 'val45',
                key2: {
                    key4: 'val456'
                }
            }
        ]

        expect(unpack(objects)).toEqual([
            {
                key1: 'val1',
                'key2.key3': 'val3'
            },
            {
                key1: 'val45',
                'key2.key4': 'val456'
            }
        ]);
    });

    it('Should unpack complex json object', () => {
        const o = {
            key1: 'val1',
            key2: {
                key3: {
                    key4: 'val2',
                    key5: [1, 2, 3]
                },
                key5: 100
            },
        }

        expect(unpack(o)).toEqual(   {
            key1: 'val1',
            'key2.key3.key4': 'val2',
            'key2.key3.key5[0]': 1,
            'key2.key3.key5[1]': 2,
            'key2.key3.key5[2]': 3,
            'key2.key5': 100,
        });
    });

    it('Should unpack complex json object with nested arrays', () => {
        const o = {
            key1: {
                key2: [
                    {
                        key3: 'hello',
                        key4: [
                            {
                                key5: .3333
                            }
                        ]
                    },
                    {
                        key3: 'hello-uuuu',
                        key4: [
                            {
                                key5: .7777
                            }
                        ],
                        key5: {
                            key6: null
                        }
                    }
                ]
            },
            key2: {
                key3: {
                    key4: 'val2',
                    key5: [1, 2, 3]
                },
                key5: 100
            },
        }

        expect(unpack(o)).toEqual(    {
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
        });
    });

    it('Should set value to undefined if key names include delimiter in their names before processing', () => {
        const o = {
            'ke.y': {
                key: 'abc'
            }
        }

        expect(unpack(o)).toEqual({
            'ke.y': undefined,
        });
    })
});