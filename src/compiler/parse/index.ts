import { parseHTML } from "./html-parse";
import { parseText } from "./text-parse";
import { ASTElement, ASTExpression, ASTNode, ASTText, CompilerOptions } from "types/compilerOptions";
import { no } from "src/shared/util";

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
    start(tagName: string, unary: boolean) {
      let element: ASTElement = {
        type: 1,
        tag: tagName,
        parent: currentParent,
        children: [],
      }

      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tagName);

      if (!root) {
        root = element;
      }

      if (currentParent) {
        currentParent.children.push(element);
      }

      if(ns) {
        element.ns = ns;
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
      currentParent = stack.length ? stack[stack.length - 1] : undefined;
    },
    chars(text: string) {
      if (!currentParent) {
        console.error("Component template requires a root element, rather than just text.");
        return;
      }
      let expression: string;
      let element: ASTText | ASTExpression;
      if (text = text.trim()) {
        if (expression = parseText(text)) {
          element = {
            type: 2,
            expression: expression
          }
        } else {
          element = {
            type: 3,
            text,
          }
        }
        currentParent.children.push(element);
      }
    }
  });

  return root;
}