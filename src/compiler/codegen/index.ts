import { ASTElement, ASTExpression, ASTIfConditions, ASTNode, ASTText, CompilerOptions } from "types/compilerOptions";

export function generate(
  ast: ASTElement
): {
  render: string
} {
  const code = ast ? genElement(ast) : '_c("div")';

  return {
    render: `with(this){return ${code}}`
  }
}

function genElement(el: ASTElement): string {
  if (el.if && !el.ifProcessed) {
    return genIf(el);
  } else if(el.for && !el.ifProcessed){
    return genFor(el);
  } else {
    let code: string;

    const data = el.plain ? undefined : genData(el);
    const children = genChildren(el);

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
  return `_l((${el.for}),` +
    `function(){` +
    `return ${genElement(el)}` +
    `})`;
}

function genChildren(el: ASTElement): string {
  const children = el.children;
  if (children.length) {
    return `[${children.map(genNode).join(",")}]`
  }
}

function genData(el: ASTElement): string {
  let data = "{";

  if (el.ref) {
    data += `ref:${el.ref},`
  }

  if(el.refInFor) {
    data += `refInFor:true,`
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

function genText(el: ASTExpression | ASTText): string {
  return `_v(${el.type === 2
    ? el.expression
    : JSON.stringify(el.text)
    })`
}
