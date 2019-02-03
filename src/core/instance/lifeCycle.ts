import vueInstance from "src/core/index";
import Watcher from "src/core/observer/watcher";
import VNode, { createEmptyVNode } from "src/core/vnode/vnode";
import { lifeCycleHooks } from "src/shared/constant";
import { Observer, observeState } from "src/core/observer/index";
import { VNodeData } from "types/vnode";
import { ComponentOptions } from "types/options";
import { remove } from "src/shared/util";
import { updateComponentListeners } from "src/core/instance/events";

export let activeInstance: vueInstance = null;

export function initLifeCycle(vm: vueInstance) {
  if (vm.$options.parent) {
    vm.$parent = vm.$options.parent;
    vm.$parent.$children.push(vm);
  }
  vm.$children = [];

  vm._watcher = null;
  vm._isMounted = false;
  vm._isBeingDestroyed = false;
  vm._isDestroyed = false;
}

export function lifeCycleMixin(Vue: typeof vueInstance) {
  Vue.prototype._update = function (vnode: VNode) {
    const vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    const prevNode = vm._vnode;
    const prevInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    if (!prevNode) {
      vm.$el = vm.__patch__(vm.$el, vnode, vm.$options._parentElm, vm.$options._refElm);
    } else {
      vm.$el = vm.__patch__(prevNode, vnode);
    }
    activeInstance = prevInstance;

    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
  }

  Vue.prototype.$forceUpdate = function () {
    const vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  }

  Vue.prototype.$destroy = function () {
    const vm = this;
    if (vm._isBeingDestroyed) {
      return;
    }

    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    const parent = vm.$parent;
    if (parent) {
      remove(parent.$children, vm);
    }

    if (vm._watcher) {
      vm._watcher.tearDown();
    }

    let i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].tearDown();
    }

    if (vm._data.__ob__) {
      (<Observer>vm._data.__ob__).vmCount--;
    }

    vm.$el = vm.__patch__(vm._vnode, null, null, null);

    vm._isDestroyed = true;
  }
}

export function mountComponent(vm: vueInstance, el?: HTMLElement) {
  vm.$el = el;
  if (!vm.$options.render) {
    // @ts-ignore
    vm.$options.render = createEmptyVNode;
    if (vm.$options.template || vm.$options.el || el) {
      console.error(`you are using the running-only build of Vue`)
    } else {
      console.error(`Failed to mount component: template or render function not defined`)
    }
  }

  callHook(vm, 'beforeMount');

  let updateComponent = () => {
    vm._update(vm._render());
  };

  vm._watcher = new Watcher(vm, updateComponent);

  vm._isMounted = true;
  callHook(vm, 'mounted');
  return vm;
}

export function callHook(vm: vueInstance, hook: lifeCycleHooks) {
  const hooks = vm.$options[hook];
  if (hooks) {
    for (let fn of hooks) {
      fn.call(vm);
    }
  }
}

export function updateChildComponents(
  vm: vueInstance,
  propsData: { [key: string]: any },
  _parentListener: { [key: string]: Function | Function[] },
  parentVnode: VNode
) {

  vm.$vnode = parentVnode;
  vm.$options._parentVnode = parentVnode; // set for hoc
  if (vm._vnode) {
    vm._vnode.parent = parentVnode; // set for patch
  }

  if (propsData && vm.$options.props) {
    observeState.shouldObserve = false;
    for (let key in vm._props) {
      vm._props[key] = propsData[key];
    }
    observeState.shouldObserve = true;
  }

  if (_parentListener) {
    const oldOn = vm.$options._parentListeners;
    vm.$options._parentListeners = _parentListener;
    updateComponentListeners(vm, _parentListener, oldOn);
  }
}
