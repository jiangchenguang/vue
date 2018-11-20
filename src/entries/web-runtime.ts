import VueCtor from "src/core/index";
import { Component } from "types/component";
import { mountComponent } from "src/core/instance/lifeCycle";
import {
  query,
  isUnknownElement,
} from "src/platforms/web/util/index";
import Vue from "types/vue";

// @ts-ignore
(VueCtor as Vue).config.isUnknownElement = isUnknownElement;

VueCtor.prototype.$mount = function(
  el?: string | Element
): Component {
  el = el && query(el);
  return mountComponent(this, el);
}

export default VueCtor;