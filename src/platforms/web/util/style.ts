import { extend, toObject } from "src/shared/util";
import VNode from "src/core/vnode/vnode";
import { VNodeData } from "types/vnode";

export function normalizeStyleBinding(bindingStyle: Object[] | Object): Object {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }
  return bindingStyle;
}

export function getStyle(vnode: VNode): { [key: string]: any } {
  const res = {};
  let styleData;

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  return res;
}

function normalizeStyleData(data: VNodeData): Object {
  const style = normalizeStyleBinding(data.style);
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style;
}
