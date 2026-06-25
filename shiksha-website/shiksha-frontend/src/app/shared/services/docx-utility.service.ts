import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AlignmentType,
  BorderStyle,
  Header,
  HeadingLevel,
  ILevelsOptions,
  INumberingOptions,
  IRunOptions,
  LevelFormat,
  Math as DocxMath,
  MathAngledBrackets,
  MathComponent,
  MathCurlyBrackets,
  MathFraction,
  MathFunction,
  MathIntegral,
  MathRadical,
  MathRoundBrackets,
  MathRun,
  MathSquareBrackets,
  MathSubScript,
  MathSubSuperScript,
  MathSuperScript,
  MathSum,
  Packer,
  Paragraph,
  ParagraphChild,
  TextRun,
} from 'docx';
import { marked } from 'marked';
import { UtilityService } from 'src/app/core/services/utility.service';
import { TEX_MATH_DELIMITERS } from '../utility/constant.util';
import temml from "temml";

const tag = (n?: Element) => n?.localName || "";
const kids = (n: Element) => Array.from(n.children) as Element[];
const text = (n?: Element) => n?.textContent ?? "";
const docx = (n?: Element) => n ? mathmlToDocx(n) : [];
const is = (n: Element, ...tags: string[]) => tags.includes(tag(n));

function nary(node: Element, body: Element) {
  const [base, sub, sup] = kids(node), Ctor = text(base).trim() === "∑" ? MathSum : text(base).trim() === "∫" ? MathIntegral : null;
  return Ctor && new Ctor({ children: docx(body), ...(is(node, "msup", "mover") ? { superScript: docx(sub) } : is(node, "msub", "munder") ? { subScript: docx(sub) } : { subScript: docx(sub), superScript: docx(sup) }) });
}

function row(node: Element): MathComponent[] {
  const out: MathComponent[] = [], c = kids(node);
  for (let i = 0; i < c.length; i++) {
    const n = c[i], next = c[i + 1], next2 = c[i + 2], op = next && nary(n, next);
    if (op) { out.push(op); if (next) i++; continue; }
    if (tag(n) === "mi" && text(next) === "" && next2) { out.push(new MathFunction({ name: docx(n), children: docx(next2) })); i += 2; continue; }
    out.push(...mathmlToDocx(n));
  }
  return out;
}

function mathmlToDocx(node: Element): MathComponent[] {
  switch (tag(node)) {
    case "math":
    case "mrow":
    case "mstyle":
      return row(node);
    case "semantics":
      return docx(kids(node)[0]);
    case "mi":
    case "mn":
    case "mo":
    case "mtext":
    case "ms":
      return [new MathRun(text(node))];
    case "mspace":
      return [new MathRun(" ")];
    case "none":
    case "annotation":
      return [];
    case "mfrac": {
      const [num, den] = kids(node);
      return [new MathFraction({ numerator: docx(num), denominator: docx(den) })];
    }
    case "msup":
    case "mover": {
      const [base, sup] = kids(node);
      return [new MathSuperScript({ children: docx(base), superScript: docx(sup) })];
    }
    case "msub":
    case "munder": {
      const [base, sub] = kids(node);
      return [new MathSubScript({ children: docx(base), subScript: docx(sub) })];
    }
    case "msubsup":
    case "munderover": {
      const [base, sub, sup] = kids(node);
      return [new MathSubSuperScript({ children: docx(base), subScript: docx(sub), superScript: docx(sup) })];
    }
    case "msqrt":
      return [new MathRadical({ children: row(node) })];
    case "mroot": {
      const [base, degree] = kids(node);
      return [new MathRadical({ children: docx(base), degree: docx(degree) })];
    }
    case "mfenced": {
      const c = row(node), open = node.getAttribute("open") ?? "(", close = node.getAttribute("close") ?? ")";
      const Ctor = ({ "()": MathRoundBrackets, "{}": MathCurlyBrackets, "[]": MathSquareBrackets, "⟨⟩": MathAngledBrackets, "<>": MathAngledBrackets } as Record<string, any>)[open + close];
      return Ctor ? [new Ctor({ children: c })] : [new MathRun(open), ...c, new MathRun(close)];
    }
    default:
      return [new MathRun(text(node))];
  }
}

export class DocxContext{
  public listInstances = 1;
  constructor(){}
}

@Injectable({
  providedIn: 'root',
})
export class DocxUtilityService {
  constructor(private utilityService:UtilityService, private translateService:TranslateService){}

