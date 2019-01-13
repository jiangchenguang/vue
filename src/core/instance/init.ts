import Vue from "src/core/index";
import { initLifeCycle, callHook } from "./lifeCycle";
import { initRender } from "./render";
import { initState } from "./state";
import { mergeOptions } from "../util/options";
import { ComponentOptions } from "types/options";

type vueInstance = Vue;
type vueConstructor = typeof Vue;

let uid = 0;

export function initMixin(Vue: vueConstructor) {
  Vue.prototype._init = function (options: ComponentOptions) {
    const vm: vueInstance = this;
    vm._uid = uid++;
    vm._isVue = true;

    if (options && options._isComponent) {
      createComponentConstructorOptions(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.__proto__.constructor),
        options || {},
        vm
      );
    }

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

export function resolveConstructorOptions(Ctor: vueConstructor) {
  let options = Ctor.options;
  if (Ctor.super) {
    const superOpt = Ctor.superOpt;
    if (superOpt != Ctor.super.options) {
      // 说明父类的options已经修改了
      Ctor.superOpt = Ctor.super.options;
      options = Ctor.options = mergeOptions(Ctor.superOpt, Ctor.extendOpt);
    }
  }
  return options;
}

/**
 * 生成组件的构造函数选项
 */
function createComponentConstructorOptions(
  Ctor: vueInstance,
  options: ComponentOptions
) {
  let opt = Ctor.$options = Object.create(Ctor.__proto__.constructor.options);
  opt.propsData = options.propsData;
  opt.parent = options.parent;
  opt._parentVnode = options._parentVnode;
  opt._parentElm = options._parentElm;
  opt._refElm = options._refElm;
}