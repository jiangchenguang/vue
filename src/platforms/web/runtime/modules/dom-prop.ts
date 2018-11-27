import VNode from "src/core/vnode/vnode";

function updateDOMProps(oldVnode: VNode, vnode: VNode) {
  if (!oldVnode.data.domProps && !vnode.data.domProps) return;

  let key: string;
  let elm = <Element>vnode.elm;
  let oldProps = oldVnode.data.domProps || {};
  let props = vnode.data.domProps || {};

  for (key in oldProps) {
    if (props[key] == null) {
      // @ts-ignore
      elm[key] = '';
    }
  }

  for (key in props) {
    let curr = props[key];

    if (key === 'innerHTML' || key === 'textContent') {
      if (vnode.children) vnode.children.length = 0;
      if (curr === oldProps[key]) continue;
    }

    if (key === 'value') {
      // @ts-ignore
      elm.value = curr;
    } else {
      // @ts-ignore
      elm[key] = curr;
    }
  }

}

export default {
  create: updateDOMProps,
  update: updateDOMProps
}