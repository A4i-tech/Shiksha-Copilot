import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { GENERATION_TILE_IMAGES, GenerationTileComponent, GenerationTileLayout } from './generation-tile.component';

@Component({ template: '' })
class BlankComponent {}

@Component({
  standalone: true,
  imports: [GenerationTileComponent, RouterLink],
  template: `<a appGenerationTile data-testid="tile" routerLink="/target" [image]="image" [label]="label" [layout]="layout"></a>`,
})
class HostComponent {
  image: string = GENERATION_TILE_IMAGES.periodPlan;
  label = 'Generate New Period Plan';
  layout: GenerationTileLayout = 'stacked';
}

describe('GenerationTileComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const tile = () => fixture.nativeElement.querySelector('[data-testid="tile"]') as HTMLAnchorElement;

  const render = (layout: GenerationTileLayout) => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.layout = layout;
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: 'target', component: BlankComponent }]),
        HostComponent,
      ],
    });
  });

  it('renders the stacked (half-width) layout: image and label, no chevron', () => {
    render('stacked');
    const el = tile();
    expect(el.tagName).toBe('A');
    expect(el.classList).toContain('generation-tile');
    expect(el.classList).not.toContain('generation-tile--row');
    expect(el.querySelector('.generation-tile__image')?.getAttribute('src')).toBe(GENERATION_TILE_IMAGES.periodPlan);
    expect(el.querySelector('.generation-tile__label')?.textContent?.trim()).toBe('Generate New Period Plan');
    expect(el.querySelector('.generation-tile__chevron')).toBeNull();
  });

  it('renders the row (full-width) layout: image, label, then chevron', () => {
    render('row');
    const el = tile();
    expect(el.classList).toContain('generation-tile--row');
    const parts = Array.from(el.children).map((child) => child.className);
    expect(parts).toEqual(['generation-tile__image', 'generation-tile__label', 'generation-tile__chevron']);
  });

  it('keeps images decorative so the link text is the accessible name', () => {
    render('row');
    tile().querySelectorAll('img').forEach((img) => {
      expect(img.getAttribute('alt')).toBe('');
      expect(img.getAttribute('aria-hidden')).toBe('true');
    });
    expect(tile().textContent?.trim()).toBe('Generate New Period Plan');
  });

  it('navigates to its route when clicked', fakeAsync(() => {
    render('stacked');
    expect(tile().getAttribute('href')).toBe('/target');
    tile().click();
    tick();
    expect(TestBed.inject(Location).path()).toBe('/target');
  }));

  it('points every shared image at an approved tile illustration', () => {
    Object.values(GENERATION_TILE_IMAGES).forEach((path) => {
      expect(path).toMatch(/^assets\/images\/home-tile-[a-z-]+\.svg$/);
    });
  });
});
