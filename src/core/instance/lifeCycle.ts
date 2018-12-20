import vueInstance from "src/core/index";
import Watcher from "src/core/observer/watcher";
import VNode, { createEmptyVNode } from "src/core/vnode/vnode";
import { lifeCycleHooks } from "src/shared/constant";
import { Observer } from "src/core/observer/index";

export function initLifeCycle(vm: vueInstance) {
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
    vm._vnode = vnode;
    vm.$el = vm.__patch__(prevNode, vnode, null, null);
  }

  Vue.prototype.$forceUpdate = function() {
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