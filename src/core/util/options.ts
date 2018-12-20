import Vue from "src/core/index";
import { hasOwn } from "src/shared/util";
import { camelize, capitalize } from "src/shared/util";
import { ComponentOptions } from "types/options";
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

export function mergeOptions(
  parent: ComponentOptions | void,
  child: ComponentOptions,
  vm: Vue
) {
  let key;
  let options: { [key: string]: any } = {};

  parent = parent || {};
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