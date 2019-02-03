const _toString = Object.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;

export function isDef(v: any): boolean {
  return v !== null && v !== undefined;
}

export function isUndef(v: any): boolean {
  return v === null || v === undefined;
}

export function remove(arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const idx = arr.indexOf(item);
    if (idx > -1) {
      return arr.splice(idx, 1);
    }
  }
}

export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === "object";
}

export function hasOwn(obj: object, key: string): boolean {
  return hasOwnProperty.call(obj, key);
}

export function isPlainObject(obj: any): boolean {
  return _toString.call(obj) === "[object Object]";
}

export function toString(v: any): string {
  return v == null
    ? ''
    : typeof v === 'object'
      ? JSON.stringify(v) : String(v);
}

export function makeMap(str: string): (val: string) => boolean {
  let map = Object.create(null);
  let list: string[] = str.split(",");
  list.forEach(item => map[item.trim()] = true);
  return target => map[target];
}

export const isBuildInTag = makeMap(`slot,component`);

const camelizeRE = /-(\w)/g;

export function camelize(str: string): string {
  return str.replace(camelizeRE, (a, b) => b ? b.toUpperCase() : "");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isPrimitive(value: any): boolean {
  return typeof value === "string" || typeof value === "number";
}

export function no() {
  return false;
}

export function noop() {
}

const hyphenateRE = /([^-])([A-Z])/g;

export function hyphenate(str: string) {
  return str.replace(hyphenateRE, '$1-$2').toLocaleLowerCase();
}

export function bind(fn: Function, contenxt: object): Function {
  return function (a: any) {
    let len = arguments.length;
    return len
      ? len > 1
        ? fn.apply(contenxt, arguments) : fn.call(contenxt, a)
      : fn.call(contenxt);
  };
}

export function extend(to: any, from: any) {
  for (const key in from) {
    to[key] = from[key];
  }
  return to;
}

export function toArray(arr: ArrayLike<any>, start?: number): any[] {
  let len: number, res: any[];
  start = start || 0;
  len = arr.length - start;
  res = new Array(len);
  while (len--) {
    res[len] = arr[len + start];
  }
  return res;
}

export function toObject(arr: Object[]): Object {
  const res = {};
  for (let item of arr) {
    if (item) {
      extend(res, item);
    }
  }
  return res;
}
