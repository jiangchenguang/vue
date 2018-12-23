import { initMixin } from "./init";
import { stateMixin } from "./state";
import { lifeCycleMixin } from "./lifeCycle";
import { renderMixin } from "./render";
import { PatchFunction } from "types/patch";
import VNode from "src/core/vnode/vnode";
import Watcher, { userWatcherOpts } from "src/core/observer/watcher";
import { ComponentOptions } from "types/options";
import { ASTElement, CompilerOptions, renderFn } from "types/compilerOptions";
import { Config } from "src/core/config";

class Vue {
  constructor(options?: ComponentOptions) {
    this._init(options);
  }

  // static properties
  static cid: number;
  static super?: typeof Vue;
  static superOpt?: { [key: string]: any };
  static extendOpt?: { [key: string]: any };
  static options?: ComponentOptions;
  static config: Config;

  // static methods
  static mixin: (option?: any) => void;
  static extend: (extendOptions?: { [key: string]: any }) => typeof Vue;
  static nextTick: (cb?: Function, obj?: object) => void;
  static set: (obj: any, key: string | number, val: any) => void;
  static delete: (obj: any, key: string | number) => void;
  static parse: (template: string, options: CompilerOptions) => ASTElement;
  static compile: (template: string) => { render: renderFn };

  // public methods
  $mount: (el: string | Element) => void;
  $forceUpdate: () => void;
  $destroy: () => void;
  $createElement: (tag: any, data: any, children: any, normalizeType: any) => VNode;
  $nextTick: (fn: Function) => void | Promise<any>;
  $set: (obj: any, key: string | number, val: any) => void;
  $delete: (obj: any, key: string | number) => void;
  $watch: (key: string | Function, cb: string | userWatcherOpts | Function, options?: any) => void;

  // public properties
  $el: HTMLElement;
  $data: Object;
  $options: ComponentOptions;

  // private properties
  _uid: number;
  _isVue: true;
  _data: { [key: string]: any };
  _renderProxy: this;
  _vnode: VNode;
  _watcher: Watcher;
  _watchers: Watcher[];
  _computedWatcher: { [key: string]: Watcher };
  _isMounted: boolean;
  _isBeingDestroyed: boolean;
  _isDestroyed: boolean;

  _init: (options?: ComponentOptions) => void;
  _render: () => VNode;
  _update: (vnode: VNode) => void;
  __patch__: PatchFunction;
  _c: (tag: any, data: any, children: any, normalizeType: any) => VNode;
  // toString
  _s: (v: any) => string;
  // text => vnode
  _v: (v: string | number) => VNode;

  // methods
  [key: string]: any;
}

initMixin(Vue);
stateMixin(Vue);
lifeCycleMixin(Vue);
renderMixin(Vue);

export default Vue;
