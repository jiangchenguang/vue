import VNode from "src/core/vnode/vnode";
import { ComponentOptions } from "types/options";
import Watcher, { userWatcherOpts } from "src/core/observer/watcher";
import { PatchFunction } from "types/patch";

export interface Component {
  // public properties
  $el: any;
  $data: object;
  $options: ComponentOptions;

  // public methods
  $mount: (el: string | Element) => void;
  $watch: (key: string | Function, cb: string | userWatcherOpts | Function, options?: any) => void;
  $createElement: (tag: any, data: any, children: any, normalizeType: any) => VNode;
  $destroy: () => void;
  $set: (obj: any, key: string | number, val: any) => void;
  $delete: (obj: any, key: string | number) => void;

  // private properties
  _uid: number;
  _isVue: true;
  _data: { [key: string]: any };
  _computedWatcher: { [key: string]: Watcher };
  _vnode: VNode;
  _renderProxy: this;
  _watcher: Watcher;
  _watchers: Watcher[];
  _isMounted?: boolean;
  _isBeingDestroyed?: boolean
  _isDestroyed?: boolean;

  // private methods
  // lifecycle
  _init: Function;
  _update: (vnode: VNode) => void;

  // render
  _render: () => VNode;
  __patch__: PatchFunction;

  _c: (tag: any, data: any, children: any, normalizeType: any) => VNode;
  // toString
  _s: (v: any) => string;
  // text => vnode
  _v: (v: string | number) => VNode;

  // methods
  [key: string]: any
}

