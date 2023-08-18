export type RepeateOptions = {
  lazy?: boolean
  zeroOrMore?: boolean
  oneOrMore?: boolean
  precise?: number
  min?: number
  max?: number
}

export type CaptureBlockOptions = {
  repeat?: RepeateOptions
  groupName?: string
}

export const xRegEx = () => new XRegEx()

export class XRegEx {
  /** .global	Does the RegExp object test against all matches in a string, or only the first? */
  static readonly globalFlag = "g"
  /** .ignoreCase	Does the RegExp object ignore case when performing a match? */
  static readonly ignoreCaseFlag = "i"
  /** .multiline	Does the RegExp object perform matches across multiple lines? */
  static readonly multilineFlag = "m"
  /** .sticky	Is the search sticky? (Does the next match have to occur at lastIndex, or can we match the next occurrence after lastIndex?) */
  static readonly stickyFlag = "y"
  /** .unicode	Are Unicode features enabled? */
  static readonly unicodeFlag = "u"
  /** .dotAll	Does . (dot) match newlines or not? */
  static readonly dotAllFlag = "s"

  // Other instance properties_
  // .hasIndices	Does the Regular Expression result expose the start and end indices of captured substrings?
  // .source	The text of the pattern used by the RegExp object.
  // .lastIndex	The index at which to start the next match.

  // standard regex parts
  static readonly dot = "." // . any char (include \n depends on flag 's')
  static readonly anyChar = "[\\s\\S]" // nomatter flag 's'
  static readonly whitespaceOnly = "[^\\S\\n]" // awoide new line
  static readonly whitespaceOrNewLine = "[\\s\\n]" // nomatter flag 's'
  static readonly tan = "\\t"
  static readonly verticalTab = "\\v"
  static readonly returnfeed = "\\r"
  static readonly newLine = "\\n"
  static readonly nonNewLine = "\\N"
  static readonly wordChar = "\\w"
  static readonly nonWordChar = "\\W"
  static readonly wordBoundary = "\\b"
  static readonly nonWordBoundary = "\\B"
  static readonly word = "\\w+"

  static readonly start = "^"
  static readonly end = "$"

  static readonly digit = "\\d"
  static readonly nonDigit = "\\D"

  // Other Character Classes
  //   [\b]	Matches a backspace.
  //   \0	Matches a NUL character (when not followed by another digit).
  //   \xnn	Matches the character code nn (two hexadecimal digits).
  //   \unnnn	Matches a UTF-16 code unit with the value nnnn (four hexadecimal digits).
  //   \

  // standard regex parts (with properties)
  static readonly escapedChar = (char: string) => "\\" + char + ")"
  static readonly nonMatchGroup = (content: string) => "(!=" + content + ")"
  static readonly lookAHead = (content: string) => "(?=" + content + ")"
  static readonly negativLookAHead = (content: string) => "(?!" + content + ")"
  static readonly lookBefore = (content: string) => "(?<=" + content + ")"
  static readonly negativLookBefore = (content: string) => "(?<!" + content + ")"
  static readonly namedGroupBackReference = (name: string) => "\\k<" + name + ">"
  static readonly range = (...chars: string[]) => "[" + chars.join("") + "]"
  // standard regex parts (with properties - groupping)
  static readonly namedGroup = (name: string, content: string) => "(?<" + name + ">" + content + ")"

  // Quantifiers
  static readonly zeroOrMOre = "*"
  static readonly zeroOrMOreLazy = "*?"
  static readonly oneOrMore = "+"
  static readonly oneOrMoreLazy = "+?"
  static readonly zeroOrOne = "?"
  static readonly zeroOrOneLazy = "??"
  static readonly precise = (n: number) => "{" + n + "}"
  static readonly min = (min: number) => "{" + min + ",}"
  static readonly minLazy = (min: number) => "{" + min + ",}?"
  static readonly minMax = (min: number, max: number) => "{" + min + "," + max + "}"
  static readonly minMaxLazy = (min: number, max: number) => "{" + min + "," + max + "}?"

  static readonly repeat = (body: string, opt: RepeateOptions) => {
    let { lazy } = opt
    if (opt.zeroOrMore) {
      return body + (lazy ? XRegEx.zeroOrMOreLazy : XRegEx.zeroOrMOre)
    }
    if (opt.oneOrMore) {
      return body + (lazy ? XRegEx.oneOrMoreLazy : XRegEx.oneOrMore)
    }
    if (opt.precise) {
      return body + XRegEx.precise(opt.precise)
    }
    if (opt.min && opt.max) {
      return body + (lazy ? XRegEx.minMaxLazy(opt.min, opt.max) : XRegEx.minMax(opt.min, opt.max))
    }
    if (opt.min) {
      return body + (lazy ? XRegEx.minLazy(opt.min) : XRegEx.min(opt.min))
    }
    throw new Error("xRegEx: no repeate option set!")
  }

