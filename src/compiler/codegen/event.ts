import { ASTElementHandler } from "types/compilerOptions";

const fnExpRE = /^\s*([\w$_]+|\([^\)]*?\))\s*=>|^function\s*\(/;  // a=> ()=> function(
const simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

const modifierCode: { [key: string]: string } = {
  stop: "$event.stopPropagation();",
  prevent: "$event.preventDefault();",
}

export function genHandlers(events: { [name: string]: ASTElementHandler | ASTElementHandler[] }, native?: boolean) {
  let data = native ? 'nativeOn:{' : "on:{";
  for (let name in events) {
    data += `"${name}":${genHandler(name, events[name])},`;
  }
  return data.slice(0, -1) + "}";
}

function genHandler(name: string, handler: ASTElementHandler | ASTElementHandler[]): string {
  if (!handler) {
    return "function(){}"
  } else if (Array.isArray(handler)) {
    return `[${handler.map(handler => genHandler(name, handler)).join(",")}]`
  } else if (!handler.modifiers) {
    return fnExpRE.test(handler.value) || simplePathRE.test(handler.value)
      ? handler.value
      : `function($event){${handler.value}}`
  } else {
    let code = '';
    let keys = [];
    for (let key in handler.modifiers) {
      if (modifierCode[key]) {
        code += modifierCode[key];
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code = genKeyFilter(keys) + code;
    }

    // todo problem 这里的作用
    const handleCode = simplePathRE.test(handler.value)
      ? handler.value + "($event)"
      : handler.value;
    return `function($event){${code}${handleCode}}`
  }
}

function genKeyFilter(keys: string[]): string {
  return `if(${keys.map(genFilterCode).join('&&')})return null;`
}

function genFilterCode(key: string): string {
  return `_k($event.keyCode,${JSON.stringify(key)})`
}
