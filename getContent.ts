import * as request from "superagent";

const get = async (url: string): Promise<request.Response | undefined> => {
    let res
    try {
        res = await request.get(url)
    } catch (err) {
        console.log('err', err)
    }

    return res
}

export { get }
