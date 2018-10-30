import Vue from "src/entries/web-runtime";
import { parse } from "src/compiler/parse/index";

describe("parse", function (){
  it("simple element", function (){
    const ast = parse("<h1>hello world</h1>");
    expect(ast.tag).toBe("h1");
    // expect(ast.plain).toBe(true);
    expect(ast.children[0].text).toBe("hello world");
  })


})
