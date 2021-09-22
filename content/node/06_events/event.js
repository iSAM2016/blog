/**
 * EventEmitter 实现
 */
function EventEmitter() {
  this._events = {};
}
// {失恋:[fn,fn]}
EventEmitter.prototype.on = function(eventName, callback) {
  /**重点 */
  if (!this._events) this._events = Object.create(null);
  if (this._events[eventName]) {
    this._events[eventName].push(callback);
  } else {
    this._events[eventName] = [callback];
  }
};
EventEmitter.prototype.emit = function(eventName) {
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => {
      fn();
    });
  }
};

module.exports = EventEmitter;

/** 分割新 */

let EventEmitter = require("events");
let util = require("util");

function Girl(params) {}
util.inherits(Girl, EventEmitter);
