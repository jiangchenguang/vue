import {
  nextTick
} from "src/core/util/index";
import {
  set,
  del,
} from "src/core/observer/index";
import { parse } from "src/compiler/parse/index";

import { GlobalAPI } from "types/globalAPI";

export function initGlobalAPI(Vue: GlobalAPI) {
  Vue.nextTick = nextTick;
  Vue.set = set;
  Vue.delete = del;
  Vue.parse = parse;
}