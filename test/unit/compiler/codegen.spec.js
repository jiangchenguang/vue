import { parse } from "src/compiler/parse/index";
import { optimize } from "src/compiler/optimizer";
import { generate } from "src/compiler/codegen";
import { baseOptions } from "src/platforms/web/compiler";

describe("codegen", function (){

  it('generate v-if directive', () => {
    const ast = parse(`<p v-if="show">hello</p>`, baseOptions);
    optimize(ast, baseOptions);
    const res = generate(ast);
    expect(res.render).toBe(`with(this){return (show)?_c('p',[_v("hello")]):_e()}`);
  })
})
