const defaultTagRE = /{{((?:.)+?)}}/g;

export function parseText(text: string) {
  if (!defaultTagRE.test(text)) {
    return;
  }

  let match: RegExpExecArray;
  let token: string[] = [];
  let pos = 0;
  let lastIndex = defaultTagRE.lastIndex = 0;

  while (match = defaultTagRE.exec(text)) {
    pos = match.index;
    // text
    if (pos > lastIndex) {
      token.push(text.slice(lastIndex, pos));
    }

    token.push(`_s(${match[1].trim()})`);
    lastIndex = pos + match[0].length;
  }

  if (lastIndex < text.length) {
    token.push(text.slice(lastIndex));
  }

  return token.join("+");
}