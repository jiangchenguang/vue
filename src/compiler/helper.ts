import { parseFilters } from "src/compiler/parse/filter-parse";
import {
  ASTElement,
  ASTElementHandler, ASTModifiers,
  CompilerModule,
  genDataFunction,
  transformFromNodeFunction
} from "types/compilerOptions";

export function pluckModuleFunction(
  modules: CompilerModule[],
  key: "transformNode" | "genData"
): any {
  // todo optimize 这里的返回类型应该和key对应，如何优化
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
  modifiers?: ASTModifiers
) {
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = `!${name}`;
  }

  let events = element.events || (element.events = {});
  let handler = events[name];
  let newHandler: ASTElementHandler = {value, modifiers};
  if (Array.isArray(handler)) {
    (handler as ASTElementHandler[]).push(newHandler);
  } else if (handler) {
    events[name] = [handler, newHandler];
  } else {
    events[name] = newHandler;
  }
}

export function addDirective(
  el: ASTElement,
  name: string,
  value?: string,
  arg?: string,
  modifiers?: ASTModifiers
) {
  (el.directives || (el.directives = [])).push({name, arg, value, modifiers});
}
