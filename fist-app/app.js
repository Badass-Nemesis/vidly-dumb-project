function sayHello(name) {
    console.log('Hello ' + name);
}

sayHello('harshit');

// console.log() // global object
// setTimeout() // also global object
// clearTimeout() // also
// setInterval() // also
// clearInterval() // also

// window.console.log(); // this window object will automatically get prefixed
// window.setTimeout(); // same here
// all belongs to window object, in normal JS

// var message = ''; // not added to global object btw
// window.message

// // but in Node, we have global object instead of window object
// globalThis.setTimeout();

// console.log(global.message);
// it'll not print anything because the message variable is in this module only, and not connected globally.

// var saySomething = function () {
//     // this makes variable global
// }
// if we even global scope the message, then it'll override the saySomething variable in other files. so avoid

console.log(module); // huihuihui, module is not global