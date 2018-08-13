// @flow

export const normalize = (str: string) => str.replace(/\s+/g, ' ').replace(/\s*\n+\s*/g, '').toLowerCase();

export const objectToQueryCondition = (params: {[string]: string | number}, separator: string = ', '): string => Object.keys(params).map(k => `\`${k}\`=${typeof params[k] === 'string' ? `'${params[k]}'` : params[k]}`).join(separator);

// actually param is Array<string | number> but Array<string> for flow check
export const arrToQueryString = (arr: Array<string>): string => (arr.length > 0 && arr[0] ? (typeof arr[0] === 'string' ? `\`${arr.join('`, `')}\`` : arr.join(', ')) : '*');
