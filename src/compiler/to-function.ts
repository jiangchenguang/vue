import { Compile, CompilerOptions, renderFn } from "types/compilerOptions";


function createFunction(str: string): renderFn {
  try {
    // @ts-ignore
    return new Function(str);
  } catch (e) {
  }
  // @ts-ignore
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