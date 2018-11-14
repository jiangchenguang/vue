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

  it("render vnode with createElement with children", function (){
    const vm = new Vue({});
    const h = vm.$createElement;
    const vnode = h('p', void 0, [h("br"), "hello world", h("br")]);
    expect(vnode.children[0].tag).toBe("br");
    expect(vnode.children[1].text).toBe("hello world");
    expect(vnode.children[2].tag).toBe("br");
  });

  it("render vnode with createElement, omitting data", function (){
    const vm = new Vue({});
    const h = vm.$createElement;
    const vnode = h('p', [h('br'), "hello world", h('br')]);
    expect(vnode.children[0].tag).toBe('br');
    expect(vnode.children[1].text).toBe('hello world');
    expect(vnode.children[2].tag).toBe('br');
  });

  it("render vnode with createElement, including boolean and null type", function (){
    const vm = new Vue({});
    const h = vm.$createElement;
    const vnode = h('p', [h('p'), true, 123, h('br'), 'abc', null]);
    expect(vnode.children.length).toBe(4);
    expect(vnode.children[0].tag).toBe("p");
    expect(vnode.children[1].text).toBe("123");
    expect(vnode.children[2].tag).toBe("br");
    expect(vnode.children[3].text).toBe('abc');
  })

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

  xit("render vnode with not string tag using createElement", function (){
  })
})