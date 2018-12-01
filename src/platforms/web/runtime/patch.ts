import * as nodeOpts from "./node-opts";
import { createPatchFunction } from "src/core/vnode/patch";
import platformModules from "./modules/index";
import { PatchFunction } from "types/patch";

const modules = platformModules;

export const patch: PatchFunction = createPatchFunction({nodeOpts, modules});