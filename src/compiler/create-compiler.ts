import { baseCompiler, CompilerOptions, CreateCompiler } from "types/compilerOptions";
import { createCompileToFunction } from "src/compiler/to-function";

export function createCompilerCreator(baseCompiler: baseCompiler):  CreateCompiler {
  return function createCompiler(baseOptions: CompilerOptions) {
    function compile(template: string, options?: CompilerOptions) {
      let finalOptions = baseOptions;

      return baseCompiler(template, finalOptions);
    }

    return {
      compile,
      compileToFunction: createCompileToFunction(compile)
    }
  }
}