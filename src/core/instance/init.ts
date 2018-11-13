import { initLifeCycle } from "./lifeCycle";
import { initRender } from "./render";
import { initState } from "./state";
import { Component } from "types/component";
import { ComponentOptions } from "types/options";

let uid = 0;

export function initMixin(Vue: Function) {
  Vue.prototype._init = function (options: ComponentOptions = {}) {
    const vm: Component = this;
    vm._uid = uid++;
    vm._isVue = true;

    vm.$options = options;

    initRender(vm);
    initLifeCycle(vm);
    initState(vm);
  }
}