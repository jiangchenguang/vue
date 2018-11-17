import { path } from "src/platforms/web/runtime/patch";
import VNode, { createTextVNode } from "src/core/vnode/vnode";

describe("vnode path: element", function (){
  it("should create an element", function (){
    const vnode = new VNode("p", null, null, [ createTextVNode("hello world") ]);
    const elm   = path(null, vnode, null, null);
    expect(elm.tagName).toBe("P");
    expect(elm.outerHTML).toBe("<p>hello world</p>");
  })
})
