import Vue from "src/entries/web-runtime";
import { createEmptyVNode } from "src/core/vnode/vnode";

describe("create-element", function (){
  it("render vnode with base reserved tag using createElement", function (){
    const vm    = new Vue({
      data: {}
    })
    const h     = vm.$createElement;
    const vnode = h("h", {});
    expect(vnode.tag).toBe('h');
    expect(vnode.data).toEqual({});
    expect(vnode.children).toBeUndefined();
    expect(vnode.text).toBeUndefined();
    expect(vnode.elm).toBeUndefined();
    expect(vnode.ns).toBeUndefined();
    expect(vnode.context).toBe(vm);
  })

  it("render vnode with custom tag using createElement", function (){
    const vm    = new Vue({
      data: { msg: "hello world" }
    })
    const h     = vm.$createElement;
    const tag   = "custom-tag";
    const vnode = h(tag, {});
    expect(vnode.tag).toBe('custom-tag');
    expect(vnode.data).toEqual({});
    expect(vnode.children).toBeUndefined();
    expect(vnode.text).toBeUndefined();
    expect(vnode.elm).toBeUndefined();
    expect(vnode.ns).toBeUndefined();
    expect(vnode.context).toEqual(vm);
    expect(vnode.componentOptions).toBeUndefined();
  });

  it("render empty vnode with falsy tag using createElement", function (){
    const vm = new Vue({
      data: { msg: 'hello world' }
    })
    const h = vm.$createElement;
    const vnode = h(null, {});
    expect(vnode).toEqual(createEmptyVNode());
  });

  xit("render vnode with component using createElement", function (){
    const vm = new Vue({
      data      : { message: "hello world" },
      components: {
        'my-component': {
          props: [ 'msg' ]
        }
      }
    })
  })
})