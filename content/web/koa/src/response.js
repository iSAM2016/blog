let response = {
    get body() {
        return this._body;
    },
    set body(value) {
        this._body = value;
    }
};
response.body;
module.exports = response;
