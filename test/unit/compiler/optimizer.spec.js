import Vue from "src/entries/web-runtime";
import { parse } from "src/compiler/parse/index";
import {optimize} from "src/compiler/optimizer";
import { baseOptions } from "src/platforms/web/compiler";

describe("optimizer", function (){
  it("simple", function (){
    const ast = parse(`<h1 section="section1"><span>hello world</span></h1>`, baseOptions);
    optimize(ast, baseOptions);
    expect(ast.static).toBe(true);
    expect(ast.staticRoot).toBe(true);
    expect(ast.children[0].static).toBe(true);
  })

  it("skip simple nodes", function(){
    const ast = parse(`<span>hello world</span>`, baseOptions);
    optimize(ast, baseOptions);
    expect(ast.static).toBe(true);
    expect(ast.staticRoot).toBe(false);
  })

  it("interpolation", function(){
    const ast = parse(`<h1>{{msg}}</h1>`, baseOptions);
    optimize(ast, baseOptions);
    expect(ast.static).toBe(false);
    expect(ast.children[0].static).toBe(false);
  })

  it("nested elements", function (){
    const ast = parse(`<ul><li>hello</li><li>world</li></ul>`, baseOptions);
    optimize(ast, baseOptions);
    // ul
    expect(ast.static).toBe(true);
    expect(ast.staticRoot).toBe(true);
    // li
    expect(ast.children[0].static).toBe(true);
    expect(ast.children[1].static).toBe(true);
    // text
    expect(ast.children[0].children[0].static).toBe(true)
    expect(ast.children[1].children[0].static).toBe(true)
  })

  it("nested complex elements", function (){
    const ast = parse(`<ul><li>{{msg1}}</li><li>---</li><li>{{msg2}}</li></ul>`, baseOptions);
    optimize(ast, baseOptions);
    // ul
    expect(ast.static).toBe(false);
    // li
    expect(ast.children[0].static).toBe(false);
    expect(ast.children[1].static).toBe(true);
    expect(ast.children[2].static).toBe(false);
    // txt
    expect(ast.children[0].children[0].static).toBe(false);
    expect(ast.children[1].children[0].static).toBe(true);
    expect(ast.children[2].children[0].static).toBe(false);
  })

  it("v-if directive", function (){
    const ast = parse(`<h1 id="section1" v-if="show">hello world</h1>`, baseOptions);
    optimize(ast, baseOptions);

    expect(ast.static).toBe(false);
    expect(ast.children[0].static).toBe(true);
  })

  it("v-else directive", function (){
    const ast = parse(`<div><p v-if="show">hellow</p><p v-else>world</p></div>`, baseOptions);
    optimize(ast, baseOptions);

    expect(ast.static).toBe(false);
    expect(ast.children[0].static).toBe(false);
    expect(ast.children[0].ifConditions[1].block.static).toBe(undefined);
  })

  xit("v-pre directive", function (){
  })

  it("v-for directive", function (){
    const ast = parse(`<ul><li v-for="item of items">hello {{msg}}</li></ul>`, baseOptions);
    optimize(ast, baseOptions);
    // ul
    expect(ast.static).toBe(false);
    // li
    expect(ast.children[0].static).toBe(false);
    expect(ast.children[0].children[0].static).toBe(false);
  })

  xit("v-once directive", function (){
  })

  it("single slot", function (){
    const ast = parse(`<div><slot>hello</slot></div>`, baseOptions);
    optimize(ast, baseOptions);
    expect(ast.static).toBe(false);
    expect(ast.children[0].children[0].static).toBe(true);
  })

  it("named slot", function (){
    const ast = parse(`<div><slot name="one">hello world</slot></div>`, baseOptions);
    optimize(ast, baseOptions);
    expect(ast.static).toBe(false);
    expect(ast.children[0].static).toBe(false);
    expect(ast.children[0].children[0].static).toBe(true);
  })

  it("slot target", function (){
    const ast = parse(`<p slot="one">hello world</p>`, baseOptions);
    optimize(ast, baseOptions);
    expect(ast.static).toBe(false);
    expect(ast.children[0].static).toBe(true);
  })

})
