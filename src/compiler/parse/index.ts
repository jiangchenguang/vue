import { parseHTML } from "./html-parse";
import { parseText } from "./text-parse";
import { ASTElement, ASTExpression, ASTNode, ASTText, CompilerOptions } from "types/compilerOptions";
import { no } from "src/shared/util";
import { getAndRemoveAttr } from "src/compiler/helper";

let platformGetTagNamespace: any;

export function parse(
  template: string,
  options: CompilerOptions
): ASTElement | undefined {
  platformGetTagNamespace = options.getTagNamespace || no;


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

      processIf(element);

      function checkRootConstraints(el: ASTElement) {
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


