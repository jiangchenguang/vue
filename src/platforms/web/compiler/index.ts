import {
  isUnaryTag,
} from "./util";
import modules from "./modules/index";
import {
  getTagNamespace,
  mustUseProp,
  isReservedTag
} from "../util/index";
import { CompilerOptions } from "types/compilerOptions";
import { createCompiler } from "src/compiler/index";

export const baseOptions: CompilerOptions = {
  modules,
  isUnaryTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace,
}

const {compile, compileToFunction} = createCompiler(baseOptions);

export {
  compile,
  compileToFunction
}