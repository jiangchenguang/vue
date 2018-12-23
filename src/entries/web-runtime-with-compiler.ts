import Vue from "./web-runtime";
import { compileToFunction } from 'src/platforms/web/compiler/index';
import { query } from "src/platforms/web/util/index";

const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el?: string | HTMLElement
): Vue {
  el = el && query(el);
  if (!this.$options.render) {
    const options = this.$options;
    let template = options.template;
    if (template) {
      if (typeof template === 'string') {
        template = template.trim();
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        return;
      }
    } else if (el) {
      template = getOuterHtml(<HTMLElement>el);
    }

    if (template) {
      const res = compileToFunction(template);
      options.render = res && res.render;
    }

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

Vue.compile = compileToFunction;

export default Vue;