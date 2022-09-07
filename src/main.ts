import Puppeteer from 'puppeteer';

import {BUILDINGLINK_USERNAME, BUILDINGLINK_PASSWORD} from './@env';

const LOGIN_URL = 'https://auth.buildinglink.com/Account/Login';
const DELIVERIES_URL =
  'https://www.buildinglink.com/V2/Tenant/Deliveries/Deliveries.aspx';

async function main(): Promise<void> {
  let browser = await Puppeteer.launch({headless: false});
  try {
    let page = await browser.newPage();
    {
      await page.goto(LOGIN_URL);

      await page.waitForSelector('input[name=Username]');

      let usernameInput = await page.$('input[name=Username]');
      if (!usernameInput) {
        throw new Error('Username input not found');
      }
      await usernameInput.type(BUILDINGLINK_USERNAME);

      let passwordInput = await page.$('input[name=Password]');
      if (!passwordInput) {
        throw new Error('Password input not found');
      }
      await passwordInput.type(BUILDINGLINK_PASSWORD);

      let loginButton = await page.$('#LoginButton');
      if (!loginButton) {
        throw new Error('Login button not found');
      }
      await loginButton.click();
    }

    await page.waitForNetworkIdle();

    {
      let pageTitle = await page.title();
      if (
        !pageTitle ||
        (!pageTitle.includes('BuildingLink 2.0') &&
          !(await page.content()).includes(
            'Welcome to BuildingLink Auth Server',
          ))
      ) {
        throw new Error('Login failed');
      }

      await page.goto(DELIVERIES_URL);
      await page.waitForSelector(
        '#ctl00_ContentPlaceHolder1_DeliveriesWrapper',
      );
    }
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
