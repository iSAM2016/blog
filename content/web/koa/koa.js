let http = require('http');

//  实现中间件
function Koa() {
    function app(req, res) {
        index = 0;
        let dispatch = () => {
            let ctx = 1;
            let route = app.middleware[index++];
            console.log(route);
            if (index > app.middleware.length + 1) {
                return false;
            }
            return route(ctx, dispatch);
        };
        dispatch(index);
    }
    app.middleware = [];
    app.use = function(fn) {
        app.middleware.push(fn);
    };
    app.listen = function(...args) {
        let client = http.createServer(app);
        client.listen(...args);
    };
    return app;
}

module.exports = Koa;
