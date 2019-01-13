import Vue from "src/core/index";
import { VNodeData } from "types/vnode";
import { hasOwn, isDef, isUndef, hyphenate } from "src/shared/util";

export function extractPropsForVnode(
  data: VNodeData,
  Ctor: typeof Vue
) {
  let propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return;
  }
  let res: { [key: string]: any } = {};
  const {attrs} = data;
  if (isDef(attrs)) {
    for (let key in propOptions) {
      const keyInLowerCase = key.toLocaleLowerCase();
      const altKey = hyphenate(key);
      if (key !== keyInLowerCase &&
        attrs && hasOwn(attrs, keyInLowerCase)
      ) {
        /**
         * key !== keyInLowerCase说明子组件的props的属性名是驼峰形式的
         * hasOwn(attrs, keyInLowerCase)说明父组件在调用的时候使用的是全小写模式
         */
        console.error(`you should probably use '${altKey}' instead of '${key}'.`)
      }

      checkProp(res, key, altKey, attrs);
    }
  }

  return res;
}

function checkProp(
  res: { [key: string]: any },
  key: string,
  altKey: string,
  attrs: { [key: string]: any },
) {
  if (hasOwn(attrs, key)) {
    res[key] = attrs[key];

    /**
     * 不删除的话，绑定的属性也会通过setAttribute添加到节点上
     */
    delete attrs[key];
  } else if (hasOwn(attrs, altKey)) {
    res[key] = attrs[key];

    delete attrs[key];
  }
}