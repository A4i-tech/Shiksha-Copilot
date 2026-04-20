import { Pipe, PipeTransform } from '@angular/core';
import { formatSuperscript } from '../utility/math-formatting.util';

@Pipe({
  name: 'mathFormatting'
})
export class MathFormattingPipe implements PipeTransform {
  transform(value: string): string {
    return formatSuperscript(value);
  }
}
