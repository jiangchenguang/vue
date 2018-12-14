import { initLifeCycle, callHook } from "./lifeCycle";
import { initRender } from "./render";
import { initState } from "./state";
import { mergeOptions } from "../util/index";
import { Component } from "types/component";
import { ComponentOptions } from "types/options";

let uid = 0;

export function initMixin(Vue: Function) {
  Vue.prototype._init = function (options: ComponentOptions = {}) {
    const vm: Component = this;
    vm._uid = uid++;
    vm._isVue = true;

    vm.$options = mergeOptions(null, options, vm);

    vm._renderProxy = vm;

    initRender(vm);
    initLifeCycle(vm);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }
}