import { parse } from "src/compiler/parse/index";
import { optimize } from "src/compiler/optimizer";
import { generate } from "src/compiler/codegen";
import { baseOptions } from "src/platforms/web/compiler";

function assertCodegen (template, generatedCode){
  const ast = parse(template, baseOptions);
  optimize(ast, baseOptions);
  const res = generate(ast);
  expect(res.render).toBe(generatedCode);
}

describe("codegen", function (){
  it("generate v-for directive", function (){
    assertCodegen(
      `<div><li v-for="item in items" :key="item.uid"></li></div>`,
      `with(this){return _c('div',[_l((items),function(item){return _c('li',{key:item.uid})})])}`
    );

    assertCodegen(
      `<div><li v-for="(item, i) in items"></li></div>`,
      `with(this){return _c('div',[_l((items),function(item,i){return _c('li')})])}`
    )

    assertCodegen(
      `<div><li v-for="(item, key, index) in items"></li></div>`,
      `with(this){return _c('div',[_l((items),function(item,key,index){return _c('li')})])}`
    )

    assertCodegen(
      `<div><li v-for="{a, b} in items"></li></div>`,
      `with(this){return _c('div',[_l((items),function({a, b}){return _c('li')})])}`
    )

    assertCodegen(
      `<div><li v-for="({a, b}, key, index) in items"></li></div>`,
      `with(this){return _c('div',[_l((items),function({a, b},key,index){return _c('li')})])}`
    )

    assertCodegen(
      `<div><p></p><li v-for="item in items"></li></div>`,
      `with(this){return _c('div',[_c('p'),_l((items),function(item){return _c('li')})])}`
    )

    assertCodegen(
      `<ul><li v-for="item of items" ref="component1"></li></ul>`,
      `with(this){return _c('ul',[_l((items),function(item){return _c('li',{ref:"component1",refInFor:true})})])}`
    )
  })

  it('generate v-if directive', () => {
    assertCodegen(
      `<p v-if="show">hello</p>`,
      `with(this){return (show)?_c('p',[_v("hello")]):_e()}`
    )
  })

  it("generate v-else directive", function (){
    assertCodegen(
      `<div><p v-if="show">hello</p><p v-else>world</p></div>`,
      `with(this){return _c('div',[(show)?_c('p',[_v("hello")]):_c('p',[_v("world")])])}`
    )
  })

  it("generate v-else-if directive", function (){
    assertCodegen(
      `<div><p v-if="show">hello</p><p v-else-if="hide">world</p></div>`,
      `with(this){return _c('div',[(show)?_c('p',[_v("hello")]):(hide)?_c('p',[_v("world")]):_e()])}`
    )
  })

  it("generate v-else-if and v-else directive", function (){
    assertCodegen(
      `<div><p v-if="show">hello</p><p v-else-if="hide">world</p><p v-else>yes</p></div>`,
      `with(this){return _c('div',[(show)?_c('p',[_v("hello")]):(hide)?_c('p',[_v("world")]):_c('p',[_v("yes")])])}`
    )
  })

  it("generate multi v-else-if directive", function (){
    assertCodegen(
      `<div><p v-if="show">hello</p><p v-else-if="1">world</p><p v-else-if="2">good</p><p v-else>morning</p></div>`,
      `with(this){return _c('div',[(show)?_c('p',[_v("hello")]):(1)?_c('p',[_v("world")]):(2)?_c('p',[_v("good")]):_c('p',[_v("morning")])])}`
    )
  })

  it("generate ref directive", function (){
    assertCodegen(
      `<p ref="component1"></p>`,
      `with(this){return _c('p',{ref:"component1"})}`
    )
  })

  xit("generate v-bind directive", function (){
    assertCodegen(
      `<p v-bind="test"></p>`,
      ``
    )
  })

})
