import Vue from "src/entries/web-runtime";
import { parse } from "src/compiler/parse/index";
import { baseOptions } from "src/platforms/web/compiler";
import { extend } from "src/shared/util";

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

  it("warn 2 root elements with v-if and v-else with v-for on 2nd", function (){
    parse(`<div v-if="1"></div><div v-else v-for="1 in [1]"></div>`, baseOptions);
    expect("Cannot use v-for on stateful component root element because it renders multiple elements.").toHaveBeenWarned();
  })

  it("warn 2 root elements with v-if and v-else-if with v-for on 2nd", function (){
    parse(`<div v-if="1"></div><div v-else-if="2" v-for="1 in [1]"></div>`, baseOptions);
    expect("Cannot use v-for on stateful component root element because it renders multiple elements.").toHaveBeenWarned();
  })

  it("warn <template> as root element", function (){
    parse(`<template></template>`, baseOptions);
    expect("Cannot use <template> as component root element.").toHaveBeenWarned();
  })

  it("warn <slot> as root element", function (){
    parse(`<slot></slot>`, baseOptions);
    expect("Cannot use <slot> as component root element.").toHaveBeenWarned();
  })

  it("warn v-for root element", function (){
    parse(`<div v-for="item in items"></div>`, baseOptions);
    expect("Cannot use v-for on stateful component root element because it renders multiple elements.").toHaveBeenWarned();
  })

  it("warn <template> key", function (){
    parse(`<div><template v-for="i in items" :key="i"></template></div>`, baseOptions);
    expect("<template> cannot be keyed. Place the key on real elements instead.").toHaveBeenWarned();
  })

  xit("v-pre directive", function (){
  })

  it("v-for directive iteration syntax (multiple)", function (){
    const ast   = parse(`<ul><li v-for="(item, key, index) in items"></li></ul>`, baseOptions);
    const liAst = ast.children[ 0 ];
    expect(liAst.for).toBe("items");
    expect(liAst.alias).toBe("item");
    expect(liAst.iterator1).toBe("key");
    expect(liAst.iterator2).toBe("index");
  })

  it('v-for directive key', () => {
    const ast   = parse('<ul><li v-for="item in items" :key="item.uid"></li></ul>', baseOptions)
    const liAst = ast.children[ 0 ];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('item');
    expect(liAst.key).toBe('item.uid');
  })

  it("v-for directive invalid syntax", function (){
    parse(`<ul><li v-for="item into items"></li></ul>`, baseOptions);
    expect("Invalid v-for expression").toHaveBeenWarned();
  })

  it("v-if directive syntax", function (){
    const ast = parse(`<p v-if="show">hello world</p>`, baseOptions);
    expect(ast.tag).toBe("p");
    expect(ast.if).toBe("show");
    expect(ast.ifConditions[ 0 ].exp).toBe("show");
  })

  it("v-else-if directive syntax", function (){
    const ast          = parse(`<div><p v-if="show">hello</p><span v-else-if="2">v-else-if</span><p v-else>world</p></div>`, baseOptions);
    const ifAst        = ast.children[ 0 ];
    const ifConditions = ifAst.ifConditions;
    expect(ifConditions.length).toBe(3);
    expect(ifConditions[ 1 ].block.children[ 0 ].text).toBe("v-else-if");
    expect(ifConditions[ 1 ].block.parent).toBe(ast);
    expect(ifConditions[ 2 ].block.children[ 0 ].text).toBe("world");
    expect(ifConditions[ 2 ].block.parent).toBe(ast);
  })

  it("v-else directive syntax", function (){
    const ast          = parse(`<div><p v-if="show">hello</p><p v-else>world</p></div>`, baseOptions);
    const ifConditions = ast.children[ 0 ].ifConditions;
    expect(ifConditions.length).toBe(2);
    expect(ifConditions[ 1 ].block.children[ 0 ].text).toBe("world");
    expect(ifConditions[ 1 ].block.parent).toBe(ast);
  })

  it("v-else-if directive invalid syntax", function (){
    parse(`<div><p v-else-if="2"></p></div>`, baseOptions);
    expect("v-else-if use on element without v-if").toHaveBeenWarned();
  })

  it("v-else directive invalid syntax", function (){
    parse(`<div><p v-else></p></div>`, baseOptions);
    expect("v-else use on element without v-if").toHaveBeenWarned();
  })

  it("v-once directive syntax", function (){
    const ast = parse(`<div v-once>world</div>`, baseOptions);
    expect(ast.once).toBe(true);
  })

  it("slot tag single syntax", function (){
    const ast = parse(`<div><slot></slot></div>`, baseOptions);
    expect(ast.children[ 0 ].tag).toBe("slot");
    expect(ast.children[ 0 ].slotName).toBe(undefined);
  })

  it("slot tag named syntax", function (){
    const ast = parse(`<div><slot name="hello"></slot></div>`, baseOptions);
    expect(ast.children[ 0 ].tag).toBe("slot");
    expect(ast.children[ 0 ].slotName).toBe('"hello"');
  })

  it("slot target", function (){
    const ast = parse(`<p slot="header"></p>`, baseOptions);
    expect(ast.slotTarget).toBe('"header"');
  })

  it("component properties", function (){
    const ast = parse(`<my-component :msg="hello"></my-component>`, baseOptions);
    expect(ast.tag).toBe("my-component");
    expect(ast.attrs[ 0 ].name).toBe("msg");
    expect(ast.attrs[ 0 ].value).toBe("hello");
  })

  it("component 'is' attribute", function (){
    const ast = parse(`<my-component is="component1"></my-component>`, baseOptions);
    expect(ast.component).toBe('"component1"')
  })

  it("component 'inline-template' attribute", function (){
    const ast = parse(`<my-component inline-template></my-component>`, baseOptions);
    expect(ast.inlineTemplate).toBe(true);
  })

  it("classes binding", function (){
    // static
    const ast1 = parse(`<p class="class1">hello world</p>`, baseOptions);
    expect(ast1.staticClass).toBe('"class1"');

    // dynamic
    const ast2 = parse(`<p :class="class2">hello world</p>`, baseOptions);
    expect(ast2.classBinding).toBe("class2");
  })

  it("style binding", function (){
    const ast = parse(`<p :style="style1"></p>`, baseOptions);
    expect(ast.styleBinding).toBe("style1");
  })

  it("attribute with v-bind", function (){
    const ast = parse(`<input type="text" name="field1" :value="msg">`, baseOptions);
    expect(ast.attrsList[ 0 ].name).toBe("type");
    expect(ast.attrsList[ 0 ].value).toBe("text");
    expect(ast.attrsList[ 1 ].name).toBe("name");
    expect(ast.attrsList[ 1 ].value).toBe("field1");
    expect(ast.attrsList[ 2 ].name).toBe(":value");
    expect(ast.attrsList[ 2 ].value).toBe("msg");
    expect(ast.attrsMap[ "type" ]).toBe("text");
    expect(ast.attrsMap[ "name" ]).toBe("field1");
    expect(ast.attrsMap[ ":value" ]).toBe("msg");

    expect(ast.attrs[ 0 ].name).toBe("type");
    expect(ast.attrs[ 0 ].value).toBe('"text"');
    expect(ast.attrs[ 1 ].name).toBe("name");
    expect(ast.attrs[ 1 ].value).toBe('"field1"');
    expect(ast.props[ 0 ].name).toBe("value");
    expect(ast.props[ 0 ].value).toBe("msg");
  })

  it("attribute with v-on", function (){
    const ast = parse(`<input @input="msg">`, baseOptions);
    expect(ast.events.input.value).toBe("msg");
  })

  it("attribute with directive", function (){
    const ast = parse(`<input v-validate:field="required">`, baseOptions);
    expect(ast.directives[ 0 ].name).toBe("validate");
    expect(ast.directives[ 0 ].arg).toBe("field");
    expect(ast.directives[ 0 ].value).toBe("required");
  })

  it("attribute with modifies directive", function (){
    const ast = parse(`<input v-validate.on.off>`, baseOptions);
    expect(ast.directives[ 0 ].modifies.on).toBe(true);
    expect(ast.directives[ 0 ].modifies.off).toBe(true);
  })

  it("literal attribute", function (){
    const ast1 = parse(`<input type="text" name="field1" value="hello world">`, baseOptions);
    expect(ast1.attrsList[ 0 ].name).toBe("type");
    expect(ast1.attrsList[ 0 ].value).toBe("text");
    expect(ast1.attrsList[ 1 ].name).toBe("name");
    expect(ast1.attrsList[ 1 ].value).toBe("field1");
    expect(ast1.attrsList[ 2 ].name).toBe("value");
    expect(ast1.attrsList[ 2 ].value).toBe("hello world");
    expect(ast1.attrsMap.type).toBe("text");
    expect(ast1.attrsMap.name).toBe("field1");
    expect(ast1.attrsMap.value).toBe("hello world");
    expect(ast1.attrs[ 0 ].name).toBe('type');
    expect(ast1.attrs[ 0 ].value).toBe('"text"');
    expect(ast1.attrs[ 1 ].name).toBe('name');
    expect(ast1.attrs[ 1 ].value).toBe('"field1"');
    expect(ast1.attrs[ 2 ].name).toBe('value');
    expect(ast1.attrs[ 2 ].value).toBe('"hello world"');
  })

  xit("custom delimiter", function (){
  })

  it("no specified getTagNamespace options", function (){
    const options = extend({}, baseOptions);
    delete options.getTagNamespace;
    const ast = parse(`<svg><text>hello world</text></svg>`, options);
    expect(ast.tag).toBe("svg");
    expect(ast.ns).toBeUndefined();
  })

  it("no specified mustUseProp", function (){
    const options = extend({}, baseOptions);
    delete options.mustUseProp;
    const ast = parse(`<input type="text" name="field1" :value="msg">`, options);
    expect(ast.props).toBeUndefined();
  })

  xit("pre/post transforms", function (){
  })


  xit("preserve whitespace in <pre> tag", function (){
  })

  it("forgivingly handle < in plain text", function(){
    const ast = parse(`<div>1 < 2 < 3</div>`, baseOptions);
    expect(ast.tag).toBe("div");
    expect(ast.children.length).toBe(1);
    expect(ast.children[0].type).toBe(3);
    expect(ast.children[0].text).toBe("1 < 2 < 3");
  })
})
