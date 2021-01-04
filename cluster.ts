import cluster from 'cluster'
import * as os from 'os'
const numCPUs = os.cpus().length

interface Message { type: string; id?: string, data?: string }

if (cluster.isMaster) {
    masterProcess()
} else {
    childProcess()
}

function masterProcess() {
    console.log(`Master ${process.pid} is running`)

    for (let i = 0; i < numCPUs; i++) {
        console.log(`Forking process number ${i}...`)
        cluster.fork()
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online')
    })

    const { workers } = cluster

    for (const id in workers) {
        if (workers.hasOwnProperty(id)) {
            const worker = workers[id] ? workers[id] : null
            if (worker) {
                function messageHandler(msg: Message) {
                    if (msg.type && msg.type === 'heartbeat') {
                        console.log('beat from id:', msg.id)
                    }
                    if (worker) worker.send({ type: 'hello', data: 'Message received by Master...' })
                }

                worker.on('message', messageHandler)
            }
        }
    }

    // cluster.on('exit', function(worker, code, signal) {
    //     console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    //     console.log('Starting a new worker');
    //     cluster.fork();
    // });
}

function childProcess() {
    console.log(`Worker ${process.pid} started`)

    function sendHeartbeat () {
        if (process.send)
            process.send({
                type: 'heartbeat',
                id: process.pid
            })
    }

    setInterval(sendHeartbeat, process.pid / 100)

    process.on('message', (msg: Message) => {
        if (msg.type === 'hello') console.log(`${process.pid}:`, msg.data)
    });
}
