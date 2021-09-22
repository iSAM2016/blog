let trem = setTimeout(() => {
    console.log(1)
}, 3000)
async function read() {
    let template = await trem;
    console.log('async')
}

read();
class A {
    constructor(a) {
        this.a = a;
    }
    getA() {
        console.log(a)
    }
}

class B extends A {
    constructor(b) {
        super()
        this.b = b;
    }
}