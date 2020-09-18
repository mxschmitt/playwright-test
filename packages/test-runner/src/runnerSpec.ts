/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { installTransform } from './transform';
import { RunnerSuite, RunnerTest } from './runnerTest';
import { extractLocation } from './util';
import { setImplementation } from './spec';

export function runnerSpec(suite: RunnerSuite): () => void {
  const suites = [suite];

  const it = (spec: 'default' | 'skip' | 'only', title: string, modifierFn: any | Function, fn?: Function) => {
    const suite = suites[0];
    fn = fn || modifierFn;
    const test = new RunnerTest(title, fn, suite);
    test.file = suite.file;
    test.location = extractLocation(new Error());
    if (spec === 'only')
      test._only = true;
    return test;
  };

  const describe = (spec: 'describe' | 'skip' | 'only', title: string, modifierFn: (suite: RunnerSuite, parameters: any) => void | Function, fn?: Function) => {
    fn = fn || modifierFn;
    const child = new RunnerSuite(title, suites[0]);
    child.file = suite.file;
    child.location = extractLocation(new Error());
    if (spec === 'only')
      child._only = true;
    suites.unshift(child);
    fn();
    suites.shift();
  };

  setImplementation({
    it,
    describe,
    beforeEach: () => {},
    afterEach: () => {},
    beforeAll: () => {},
    afterAll: () => {},
  });

  return installTransform();
}
