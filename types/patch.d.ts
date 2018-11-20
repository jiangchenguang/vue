import VNode from "src/core/vnode/vnode";

export type PathFunction = (oldVnode: VNode, vnode: VNode, parentElm: Node, refElm: Node) => Node | void;

export type NodeOpts = {
  createElement: (tagName: string, vnode: VNode) => HTMLElement;
  createTextNode: (text: string) => Text;
  insertBefore: (parent: Node, newNode: Node, refNode: Node) => void;
  appendChild: (parent: Node, newNode: Node) => void;
  nextSibling: (node: Node) => Node;
  setTextContent: (node: Node, text: string) => void;
}