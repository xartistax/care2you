import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '@/locales/de.json';

import { BaseTemplate } from './BaseTemplate';

describe('Base template', () => {
  describe('Render method', () => {
    it('should have 3 menu items', async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <BaseTemplate locale="en">
            <div>
              <ul>
                <li>link 1</li>
                <li>link 2</li>
                <li>link 3</li>
              </ul>
            </div>
          </BaseTemplate>
        </NextIntlClientProvider>,
      );

      const menuItemList = screen.getAllByRole('listitem');

      expect(menuItemList).toHaveLength(3);
    });

    it('should have a link to support creativedesignsguru.com', async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <BaseTemplate locale="en">
            <div>
              <p>© Copyright</p>
              <a href="https://creativedesignsguru.com">Support</a>
            </div>
          </BaseTemplate>
        </NextIntlClientProvider>,
      );

      const copyrightSection = screen.getByText(/© Copyright/);
      const copyrightLink = within(copyrightSection).getByRole('link');

      expect(copyrightLink).toHaveAttribute(
        'href',
        'https://creativedesignsguru.com',
      );
    });
  });
});
