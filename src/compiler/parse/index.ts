import { parseHTML } from "./html-parse";
import { parseText } from "./text-parse";
import { ASTElement, ASTExpression, ASTNode, ASTText } from "types/compilerOptions";

export function parse(template: string): ASTElement | undefined {
  let stack: ASTElement[] = []
  let root: ASTElement | undefined;
  let currentParent: ASTElement | undefined;

  parseHTML(template.trim(), {
    start(tagName: string) {
      let element: ASTElement = {
        type: 1,
        tag: tagName,
        parent: currentParent,
        children: [],
      }

      if (!root) {
        root = element;
      }
      stack.push(element);
      currentParent = element;
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
        console.error("handle txt, but current parent is null!");
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