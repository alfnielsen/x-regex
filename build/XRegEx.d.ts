export type RepeateOptions = {
    lazy?: boolean;
    zeroOrMore?: boolean;
    oneOrMore?: boolean;
    precise?: number;
    min?: number;
    max?: number;
};
export type CaptureBlockOptions = {
    repeat?: RepeateOptions;
    groupName?: string;
};
export declare const xRegEx: () => XRegEx;
export declare class XRegEx {
    /** .global	Does the RegExp object test against all matches in a string, or only the first? */
    static readonly globalFlag = "g";
    /** .ignoreCase	Does the RegExp object ignore case when performing a match? */
    static readonly ignoreCaseFlag = "i";
    /** .multiline	Does the RegExp object perform matches across multiple lines? */
    static readonly multilineFlag = "m";
    /** .sticky	Is the search sticky? (Does the next match have to occur at lastIndex, or can we match the next occurrence after lastIndex?) */
    static readonly stickyFlag = "y";
    /** .unicode	Are Unicode features enabled? */
    static readonly unicodeFlag = "u";
    /** .dotAll	Does . (dot) match newlines or not? */
    static readonly dotAllFlag = "s";
    static readonly dot = ".";
    static readonly anyChar = "[\\s\\S]";
    static readonly whitespaceOnly = "[^\\S\\n]";
    static readonly whitespaceOrNewLine = "[\\s\\n]";
    static readonly tab = "\\t";
    static readonly verticalTab = "\\v";
    static readonly returnfeed = "\\r";
    static readonly newLine = "\\n";
    static readonly nonNewLine = "\\N";
    static readonly wordChar = "\\w";
    static readonly nonWordChar = "\\W";
    static readonly wordBoundary = "\\b";
    static readonly nonWordBoundary = "\\B";
    static readonly word = "\\w+";
    static readonly start = "^";
    static readonly end = "$";
    static readonly digit = "\\d";
    static readonly nonDigit = "\\D";
    static readonly escapedChar: (char: string) => string;
    static readonly nonMatchGroup: (content: string) => string;
    static readonly lookAHead: (content: string) => string;
    static readonly negativLookAHead: (content: string) => string;
    static readonly lookBefore: (content: string) => string;
    static readonly negativLookBefore: (content: string) => string;
    static readonly namedGroupBackReference: (name: string) => string;
    static readonly range: (...chars: string[]) => string;
    static readonly namedGroup: (name: string, content: string) => string;
    static readonly zeroOrMOre = "*";
    static readonly zeroOrMOreLazy = "*?";
    static readonly oneOrMore = "+";
    static readonly oneOrMoreLazy = "+?";
    static readonly zeroOrOne = "?";
    static readonly zeroOrOneLazy = "??";
    static readonly precise: (n: number) => string;
    static readonly min: (min: number) => string;
    static readonly minLazy: (min: number) => string;
    static readonly minMax: (min: number, max: number) => string;
    static readonly minMaxLazy: (min: number, max: number) => string;
    static readonly repeat: (body: string, opt: RepeateOptions) => string;
    flags: string[];
    blocks: XRegExBlock[];
    blockStack: XRegExBlock[];
    currentBlock: XRegExBlock;
    start(): this;
    add(content: string): this;
    addAnyChar(): this;
    addWhitespaceOnly(): this;
    addWhitespaceOrNewLine(): this;
    addTab(): this;
    addVerticalTab(): this;
    addReturnfeed(): this;
    addNewLine(): this;
    addNonNewLine(): this;
    addWordChar(): this;
    addNonWordChar(): this;
    addWordBoundary(): this;
    addNonWordBoundary(): this;
    addWord(): this;
    addStart(): this;
    addEnd(): this;
    addDigit(): this;
    addNonDigit(): this;
    addEscapedChar(char: string): void;
    addNonMatchGroup(content: string): void;
    addLookAHead(content: string): void;
    addNegativLookAHead(content: string): void;
    addLookBefore(content: string): void;
    addNegativLookBefore(content: string): void;
    addNamedGroupBackReference(name: string): void;
    addRange(chars: string): void;
    match(opt?: CaptureBlockOptions): this;
    addFlag(flag: string): this;
    removeFlag(flag: string): this;
    get regExp(): RegExp;
    exec(content: string): RegExpExecArray | null;
    test(content: string): boolean;
    split(content: string): string[];
    replace(content: string, replace: string | ((match: RegExpExecArray) => string), replaceCount?: number): string;
    replaceAll(content: string, replace: string | ((match: RegExpExecArray) => string)): string;
}
export declare class XRegExBlock {
    content: string[];
    groupName?: string;
    repeat?: RepeateOptions;
    add(content: string): this;
    addEscapedChar(char: string): void;
    addNonMatchGroup(content: string): void;
    addLookAHead(content: string): void;
    addNegativLookAHead(content: string): void;
    addLookBefore(content: string): void;
    addNegativLookBefore(content: string): void;
    addNamedGroupBackReference(name: string): void;
    addRange(chars: string): void;
    toString(): string;
}
