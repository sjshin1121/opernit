const listeners = {};

export default class BaseClass {
  addEvent (type, listener, isGlobal = true) {
    listeners[type] = listeners[type] || [];
    if(listeners[type].indexOf(listener) === -1) {
      listeners[type].push({
        f: listener,
        ctx: this,
        isGlobal: isGlobal
      });
    }
  }
  dispatch (type) {
    if(!listeners[type]) return;
    const evt = listeners[type], params = Array.prototype.slice.call(arguments, 1);
    let i = evt.length;


    while (i--) {
      if (evt[i].ctx === this || evt[i].isGlobal)
        evt[i].f.apply(evt[i].ctx, params);
    }
  }
}