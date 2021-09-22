let fs = require("fs");
let path = require("path");
let temstr = fs.readFileSync(path.join(__dirname, 'index.ejs'))


function render(str, obj) {
    return str.replace(/<%=(\S*?)%>/g, function (match, p1) {
        console.log('match:' + match)
        return obj[arguments[1]]
    })
}

let source = render(temstr.toString(), {
    name: 'isam2016',
    age: 17,
    my: 'money'
})
console.log(source)