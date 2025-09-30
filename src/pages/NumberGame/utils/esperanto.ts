export const esperantoNumbers: Record<number, string> = {
  1: 'unu',
  2: 'du',
  3: 'tri',
  4: 'kvar',
  5: 'kvin',
  6: 'ses',
  7: 'sep',
  8: 'ok',
  9: 'naŭ',
  10: 'dek',
  100: 'cent',
  1000: 'mil',
}

export const numberToEsperanto = (num: number): number[] => {
  const parts: number[] = []

  // 千の位
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000)
    if (thousands > 1) {
      parts.push(thousands) // 2, 3, 4... など
    }
    parts.push(1000) // mil
    num %= 1000
  }

  // 百の位
  if (num >= 100) {
    const hundreds = Math.floor(num / 100)
    if (hundreds === 1) {
      parts.push(100) // cent
    } else {
      parts.push(hundreds) // 2, 3, 4... など
      parts.push(100) // cent
    }
    num %= 100
  }

  // 十の位
  if (num >= 20) {
    const tens = Math.floor(num / 10)
    parts.push(tens) // 2, 3, 4... など
    parts.push(10) // dek
    num %= 10
  } else if (num >= 10) {
    parts.push(10) // dek (10-19の場合)
    num %= 10
  }

  // 一の位
  if (num > 0) {
    parts.push(num)
  }

  return parts
}

export const generateRandomNumber = (): number => {
  return Math.floor(Math.random() * 9000) + 1000 // 1000-9999の範囲
}