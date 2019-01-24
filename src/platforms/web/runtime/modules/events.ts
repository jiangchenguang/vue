import { updateListeners } from "src/core/vnode/helper/index";
import VNode from "src/core/vnode/vnode";

let target: Element;

function add(event: string, handler: Function, capture: boolean) {
  // @ts-ignore
  target.addEventListener(event, handler, capture);
}

function remove(event: string, handler: Function) {
  // @ts-ignore
  target.removeEventListener(event, handler);
}

function updateEvents(oldVnode: VNode, vnode: VNode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return;
  }
  const on = vnode.data.on || {};
  const oldOn = oldVnode.data.on || {};
  target = <Element>vnode.elm;

  updateListeners(on, oldOn, add, remove, vnode.context);
}

export default {
  create: updateEvents,
  update: updateEvents
}
