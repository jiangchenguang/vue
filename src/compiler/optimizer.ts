import { ASTElement, ASTNode, CompilerOptions } from "types/compilerOptions";
import { no, isBuildInTag, makeMap } from "src/shared/util";

let isStaticKey: (value: string) => boolean;
let isPlatformReservedTag: any;

export function optimize(root: ASTElement, options: CompilerOptions) {
  isStaticKey = makeMap(`type,tag,attrsList,attrsMap,parent,children,attrs`);
  isPlatformReservedTag = options.isReservedTag || no();

  makeStatic(root);

  makeStaticRoot(root);
}

function makeStatic(node: ASTNode) {
  node.static = isStatic(node);

  if (node.type === 1) {
    if (!isPlatformReservedTag(node.tag) &&
      node.tag !== "slot" &&
      node.attrsMap["inline-template"] == null) {
      return;
    }

    for (let child of node.children) {
      makeStatic(child);
      if (!child.static) {
        node.static = false;
      }
    }
  }
}


function makeStaticRoot(node: ASTNode) {
  if (node.type === 1) {

    // 只有在子节点个数较多的情况下才置 staticRoot
    // 排除只有一个静态文本子节点的情况，怕不合算
    if (node.static && node.children.length &&
      !(node.children.length === 1 && node.children[0].type === 3)) {
      node.staticRoot = true;
      return;
    } else {
      node.staticRoot = false;
    }

    if (node.children.length) {
      for (let child of node.children) {
        makeStaticRoot(child);
      }
    }

    if (node.ifConditions) {
      walkThroughIfConditionBlocks(node.ifConditions);
    }
  }
}

function walkThroughIfConditionBlocks(conditions: { exp: string, block: ASTElement }[]) {
  // 跳过第一个
  for (let i = 1, l = conditions.length; i < l; i++) {
    makeStaticRoot(conditions[i].block);
  }
}

function isStatic(node: ASTNode) {
  if (node.type === 3) {
    // text
    return true;
  }
  if (node.type === 2) {
    // expression
    return false;
  }

  return !!(
    !node.hasBindings &&
    !node.if &&
    !node.for &&
    !isBuildInTag(node.tag) &&
    isPlatformReservedTag(node.tag) &&
    Object.keys(node).every(isStaticKey)
  )
}