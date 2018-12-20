import vueInstance from "src/core/index";
import { createElement } from "src/core/vnode/create-element";
import VNode, { createEmptyVNode, createTextVNode } from "src/core/vnode/vnode";
import { toString } from "src/shared/util";
import { nextTick } from "../util/index";

export function initRender(vm: vueInstance) {
  vm._vnode = null;
  vm._c = (a: any, b: any, c: any, d: any) => createElement(vm, a, b, c, d, false);
  vm.$createElement = (a: any, b: any, c: any, d: any) => createElement(vm, a, b, c, d, true);
}

export function renderMixin(Vue: typeof vueInstance) {
  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this);
  }

  Vue.prototype._render = function () {
    const vm = this;
    const {render} = vm.$options;
    let vnode: VNode;

    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      console.error('render failed!', e);
    }

    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode();
    }
    return vnode;
  }

  Vue.prototype._s = toString;
  Vue.prototype._v = createTextVNode;
}
