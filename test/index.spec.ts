import { expect } from 'chai'
import { createSandbox, SinonStub } from 'sinon'
const sandbox = createSandbox()

import * as request from "../getContent"
import { getPageBody } from "../index"

describe('unit index.ts', function () {
    this.timeout(10000)
    let getStub: SinonStub
    before(function () {
        getStub = sandbox.stub(request, 'get')
    })

    afterEach(function () {
        getStub.reset()
    })

    after(function () {
        sandbox.restore()
    })

    it('should...', async function () {
        getStub.resolves({
            text: '<html><head></head><body><div class="one"></div></body></html>'
        })
        const res = await getPageBody('https://www.hurricanecommerce.com')
        expect(res).to.not.be.undefined
        console.log('res', res)
    })
})
