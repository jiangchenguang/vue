import Vue from "./vue";
import VNode from "src/core/vnode/vnode";
import { ComponentOptions } from "types/options";
import Watcher from "src/core/observer/watcher";

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
}

