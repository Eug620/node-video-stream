const fs = require('fs')
const http = require('http');
const {stat} = require('fs').promises;
const videoPath = './video/dst.mp4'

http.createServer(async (req,res)=>{
    if(req.url === '/'){
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end(
            `<video src="/video" width="500" controls="controls"></video>`
        )
    } else if (req.url === '/video') {
        let range = req.headers['range']
        if(range) {
            console.log('range')
            console.log(range)
            let stats =  await stat(videoPath)
            console.log('stats')
            console.log(stats.size)
            let r = range.match(/=(\d+)-(\d+)?/)
            console.log('r');
            console.log(r[1],r[2]);
            let start = parseInt(r[1],10)
            let end = r[2]? parseInt(r[2],10):start+1024*1024
            if(end>stats.size-1) end = stats.size-1
            let head = {
                'Content-Type':'video/mp4',
                'Content-Range':`bytes ${start} - ${end} / ${stats.size}`,
                'Content-Length': end - start+1,
                'Accept-Ranges':'bytes'
            }
            res.writeHead(206,head)
            fs.createReadStream(videoPath,{start:start,end:end}).pipe(res)
        } else {
            console.log('初次进入');
            fs.createReadStream(videoPath).pipe(res)
        }
    }
}).listen(3000,() => {
    console.log('3000 >>>>>>>>>>>>>>>>');
})