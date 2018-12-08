import { observe } from "src/core/observer/index";
import { Component } from "types/component";
import { bind, hasOwn, isPlainObject, noop } from "src/shared/util";

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
  let data = vm.$options.data;
  let methods = vm.$options.methods;

  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};

  if (!isPlainObject(data)) {
    console.error('data functions should return an object');
    data = {};
  }

  let keys = Object.keys(data);
  let len = keys.length;
  while (len--) {
    if (methods && hasOwn(methods, keys[len])) {
      console.error(`method "${keys[len]}" has been defined as a data property`);
    }

    proxy(vm, "_data", keys[len]);
  }

  observe(vm.$options.data);
}

function getData(dataFn: Function, vm: Component): any {
  try {
    return dataFn.call(vm);
  } catch (e) {
    return {};
  }
}

function initMethods(vm: Component) {
  const methods = vm.$options.methods;
  if (!isPlainObject(methods)) {
    console.error(`methods must be object`);
    return;
  }

  for (let key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    if (methods[key] == null) {
      console.error(`method "${key}" has an undefined value!`);
    }
  }
}

export function stateMixin(Vue: Function) {
  const dataDef: PropertyDescriptor = {};
  dataDef.get = function () {
    return this._data;
  }
  dataDef.set = function () {
    console.error(`Avoid replacing instance root $data`);
  }

  Object.defineProperty(Vue.prototype, "$data", dataDef);
}

