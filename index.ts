import * as request from './getContent'
import { parseDocument } from 'htmlparser2'
import { Element, Node } from 'domhandler'

type Store = [string[], string[]]

const getAssetName = (str: string) => {
    const splitStr = str.split('/')
    return splitStr[splitStr.length - 1]
}

const traverseChildren = (
    elements: Element[],
    store: Store,
    url: string,
    depth: number
) => {
    console.log('depth', depth)
    let tempChildArr: Node[] = []

    for (const el of elements) {
        const { name, attribs, children } = el
        let src, href
        if (attribs) {
            ({ src, href } = attribs)
        }

        if (name === 'a' && href && href.includes('http')) {
            store[0].push(href)
        }

        if (name === 'img' || name === 'script') {
            if (src) store[1].push(getAssetName(src))
            if (href) store[1].push(getAssetName(href))
        }

        if (children && children.length) {
            tempChildArr = [...children]
        }
    }

    depth++
    if (tempChildArr.length) traverseChildren(<Element[]>tempChildArr, store, url, depth)
}

const getPageBody = async (url: string): Promise<Store> => {
    const store: Store = [[], []]

    let res
    try {
        res = await request.get(url)
    } catch (err) {
        console.log('err', err)
    }

    if (!res) throw new Error('failed to fetch url')

    const pageBody = res.text
    const doc = parseDocument(pageBody)
    const children = doc.childNodes
    const depth = 0
    traverseChildren(<Element[]>children, store, url, depth)
    console.log('store - links:', store[0])
    console.log('store - assets', store[1])
    return store
}

export { getPageBody }
