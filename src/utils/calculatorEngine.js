export const INITIAL_CALC_STATE = {
  acc: null,
  op: null,
  entry: '0',
  fresh: true
};

export const fmtDisplay = (n) => {
  if (n === 'Error') return 'Error';
  const num = Number(n);
  if (Number.isNaN(num)) return 'Error';
  return String(Number(num.toPrecision(8)));
};

export const compute = (a, b, operation) => {
  const x = Number(a);
  const y = Number(b);
  switch (operation) {
    case '+': return x + y;
    case '−': return x - y;
    case '×': return x * y;
    case '÷': return y !== 0 ? x / y : 'Error';
    default: return y;
  }
};

export function calcReducer(state, action) {
  const { acc, op, entry, fresh } = state;
  switch (action.type) {
    case 'DIGIT': {
      const d = action.digit;
      if (fresh || entry === '0' || entry === 'Error') {
        return { ...state, entry: String(d), fresh: false };
      }
      return { ...state, entry: entry + d };
    }
    case 'DOT': {
      if (fresh || entry === 'Error') {
        return { ...state, entry: '0.', fresh: false };
      }
      if (!entry.includes('.')) {
        return { ...state, entry: entry + '.' };
      }
      return state;
    }
    case 'BACKSPACE': {
      if (fresh || entry === 'Error') return state;
      if (entry.length <= 1) {
        return { ...state, entry: '0', fresh: true };
      }
      return { ...state, entry: entry.slice(0, -1) };
    }
    case 'CLEAR': {
      return { ...INITIAL_CALC_STATE };
    }
    case 'OP': {
      const nextOp = action.op;
      if (entry === 'Error') {
        return { ...INITIAL_CALC_STATE };
      }
      const curVal = Number(entry);
      if (acc === null) {
        return { acc: curVal, op: nextOp, entry, fresh: true };
      }
      if (op && !fresh) {
        const res = compute(acc, curVal, op);
        if (res === 'Error') {
          return { acc: null, op: null, entry: 'Error', fresh: true };
        }
        return { acc: res, op: nextOp, entry: fmtDisplay(res), fresh: true };
      }
      return { ...state, op: nextOp, fresh: true };
    }
    case 'EQUALS': {
      if (op && acc !== null && entry !== 'Error') {
        const res = compute(acc, Number(entry), op);
        if (res === 'Error') {
          return { acc: null, op: null, entry: 'Error', fresh: true };
        }
        return { acc: null, op: null, entry: fmtDisplay(res), fresh: true };
      }
      return state;
    }
    case 'SQUARE': {
      if (entry === 'Error') return state;
      const cur = Number(entry);
      const val = cur * cur;
      return { ...state, entry: fmtDisplay(val), fresh: false };
    }
    case 'SQRT': {
      if (entry === 'Error') return state;
      const cur = Number(entry);
      if (cur < 0) {
        return { acc: null, op: null, entry: 'Error', fresh: true };
      }
      const val = Math.sqrt(cur);
      return { ...state, entry: fmtDisplay(val), fresh: false };
    }
    default:
      return state;
  }
}
