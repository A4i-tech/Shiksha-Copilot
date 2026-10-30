import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { PresentationGenerationComponent } from './presentation-generation.component';

describe('PresentationGenerationComponent file upload', () => {
  let component: PresentationGenerationComponent;
  let utility: { showWarning: jasmine.Spy; showError: jasmine.Spy };
  let service: { getPresentationTools: jasmine.Spy; createPresentationJob: jasmine.Spy; closePresentationEventStream: jasmine.Spy };

  beforeEach(() => {
    utility = { showWarning: jasmine.createSpy('showWarning'), showError: jasmine.createSpy('showError') };
    service = {
      getPresentationTools: jasmine.createSpy('getPresentationTools').and.returnValue(of([])),
      createPresentationJob: jasmine.createSpy('createPresentationJob').and.returnValue(of({ id: 'job-1' })),
      closePresentationEventStream: jasmine.createSpy('closePresentationEventStream'),
    };
    const route: any = { snapshot: { paramMap: { get: () => null } }, paramMap: of({ get: () => null }) };
    const router: any = { navigate: jasmine.createSpy('navigate') };
    component = new PresentationGenerationComponent(new FormBuilder(), route, router, {} as any, utility as any, service as any);
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('accepts pdf, doc, docx, ppt, pptx, txt and md', () => {
    expect([...component.acceptedFileTypes].sort()).toEqual(['.doc', '.docx', '.md', '.pdf', '.ppt', '.pptx', '.txt']);
    expect(component.acceptedFileTypesAttr).toContain('.pptx');
  });

  ['deck.pdf', 'notes.doc', 'book.docx', 'slides.ppt', 'slides.pptx', 'a.txt', 'a.md', 'UPPER.PPTX'].forEach((name) => {
    it(`selects ${name} without warning`, () => {
      const file = new File(['x'], name);
      component.onFileSelected({ target: { files: [file], value: name } } as any);
      expect(component.selectedFile).toBe(file);
      expect(utility.showWarning).not.toHaveBeenCalled();
    });
  });

  it('rejects unsupported extensions', () => {
    const input = { files: [new File(['x'], 'virus.exe')], value: 'virus.exe' };
    component.onFileSelected({ target: input } as any);
    expect(component.selectedFile).toBeNull();
    expect(input.value).toBe('');
    expect(utility.showWarning).toHaveBeenCalled();
  });

  ['book.docx', 'slides.pptx', 'old.doc', 'old.ppt'].forEach((name) => {
    it(`uploads ${name} to the backend unmodified`, () => {
      const file = new File(['x'], name);
      component.selectedFile = file;
      component.startGeneration();

      expect(service.createPresentationJob).toHaveBeenCalledTimes(1);
      const sent = service.createPresentationJob.calls.mostRecent().args[0] as FormData;
      expect(sent.get('textbook_file')).toBe(file);
    });
  });
});
