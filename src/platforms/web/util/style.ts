import { extend, toObject } from "src/shared/util";
import VNode from "src/core/vnode/vnode";
import { VNodeData } from "types/vnode";

export const parseStyleText = function (cssText: string) {
  const res: {[key: string]: string} = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  cssText.split(listDelimiter).forEach(function (item: string) {
    if (item) {
      var tmp = item.split(propertyDelimiter)
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return res
}

export function normalizeStyleBinding(bindingStyle: Object[] | Object | string): Object {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle);
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
