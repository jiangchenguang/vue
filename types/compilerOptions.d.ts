
export type CompilerOptions = {

}

// parseHTML的选项
export type ParseHTMLOptions = {
  chars: (tagName: string) => void,
  start: (tagName: string) => void,
  end: (text: string) => void,
}

export type ASTNode = ASTElement | ASTText

export type ASTElement = {
  type: 1;
  tag: string;
  parent: ASTElement | undefined;
  children: ASTNode[];
}

export type ASTText = {
  type: 3;
  text: string;
}


