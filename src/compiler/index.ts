import { parse } from "./parse/index";
import { createCompilerCreator } from "./create-compiler";
import { CompilerOptions } from "types/compilerOptions";

export const createCompiler = createCompilerCreator(function baseCompiler(
  template: string,
  options?: CompilerOptions
) {
  let ast = parse(template.trim(), options);

  return {
    ast
  }
})
