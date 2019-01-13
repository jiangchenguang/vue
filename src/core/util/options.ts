import Vue from "src/core/index";
import { set } from "../observer/index";
import { hasOwn, isPlainObject, camelize, capitalize, extend } from "src/shared/util";
import { ComponentOptions, VueCtorOptions } from "types/options";
import { LIFE_CYCLE_HOOKS } from "src/shared/constant";

export function resolveAsset(
  options: { [key: string]: any },
  type: string,
  id: string
): any {
  if (typeof id !== "string") {
    return;
  }

  const assets = options[type];
  if (hasOwn(assets, id)) return assets[id];
  const camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) return assets[camelizedId];
  const capitalizeId = capitalize(camelizedId);
  if (hasOwn(assets, capitalizeId)) return assets[capitalizeId];
}

const strategies: { [key: string]: Function } = Object.create(null);

function defaultStrategy(parent?: any, child?: any): any {
  return child == null ? parent : child;
}

LIFE_CYCLE_HOOKS.map(hook => {
  strategies[hook] = function (
    parent?: Function[],
    child?: Function | Function[],
  ) {
    return child
      ? parent
        ? parent.concat(child)
        : Array.isArray(child)
          ? child
          : [child]
      : parent
  }
})


function mergeData(
  to: { [key: string]: any },
  from?: { [key: string]: any }
): Object {
  if (!from) return to;

  let key: string, fromV, toV;
  const keys = Object.keys(from);
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    toV = to[key];
    fromV = from[key];

    if (!hasOwn(to, key)) {
      set(to, key, fromV);
    } else if (isPlainObject(fromV) && isPlainObject(toV)) {
      mergeData(toV, fromV);
    }
  }

  return to;
}

function mergeDataOrFn(
  parent?: any,
  child?: any,
  vm?: Vue
) {
  if (!vm) {
    // extends
    if (!child) {
      return parent;
    }
    if (!parent) {
      return child;
    }

    return function mergedDataFn() {
      return mergeData(
        typeof parent === 'function' ? parent.call(this) : parent,
        typeof child === 'function' ? child.call(this) : child
      )
    }
  } else {
    // init instance
    return function instanceDataFn() {
      let parentData = typeof parent === 'function' ? parent.call(vm) : parent;
      let childData = typeof child === 'function' ? child.call(vm) : child;
      if (!parentData) {
        return childData;
      } else {
        return mergeData(parentData, childData);
      }
    }
  }
}

strategies.data = function (
  parentVal?: any,
  childVal?: any,
  vm?: Vue
): Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      console.error(`the "data" option should be a function`);
      return parentVal;
    }
    return mergeDataOrFn.call(this, parentVal, childVal);

  }
  return mergeDataOrFn(parentVal, childVal, vm);
}
strategies.methods = strategies.computed =
  function (parent?: object, child?: object) {
    if (!child) return Object.create(parent || null);
    if (!parent) return child;
    let res = {};
    extend(res, parent);
    extend(res, child);
    return res;
  };

function normalizeProps(options: { [key: string]: any }) {
  const props = options.props;
  if (!props) return;
  const res: { [key: string]: any } = {};

  let key: string, camelizeKey: string, value: string;
  if (Array.isArray(props)) {

    let len = props.length;
    while (len--) {
      key = props[len];
      if (typeof key === 'string') {
        camelizeKey = camelize(key);
        res[camelizeKey] = {type: null};
      }
    }
  } else if (isPlainObject(props)) {
    for (key in props) {
      value = props[key];
      camelizeKey = camelize(key);
      res[camelizeKey] = isPlainObject(value)
        ? value
        : {type: value}
    }
  }

  options.props = res;
}

export function mergeOptions(
  parent: VueCtorOptions | ComponentOptions,
  child: object,
  vm?: Vue
): ComponentOptions {
  let key;
  // let options: { [key: string]: any } = {};
  // @ts-ignore
  const options: ComponentOptions = {};

  normalizeProps(child);

  // parent = parent || {}
  for (key in parent) {
    options[key] = mergeField(parent, child, vm, key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      options[key] = mergeField(parent, child, vm, key);
    }
  }

  function mergeField(parent: any, child: any, vm: Vue, key: string) {
    const strategy = strategies[key] || defaultStrategy;
    return strategy(parent[key], child[key], vm, key);
  }

  return options;
}