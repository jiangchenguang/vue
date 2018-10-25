import { Component } from "types/component";
import Watcher from "src/core/observer/watcher";

export function initLifeCycle(vm: Component) {
}

export function lifeCycleMixin(Vue: Function){
  Vue.prototype._update = function(){
  }
}

export function mountComponent(vm: Component, el?: Element) {
  vm.$el = el;
  if (!vm.$options.render){

  }


  let updateComponent = () => {
    vm._update(vm.$options.render);
  };

  vm._watcher = new Watcher(vm, updateComponent);

  return vm;
}