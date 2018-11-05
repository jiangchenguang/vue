import { ASTElement } from "types/compilerOptions";
import { getAndRemoveAttr, getBindAttr } from "src/compiler/helper";

function transformNode(el: ASTElement) {
  const staticClass = getAndRemoveAttr(el, "class");
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  const classBinding = getBindAttr(el, "class", false);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

export default {
  transformNode,
}
