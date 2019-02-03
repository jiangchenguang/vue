import vueInstance from './index';
import { updateListeners } from "src/core/vnode/helper/index";
import { toArray } from "src/shared/util";

let target: vueInstance;

function add(event: string, handle: Function) {
  target.$on(event, handle);
}

function remove(event?: string, handler?: Function) {
  target.$off(event, handler);
}

export function initEvent(vm: vueInstance) {
  vm._events = Object.create(null);
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    target = vm;
    updateComponentListeners(vm, listeners);
  }
}

export function updateComponentListeners(
  vm: vueInstance,
  listeners: { [key: string]: Function | Function[] },
  oldListeners?: { [key: string]: Function | Function[] }
) {
  updateListeners(listeners, oldListeners || {}, add, remove, vm);
}

export function eventMixin(Vue: typeof vueInstance) {
  Vue.prototype.$on = function (event: string, handle: Function) {
    const vm = this;
    (vm._events[event] || (vm._events[event] = [])).push(handle);
  }

  Vue.prototype.$off = function (event?: string, handle?: Function) {
    const vm = this;
    if (arguments.length === 0) {
      vm._events = Object.create(null);
    }

    if (!vm._events[event]) {
      return;
    }

    if (arguments.length === 1) {
      vm._events[event] = [];
    }

    const cbs = vm._events[event];
    let cb: Function;
    let len = cbs.length;
    while (len--) {
      cb = cbs[len];
      if (cb === handle) {
        cbs.splice(len, 1);
      }
    }
  }

  Vue.prototype.$emit = function (event: string) {
    const vm = this;
    const cbs = vm._events[event];
    if (cbs) {
      let args = toArray(arguments, 1);
      for (let i = 0; i < cbs.length; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm;
  }
}
