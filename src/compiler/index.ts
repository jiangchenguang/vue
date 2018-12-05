import { parse } from "./parse/index";
import { optimize } from "./optimizer";
import { generate } from "./codegen/index";
import { createCompilerCreator } from "./create-compiler";
import { CompilerOptions, CreateCompiler } from "types/compilerOptions";

export const createCompiler: CreateCompiler = createCompilerCreator(function baseCompiler(
  template: string,
  options?: CompilerOptions
) {
  let ast = parse(template.trim(), options);
  optimize(ast, options);
  let code = generate(ast, options);

  return {
    ast,
    render: code.render
  }
})
