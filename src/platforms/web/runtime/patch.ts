import * as nodeOpts from "./node-opts";
import { createPathFunction } from "src/core/vnode/patch";
import { PathFunction } from "types/patch";

export const path: PathFunction = createPathFunction(nodeOpts);