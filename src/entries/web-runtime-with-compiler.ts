import VueCtor from "./web-runtime";
import { Component } from "types/component";
import { mountComponent } from "src/core/instance/lifeCycle";
import { compileToFunction } from 'src/platforms/web/compiler/index';
import { query } from "src/platforms/web/util/index";
import Vue from "types/vue";

const mount = VueCtor.prototype.$mount;
VueCtor.prototype.$mount = function (
  el?: string | Element
): Component {
  el = el && query(el);
  if (!this.$options.render) {
    const options = this.$options;
    const template = options.template;
    let res;
    if (template) {
      if (typeof template === 'string') {
        res = compileToFunction(options.template.trim());
      } else if (template.nodeType) {
        res = compileToFunction(template.innerHTML);
      } else {
        return;
      }
    } else if (el) {
      res = compileToFunction(getOuterHtml(options.el));
    }

    options.render = res.render;
  }
  return mount.call(this, el);
}

function getOuterHtml(el: HTMLElement) {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    const node = document.createElement("div");
    node.appendChild(el.cloneNode(true));
    return node.innerHTML;
  }
}

export default VueCtor;