import Vue from 'src/core/instance/index';
import VNode from "src/core/vnode/vnode";

/**
 * Vue constructor's options
 */
export interface VueCtorOptions {
  _base: typeof Vue;
  components: { [index: string]: Vue }
}

/**
 * Vue instance's $option property
 */
export interface ComponentOptions extends VueCtorOptions {
  props?: { [key: string]: any };
  propsData?: { [key: string]: any };
  data?: object | Function;
  computed?: { [key: string]: Function | { get?: Function, set?: (v: any) => any } };
  watch?: { [key: string]: Function | string };
  methods?: { [key: string]: Function };

  el?: string | Element;
  template?: string;
  render?: (h: () => VNode) => VNode;

  // lifecycle hooks
  beforeCreate?: Function[];
  created?: Function[];
  beforeMount?: Function[];
  mounted?: Function[];
  beforeUpdate?: Function[];
  beforeDestroy?: Function[];

  _isComponent?: true,
  parent: Vue;
  _parentListeners: { [key: string]: Function | Function[] };
  _parentVnode?: VNode,
  _parentElm?: HTMLElement,
  _refElm?: HTMLElement

  [key: string]: any
}

/**
 * Vue instance components init options
 */
export interface InnerComponentOptions {
  _isComponent?: true,
  _parentVnode?: VNode,
  _parentElm?: HTMLElement,
  _refElm?: HTMLElement,
}

