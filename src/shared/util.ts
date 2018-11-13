let toString = Object.prototype.toString;
let hasOwnProperty = Object.prototype.hasOwnProperty;

export function remove(arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const idx = arr.indexOf(arr, item);
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
  return toString.call(obj) === "[object Object]";
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

export function no() {
  return false;
}

export function extend(to: any, from: any) {
  for (const key in from) {
    to[key] = from[key];
  }
  return to;
}
