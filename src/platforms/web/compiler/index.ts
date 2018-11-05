import {
  isUnaryTag,
} from "./util";
import modules from "./modules/index";
import {
  getTagNamespace,
  mustUseProp,
} from "../util/index";
import { CompilerOptions } from "types/compilerOptions";

export const baseOptions: CompilerOptions = {
  modules,
  isUnaryTag,
  mustUseProp,
  getTagNamespace,
}