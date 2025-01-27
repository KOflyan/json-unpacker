import {
  setNestedValue,
  DelimiterNotSpecifiedException,
  getNestedValue,
} from '../src'

describe('Test utils', () => {
  describe('Test getNestedValue()', () => {
    it('Should return nested value', () => {
      const o = {
        key1: {
          nextKey: 10,
        },
        key2: {
          key3: [1, 2],
          key4: [
            {
              key5: 'hellou',
            },
          ],
        },
      }

      expect(getNestedValue(o, 'key1')).toEqual({ nextKey: 10 })
      expect(getNestedValue(o, 'key1.nextKey', '.')).toEqual(10)
      expect(getNestedValue(o, 'key1~nextKey', '~')).toEqual(10)
      expect(getNestedValue(o, 'key2.key3[0]', '.')).toEqual(1)
      expect(getNestedValue(o, 'key2.key4[0].key5', '.')).toEqual('hellou')
    })

    it('Should return undefined if no such value exists', () => {
      const o = {
        key1: {
          key2: [
            {
              key5: 'hellou',
            },
          ],
        },
      }

      expect(getNestedValue(o, 'key1.key2[1].key5', '.')).toBeUndefined()
      expect(getNestedValue(o, 'key1.key3[0].key5', '.')).toBeUndefined()
    })
  })

  describe('Test assignNestedValue()', () => {
    it('Should assign nested value', () => {
      expect(setNestedValue('test', 'key1.key2[0].key3', {})).toEqual({
        key1: {
          key2: [
            {
              key3: 'test',
            },
          ],
        },
      })
    })

    it('Should return initial object', () => {
      expect(setNestedValue('test', '', {})).toEqual({})
      expect(setNestedValue('test', '', { hello: 1 })).toEqual({
        hello: 1,
      })
    })

    it('Should throw if no delimiter is specified', () => {
      expect(() =>
        setNestedValue('test', 'key.keeeeey', {}, null as unknown as string)
      ).toThrow(DelimiterNotSpecifiedException)
    })
  })
})
