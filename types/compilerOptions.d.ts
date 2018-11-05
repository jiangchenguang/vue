type CompilerModule = {
  transformNode?: (el: ASTElement) => void;
}

export type CompilerOptions = {
  modules: CompilerModule[],
  isUnaryTag: { [index: string]: true },
  mustUseProp: (tag: string, attr: string, type?: string) => boolean,
  getTagNamespace: (tag: string) => string | undefined,
}

// parseHTML的选项
export type ParseHTMLOptions = {
  chars: (tagName: string) => void,
  start: (tagName: string, attrs: { name: string; value: string }[], unary: boolean) => void,
  end: (text: string) => void,
  isUnaryTag: { [index: string]: true },
}

export type ASTNode = ASTElement | ASTExpression | ASTText

export type ASTElement = {
  type: 1;
  tag: string;
  parent: ASTElement | undefined;
  children: ASTNode[];
  props?: { name: string, value: string }[];
  attrs?: { name: string, value: string }[];
  attrsList: { name: string, value: string }[];
  attrsMap: { [index: string]: string };

  once?: true;

  if?: string;
  elseif?: string;
  else?: true;
  ifConditions?: { exp: string, block: ASTElement }[];

  for?: string;
  alias?: string;
  iterator1?: string;
  iterator2?: string;
  key?: string;

  slotName?: string;
  slotTarget?: string;

  component?: string;
  inlineTemplate?: true;

  staticClass?: string;
  classBinding?: string;
  staticStyle?: string;
  styleBinding?: string;

  events?: { [index: string]: { value: string, } } | { [index: string]: { value: string }[] }
  directives?: { name: string, arg?: string, value?: string, modifies?: { [index: string]: true } }[];

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

