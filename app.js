var http = require('http');
var https = require('https');
var fs = require('fs');
var url=require('url');
var mine=require('./mine').types;
var path=require('path');

 
var options = {//生成的证书
    key: fs.readFileSync('./cert/server.key'),
    cert: fs.readFileSync('./cert/server.crt')
};

var server = function(request, response){
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join("webapp", pathname);    //这里设置自己的文件名称;

    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}

function httpCallBack(request, response) {
    server(request, response)
}
function httpsCallBack(request, response) {    
    server(request, response)
}

http.createServer(httpCallBack).listen(9091);
https.createServer(options, httpsCallBack).listen(9090);

