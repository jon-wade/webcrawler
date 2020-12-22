import * as request from 'superagent'
import { parseDocument } from 'htmlparser2'
import { Document, Element } from 'domhandler'

const getAssetName = (str: string) => {
    const splitStr = str.split('/')
    return splitStr[splitStr.length - 1]
}

const traverseChildren = (
    elements: Element[],
    store: [string[], string[]],
    url: string,
    count: number,
    cb: () => void
) => {
    for (const el of elements) {
        count++
        const { name, attribs, children } = el
        let src, href
        if (attribs) {
            ({ src, href } = attribs)
        }

        if (
            name === 'a' &&
            href &&
            href.includes('http')
        ) {
            store[0].push(href)
        }

        if (name === 'img' || name === 'script') {
            if (src) store[1].push(getAssetName(src))
            if (href) store[1].push(getAssetName(href))
        }

        if (children) {
            traverseChildren(<Element[]>children, store, url, count, cb)
            // this should be 1 once all the children have been successfully traversed
            if (count === 1) cb()
        } else {
            count--
        }
    }
}

const cb = () => {
    console.log('finished')
}

const extractData = (
    doc: Document,
    store: [string[], string[]],
    url: string
) => {
    const children = doc.childNodes
    const count = 0
    traverseChildren(<Element[]>children, store, url, count, cb)
}

const getPageBody = (url: string): void => {
    const store: [string[], string[]] = [[], []]
    request
        .get(url)
        .then((res) => {
            const pageBody = res.text
            const doc = parseDocument(pageBody)
            extractData(doc, store, url)
            console.log('store - links:', store[0])
            console.log('store - assets', store[1])
        })
        .catch((err) => {
            console.log('err', err)
        })
}

export default getPageBody('https://bbc.co.uk')
