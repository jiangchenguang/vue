import VNode from "src/core/vnode/vnode";
import { isDef, isObject } from "src/shared/util";
import { VNodeData } from "types/vnode";

export function genClassFromVnode(vnode: VNode): string {
  let data: {
    staticClass?: string;
    class?: any;
  } = vnode.data;


  let childVnode = vnode;
  while (isDef(childVnode.componentInstance)) {
    childVnode = vnode.componentInstance._vnode;
    data = mergeClass(childVnode.data, data);
  }

  return renderClass(data.staticClass, data.class);
}

function mergeClass(child: VNodeData, parent: VNodeData): {
  staticClass?: string;
  class?: any;
} {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass(staticClass: string, dynamicClass: any): string {
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  return '';
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