/*
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

'use strict';

const should = require('should');
const path = require('path');
const { Configuration, Web3jService, CompileService } = require('../packages/api');

const config = new Configuration(path.join(__dirname, './conf/config.json'));
const contractPath = path.join(__dirname, './contracts/v4/HelloWorld.sol');
const compileService = new CompileService(config);
const web3jService = new Web3jService(config);
let contractClass = compileService.compile(contractPath);
let helloWorld = contractClass.newInstance();

describe('test for hello world', function () {
    this.beforeAll(() => {
        return helloWorld.$deploy(web3jService);
    });

    it('duplicate deploy', async () => {
        try {
            let _ = await helloWorld.$deploy(web3jService);
            should.equal(true, false);
        } catch (_) { }
    });

    it('get', async () => {
        let ret = await helloWorld.get();
        should.exist(ret);
        should.equal(ret[0], 'Hello, World!');
    });

    it('set', async () => {
        await helloWorld.set('こんにちわ！');

        let ret = await helloWorld.get();
        should.exist(ret);
        should.equal(ret[0], 'こんにちわ！');
    });
});
