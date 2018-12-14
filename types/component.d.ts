import VNode from "src/core/vnode/vnode";
import { ComponentOptions } from "types/options";
import Watcher, { userWatcherOpts } from "src/core/observer/watcher";
import { PatchFunction } from "types/patch";

export interface Component {
  $el: any;
  $data: object;
  $options: ComponentOptions;

  _init: Function;
  _render: () => VNode;
  _update: (vnode: VNode) => void;

  _uid: number;
  _isVue: true;
  _data: {[key: string]: any};
  _computedWatcher: { [key: string]: Watcher };

  _renderProxy: this;
  _vnode: VNode;
  _watcher: Watcher;
  _watchers: Watcher[];
  __patch__: PatchFunction;

  _isMounted?: boolean;
  _isBeingDestroyed?:boolean;
  _isDestroyed?: boolean;

  $mount: (el: string | Element) => void;
  $watch: (key: string | Function, cb: string | userWatcherOpts | Function, options?: any) => void;
  $createElement: (tag: any, data: any, children: any, normalizeType: any) => VNode;
  $destroy: () => void;

  _c: (tag: any, data: any, children: any, normalizeType: any) => VNode;

  // methods
  [key: string]: any
}

