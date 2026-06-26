import { TEX_MATH_DELIMITERS } from './constant.util';

declare const renderMathInElement: any;

const MATH_RENDER_OPTIONS = { delimiters: TEX_MATH_DELIMITERS, throwOnError: false };

export const renderTexMath = (element: HTMLElement) => setTimeout(() => renderMathInElement(element, MATH_RENDER_OPTIONS));
