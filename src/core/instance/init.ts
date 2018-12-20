import vueInstance from "src/core/index";
import { initLifeCycle, callHook } from "./lifeCycle";
import { initRender } from "./render";
import { initState } from "./state";
import { mergeOptions } from "../util/index";
import { ComponentOptions } from "types/options";

let uid = 0;

export function initMixin(Vue: typeof vueInstance) {
  Vue.prototype._init = function (options: ComponentOptions = {}) {
    const vm: vueInstance = this;
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