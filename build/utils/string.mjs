//

export const normalize = str => str.replace(/\s+/g, ' ').replace(/\s*\n+\s*/g, '').toLowerCase();

export const objectToQueryCondition = (params, separator = ', ') => Object.keys(params).map(k => `\`${k}\`=${typeof params[k] === 'string' ? `\`${params[k]}\`` : params[k]}`).join(separator);

export const arrToQueryString = arr => (arr.length && typeof arr[0] === 'string' ? `\`${arr.join('`, `')}\`` : arr.join(', '));
