import { initState } from "./state";
import { initLifeCycle } from "./lifeCycle";
import { Component } from "types/component";
import { ComponentOptions } from "types/options";

let uid = 0;

export function initMixin(Vue: Function) {
  Vue.prototype._init = function (options: ComponentOptions = {}) {
    const vm: Component = this;
    vm._uid = uid++;
    vm._isVue = true;

    vm.$options = options;

    initLifeCycle(vm);
    initState(vm);
  }
}