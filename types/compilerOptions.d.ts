type transformFromNodeFunction = (el: ASTElement) => void;
type genDataFunction = (el: ASTElement) => string;
type CompilerModule = {
  transformNode?: transformFromNodeFunction;
  genData?: genDataFunction;
}

export type CompilerOptions = {
  modules: CompilerModule[],
  isUnaryTag: (value: string) => boolean,
  mustUseProp: (tag: string, attr: string, type?: string) => boolean,
  isReservedTag: (tag: string) => boolean,
  getTagNamespace: (tag: string) => string | undefined,
}

// parseHTML的选项
export type ParseHTMLOptions = {
  chars: (tagName: string) => void,
  start: (tagName: string, attrs: { name: string; value: string }[], unary: boolean) => void,
  end: (text: string) => void,
  isUnaryTag: (value: string) => boolean,
}

export type ASTNode = ASTElement | ASTExpression | ASTText

export type ASTIfConditions = { exp: string, block: ASTElement }[];
export type ASTModifiers = { [name: string]: true };
export type ASTElementHandler = { value: string, modifiers?: ASTModifiers };
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
  ifProcessed?: boolean;
  elseif?: string;
  else?: true;
  ifConditions?: ASTIfConditions;

  for?: string;
  forProcessed?: boolean;
  alias?: string;
  iterator1?: string;
  iterator2?: string;
  key?: string;

  ref?: string;
  refInFor?: boolean;
  slotName?: string;
  slotTarget?: string;

  component?: string;
  inlineTemplate?: true;

  staticClass?: string;
  classBinding?: string;
  staticStyle?: string;
  styleBinding?: string;

  events?: { [name: string]: ASTElementHandler | ASTElementHandler[] },
  directives?: { name: string, arg?: string, value?: string, modifiers?: ASTModifiers }[];

  ns?: string;
  plain?: boolean;
  hasBindings?: true;
  static?: boolean;
  staticRoot?: boolean;
  staticInFor?: boolean;
  staticProcessed?: boolean;
}

export type ASTExpression = {
  type: 2;
  expression: string;
  static?: boolean;
}

export type ASTText = {
  type: 3;
  text: string;
  static?: boolean;
}