  getTextRunsWithMath(content: unknown, options: IRunOptions = {}): (TextRun | DocxMath)[] {
    return this.processMath(content == null ? '' : String(content), options);
  }

  private processMath(content: string, options: IRunOptions): (TextRun | DocxMath)[] {
    const mathPattern = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\n]+\$)/g;
    return content.split(mathPattern).map(part => {
      const math = this.extractMath(part);
      if (!math) return new TextRun({ ...options, text: part });

      const mathml = temml.renderToString(math.content, { displayMode: math.displayMode, throwOnError: false });
      const doc = new DOMParser().parseFromString(mathml, "application/xml");
      return new DocxMath({ ...options, children: mathmlToDocx(doc.documentElement) });
    });
  }

  private extractMath(part: string): { content: string; displayMode: boolean } | null {
    const delimiter = TEX_MATH_DELIMITERS.find(({ left, right }) => part.startsWith(left) && part.endsWith(right));
    return delimiter ? { content: part.slice(delimiter.left.length, -delimiter.right.length), displayMode: delimiter.display } : null;
  }

  private toRuns(tokens: marked.Token[]): ParagraphChild[] {
    return tokens.flatMap((token) => {
      switch (token.type) {
        case 'strong':
          return this.processMath(token.text, { bold: true });
        case 'em':
          return this.processMath(token.text, { italics: true });
        case 'br':
          return this.processMath('', { break: 1 });
        default:
          if("tokens" in token && token.tokens !== undefined){
            return this.toRuns(token.tokens);
          }
          return token.raw.split(/\r?\n/).flatMap((line, index) => [
            ...(index > 0 ? [new TextRun({ break: 1 })] : []),
            ...this.processMath(line, {}),
          ]);
      }
    });
  };

  getMarkdownParagraphs(content: string, context: DocxContext): Paragraph[] {
    const toParagraphs = (tokens: marked.Token[], level = 0): Paragraph[] => {
      return tokens.flatMap((token) => {
        if (token.type === 'space') {
          return [];
        }

        if (token.type === 'hr') {
          return [new Paragraph("")];
        }

        if (token.type === 'list') {
          const depth = Math.min(level, 8);
          const reference = token.ordered ? `markdown-numbered-${depth}` : 'markdown-bullets';
          const instance = context.listInstances++;

          return token.items.flatMap((item) => {
            const mcq = token.ordered ? this.parseLetteredOptions(item.text) : null;

            if (mcq) {
              const optionsInstance = context.listInstances++;

              return [
                new Paragraph({
                  numbering: { reference, level: token.ordered ? 0 : depth, instance },
                  children: [new TextRun(mcq.question)],
                  spacing: { after: 40 },
                }),
                ...mcq.options.map(option => new Paragraph({
                  numbering: { reference: `markdown-lettered-${Math.min(level + 1, 8)}`, level: 0, instance: optionsInstance },
                  children: [new TextRun(option)],
                  spacing: { after: 40 },
                })),
                ...(mcq.answer ? [new Paragraph({ text: mcq.answer, spacing: { after: 100 } })] : []),
              ];
            }

            return [
              new Paragraph({
                numbering: { reference, level: token.ordered ? 0 : depth, instance },
                children: this.toRuns(item.tokens.filter(t => t.type !== 'list')),
                spacing: { after: 40 },
              }),
              ...toParagraphs(item.tokens.filter(t => t.type === 'list'), level + 1),
            ];
          });
        }

        return [
          new Paragraph({
            heading: token.type === 'heading' ? HeadingLevel[`HEADING_${Math.min(token.depth, 6)}` as keyof typeof HeadingLevel] : undefined,
            children: this.toRuns("tokens" in token && token.tokens !== undefined ? token.tokens : [token]),
            spacing: { after: 100 },
          }),
        ];
      });
    };

    return toParagraphs(marked.lexer(content));
  }

  private parseLetteredOptions(text: string) {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const firstOption = lines.findIndex(line => /^a\)\s+/i.test(line));
    if (firstOption < 1) return null;

    const question = lines.slice(0, firstOption).join(' ');
    const tail = lines.slice(firstOption);
    const answer = /^Ans:\s+/i.test(tail[tail.length - 1] || '') ? tail.pop() : '';
    const options = tail.map((line, index) => {
      const match = line.match(/^([a-z])\)\s+(.+)$/i);
      return match?.[1].toLowerCase() === String.fromCharCode(97 + index) ? match[2] : null;
    });

    return options.length > 1 && options.every(Boolean)
      ? { question, options: options as string[], answer }
      : null;
  }

  getMarkdownNumbering() : INumberingOptions{
    const levels = (
      format: typeof LevelFormat[keyof typeof LevelFormat],
      text: (level: number) => string,
      depthOffset = 0,
    ) => Array.from({ length: 9 }, (_, level) : ILevelsOptions => ({
        level,
        format,
        text: text(level),
        start: 1,
        alignment: AlignmentType.LEFT,
        style: {
          paragraph: {
            indent: { left: 360 + (depthOffset + level) * 360, hanging: 180 },
          },
        },
      }));

    return {
      config: [
        { reference: 'markdown-bullets', levels: levels(LevelFormat.BULLET, () => '•') },
        ...Array.from({ length: 9 }, (_, depth) => ({
          reference: `markdown-numbered-${depth}`,
          levels: levels(LevelFormat.DECIMAL, () => '%1.', depth).slice(0, 1),
        })),
        ...Array.from({ length: 9 }, (_, depth) => ({
          reference: `markdown-lettered-${depth}`,
          levels: levels(LevelFormat.LOWER_LETTER, () => '%1)', depth).slice(0, 1),
        })),
      ],
    };
  }

  /**
   * Function to download doc file
   * @param doc
   * @param fileName
   */
  downloadFile(doc: any, fileName: any) {
    Packer.toBlob(doc).then((blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName + '.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.utilityService.showSuccess('Document downloaded successfully!')
    }).catch(()=>{
      this.utilityService.showError('Something went wrong! Please try again later.')
    })
  }

  getLearningOutcomes(learningOutcomes:any[]){
    const loContent = learningOutcomes.map((item,i) => [
      new Paragraph({
          text: `${i + 1}. ${item}`,
          spacing: {
              before: 80,
              after: 80,
          },
      })
  ]).flat();

  // Define the content for the first page with checklist
  const learningOutcomesContent = [
      new Paragraph({
          text: this.translateService.instant('LEARNING OUTCOMES'),
          heading: HeadingLevel.HEADING_1,
          spacing:{
            after:300
          }
      }),
      ...loContent,
  ];

  return learningOutcomesContent
  }

  /**
   * Function to get footer data
   * @param formData 
   * @returns 
   */
  getHeader(formData: any) {
    const medium = formData?.medium ? formData.medium.charAt(0).toUpperCase() + formData.medium.slice(1) : '';
    const chapter = [formData?.orderNumber, formData?.topics].filter(Boolean).join('. ');
    const subTopics = Array.isArray(formData?.subTopics) ? formData.subTopics.join(', ') : formData?.subTopics || '';
    const subject = formData?.subjects ? this.utilityService.getSubjectDisplayName(formData.subjects) : '';
    return {
      default: new Header({
        children: [
          this.buildHeaderTitleLine(subject, chapter),
          this.buildHeaderMetaLine([
            [this.translateService.instant('Board'), formData?.board],
            [this.translateService.instant('Medium'), medium],
            [this.translateService.instant('Class'), formData?.class?.toString()],
            [this.translateService.instant('Sub-Topic'), subTopics],
          ]),
        ],
      }),
    };
  }

  private buildHeaderTitleLine(subject: string, chapter: string) {
    const items = [subject, chapter].filter(Boolean);
    return new Paragraph({
      children: items.flatMap((value, index) => [
        ...(index > 0 ? [new TextRun({ text: '  |  ', color: '7A7A7A', size: 17 })] : []),
        new TextRun({ text: value, bold: true, color: '1F2937', size: 18 }),
      ]),
      spacing: { before: 0, after: 10 },
    });
  }

  private buildHeaderMetaLine(items: [string, any][]) {
    return new Paragraph({
      children: items
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .flatMap(([label, value], index) => [
          ...(index > 0 ? [new TextRun({ text: '  |  ', color: 'B0B0B0', size: 14 })] : []),
          new TextRun({ text: `${label}: `, bold: true, color: '5F6368', size: 14 }),
          new TextRun({ text: value.toString(), color: '374151', size: 14 }),
        ]),
      spacing: { before: 0, after: 60 },
      border: {
        bottom: { color: 'D0D7DE', space: 4, style: BorderStyle.SINGLE, size: 3 },
      },
    });
  }
}
