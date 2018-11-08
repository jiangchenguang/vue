import { parseHTML } from "./html-parse";
import { parseText } from "./text-parse";
import { ASTElement, ASTExpression, ASTNode, ASTText, CompilerOptions } from "types/compilerOptions";
import { no } from "src/shared/util";
import {
  addAttr, addDirective, addHandler, addProp,
  getAndRemoveAttr,
  getBindAttr, pluckModuleFunction
} from "src/compiler/helper";

const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
const forIteratorRE = /\(([^,]*),([^,]*)(?:,([^,]*))?\)/;
const dirRE = /^v-|^:|^@/;
const bindRE = /^v-bind|^:/;
const onRE = /^v-on|^@/;
const argRE = /:(.*)$/;
const modifyRE = /\.[^\.]+/g;

let platformGetTagNamespace: any;
let platformMustUseProp: any;
let tranforms: ((el: ASTElement) => void)[];

export function parse(
  template: string,
  options: CompilerOptions
): ASTElement | undefined {
  platformGetTagNamespace = options.getTagNamespace || no;
  platformMustUseProp = options.mustUseProp || no;
  tranforms = pluckModuleFunction(options.modules, "transformNode");

  let stack: ASTElement[] = []
  let root: ASTElement | undefined;
  let currentParent: ASTElement | undefined;

  parseHTML(template.trim(), {
    isUnaryTag: options.isUnaryTag,
    start(tagName: string, attrs: [], unary: boolean) {
      let element: ASTElement = {
        type: 1,
        tag: tagName,
        attrsList: attrs,
        attrsMap: makeAttrMap(attrs),
        parent: currentParent,
        children: [],
      }
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tagName);
      if (ns) {
        element.ns = ns;
      }

      processFor(element);
      processIf(element);
      processOnce(element);
      processKey(element);

      element.plain = !element.key && !attrs.length;

      processRef(element);
      processSlot(element);
      processComponent(element);
      for (let transform of tranforms) {
        transform(element);
      }
      processAttrs(element);

      function checkRootConstraints(el: ASTElement) {
        if (el.tag === "slot" || el.tag === "template") {
          console.error(
            `Cannot use <${el.tag}> as component root element.`
          )
        }
        if (el.attrsMap.hasOwnProperty("v-for")) {
          console.error(
            'Cannot use v-for on stateful component root element because ' +
            'it renders multiple elements.'
          );
        }
      }

      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfConditions(root, {
            exp: element.elseif,
            block: element
          })
        } else {
          console.error(
            `Component template should contain exactly one root element.`
          )
        }
      }

      if (currentParent) {
        if (element.elseif || element.else) {
          processIfProcess(element, currentParent);
        } else {
          currentParent.children.push(element);
        }
      }

      if (!unary) {
        currentParent = element;
        stack.push(element);
      }
    },
    end(tagName: string) {
      if (!stack.length) {
        console.error("end tag, but stack is empty!");
        return;
      }
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
    },
    chars(text: string) {
      if (!currentParent) {
        if (text === template) {
          console.error("Component template requires a root element, rather than just text.");
        }
        return;
      }
      let expression: string;
      const children = currentParent.children;
      text = text.trim()
        ? text
        : children.length ? " " : "";
      let element: ASTText | ASTExpression;
      if (text) {
        if (expression = parseText(text)) {
          children.push({
            type: 2,
            expression: expression
          })
        } else {
          children.push({
            type: 3,
            text,
          })
        }
      }
    }
  });

  return root;
}

function makeAttrMap(attrs: { name: string, value: string }[]): { [index: string]: string } {
  let map: { [index: string]: string } = {};
  for (let attr of attrs) {
    map[attr.name] = attr.value;
  }
  return map;
}

