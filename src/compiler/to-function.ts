import { Compile, CompilerOptions } from "types/compilerOptions";

function createFunction(str: string): Function {
  try {
    return new Function(str);
  } catch (e) {
  }
  return function () {
  };
}

export function createCompileToFunction(compile: Compile) {
  return function compileToFunction(template: string, options?: CompilerOptions) {

    const compiled = compile(template, options);

    return {
      render: createFunction(compiled.render)
    }
  }
}