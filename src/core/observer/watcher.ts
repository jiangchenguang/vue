import Dep, { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./scheduler";
import {
  isObject, isPlainObject,
  parsePath,
} from "src/core/util/index";
import { Observer } from "src/core/observer/index";

let uid: number = 0;

/**
 * 用户使用的watcher选项
 */
export type userWatcherOpts = {
  handler?: string | Function,
  deep?: boolean,
  immediate?: boolean,
}

/**
 * 内部使用的watcher选项
 */
export interface watcherOptions {
  deep?: boolean;
  user?: boolean;
  lazy?: boolean;
  sync?: boolean;
}

export default class Watcher {
  id: number;
  vm: any;
  getter: Function;
  cb: Function;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: Set<number>;
  newDepIds: Set<number>;
  value: any;

  constructor(
    vm: any,
    expression: string | Function,
    cb?: Function,
    options?: watcherOptions) {
    this.id = uid++;
    this.vm = vm;
    if (typeof expression === "function") {
      this.getter = expression;
    } else {
      this.getter = parsePath(expression);
    }
    this.cb = cb;
    this.deps = [];
    this.depIds = new Set();
    this.newDeps = [];
    this.newDepIds = new Set();

    if (options) {
      this.deep = options.deep || false;
      this.user = options.user || false;
      this.lazy = options.lazy || false;
      this.sync = options.sync || false;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }

    this.dirty = this.lazy;
    this.value = this.lazy
      ? undefined
      : this.get();
  }

  /**
   * 添加一个订阅源
   * @param dep
   */
  addDep(dep: Dep) {
    let id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }

  /**
   * 清理订阅源
   */
  cleanupDeps() {
    for (let oldDep of this.deps) {
      if (!this.newDepIds.has(oldDep.id)) {
        oldDep.removeSub(this);
      }
    }

    let tmp: any = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;

    tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
  }

  /**
   * 计算value，同时收集依赖
   */
  get() {
    pushTarget(this);
    let value: any;
    let vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      console.error("get error!", e);
    } finally {
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }

    return value;
  }

  /**
   * 重新计算value
   */
  update() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this);
    }
  }

  /**
   * 用于计算属性的求值
   */
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }

  /**
   * 用于watch的求值
   */
  run() {
    let value = this.get();
    if (this.value !== value ||
      isObject(value) ||
      this.deep
    ) {
      let oldValue = this.value;
      this.value = value;
      try {
        this.cb.call(this.vm, this.value, oldValue);
      } catch (e) {
        console.warn("run failed!");
      }
    }
  }

  /**
   * 将计算属性的依赖传递给引用自己的计算属性或watcher实例
   */
  depend() {
    for (let dep of this.deps) {
      dep.depend();
    }
  }
}

let seenObjects = new Set();

function traverse(val: any) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse(val: any, seen: Set<number>) {
  let isArray = Array.isArray(val);
  if ((!isArray && !isPlainObject(val)) || !Object.isExtensible(val)) {
    return;
  }

  if (val.__ob__) {
    let ob: Observer = val.__ob__;
    let id = ob.dep.id;
    if (seen.has(id)) {
      return;
    }
    seen.add(id);
  }

  if (isArray) {
    let len = val.length;
    while (len--) _traverse(val[len], seen);
  } else {
    let keys = Object.keys(val);
    let len = keys.length;
    while (len--) _traverse(val[keys[len]], seen);
  }
}

