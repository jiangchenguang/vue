import Vue from "src/core/index";
import VNode from "src/core/vnode/vnode";
import { resolveConstructorOptions } from "src/core/instance/init";
import { updateChildComponents, activeInstance } from "src/core/instance/lifeCycle";
import { extractPropsForVnode } from "./helper/index";
import { isPlainObject } from "src/shared/util";
import { VNodeData } from "types/vnode";

const componentLifecycleHookList: { [key: string]: Function } = {
  init: function (
    vnode: VNode,
    parentElm: HTMLElement,
    refElm: HTMLElement
  ) {
    if (!vnode.componentInstance || vnode.context._isDestroyed) {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(<Element>vnode.elm);
    }
  },
  prePatch: function (oldVnode: VNode, vnode: VNode) {
    const options = vnode.componentOptions;
    const child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponents(child, options.propsData, options.listener, vnode);
  },
  destroy: function (vnode: VNode) {
    if (!vnode.componentInstance._isDestroyed) {
      vnode.componentInstance.$destroy();
    }
  }
}

function createComponentInstanceForVnode(
  vnode: VNode,
  parent: Vue,
  parentElm: HTMLElement,
  refElm: HTMLElement
): Vue {
  const componentOption = vnode.componentOptions;
  const options = {
    _isComponent: true,
    propsData: componentOption.propsData,
    parent,
    _parentListeners: componentOption.listener,
    _parentVnode: vnode,
    _parentElm: parentElm,
    _refElm: refElm
  }
  return new componentOption.Ctor(options);
}

export function createComponent(
  Ctor: typeof Vue | Object,
  data: VNodeData,
  context: Vue,
  tag: string
): VNode {
  const base = context.$options._base;

  if (isPlainObject(Ctor)) {
    Ctor = base.extend(Ctor);
  }
  if (typeof Ctor !== 'function') {
    return;
  }

  // @ts-ignore
  resolveConstructorOptions(Ctor);

  data = data || {};

  let propsData = extractPropsForVnode(data, <typeof Vue>Ctor);

  let listener = data.on;
  data.on = data.nativeOn;

  mergeHooks(data);

  return new VNode(
    // @ts-ignore
    `vue-component-${Ctor.cid}-${tag}`,
    data, null, null, context,
    {
      // @ts-ignore
      Ctor,
      propsData,
      listener,
      tag
    }
  );
}

function mergeHooks(data: VNodeData) {
  if (!data.hook) {
    data.hook = {};
  }

  for (let key of Object.keys(componentLifecycleHookList)) {
    data.hook[key] = componentLifecycleHookList[key];
  }
}
