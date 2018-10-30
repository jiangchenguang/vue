import Vue from "src/entries/web-runtime";
import { parse } from "src/compiler/parse/index";
import { parseText } from "src/compiler/parse/text-parse";

describe("parse", function (){
  it("simple element", function (){
    const ast = parse("<h1>hello world</h1>");
    expect(ast.tag).toBe("h1");
    // expect(ast.plain).toBe(true);
    expect(ast.children[ 0 ].text).toBe("hello world");
  })

  it("interpolation in element", function(){
    const ast = parse("<h1>{{msg}}</h1>");
    expect(ast.tag).toBe("h1");
    expect(ast.children[0].expression).toBe("_s(msg)");
  })

})
