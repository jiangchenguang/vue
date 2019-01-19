import { ASTElement, directive, directiveFunction } from "types/compilerOptions";

const bind: directiveFunction = function (el: ASTElement, dir: directive) {
  el.wrapData = (code?: string) => {
    return `_b(${code},'${el.tag}',${dir.value}${
      (dir.modifiers && dir.modifiers.prop) ? ',true' : ','
      })`;
  }
}

export default bind;
