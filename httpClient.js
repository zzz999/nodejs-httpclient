var express = require('express');
var http = require('http');
var url=require('url')
var qs = require('querystring');
var web = require('./../../routes/web');
//http请求的服务器
var httpServer=web.httpServer;
var httpClient=function(path,op){
    var _options=url.parse(httpServer+path,true);
    _options.params=op.params||{};
    var content = qs.stringify(_options.params);
    var options = {
        hostname: _options.hostname,
        port: _options.port,
        path: _options.path+(m=="GET"?"?"+content:""),
        method: op.method||"GET"
    };
    if(op.method=="GET"){
        _options.path+"?"+content;
    }else{
        options.headers= {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Length':content.length
        }
    }
    var _data = '';
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            _data += chunk;
        });
        res.on('end', function () {
            if(!!op.success)op.success.apply(this,[_data]);
            return _data;
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    if(m=="POST") req.write(content);
    req.end();
}

var _post = function(path,params,fun){
    if(!fun) fun=params;
    httpClient(path,{
        method:"POST",
        params:params,
        success:fun
    });
}

var _get = function(path,params,fun){
    if(!fun) fun=params;
    httpClient(path,{
        method:"GET",
        params:params,
        success:fun
    });
}
exports.httpClient=httpClient;
exports.get=_get;
exports.post=_post;
//后台项目地址
exports.httpServer =httpServer;