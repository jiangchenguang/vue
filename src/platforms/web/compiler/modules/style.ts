import { ASTElement } from "types/compilerOptions";
import { getAndRemoveAttr, getBindAttr } from "src/compiler/helper";

function transformNode(el: ASTElement) {
  const staticStyle = getAndRemoveAttr(el, "style");
  if (staticStyle) {
    el.staticStyle = JSON.stringify(staticStyle);
  }
  const styleBinding = getBindAttr(el, "style", false);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData(el: ASTElement): string {
  let data = "";
  if (el.staticStyle) {
    data += `staticStyle:${el.staticStyle},`
  }
  if (el.styleBinding) {
    data += `style:(${el.styleBinding}),`
  }
  return data;
}

export default {
  transformNode,
  genData,
}
