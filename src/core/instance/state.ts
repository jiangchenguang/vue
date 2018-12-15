import { observe } from "src/core/observer/index";
import Dep from "src/core/observer/dep";
import Watcher, { userWatcherOpts, watcherOptions } from "src/core/observer/watcher";
import { bind, hasOwn, isPlainObject, noop } from "src/shared/util";
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
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.methods) initMethods(vm);
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true);
  }

  if (opts.computed) initComputed(vm);
  if (opts.watch) initWatcher(vm);
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

  observe(vm.$options.data, true);
}

const computedOpts: watcherOptions = {
  lazy: true
}

function initComputed(vm: Component) {
  const watchers: { [key: string]: Watcher }
    = vm._computedWatcher
    = Object.create(null);
  const computed = vm.$options.computed;
  let getter: Function;
  for (let key in computed) {
    getter = typeof computed[key] === 'function'
      ? <Function>computed[key]
      : (<{ get?: Function; set?: (v: any) => void }>computed[key]).get;
    if (getter === undefined) {
      console.error(`No getter function has defined on computed property:${key}`);
      getter = noop;
    }
    watchers[key] = new Watcher(vm, getter, noop, computedOpts);

    if (!(key in vm)) {
      defineComputed(vm, key, computed[key]);
    } else if (key in vm.$data) {
      console.error(`The computed property '${key}' has defined in data`);
    }
  }
}

function defineComputed(
  vm: Component,
  key: string,
  value: Function | { get?: Function; set?: (v: any) => void }
) {
  if (typeof value === 'function') {
    value = <Function>value;
    sharedPropertyDescription.get = createComputedGetter(key);
    sharedPropertyDescription.set = noop;
  } else {
    value = <{ get?: Function; set?: (v: any) => void }>value;
    sharedPropertyDescription.get = value.get ?
      createComputedGetter(key) : noop;
    sharedPropertyDescription.set = value.set;
  }


  Object.defineProperty(vm, key, sharedPropertyDescription);
}

function createComputedGetter(key: string) {
  return function () {
    const vm: Component = this;
    const watcher = vm._computedWatcher && vm._computedWatcher[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    }
  }
}


function initWatcher(vm: Component) {
  const watcher = vm.$options.watch || {};
  let key: string;
  let handler: string | Function | userWatcherOpts;
  if (Array.isArray(watcher)) {
    for (let i = 0; i < watcher.length; i++) {
      for (key in watcher[i]) {
        handler = watcher[i][key];
        createWatcher(vm, key, handler);
      }
    }
  } else {
    for (key in watcher) {
      handler = watcher[key];
      createWatcher(vm, key, handler);
    }
  }
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

function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: string | Function | userWatcherOpts,
  option?: userWatcherOpts
) {
  if (isPlainObject(handler)) {
    handler = <userWatcherOpts>handler;
    option = handler;
    handler = (handler).handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, option);
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

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: string | Function | userWatcherOpts,
    option?: userWatcherOpts
  ) {
    const vm: Component = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, option);
    }

    option = option || {};
    cb = <Function>cb;
    let watcher = new Watcher(vm, expOrFn, cb, option);
    if (option.immediate) {
      cb.call(vm, watcher.value);
    }

    return function unWatch(){
      watcher.tearDown();
    }
  }
}

