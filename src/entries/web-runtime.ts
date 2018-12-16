import VueCtor from "src/core/index";
import { Component } from "types/component";
import { mountComponent } from "src/core/instance/lifeCycle";
import {
  query,
  isUnknownElement,
} from "src/platforms/web/util/index";
import Vue from "types/vue";
import { patch } from "src/platforms/web/runtime/patch";

// @ts-ignore
(VueCtor as Vue).config.isUnknownElement = isUnknownElement;

VueCtor.prototype.__patch__ = patch;

VueCtor.prototype.$mount = function(
  el?: string | HTMLElement
): Component {
  el = el && query(el);
  return mountComponent(this, <HTMLElement>el);
}

export default VueCtor;