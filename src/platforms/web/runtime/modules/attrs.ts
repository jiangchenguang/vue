import { isBooleanAttr, isEnumerabledAttr, isFalsyAttrValue } from "../../util/index";
import VNode from "src/core/vnode/vnode";

function updateAttrs(oldVnode: VNode, vnode: VNode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) return;

  const elm = <Element>vnode.elm;
  const oldAttrs = oldVnode.data.attrs || {};
  const attrs = vnode.data.attrs || {};

  for (let key in attrs) {
    const oldV = oldAttrs[key];
    const newV = attrs[key];
    if (oldV !== newV) {
      setAttr(elm, key, newV);
    }
  }

  for (let key in oldAttrs) {
    if (attrs[key] == null) {
      if (!isEnumerabledAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr(elm: Element, name: string, val: string) {
  if (isBooleanAttr(name)) {
    if (isFalsyAttrValue(val)) {
      elm.removeAttribute(name);
    } else {
      elm.setAttribute(name, name);
    }
  } else if (isEnumerabledAttr(name)) {
    elm.setAttribute(name, isFalsyAttrValue(val) || val === 'false' ? 'false' : 'true');
  } else {
    if (isFalsyAttrValue(val)) {
      elm.removeAttribute(name);
    } else {
      elm.setAttribute(name, val);
    }
  }
}

export default {
  create: updateAttrs,
  update: updateAttrs
}
