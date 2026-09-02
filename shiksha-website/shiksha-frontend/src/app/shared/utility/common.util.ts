import { HttpClient } from "@angular/common/http";
import { TranslateCompiler } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { evaluate } from "@marcbachmann/cel-js";
import enLabels from "../../../assets/i18n/en.json";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class RuleTranslateCompiler extends TranslateCompiler {
    compile(value: string): string {
        return value;
    }

    compileTranslations(translations: Record<string, unknown>): Record<string, unknown> {
        const user = JSON.parse(localStorage.getItem('userData') ?? 'null');
        const state = user?.school?.state || user?.profiles?.admin?.state || null;
        const translateValue = (value: unknown): unknown => {
            if (typeof value === 'string') return typeof translations[value] === 'string' ? translations[value] : value;
            if (value === null || typeof value !== 'object') return value;
            return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, translateValue(entry)]));
        };
        for (const [key, rules] of Object.entries(enLabels)) {
            if (!Array.isArray(rules)) continue;
            const fallback = Array.isArray(translations[key]) ? key : translations[key] ?? key;
            translations[key] = (params: Record<string, unknown> = {}) => {
                for (const entry of rules) {
                    if (entry === null || typeof entry !== 'object' || !('rule' in entry)) return translateValue(entry);
                    const rule = entry as { rule: string; value: unknown };
                    if (evaluate(rule.rule, { state, board: null, subject: null, ...params })) {
                        return translateValue(rule.value);
                    }
                }
                return translateValue(fallback);
            }
        }
        return translations;
    }
}
