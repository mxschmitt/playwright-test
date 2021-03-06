/**
 * Copyright Microsoft Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {registerFixture} from 'playwright-runner';
import {saveVideo} from 'playwright-video';
import path from 'path';

registerFixture('page', async ({context}, runTest, info) => {
  const page = await context.newPage();
  const {test, config} = info;
  const relativePath = path.relative(config.testDir, test.file).replace(/\.spec\.[jt]s/, '');
  const sanitizedTitle = test.title.replace(/[^\w\d]+/g, '_');
  const assetPath = path.join(config.outputDir, relativePath, sanitizedTitle) + '-recording.mp4';

  const recording = await saveVideo(page, assetPath);
  await runTest(page);
  await recording.stop();
  await page.close();
});

it('is a basic test with the page', async ({page}) => {
  await page.goto('https://github.com');
  await page.type('input[name="q"]', 'Playwright');
  await page.press('input[name="q"]', 'Enter');
  await page.click('.repo-list-item:nth-child(1) a');
});