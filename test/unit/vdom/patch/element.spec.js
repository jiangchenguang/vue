import { patch } from "src/platforms/web/runtime/patch";
import VNode, { createTextVNode } from "src/core/vnode/vnode";

describe("vnode patch: element", function (){
  it("should create an element", function (){
    const vnode = new VNode("p", null, null, [ createTextVNode("hello world") ]);
    const elm   = patch(null, vnode, null, null);
    expect(elm.tagName).toBe("P");
    expect(elm.outerHTML).toBe("<p>hello world</p>");
  })

  xit("should create an element with namespace", function (){
  })

  it("should warn unknown element with hyphen", function (){
    const vnode = new VNode("unknown-foo");
    const elm = patch(null, vnode);
    expect(`Unknown custom element: <unknown-foo>!`).toHaveBeenWarned();
  })

  it("should create an element which have text content", function (){
    const vnode = new VNode("div", null, null, [createTextVNode("hello world")]);
    const elm = patch(null, vnode);
    expect(elm.innerHTML).toBe("hello world");
  })

  it("should create an element which have a span and text content", function (){
    const vnode = new VNode("div", null, null, [
      new VNode("span"),
      createTextVNode("hello world")
    ]);
    const elm = patch(null, vnode);
    expect(elm.childNodes[0].tagName).toBe("SPAN");
    expect(elm.childNodes[1].textContent).toBe("hello world");
  })

  xit("should create an element which have a scoped attr", function (){
  })
})
