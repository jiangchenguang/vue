import Vue from "./vue";
import VNode from "src/core/vnode/vnode";
import { ComponentOptions } from "types/options";
import Watcher from "src/core/observer/watcher";
import { PatchFunction } from "types/patch";

export interface Component {
  $el: any;
  $data: object;
  $options: ComponentOptions;

  _init: Function;
  _update: (vnode: VNode) => void;
  _render: () => VNode;

  _uid: number;
  _isVue: true;
  _data: object;
  _watcher: Watcher;

  _renderProxy: this;
  _vnode: VNode;
  __patch__: PatchFunction;

  $mount: (el: string | Element) => void;
  $createElement: (tag: any, data: any, children: any, normalizeType: any) => VNode;

  _c: (tag: any, data: any, children: any, normalizeType: any) => VNode;

  // methods
  [key: string]: any
}

