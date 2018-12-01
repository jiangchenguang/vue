import VNode from "src/core/vnode/vnode";

export type PatchFunction = (oldVnode: VNode, vnode: VNode, parentElm: Node, refElm: Node) => Node | void;

export type BackEnd = {
  nodeOpts: NodeOpts,
  modules: Modules
}

export type NodeOpts = {
  createElement: (tagName: string, vnode: VNode) => HTMLElement;
  createTextNode: (text: string) => Text;
  insertBefore: (parent: Node, newNode: Node, refNode: Node) => void;
  appendChild: (parent: Node, newNode: Node) => void;
  removeChild: (node: Node, child: Node) => void;
  nextSibling: (node: Node) => Node;
  setTextContent: (node: Node, text: string) => void;
}

export type Modules = oneModule[];

export type modulePathFunc = (oldVnode: VNode, vnode: VNode) => void;
type oneModule = {
  create?: modulePathFunc;
  update?: modulePathFunc;
  [index: string]: modulePathFunc;
}