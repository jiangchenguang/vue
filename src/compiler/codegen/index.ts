import { ASTElement, ASTExpression, ASTIfConditions, ASTNode, ASTText, CompilerOptions } from "types/compilerOptions";
import { isReservedTag } from "src/platforms/web/util/index";
import { no } from "src/shared/util";

let isPlantReservedTag: any;

export function generate(
  ast: ASTElement,
  options: CompilerOptions,
): {
  render: string
} {
  isPlantReservedTag = options.isReservedTag || no;

  const code = ast ? genElement(ast) : '_c("div")';

  return {
    render: `with(this){return ${code}}`
  }
}

function genElement(el: ASTElement): string {
  if (el.if && !el.ifProcessed) {
    return genIf(el);
  } else if (el.for && !el.ifProcessed) {
    return genFor(el);
  } else if (el.tag === "slot") {
    return genSlot(el);
  } else {
    let code: string;

    const data = el.plain ? undefined : genData(el);
    const children = genChildren(el, true);

    code = `_c('${el.tag}'${
      data ? `,${data}` : ""
      }${
      children ? `,${children}` : ""
      })`;

    return code;
  }
}

function genIf(el: ASTElement): string {
  el.ifProcessed = true;
  return genIfConditions(el.ifConditions);
}

function genIfConditions(conditions: ASTIfConditions): string {
  if (!conditions.length) {
    return "_e()";
  }

  const condition = conditions.shift();
  if (condition.exp) {
    return `(${condition.exp})?${genElement(condition.block)}:${genIfConditions(conditions)}`;
  } else {
    // else 分支
    return genElement(condition.block);
  }
}

function genFor(el: ASTElement): string {
  el.ifProcessed = true;

  let exp = el.for;
  let alias = el.alias;
  let iterator1 = el.iterator1 ? `,${el.iterator1}` : "";
  let iterator2 = el.iterator2 ? `,${el.iterator2}` : "";


  return `_l((${el.for}),` +
    `function(${alias}${iterator1}${iterator2}){` +
    `return ${genElement(el)}` +
    `})`;
}

function genSlot(el: ASTElement): string {
  const slotName = el.slotName || '"default"';
  let children = genChildren(el);
  let res = `_t(${slotName}${children ? `,${children}`:""}`;

  res += ')';
  return res;
}

function genData(el: ASTElement): string {
  let data = "{";

  if (el.key) {
    data += `key:${el.key},`
  }

  if (el.ref) {
    data += `ref:${el.ref},`
  }

  if (el.refInFor) {
    data += `refInFor:true,`
  }

  if (el.slotTarget) {
    data += `slot:${el.slotTarget},`
  }

  data = data.replace(/,$/, "") + "}";

  return data;
}

function genNode(el: ASTNode): string {
  if (el.type === 1) {
    return genElement(el);
  } else {
    return genText(el);
  }
}

function genProps(props: { name: string, value: string }[]): string {
  let data = "";
  for (let prop of props) {
    data += `${prop.name}: ${prop.value},`
  }
  data = data.replace(/,$/, "");
  return data;
}

function genText(el: ASTExpression | ASTText): string {
  return `_v(${el.type === 2
    ? el.expression
    : JSON.stringify(el.text)
    })`
}

function genChildren(el: ASTElement, checkSkip?: boolean): string {
  const children = el.children;

  let normalizationType = getNormalizationType(el);
  if (children.length) {
    return `[${children.map(genNode).join(",")}]${
      checkSkip
        ? normalizationType ? `,${normalizationType}` : ''
        : ''
      }`
  }
}

// todo: 目的是什么？
function getNormalizationType(el: ASTElement): number {
  let type = 0;
  for (let child of el.children) {
    if (child.type !== 1) {
      continue;
    }

    if (needNormalization(child) ||
      (child.ifConditions && child.ifConditions.some(condition => needNormalization(condition.block)))) {
      type = 2;
      break;
    }
    if (maybeComponent(child) ||
      (child.ifConditions && child.ifConditions.some(condition => maybeComponent(condition.block)))) {
      type = 1;
    }
  }
  return type;
}

function needNormalization(el: ASTElement): boolean {
  return el.for !== undefined || el.tag === "slot" || el.tag === "template";
}

function maybeComponent(el: ASTElement): boolean {
  return !isPlantReservedTag(el.tag);
}