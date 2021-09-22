// 代理
module.exports = {
    //ctx.request =>this
    get url() {
        return this.req.url;
    },
    get path() {
        let { pathname } = require('url').parse(this.req.url);
        return pathname;
    },
    get query() {
        let { query } = require('url').parse(this.req.url, true);
        return query;
    },
    get headers() {
        return this.req.headers;
    }
};
