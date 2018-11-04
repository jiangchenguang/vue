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

  it("remove text nodes between v-if conditions", function (){
    const ast = parse(`<div><div v-if="1"></div> <div v-else-if="2"></div> <div v-else></div> <span></span></div>`, baseOptions);
    expect(ast.children.length).toBe(3);
    expect(ast.children[ 0 ].tag).toBe("div");
    expect(ast.children[ 0 ].ifConditions.length).toBe(3);
    expect(ast.children[ 1 ].text).toBe(" ");
    expect(ast.children[ 2 ].tag).toBe("span");
  })

  it("warn non whitespace text between v-if condition", function (){
    parse(`<div><div v-if="1"></div> foo <div v-else></div></div>`, baseOptions);
    expect('text "foo" between v-if and v-else(-if) will be ignored.').toHaveBeenWarned();
  })

  it("no warn 2 root elements with v-if and v-else", function (){
    parse(`<div v-if="1"></div><div v-else></div>`, baseOptions);
    expect('Component template should contain exactly one root element.').not.toHaveBeenWarned();
  })

  it("no warn 3 root elements with v-if, v-else-if and v-else", function (){
    parse(`<div v-if="1"></div><div v-else-if="2"></div><div v-else></div>`, baseOptions);
    expect('Component template should contain exactly one root element.').not.toHaveBeenWarned();
  })

  it("no warn 2 root elements with v-if and v-else on separate lines", function (){
    parse(`
      <div v-if="1"></div>
      <div v-else></div>
    `, baseOptions);
    expect('Component template should contain exactly one root element.').not.toHaveBeenWarned();
  })

  it("no warn 3 or more root elements with v-if, v-else-if, v-else on separate lines", function (){
    parse(`
      <div v-if="1"></div>
      <div v-else-if="2"></div>
      <div v-else-if="3"></div>
      <div v-else></div>
    `, baseOptions);
    expect('Component template should contain exactly one root element.').not.toHaveBeenWarned();
  })

  it("generate correct ast for 2 root elements with v-if and v-else on separate lines", function (){
    const ast = parse(`
      <div v-if="1"></div>
      <p v-else></p>
    `, baseOptions);
    expect(ast.tag).toBe("div");
    expect(ast.ifConditions[ 1 ].block.tag).toBe("p");
  })

  it("generate correct ast for 3 or more root elements with v-if and v-else on separate lines", function (){
    const ast = parse(`
      <div v-if="1"></div>
      <span v-else-if="2"></span>
      <p v-else></p>
    `, baseOptions);
    expect(ast.tag).toBe("div");
    expect(ast.ifConditions[ 0 ].block.tag).toBe("div");
    expect(ast.ifConditions[ 1 ].block.tag).toBe("span");
    expect(ast.ifConditions[ 2 ].block.tag).toBe("p");

    const astMore = parse(`
      <div v-if="1"></div>
      <span v-else-if="2"></span>
      <div v-else-if="3"></div>
      <span v-else-if="4"></span>
      <p v-else></p>
    `, baseOptions);
    expect(astMore.tag).toBe("div");
    expect(astMore.ifConditions[ 0 ].block.tag).toBe("div");
    expect(astMore.ifConditions[ 1 ].block.tag).toBe("span");
    expect(astMore.ifConditions[ 2 ].block.tag).toBe("div");
    expect(astMore.ifConditions[ 3 ].block.tag).toBe("span");
    expect(astMore.ifConditions[ 4 ].block.tag).toBe("p");
  })

  it("warn 2 root elements with v-if", function (){
    parse(`<div v-if="1"></div><div v-if="2"></div>`, baseOptions);
    expect('Component template should contain exactly one root element.').toHaveBeenWarned();
  })

  it("warn 3 root elements with v-if and v-else on first 2", function (){
    parse(`<div v-if="1"></div><div v-else></div><div></div>`, baseOptions);
    expect('Component template should contain exactly one root element.').toHaveBeenWarned();
  })

  it("warn 3 root elements with v-if and v-else-if on first 2", function (){
    parse(`<div v-if="1"></div><div v-else-if></div><div></div>`, baseOptions);
    expect('Component template should contain exactly one root element.').toHaveBeenWarned();
  })

  it("warn 4 root elements with v-if and v-else-if and v-else on first 3", function (){
    parse(`<div v-if="1"></div><div v-else-if></div><div v-else></div><div></div>`, baseOptions);
    expect('Component template should contain exactly one root element.').toHaveBeenWarned();
  })

  it("warn 2 root elements with v-if and v-else with v-for on 2nd", function(){
    parse(`<div v-if="1"></div><div v-else v-for="1 in [1]"></div>`, baseOptions);
    expect("Cannot use v-for on stateful component root element because it renders multiple elements.").toHaveBeenWarned();
  })

  it("warn 2 root elements with v-if and v-else-if with v-for on 2nd", function(){
    parse(`<div v-if="1"></div><div v-else-if="2" v-for="1 in [1]"></div>`, baseOptions);
    expect("Cannot use v-for on stateful component root element because it renders multiple elements.").toHaveBeenWarned();
  })
})
