import { InvalidPlainJsonObjectException, DelimiterNotSpecifiedException, PlainJsonObject, pack } from "../src";

describe("Test pack()", () => {

    it("Should return empty object if called with empty object", () => {
        expect(pack({})).toEqual({});
    });

    it('Should throw if called with null/undefined', () => {
        expect(() => pack(null as unknown as PlainJsonObject)).toThrow(InvalidPlainJsonObjectException);
        expect(() => pack(undefined as unknown as PlainJsonObject)).toThrow(InvalidPlainJsonObjectException);
        expect(() => pack("hello" as unknown as PlainJsonObject)).toThrow(InvalidPlainJsonObjectException);
    });

    it('Should throw if no delimiter is specified', () => {
        expect(() => pack({}, null as unknown as string)).toThrow(DelimiterNotSpecifiedException);
        expect(() => pack({}, '')).toThrow(DelimiterNotSpecifiedException);
        expect(() => pack({}, '     ')).toThrow(DelimiterNotSpecifiedException);
    });

    it('Should throw if called with object which is not compatible to PlainJsonObject type', () => {
        const o1 = {
            key1: 'val',
            key2: {
                key3: 'val'
            }
        };
        const o2 = {
            key1: 'val',
            key2: [1, 2]
        };

        [o1, o2].forEach(o =>
            expect(() => pack(o as unknown as PlainJsonObject)).toThrow(InvalidPlainJsonObjectException)
        );
    })

    it('Should return same object if no nested attributes exist', () => {
        const o = {
            key1: 'val1',
            key2: null
        };

        expect(pack(o)).toEqual(o);
    });

    it('Should use default delimiter and properly pack', () => {
        const o = {
            key1: 'val1',
            'key2.key3': 'val3'
        }
        expect(pack(o)).toEqual({
            key1: 'val1',
            key2: {
                key3: 'val3'
            }
        });
    });

    it('Should use custom delimiter and properly pack', () => {
        const o = {
            key1: 'val1',
                'key2~key3': 'val3'
        }

        expect(pack(o, '~')).toEqual({
            key1: 'val1',
            key2: {
                key3: 'val3'
            }
        });
    });

    it('Should work with arrays of json objects', () => {
        const objects = [
            {
                key1: 'val1',
                'key2.key3': 'val3'
            },
            {
                key1: 'val45',
                'key2.key4': 'val456'
            }
        ]

        expect(pack(objects)).toEqual([
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
        ]);
    });

    it('Should pack complex json object', () => {
        const o = {
            key1: 'val1',
            'key2.key3.key4': 'val2',
            'key2.key3.key5[0]': 1,
            'key2.key3.key5[1]': 2,
            'key2.key3.key5[2]': 3,
            'key2.key3.key6[0].key7': 'val3',
            'key2.key8': 100,
        }

        expect(pack(o)).toEqual({
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
            },
        });
    });

    it('Should pack complex json object with nested arrays', () => {
        const o = {
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
        }

        expect(pack(o)).toEqual({
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
            });
        });
});