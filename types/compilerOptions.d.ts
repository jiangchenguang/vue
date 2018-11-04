
export type CompilerOptions = {
  isUnaryTag: {[index: string]: true}
  getTagNamespace: (tag: string) => string | undefined
}

// parseHTML的选项
export type ParseHTMLOptions = {
  chars: (tagName: string) => void,
  start: (tagName: string, attrs: {name: string; value: string}[], unary: boolean) => void,
  end: (text: string) => void,
  isUnaryTag: {[index: string]: true},
}

export type ASTNode = ASTElement | ASTExpression | ASTText

export type ASTElement = {
  type: 1;
  tag: string;
  parent: ASTElement | undefined;
  children: ASTNode[];
  attrsList: {name: string, value: string}[];
  attrsMap: {[index: string]: string};

  if?: string;
  elseif?: string;
  else?: true;
  ifConditions?: {exp: string, block: ASTElement}[];

  ns?: string;
}

export type ASTExpression = {
  type: 2;
  expression: string;
}

export type ASTText = {
  type: 3;
  text: string;
}

