import { NgIf } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Design-approved generation tile illustrations (120x80 SVG, #677 Figma).
 * Shared by Home and the Content Generation landing page; change paths only here.
 */
export const GENERATION_TILE_IMAGES = {
  periodPlan: 'assets/images/home-tile-period-plan.svg',
  questionPaper: 'assets/images/home-tile-question-paper.svg',
  lessonResource: 'assets/images/home-tile-lesson-resource.svg',
  presentation: 'assets/images/home-tile-presentation.svg',
} as const;

/** `stacked`: half-width tile, image above label. `row`: full-width tile, image, label, chevron. */
export type GenerationTileLayout = 'stacked' | 'row';

/**
 * Generation tile applied to the caller's own link, so routing, test IDs and
 * grid placement stay on the `<a>`:
 * `<a appGenerationTile routerLink="..." [image]="..." label="..." layout="row"></a>`
 */
@Component({
  selector: 'a[appGenerationTile]',
  standalone: true,
  imports: [NgIf, TranslateModule],
  templateUrl: './generation-tile.component.html',
  styleUrls: ['./generation-tile.component.scss'],
})
export class GenerationTileComponent {
  @Input({ required: true }) image!: string;
  /** i18n key, also the English label */
  @Input({ required: true }) label!: string;
  @Input() layout: GenerationTileLayout = 'stacked';

  @HostBinding('class.generation-tile') readonly tileClass = true;

  @HostBinding('class.generation-tile--row')
  get isRow(): boolean {
    return this.layout === 'row';
  }
}
