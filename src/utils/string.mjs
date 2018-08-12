// @flow

export const normalize = (str: string) => str.replace(/\s+/g, ' ').replace(/\s*\n+\s*/g, '').toLowerCase();

export const objectToQueryCondition = (params: {[string]: string | number}, separator: string = ', '): string => Object.keys(params).map(k => `\`${k}\`=${typeof params[k] === 'string' ? `\`${params[k]}\`` : params[k]}`).join(separator);

export const arrToQueryString = (arr: Array<string | number>): string => (arr.length && typeof arr[0] === 'string' ? `\`${arr.join('`, `')}\`` : arr.join(', '));
