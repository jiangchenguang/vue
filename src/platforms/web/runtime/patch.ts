import * as nodeOpts from "./node-opts";
import { createPathFunction } from "src/core/vnode/patch";
import platformModules from "./modules/index";
import { PathFunction } from "types/patch";

const modules = platformModules;

export const patch: PathFunction = createPathFunction({nodeOpts, modules});