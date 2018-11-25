import { genClassFromVnode } from "../../util/index";
import VNode from "src/core/vnode/vnode";

function updateClass(oldVnode: VNode, vnode: VNode) {
  let elm = <Element>vnode.elm;
  let data = vnode.data;
  let oldData = oldVnode.data;
  if ((!oldData || (!oldData.staticClass && !oldData.class)) &&
    (!data || (!data.staticClass && !data.class))) {
    return;
  }

  let cls = genClassFromVnode(vnode);
  elm.setAttribute("class", cls);
}

export default {
  create: updateClass,
  update: updateClass
}