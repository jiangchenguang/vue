import { makeMap, no } from "src/shared/util";
import { ParseHTMLOptions } from "types/compilerOptions";


const tagNameRE: RegExp = /[a-zA-Z0-9-]+/;
const startTagOpenRE = new RegExp(`^<\(${tagNameRE.source}\)`);
const startTagCloseRE = new RegExp(`^\s*(\/?)>`);
const endTagRE: RegExp = new RegExp(`^<\/\(${tagNameRE.source}\)>`);

const singleAttrIdentifier = /([^\s"'<>/=]+)/
const singleAttrAssign = /(?:=)/
const singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
]
const attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
)

const isScriptOrStyle = makeMap("script,style");

export function parseHTML(html: string, options: ParseHTMLOptions) {
  const isUnaryTag = options.isUnaryTag || no;

  let stack: string[] = [];
  let lastTag: string;
  let textEnd: number;
  let last: string;
  while (html) {
    last = html;
    if (!lastTag || !isScriptOrStyle(lastTag)) {
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

      let text, rest;
      if (textEnd > 0) {
        // text
        rest = html.slice(textEnd);
        while (
          !startTagOpenRE.test(rest) &&
          !endTagRE.test(rest)
          ) {
          let find = rest.indexOf("<", 1);
          if (find < 0) break;
          textEnd += find;
          rest = html.slice(textEnd);
        }
        text = html.slice(0, textEnd);
        advance(text.length);
      }

      if (textEnd < 0) {
        // not found
        text = html;
        html = "";
      }

      if (options.chars && text) {
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
    let result: RegExpExecArray = startTagOpenRE.exec(html);
    if (result) {
      let match: startTagMatchResult = {
        tagName: result[1],
        attrs: []
      };
      advance(result[0].length);
      let end, attr;
      while (!(end = startTagCloseRE.exec(html)) && (attr = attribute.exec(html))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }

      if (end) {
        advance(end[0].length);
        return match;
      }

    }
  }

  function handleStartTag(execResult: startTagMatchResult) {
    // @ts-ignore
    const unary = isUnaryTag(execResult.tagName);
    if (!unary) {
      lastTag = execResult.tagName;
      stack.push(lastTag);
    }

    let attrs = [];
    for (let attr of execResult.attrs) {
      attrs.push({
        name: attr[1],
        value: attr[3] || attr[4] || attr[5] || ""
      });
    }

    if (options.start) {
      options.start(execResult.tagName, attrs, unary);
    }
  }

  function handleEndTag(execResult: RegExpExecArray) {
    let tagName = execResult[1];
    if (options.end) {
      options.end(tagName);
    }
    stack.length -= 1;
    lastTag = stack[stack.length - 1];
    advance(execResult[0].length);
  }
}

type startTagMatchResult = {
  tagName: string,
  attrs: RegExpExecArray[],
}
