import { Readable } from 'stream';

const readStream = new Readable();

readStream.push('ABCDEFGHIJKLM');
readStream.push('NOPQRSTUVWXYZ');
readStream.push(null); // No more data

readStream.on('data', (data) => {
    readStream.pause()
    console.log(data.toString())
    setTimeout(() => readStream.resume(), 2000)
})

readStream.on('end', () => {
    console.log('no further data...')
})
