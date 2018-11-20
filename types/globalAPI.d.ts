import { ASTElement, CompilerOptions } from "types/compilerOptions";
import { Config } from "src/core/config";

export interface GlobalAPI {
  config: Config;
  nextTick: (cb?: Function, obj?: object) => void;

  set: (obj: any, key: string| number, val: any) => void,
  delete: (obj: any, key: string | number) => void,
  parse: (template: string, options: CompilerOptions) => ASTElement
}