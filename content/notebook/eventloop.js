setTimeout(function () {
  console.log('setTimeout1');
  Promise.resolve().then(() => {
    console.log('then1');
  });
}, 0);
Promise.resolve().then(() => {
  console.log('then2');
  Promise.resolve().then(() => {
    console.log('then3');
  });
  setTimeout(function () {
    console.log('setTimeout2');
  }, 0);
});
// then2 then3 setTimeout1  then1 setTimeout2
//  先执行 执行栈中的内容  执行后 清空微任务
//  取一个宏任务 再去清空微任务 ，再去取宏任务

setTimeout(function () {
  Promise.resolve().then(() => console.log("then"));
}, 0);
setTimeout(function () {
  console.log(1);
}, 0);
setTimeout(function () {
  console.log(2);
}, 0);
setTimeout(function () {
  console.log(3);
}, 0);