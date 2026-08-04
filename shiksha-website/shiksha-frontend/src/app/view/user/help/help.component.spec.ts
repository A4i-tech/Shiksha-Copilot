import { HelpComponent } from './help.component';

describe('HelpComponent', () => {
  const utility = (state: string) => ({ loggedInUserData: { school: { state }, profiles: {} }, trustUrl: (url: string) => url });

  it('shows Telugu videos in Telangana', () => {
    const component = new HelpComponent(utility('Telangana') as any);
    expect(component.isTelangana).toBeTrue();
    expect(component.videos.every((video) => video.title.includes('Telugu'))).toBeTrue();
  });

  it('shows Kannada videos elsewhere', () => {
    const component = new HelpComponent(utility('Karnataka') as any);
    expect(component.isTelangana).toBeFalse();
    expect(component.videos.some((video) => video.title.includes('Telugu'))).toBeFalse();
  });
});
