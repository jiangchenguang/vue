import { ASTElement } from "types/compilerOptions";

export function getAndRemoveAttr(element: ASTElement, name: string): string{
  let val: string;
  if (val = element.attrsMap[name]){
    for (let i = 0; i < element.attrsList.length; i++){
      if (element.attrsList[i].name === name){
        element.attrsList.splice(i, 1);
        break;
      }
    }
  }
  return val;
}