  // builder instance:

  flags = ["is"]
  //
  blocks: XRegExBlock[] = []
  // block stack
  blockStack: XRegExBlock[] = []
  currentBlock: XRegExBlock = new XRegExBlock()

  // blocks
  start() {
    this.blockStack.push(new XRegExBlock())
    this.currentBlock = this.blockStack[this.blockStack.length - 1]
    return this
  }
  add(content: string) {
    this.currentBlock.add(content)
    return this
  }
  addEscapedChar(char: string) {
    this.add("\\" + char + ")")
  }
  addNonMatchGroup(content: string) {
    this.add("(!=" + content + ")")
  }
  addLookAHead(content: string) {
    this.add("(?=" + content + ")")
  }
  addNegativLookAHead(content: string) {
    this.add("(?!" + content + ")")
  }
  addLookBefore(content: string) {
    this.add("(?<=" + content + ")")
  }
  addNegativLookBefore(content: string) {
    this.add("(?<!" + content + ")")
  }
  addNamedGroupBackReference(name: string) {
    this.add("\\k<" + name + ">")
  }
  addRange(chars: string) {
    this.add("[" + chars + "]")
  }

  match(opt?: CaptureBlockOptions) {
    let block = this.blockStack.pop() // pop current block
    if (!block) throw new Error("xRegEx: no block to end!")
    // set block options
    block.groupName = opt?.groupName
    block.repeat = opt?.repeat
    this.currentBlock.add(block.toString())
    // set next current block
    this.currentBlock = this.blockStack[this.blockStack.length - 1]
    if (!this.currentBlock) throw new Error("xRegEx: no current block!")
    return this
  }

  // settings:
  addFlag(flag: string) {
    this.flags.push(flag)
    return this
  }
  removeFlag(flag: string) {
    this.flags = this.flags.filter((f) => f !== flag)
    return this
  }

  // getters
  get regExp() {
    var regExpContent = this.blocks.map((b) => b.toString()).join("")
    return new RegExp(regExpContent, this.flags.join(""))
  }

  // regex methods

  exec(content: string) {
    return this.regExp.exec(content)
  }
  test(content: string) {
    return this.regExp.test(content)
  }

  split(content: string) {
    return content.split(this.regExp)
  }

  replace(content: string, replace: string | ((match: RegExpExecArray) => string), replaceCount = 1) {
    let reegExp = this.regExp
    let newContent = content
    let match = reegExp.exec(content)
    while (match) {
      let placeContent = typeof replace === "string" ? replace : replace(match)
      newContent =
        newContent.substring(0, match.index) + placeContent + newContent.substring(match.index + match[0].length)
      if (replaceCount > 0) {
        replaceCount--
        if (replaceCount === 0) break
      }
      match = reegExp.exec(content)
    }
    return newContent
  }

  replaceAll(content: string, replace: string | ((match: RegExpExecArray) => string)) {
    return this.replace(content, replace, -1)
  }
}

export class XRegExBlock {
  content: string[] = []
  groupName?: string
  repeat?: RepeateOptions
  add(content: string) {
    this.content.push(content)
    return this
  }
  addEscapedChar(char: string) {
    this.add("\\" + char + ")")
  }
  addNonMatchGroup(content: string) {
    this.add("(!=" + content + ")")
  }
  addLookAHead(content: string) {
    this.add("(?=" + content + ")")
  }
  addNegativLookAHead(content: string) {
    this.add("(?!" + content + ")")
  }
  addLookBefore(content: string) {
    this.add("(?<=" + content + ")")
  }
  addNegativLookBefore(content: string) {
    this.add("(?<!" + content + ")")
  }
  addNamedGroupBackReference(name: string) {
    this.add("\\k<" + name + ">")
  }
  addRange(chars: string) {
    this.add("[" + chars + "]")
  }

  toString() {
    let str = this.content.join("")
    if (this.repeat) {
      str = XRegEx.repeat(str, this.repeat)
    }
    if (this.groupName) {
      str = XRegEx.namedGroup(this.groupName, str)
    }
    return str
  }
}
