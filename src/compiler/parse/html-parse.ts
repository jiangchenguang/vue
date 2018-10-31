import { makeMap, no } from "src/shared/util";
import { ParseHTMLOptions } from "types/compilerOptions";


const tagNameRE: RegExp = /[a-zA-Z0-9]+/;
const startTagRE: RegExp = new RegExp(`^<\(${tagNameRE.source}\)>`);
const endTagRE: RegExp = new RegExp(`^<\/\(${tagNameRE.source}\)>`);

const isScriptOrStyle = makeMap("script,style");

export function parseHTML(html: string, options: ParseHTMLOptions) {
  const isUnaryTag = options.isUnaryTag || no;

  let stack: string[] = [];
  let lastTag: string;
  let textEnd: number;
  let last: string;
  while (html) {
    last = html;
    if (!lastTag || !isScriptOrStyle[lastTag]) {
      textEnd = html.indexOf("<");
      if (textEnd === 0) {
        // end tag
        let match: RegExpExecArray | startTagMatchResult = endTagRE.exec(html);
        if (match) {
          handleEndTag(match);
          continue;
        }

        // start tag
        match = parseStartTag();
        if (match) {
          handleStartTag(match);
          continue;
        }

      }

      let text;
      if (textEnd > 0) {
        // text
        text = html.slice(0, textEnd);
        if (options.chars) {
          options.chars(text);
          advance(text.length);
          continue;
        }
      }

      if (textEnd < 0) {
        // not found
        text = html;
        html = "";
      }

      if (options.chars && text){
        options.chars(text);
      }

    } else {
      // style script
    }

    if (last === html) {
      // todo:txt beyond tag, error
      html = "";
    }

  }

  function advance(n: number) {
    html = html.slice(n);
  }

  function parseStartTag(): startTagMatchResult | undefined {
    let result: RegExpExecArray = startTagRE.exec(html);
    if (result) {
      let match: startTagMatchResult = {
        tagName: result[1],
      };
      advance(result[0].length);

      return match;
    }
  }

  function handleStartTag(execResult: startTagMatchResult) {
    // @ts-ignore
    const unary = isUnaryTag[execResult.tagName];
    if (!unary) {
      lastTag = execResult.tagName;
      stack.push(lastTag);
    }

    if (options.start) {
      options.start(execResult.tagName, unary);
    }
  }

  function handleEndTag(execResult: any[]) {
    let tagName = execResult[1];
    if (options.end) {
      options.end(tagName);
    }
    stack.length -= 1;
    lastTag = stack.length ? stack[stack.length - 1] : undefined;
    advance(execResult[0].length);
  }
}

type startTagMatchResult = {
  tagName: string
}