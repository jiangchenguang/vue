declare interface VNodeData {
  key?: string;
  attrs?: { [key: string]: any };

  staticClass?: string;
  class?: any;
}