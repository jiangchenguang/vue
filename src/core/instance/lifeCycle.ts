import { Component } from "types/component";
import Watcher from "src/core/observer/watcher";
import VNode, { createEmptyVNode } from "src/core/vnode/vnode";

export function initLifeCycle(vm: Component) {
}

export function lifeCycleMixin(Vue: Function) {
  Vue.prototype._update = function (vnode: VNode) {
    const vm = <Component>this;
    const prevNode = vm._vnode;
    vm._vnode = vnode;
    vm.$el = vm.__patch__(prevNode, vnode, null, null);
  }
}

export function mountComponent(vm: Component, el?: Element) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
  }


  let updateComponent = () => {
    vm._update(vm._render());
  };

  vm._watcher = new Watcher(vm, updateComponent);

  return vm;
}