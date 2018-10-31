import {
  isUnaryTag,
} from "./util";
import { getTagNamespace } from "../util/index";
import { CompilerOptions } from "types/compilerOptions";

export const baseOptions: CompilerOptions = {
  isUnaryTag,
  getTagNamespace,
}