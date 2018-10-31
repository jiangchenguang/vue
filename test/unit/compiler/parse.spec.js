import Vue from "src/entries/web-runtime";
import { parse } from "src/compiler/parse/index";
import { baseOptions } from "src/platforms/web/compiler";

describe("parse", function (){
  it("simple element", function (){
    const ast = parse("<h1>hello world</h1>", baseOptions);
    expect(ast.tag).toBe("h1");
    // expect(ast.plain).toBe(true);
    expect(ast.children[ 0 ].text).toBe("hello world");
  })

  it("interpolation in element", function (){
    const ast = parse("<h1>{{msg}}</h1>", baseOptions);
    expect(ast.tag).toBe("h1");
    expect(ast.children[ 0 ].expression).toBe("_s(msg)");
  })

  it("child element", function (){
    const ast = parse("<ul><li>hello world</li></ul>", baseOptions);
    expect(ast.tag).toBe("ul");
    expect(ast.children[ 0 ].tag).toBe("li");
    expect(ast.children[ 0 ].children[ 0 ].text).toBe("hello world");
    expect(ast.children[ 0 ].parent).toBe(ast);
  })

  it("unary element", function (){
    const ast = parse(`<br>`, baseOptions);
    expect(ast.tag).toBe("br");
    expect(ast.children.length).toBe(0);
  })

  it("svg element", function (){
    const ast = parse(`<svg><text>hello world</text></svg>`, baseOptions);
    expect(ast.tag).toBe("svg");
    expect(ast.ns).toBe("svg");
    expect(ast.children[ 0 ].tag).toBe("text");
    expect(ast.children[ 0 ].children[ 0 ].text).toBe("hello world");
    expect(ast.children[ 0 ].parent).toBe(ast);
  })

  it("camelCase element", function (){
    const ast = parse(`<MyComponent><p>hello world</p></MyComponent>`, baseOptions);
    expect(ast.tag).toBe("MyComponent");
    expect(ast.children[ 0 ].tag).toBe("p");
    expect(ast.children[ 0 ].children[ 0 ].text).toBe("hello world");
    expect(ast.children[ 0 ].parent).toBe(ast);
  })

  xit("forbidden element", function (){
  })

  it("not contain root element", function (){
    parse(`hello world`, baseOptions);
    expect('Component template requires a root element, rather than just text').toHaveBeenWarned()
  })


  xit("warn multiple root element", function (){
    parse(`<div></div><div></div>`, baseOptions);
  })
})
