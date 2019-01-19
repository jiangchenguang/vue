import { getAndRemoveAttr, getBindAttr } from "src/compiler/helper";
import { parseStyleText } from "../../util/index";
import { ASTElement } from "types/compilerOptions";

function transformNode(el: ASTElement) {
  const staticStyle = getAndRemoveAttr(el, "style");
  if (staticStyle) {
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
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
