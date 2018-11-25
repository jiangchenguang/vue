import VNode from "src/core/vnode/vnode";
import { isObject } from "src/shared/util";

export function genClassFromVnode(vnode: VNode): string {
  return genClassFromData(vnode.data);
}

function genClassFromData(data: VNodeData): string {
  const staticClass = data.staticClass;
  const dynamicClass = data.class;
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  return '';
}

function stringifyClass(value: any): string {
  let res = '';
  if (!value) {
    return res;
  }

  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    let stringified: string;
    for (let clz of value) {
      if (clz) {
        if ((stringified = stringifyClass(clz))) {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1);
  }

  if (isObject(value)) {
    for (let key in value) {
      if (value[key]) res += key + ' ';
    }
    return res.slice(0, -1);
  }
}

function concat(a?: string, b?: string): string {
  return a
    ? b
      ? a + ' ' + b
      : a
    : (b || '')
}