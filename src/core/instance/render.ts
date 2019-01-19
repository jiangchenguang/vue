import vueInstance from "src/core/index";
import { defineReactive } from "src/core/observer/index";
import { createElement } from "src/core/vnode/create-element";
import VNode, { createEmptyVNode, createTextVNode } from "src/core/vnode/vnode";
import { bindObjectProps } from "src/core/vnode/helper/index";
import { toString } from "src/shared/util";
import { nextTick } from "../util/index";

export function initRender(vm: vueInstance) {
  vm._vnode = null;
  vm.$vnode = vm.$options._parentVnode;
  vm._c = (a: any, b: any, c: any, d: any) => createElement(vm, a, b, c, d, false);
  vm.$createElement = (a: any, b: any, c: any, d: any) => createElement(vm, a, b, c, d, true);
}

export function renderMixin(Vue: typeof vueInstance) {
  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this);
  }

  Vue.prototype._render = function () {
    const vm = this;
    const {render, _parentVnode} = vm.$options;
    let vnode: VNode;

    vm.$vnode = _parentVnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      console.error('render failed!', e);
    }

    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode();
    }
    vnode.parent = _parentVnode;

    return vnode;
  }

  Vue.prototype._s = toString;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._b = bindObjectProps;
}
