// import { expect } from 'chai'
// import { createSandbox } from 'sinon'
// const sandbox = createSandbox()

// import * as request from "../getContent"
import { getSiteMap } from "../index"

describe('e2e index.ts', function () {
    this.timeout(30000)
    // let getStub: SinonStub
    before(function () {
        // getStub = sandbox.stub(request, 'get')
    })

    afterEach(function () {
        // getStub.reset()
    })

    after(function () {
        // sandbox.restore()
    })

    it('should...', async function () {
        // getStub.onFirstCall().resolves({
        //     text: '<html><head><div></div><div></div></head><body><div><a href="http://www.hurricanecommerce.com/something" /></div></body></html>'
        // })
        // getStub.onSecondCall().resolves({
        //     text: '<html><body><div><script src="../jjj.js" /><a href="http://test2.com" /></div></body></html>'
        // })
        // getStub.onThirdCall().resolves({
        //     text: '<html><body><div></div></body></html>'
        // })
        const res = await getSiteMap()
        // expect(res).to.not.be.undefined
        console.log('res from test', res)
    })
})
