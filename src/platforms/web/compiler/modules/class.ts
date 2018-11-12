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

function genData(el: ASTElement): string {
  let data = '';
  if (el.staticClass){
    data += `staticClass:${el.staticClass},`
  }
  if (el.classBinding){
    data += `class:${el.classBinding},`
  }
  return data;
}

export default {
  transformNode,
  genData,
}
