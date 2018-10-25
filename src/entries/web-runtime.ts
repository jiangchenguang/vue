import Vue from "src/core/index";
import { Component } from "types/component";
import { mountComponent } from "src/core/instance/lifeCycle";
import {
  query
} from "src/platforms/web/util/index";

Vue.prototype.$mount = function(
  el?: string | Element
): Component {
  el = el && query(el);
  return mountComponent(this, el);
}

export default Vue;