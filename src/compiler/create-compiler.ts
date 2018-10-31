import { CompilerOptions } from "types/compilerOptions";

export function createCompilerCreator(baseCompiler: Function): Function{
  return function createCompiler(baseOptions: CompilerOptions){
    function compiler(template: string, options?: object){
      let finalOptions = baseOptions;

      let compiled = baseCompiler(template, finalOptions);

      return compiled;
    }

    return {
      compiler
    }
  }
}