declare interface VNodeData {
  key?: string;
  attrs?: { [key: string]: any };

  staticClass?: string;
  class?: any;

  staticStyle?: { [key: string]: any };
  style?: { [key: string]: any };
}