import { makeMap } from "src/shared/util";
import { ParseHTMLOptions } from "types/compilerOptions";


const tagNameRE: RegExp = /[a-zA-Z0-9]+/;
const startTagRE: RegExp = new RegExp(`^<\(${tagNameRE.source}\)>`);
const endTagRE: RegExp = new RegExp(`^<\/\(${tagNameRE.source}\)>`);


const isScriptOrStyle = makeMap("script,style");

export function parseHTML(html: string, options: ParseHTMLOptions) {
  let stack: string[] = [];
  let lastTag: string;
  let lastPos: number;
  let last: string;
  while (html) {
    last = html;
    if (!lastTag || !isScriptOrStyle[lastTag]) {
      lastPos = html.indexOf("<");
      if (lastPos === 0) {
        // end tag
        let match = endTagRE.exec(html);
        if (match) {
          parseEndTag(match);
          continue;
        }

        // start tag
        match = startTagRE.exec(html);
        if (match) {
          parseStartTag(match);
          continue;
        }

      } else if (lastPos > 0) {
        // text
        let text = html.slice(0, lastPos);
        if (options.chars) {
          options.chars(text);
          advance(text.length);
          continue;
        }
      } else {
        // not found
      }

    } else {
      // warning
    }

    if (last === html) {
      // todo:txt beyond tag, error
    }

  }

  function advance(n: number) {
    html = html.slice(n);
  }

  function parseStartTag(execResult: any[]) {
    lastTag = execResult[1];
    stack.push(lastTag)
    if (options.start) {
      options.start(lastTag);
    }
    advance(execResult[0].length);
  }

  function parseEndTag(execResult: any[]) {
    let tagName = execResult[1];
    if (options.end) {
      options.end(tagName);
    }
    stack.length -= 1;
    lastTag = stack.length ? stack[stack.length - 1] : undefined;
    advance(execResult[0].length);
  }
}