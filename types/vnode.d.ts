import VNode from "src/core/vnode/vnode";

export interface VNodeData {
  key?: string;
  is?: string;
  attrs?: { [key: string]: any };

  staticClass?: string;
  class?: any;

  staticStyle?: { [key: string]: any };
  style?: { [key: string]: any };
  hook?: {[key: string]: Function};

  domProps?: { [key: string]: any };

  on?: { [key: string]: any }
}