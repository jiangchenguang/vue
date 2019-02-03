import VNode from "src/core/vnode/vnode";

export type directiveFunction = (el: ASTElement, dir: directive) => void;

type transformFromNodeFunction = (el: ASTElement) => void;
type genDataFunction = (el: ASTElement) => string;
type CompilerModule = {
  transformNode?: transformFromNodeFunction;
  genData?: genDataFunction;
}

type renderFn = (h: () => VNode) => VNode;
type baseCompiler = (template: string, options?: CompilerOptions) => { ast: ASTNode, render: string };
export type Compile = (template: string, options?: CompilerOptions) => { ast: ASTNode, render: string };
export type CreateCompiler = (baseOption: CompilerOptions) => { compile: Compile, compileToFunction: (template: string) => { render: renderFn } };
export type CreateCompilerCreator = (fn: baseCompiler) => CreateCompiler;

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
export type directive = { name: string, arg?: string, value?: string, modifiers?: ASTModifiers };
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
  nativeEvents?: { [name: string]: ASTElementHandler | ASTElementHandler[] },
  directives?: directive[];

  ns?: string;
  plain?: boolean;
  hasBindings?: true;
  static?: boolean;
  staticRoot?: boolean;
  staticInFor?: boolean;
  staticProcessed?: boolean;

  wrapData?: (code: string) => string;
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

