import { observe } from "src/core/observer/index";
import { Component } from "types/component";

const sharedPropertyDescription: PropertyDescriptor = {
  configurable: true,
  enumerable: true,
};

export function proxy(target: any, sourceKey: string, key: any): void {
  sharedPropertyDescription.get = function () {
    return this[sourceKey][key];
  }
  sharedPropertyDescription.set = function (value) {
    this[sourceKey][key] = value;
  }

  Object.defineProperty(target, key, sharedPropertyDescription);
}

export function initState(vm: Component) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  } else {
    observe(opts.data = {});
  }
  if (opts.methods) initMethods(vm);
}

function initData(vm: Component) {
  let data = vm._data = vm.$options.data;

  let keys = Object.keys(data);
  let len = keys.length;
  while (len--) {
    proxy(vm, "_data", keys[len]);
  }

  observe(vm.$options.data);
}

function initMethods(vm: Component) {

}

export function stateMixin(Vue: Function) {
  const dataDef = {
    get: function(){
      return this._data;
    }
  };

  Object.defineProperty(Vue.prototype, "$data", dataDef);
}

