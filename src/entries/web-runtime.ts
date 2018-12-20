import Vue from "src/core/index";
import { mountComponent } from "src/core/instance/lifeCycle";
import {
  query,
  isUnknownElement,
} from "src/platforms/web/util/index";
import { patch } from "src/platforms/web/runtime/patch";

Vue.config.isUnknownElement = isUnknownElement;

Vue.prototype.__patch__ = patch;

Vue.prototype.$mount = function(
  el?: string | HTMLElement
): Vue {
  el = el && query(el);
  return mountComponent(this, <HTMLElement>el);
}

export default Vue;