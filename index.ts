import * as request from './getContent'
import { parseDocument } from 'htmlparser2'
import { Element } from 'domhandler'
import { URL } from 'url'

type Store = [string[], string[]]

interface Map {
    [index: string]: { links: string[], assets: string[] }
}

const getAssetName = (str: string) => {
    const splitStr = str.split('/')
    return splitStr[splitStr.length - 1]
}

const traverseChildren = async (
    elements: Element[],
    store: Store,
    url: string,
    hostname: string,
    count: number,
    map: Map
) => {
    count++
    console.log('traversing child nodes...')
    for (const el of elements) {
        const { name, attribs, children } = el
        let src, href
        if (attribs) {
            ({ src, href } = attribs)
        }

        if (name === 'a' && href && href.includes('http')) {
            console.log('Found link...', href)
        }

        if (name === 'a' && href && href.includes('http') && href.includes(hostname)) {
            store[0].push(href)
        }

        if (name === 'img' || name === 'script') {
            if (src) store[1].push(getAssetName(src))
            if (href) store[1].push(getAssetName(href))
        }

        if (children && children.length) {
            await traverseChildren(<Element[]>children, store, url, hostname, count, map)
        }
    }

    count--
    if (count === 0) {
        map[url] = { links: store[0], assets: store[1] }
        if (store[0].length) {
            for (const link of store[0]) {
                const url = new URL(link)
                if (!map[link] && url.hostname === hostname) await getPageBody(link, hostname, map)
            }
        }
    }
}

const getPageBody = async (url: string, hostname: string, map: Map): Promise<void> => {
    console.log('getting page body for...', url)
    const store: Store = [[], []]

    let res
    try {
        res = await request.get(url)
    } catch (err) {
        console.log('err', err)
    }

    if (res) {
        const pageBody = res.text
        const doc = parseDocument(pageBody)
        const children = doc.childNodes
        const count = 0
        await traverseChildren(<Element[]>children, store, url, hostname, count, map)
    }
}

const getSiteMap = async (): Promise<Map> => {
    const map: Map = {}
    const urlStr = 'https://cuvva.insure'
    const url = new URL(urlStr)
    const { hostname } = url

    await getPageBody(urlStr, hostname, map)
    console.log('site traversal complete!')
    console.log('results\n', map)
    return map
}

getSiteMap()
