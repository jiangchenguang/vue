import bind from './bind';
import {directiveFunction} from "types/compilerOptions";

export const baseDirectives: { [key: string]: directiveFunction } = {
  bind,
}