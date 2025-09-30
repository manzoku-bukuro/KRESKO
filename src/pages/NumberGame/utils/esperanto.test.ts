import { describe, it, expect } from 'vitest'
import { numberToEsperanto, generateRandomNumber, esperantoNumbers } from './esperanto'

describe('esperanto utils', () => {
  describe('esperantoNumbers', () => {
    it('has correct mappings', () => {
      expect(esperantoNumbers[1]).toBe('unu')
      expect(esperantoNumbers[2]).toBe('du')
      expect(esperantoNumbers[10]).toBe('dek')
      expect(esperantoNumbers[100]).toBe('cent')
      expect(esperantoNumbers[1000]).toBe('mil')
    })
  })

  describe('numberToEsperanto', () => {
    it('converts single digit numbers correctly', () => {
      expect(numberToEsperanto(1)).toEqual([1])
      expect(numberToEsperanto(5)).toEqual([5])
      expect(numberToEsperanto(9)).toEqual([9])
    })

    it('converts tens correctly', () => {
      expect(numberToEsperanto(10)).toEqual([10])
      expect(numberToEsperanto(15)).toEqual([10, 5])
      expect(numberToEsperanto(20)).toEqual([2, 10])
      expect(numberToEsperanto(25)).toEqual([2, 10, 5])
      expect(numberToEsperanto(99)).toEqual([9, 10, 9])
    })

    it('converts hundreds correctly', () => {
      expect(numberToEsperanto(100)).toEqual([100])
      expect(numberToEsperanto(200)).toEqual([2, 100])
      expect(numberToEsperanto(250)).toEqual([2, 100, 5, 10])
      expect(numberToEsperanto(999)).toEqual([9, 100, 9, 10, 9])
    })

    it('converts thousands correctly', () => {
      expect(numberToEsperanto(1000)).toEqual([1000])
      expect(numberToEsperanto(2000)).toEqual([2, 1000])
      expect(numberToEsperanto(2521)).toEqual([2, 1000, 5, 100, 2, 10, 1])
      expect(numberToEsperanto(9999)).toEqual([9, 1000, 9, 100, 9, 10, 9])
    })

    it('handles numbers with zeros correctly', () => {
      expect(numberToEsperanto(1001)).toEqual([1000, 1])
      expect(numberToEsperanto(1010)).toEqual([1000, 10])
      expect(numberToEsperanto(1100)).toEqual([1000, 100])
      expect(numberToEsperanto(2005)).toEqual([2, 1000, 5])
    })

    it('handles edge cases', () => {
      expect(numberToEsperanto(1000)).toEqual([1000])
      expect(numberToEsperanto(9999)).toEqual([9, 1000, 9, 100, 9, 10, 9])
    })
  })

  describe('generateRandomNumber', () => {
    it('generates numbers within the correct range', () => {
      for (let i = 0; i < 100; i++) {
        const num = generateRandomNumber()
        expect(num).toBeGreaterThanOrEqual(1000)
        expect(num).toBeLessThanOrEqual(9999)
      }
    })

    it('generates different numbers', () => {
      const numbers = new Set<number>()
      for (let i = 0; i < 50; i++) {
        numbers.add(generateRandomNumber())
      }
      // At least 40 unique numbers in 50 attempts (randomness check)
      expect(numbers.size).toBeGreaterThan(40)
    })
  })
})