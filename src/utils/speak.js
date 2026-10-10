const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

export function intToWords(n) {
  if (n === 0) return 'zero';
  if (n < 0) return 'minus ' + intToWords(-n);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + intToWords(n % 100) : '');
  if (n < 1e6) {
    const thousands = Math.floor(n / 1000);
    const rem = n % 1000;
    return intToWords(thousands) + ' thousand' + (rem ? (rem < 100 ? ' and ' : ' ') + intToWords(rem) : '');
  }
  return String(n);
}

export function numToWords(str) {
  const [i, d] = String(str).split('.');
  const w = intToWords(parseInt(i, 10));
  return d === undefined ? w : w + ' point ' + d.split('').map(ch => intToWords(+ch)).join(' ');
}

const UNITS = {
  km: 'kilometres',
  m: 'metres',
  cm: 'centimetres',
  mm: 'millimetres'
};

export function speak(text) {
  let s = String(text ?? '');
  // 10 000 -> 10000 (thousands separators: space, non-breaking space, thin space, comma)
  s = s.replace(/(\d)[\u00A0\u202F\u2009 ,](\d{3})(?!\d)/g, '$1$2').replace(/(\d)[\u00A0\u202F\u2009 ,](\d{3})(?!\d)/g, '$1$2');
  // 3-4-5 triples
  s = s.replace(/\b(\d+)-(\d+)-(\d+)\b/g, '$1, $2, $3');
  // 1 d.p. / decimal places
  s = s.replace(/\bd\.p\./g, 'decimal place').replace(/\b1 decimal place/g, 'one decimal place');
  // Square root notation: √73, √(100)
  s = s.replace(/√\s*\(?(\d+(?:\.\d+)?)\)?/g, (_, n) => `the square root of ${n}`);
  // Squared notation: 60², c²
  s = s.replace(/([a-zA-Z0-9.]+)²/g, (_, b) => `${b} squared`);
  // Math operators & symbols
  s = s.replace(/≈/g, ' is approximately ').replace(/≠/g, ' does not equal ').replace(/=/g, ' equals ');
  s = s.replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/\+/g, ' plus ').replace(/(\s)[−–-](\s)/g, ' minus ');
  // Currency: $112.50, $18
  s = s.replace(/\$\s?(\d+)\.(\d{2})\b/g, (_, d, c) => `${d} dollars and ${parseInt(c, 10)} cents`);
  s = s.replace(/\$\s?(\d+(?:\.\d+)?)/g, (_, n) => `${n} dollars`);
  // Adjectival units: 13-m ladder -> thirteen-metre ladder
  s = s.replace(/(\d+(?:\.\d+)?)-(km|cm|mm|m)\b/g, (_, n, u) => `${n}-${UNITS[u].replace(/res$/, 're').replace(/s$/, '')}`);
  // Normal units: 60 m -> 60 metres
  s = s.replace(/(\d+(?:\.\d+)?)\s?(km|cm|mm|m)\b/g, (_, n, u) => `${n} ${UNITS[u]}`);
  // Angles
  s = s.replace(/(\d+)°/g, '$1 degrees').replace(/∠([A-Za-z]{3})/g, (_, l) => `angle ${l.split('').join(' ')}`);
  // Convert digits to words
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, (_, n) => numToWords(n));

  return s.replace(/\s+/g, ' ').trim();
}
