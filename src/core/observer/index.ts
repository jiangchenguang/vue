import Dep from "./dep";
import { arrayMethods } from "./array";
import {
  def,
  hasOwn,
  isObject,
  isPlainObject,
} from "src/core/util/index";

export class Observer {
  value: any;
  dep: Dep;
  vmCount: number;

  constructor(value: object | Array<any>) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);

    if (Array.isArray(value)) {
      protoAugment(value, arrayMethods);
      Observer.observeArray(value);
    } else {
      Observer.walk(value);
    }
  }

  static walk(obj: { [n: string]: any }) {
    let keys = Object.keys(obj);
    for (let idx = 0; idx < keys.length; idx++) {
      defineReactive(obj, keys[idx], obj[keys[idx]]);
    }
  }

  static observeArray(items: any[]) {
    for (let item of items) {
      observe(item);
    }
  }
}

function protoAugment(target: any, src: object): void {
  target.__proto__ = src;
}

export function observe(value: any, asRoot = false): Observer {
  if (!isObject(value)) return undefined;

  let ob: Observer;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (!value._isVue &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value)) {
    ob = new Observer(value);
  }

  if (asRoot && ob) {
    ob.vmCount++;
  }

  return ob;
}

function defineReactive(obj: any, key: string, val: any): void {
  let dep = new Dep();

  let property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && !property.configurable) return;

  let getter = property && property.get;
  let setter = property && property.set;

  let childOb: Observer = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      let value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
      }
      return value;
    },
    set: function (newVal) {
      let oldVal = getter ? getter.call(obj) : val;
      if (oldVal === newVal || (val !== val && newVal !== newVal)) {
        return;
      }

      setter ? setter.call(obj, newVal) : val = newVal;
      childOb = observe(newVal);
      dep.notify();
    }
  })
}

export function set(
  obj: { [key: string]: any } | any[],
  key: string | number,
  val: any
): void {
  if (Array.isArray(obj)) {
    obj.length = Math.max(obj.length, <number>key);
    obj.splice(<number>key, 1, val);
    return;
  }

  if (hasOwn(obj, <string>key)) {
    obj[key] = val;
    return;
  }

  let ob: Observer = obj.__ob__;
  if (obj._isVue) {
    return;
  }

  if (!ob) {
    obj[key] = val;
    return;
  }

  defineReactive(ob.value, <string>key, val);
  ob.dep.notify();
}

export function del(obj: any, key: string | number): void {
  if (Array.isArray(obj)) {
    obj.splice(<number>key, 1);
    return;
  }

  if (!hasOwn(obj, <string>key)) {
    return;
  }

  let ob: Observer = obj.__ob__;
  if (obj._isVue) {
    return;
  }

  delete obj[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}
