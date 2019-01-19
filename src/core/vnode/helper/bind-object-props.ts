/**
 *
 */
import { VNodeData } from "types/vnode";
import { isObject, toObject } from "src/shared/util";
import { mustUseProp } from "src/platforms/web/util/index";

export function bindObjectProps(
  data: VNodeData,
  tag: string,
  value: any,
  asProp?: boolean
) {
  let hash: { [key: string]: any } = {};
  let key: string;
  if (!isObject(value)) {
    console.error('v-bind without argument expects an Object or Array value');
  } else {
    if (Array.isArray(value)) {
      value = toObject(value);
    }

    const keys = Object.keys(value);
    let len = keys.length;
    while (len--) {
      key = keys[len];
      if (key === 'class' || key === 'style') {
        hash = data;
      } else {
        hash = asProp || mustUseProp(tag, key)
          ? (data.domProps || (data.domProps = {}))
          : (data.attrs || (data.attrs = {}))
      }

      if (!(key in hash)) {
        hash[key] = value[key];
      }
    }
  }

  return data;
}
