import { UtilityService } from './utility.service';

describe('UtilityService.trustUrl', () => {
  let service: UtilityService;
  const sanitizer = { bypassSecurityTrustResourceUrl: (url: string) => url } as any;

  beforeEach(() => {
    service = new UtilityService({} as any, {} as any, {} as any, sanitizer, {} as any, {} as any, {} as any);
  });

  it('passes through an https URL', () => {
    expect(service.trustUrl('https://example.com/video.mp4')).toBe('https://example.com/video.mp4');
  });

  it('blanks a non-https URL', () => {
    expect(service.trustUrl('http://example.com/video.mp4')).toBe('');
  });

  it('blanks a relative URL', () => {
    expect(service.trustUrl('/video.mp4')).toBe('');
  });

  it('trims whitespace before checking scheme', () => {
    expect(service.trustUrl('  https://example.com/video.mp4  ')).toBe('https://example.com/video.mp4');
  });

  it('extracts a YouTube embed URL when the input is a YouTube link', () => {
    expect(service.trustUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });
});
