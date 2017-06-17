import { OfflinenpmUiPage } from './app.po';

describe('offlinenpm-ui App', () => {
  let page: OfflinenpmUiPage;

  beforeEach(() => {
    page = new OfflinenpmUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