function processFor(el: ASTElement) {
  let exp;
  if ((exp = getAndRemoveAttr(el, "v-for"))) {
    const inMatch = forAliasRE.exec(exp);
    if (!inMatch) {
      console.error(`Invalid v-for expression: ${exp}`);
      return;
    }

    el.for = inMatch[2].trim();
    const aliasMatch = forIteratorRE.exec(inMatch[1].trim());
    if (aliasMatch) {
      el.alias = aliasMatch[1].trim();
      el.iterator1 = aliasMatch[2].trim();
      if (aliasMatch[3]) {
        el.iterator2 = aliasMatch[3].trim();
      }
    } else {
      el.alias = inMatch[1].trim();
    }
  }
}

function processOnce(el: ASTElement) {
  let exp = getAndRemoveAttr(el, "v-once");
  if (exp != null) {
    el.once = true;
  }
}

function processIf(el: ASTElement) {
  let exp: string;
  let test = getAndRemoveAttr(el, "v-else");
  if (exp = getAndRemoveAttr(el, "v-if")) {
    el.if = exp;
    addIfConditions(el, {
      exp: exp,
      block: el
    })
  } else if (exp = getAndRemoveAttr(el, "v-else-if")) {
    el.elseif = exp;
  } else if (getAndRemoveAttr(el, "v-else") != null) {
    el.else = true;
  }
}

function processIfProcess(el: ASTElement, parent: ASTElement) {
  let prev: ASTElement = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfConditions(prev, {
      exp: el.elseif,
      block: el
    })
  } else {
    console.error(`v-${el.elseif ? "else-if" : "else"} use on element without v-if`)
  }
}

function findPrevElement(children: ASTNode[]): ASTElement {
  let i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return <ASTElement>children[i];
    } else {
      const txt = (children[i] as ASTText).text;
      if (txt !== " ") {
        console.error(
          `text "${(children[i] as ASTText).text.trim()}" between v-if and v-else(-if) will be ignored.`
        )
      }
      children.pop();
    }
  }
}

function addIfConditions(el: ASTElement, condition: { exp: string; block: ASTElement }) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition)
}

function processKey(el: ASTElement) {
  const exp = getBindAttr(el, "key");
  if (exp) {
    if (el.tag === "template") {
      console.error(`<template> cannot be keyed. Place the key on real elements instead.`)
    }
    el.key = exp;
  }
}

function processRef(el: ASTElement) {
  let ref = getBindAttr(el, "ref");
  if (ref) {
    el.ref = ref;
  }
}

function processSlot(el: ASTElement) {
  // todo: why not use getAndRemoveAttr?
  if (el.tag === "slot") {
    el.slotName = getBindAttr(el, "name");
  } else {
    const slotTarget = getBindAttr(el, "slot");
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
  }
}

function processComponent(el: ASTElement) {
  let component = getBindAttr(el, "is");
  if (component) {
    el.component = component;
  }

  if (getAndRemoveAttr(el, "inline-template") != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs(el: ASTElement) {
  let name: string;
  let value: string;

  if (el.attrsList) {
    for (let attr of el.attrsList) {
      name = attr.name;
      value = attr.value;
      if (dirRE.test(name)) {
        el.hasBindings = true;
        let modifies = parseModifies(name);
        if (modifies) {
          name = name.replace(modifyRE, "");
        }

        if (bindRE.test(name)) {
          name = name.replace(bindRE, "");
          if (platformMustUseProp(el.tag, name, el.attrsMap.type)) {
            addProp(el, name, value);
          } else {
            addAttr(el, name, value);
          }
        } else if (onRE.test(name)) {
          name = name.replace(onRE, "");
          addHandler(el, name, value);
        } else {
          name = name.replace(dirRE, "");
          let arg;
          let argMatch = argRE.exec(name);
          if (argMatch) {
            arg = argMatch[1];
            name = name.slice(0, -(argMatch[0].length));
          }

          addDirective(el, name, value, arg, modifies);
        }
      } else {
        addAttr(el, name, JSON.stringify(value));
      }
    }
  }
}

function parseModifies(name: string): { [index: string]: true } {
  let match = name.match(modifyRE);
  if (match) {
    let r: { [index: string]: true } = {};
    match.forEach(m => r[m.slice(1)] = true);
    return r;
  }
}
