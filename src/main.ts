import Puppeteer from 'puppeteer';
import * as FS from 'fs-extra';

import {BUILDINGLINK_USERNAME, BUILDINGLINK_PASSWORD} from './@env';
import {formateDate} from './@utils';
import {DELIVERIES_JSON_PATH, PUBLIC_DIR} from './@paths';

const LOGIN_URL = 'https://auth.buildinglink.com/Account/Login';
const DELIVERIES_URL =
  'https://www.buildinglink.com/V2/Tenant/Deliveries/Deliveries.aspx';

interface DeliveryInfo {
  date: string;
  vendor: string;
  trackingNumber: string;
}

async function getDeliveryInfos(): Promise<DeliveryInfo[]> {
  let result: DeliveryInfo[] = [];

  let browser = await Puppeteer.launch({headless: true});
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
    }

    await page.goto(DELIVERIES_URL);
    await page.waitForSelector('#ctl00_ContentPlaceHolder1_DeliveriesWrapper');

    {
      let table = await page.$('table.rgMasterTable');
      if (!table) {
        throw new Error('Table not found');
      }

      let rows = await table.$$('tr.rgRow, tr.rgAltRow');
      for (let row of rows) {
        let cells = await row.$$('td');
        if (cells.length < 3) {
          throw new Error('Unexpected number of cells in row');
        }
        let date = String(
          await cells[0].evaluate(node => node.textContent),
        ).trim();
        date = formateDate(date);
        let vendor = String(
          await cells[1].evaluate(node => node.textContent),
        ).trim();
        let trackingNumber = String(
          await cells[2].evaluate(node => node.textContent),
        ).trim();

        result.push({
          date,
          vendor,
          trackingNumber,
        });
      }
    }

    return result;
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  let deliveryInfos = await getDeliveryInfos();
  await FS.mkdirp(PUBLIC_DIR);
  await FS.writeJSON(DELIVERIES_JSON_PATH, deliveryInfos, {spaces: 2});
}

main().catch(console.error);
