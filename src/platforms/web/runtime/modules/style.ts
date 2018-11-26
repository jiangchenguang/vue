import { normalizeStyleBinding, getStyle } from "../../util/index";
import VNode from "src/core/vnode/vnode";

function setProp(el: Element, name: string, val: string) {
  // @ts-ignore
  el.style[name] = val;
}

function updateStyle(oldVnode: VNode, vnode: VNode) {
  let elm = <Element>vnode.elm;
  let data = vnode.data;
  let oldData = oldVnode.data;
  if ((!oldData || (!oldData.staticStyle && !oldData.style)) &&
    (!data || (!data.staticStyle && !data.style))) {
    return;
  }

  const oldStaticStyle = oldData.staticStyle;
  const oldStyleBinding = oldData.style || {};
  const oldStyle = oldStaticStyle || oldStyleBinding;

  vnode.data.style = normalizeStyleBinding(vnode.data.style) || {};
  const style = getStyle(vnode);

  for (let name in oldStyle) {
    if (style[name] == null) {
      setProp(elm, name, "");
    }
  }

  for (let name in style) {
    if (style[name] !== oldStyle[name]) {
      setProp(elm, name, style[name]);
    }
  }
}

export default {
  create: updateStyle,
  update: updateStyle
}