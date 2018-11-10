import { parseFilters } from "src/compiler/parse/filter-parse";
import { ASTElement, CompilerModule } from "types/compilerOptions";

export function pluckModuleFunction(
  modules: CompilerModule[],
  key: "transformNode"
): ((el: ASTElement) => void)[] {
  return modules.map(item => item[key]).filter(i => i);
}

export function addProp(el: ASTElement, name: string, value: string) {
  (el.props || (el.props = [])).push({name, value});
}

export function addAttr(el: ASTElement, name: string, value: string) {
  (el.attrs || (el.attrs = [])).push({name, value});
}

export function getBindAttr(
  element: ASTElement,
  name: string,
  getStatic?: false
) {
  const dynamicVal = getAndRemoveAttr(element, `:${name}`)
    || getAndRemoveAttr(element, `v-bind:${name}`);
  if (dynamicVal != null) {
    return parseFilters(dynamicVal);
  } else if (getStatic !== false) {
    const staticValue = getAndRemoveAttr(element, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue);
    }
  }
}

export function getAndRemoveAttr(element: ASTElement, name: string): string {
  let val: string;
  if ((val = element.attrsMap[name]) != null) {
    for (let i = 0; i < element.attrsList.length; i++) {
      if (element.attrsList[i].name === name) {
        element.attrsList.splice(i, 1);
        break;
      }
    }
  }
  return val;
}

export function addHandler(
  element: ASTElement,
  name: string,
  value: string,
) {
  let handler: { value: string } | { value: string }[];
  let events = element.events || (element.events = {});
  let newHandler = {value};
  handler = events[name];
  if (Array.isArray(handler)) {
    handler.push(newHandler);
  } else if (handler) {
    handler = [handler, newHandler];
  } else {
    events[name] = newHandler;
  }
}

export function addDirective(
  el: ASTElement,
  name: string,
  value?: string,
  arg?: string,
  modifies?: { [index: string]: true }
) {
  (el.directives || (el.directives = [])).push({name, arg, value, modifies});
}
