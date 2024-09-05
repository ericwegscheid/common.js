//                                                    _     
//    _________  ____ ___  ____ ___  ____  ____      (_)____
//   / ___/ __ \/ __ `__ \/ __ `__ \/ __ \/ __ \    / / ___/
//  / /__/ /_/ / / / / / / / / / / / /_/ / / / /   / (__  ) 
//  \___/\____/_/ /_/ /_/_/ /_/ /_/\____/_/ /_(_)_/ /____/  
//                                             /___/        
//                                                          
////////////////////////////////////////////////////////////

let __ = {};
const common = {

  _isFn: (param) => typeof param === 'function',
  _isArr: (param) => Array.isArray(param),
  _isStr: (param) => typeof param === 'string',
  _isNum: (param) => typeof param === 'number',
  _isBool: (param) => typeof param === 'boolean',
  _isObj: (param) => param && !__.isArr(param) && !__.isFn(param) && !__.isStr(param) && !__.isNum(param) && !__.isBool(param),
  _isNill: (param) => param === void 0 || param === null,

  _return: (param, fn, _return) => {
    const result = __._isFn(fn) ? fn() : null;
    return _return ? __._isFn(fn) && !result ? null : param : result;
  },

  // if falsy return () => {} else param or result
  _noop_it: (param, result, _return) => {
    const output = __._return(param, () => result, _return);
    return !output ? () => {} : output;
  },

  // if falsy return false else param or result
  _false_it: (param, result, _return) => {
    const output = __._return(param, () => result, _return);
    return !output ? false : output;
  },

  // if truthy return true else param or result
  _truth_it: (param, result, _return) => {
    const output = __._return(param, () => result, _return);
    return !!output ? true : output;
  },

  isArr: (param, _return) => __._false_it(param, __._isArr(param), _return),
  isFn: (param, _return) => __[_return ? '_noop_it' : '_false_it'](param, __._isFn(param), _return),
  isStr: (param, _return) => __._false_it(param,__._isStr(param), _return),
  isNum: (param, _return) => __._false_it(param,__._isNum(param), _return),
  isBool: (param, _return) => __._false_it(param,__._isBool(param), _return),
  isObj: (param, _return) => __._false_it(param, __._isObj(param), _return),
  isNill: (param, _return) => __._false_it(param, __._isNill(param), _return),

  isSet: param => param !== void 0,

  noop: () => {},

  capitalize: str => str[0].toUpperCase() + str.slice(1),
  // TODO: titleCase, kebabCase, snakeCase

  QUEUE: {
    _q: [],
    _t: 1000,
    setTimeout: n => {
      __.QUEUE._t = __.isNum(n) ? n : __.QUEUE._t;
      return __.QUEUE;
    },
    push: (input) => {
      if (Array.isArray(input)) {
        for (let statement of input) {
          __.QUEUE._q.push(statement);
        }
      } else if (typeof input === 'string') {
          __.QUEUE._q.push(input);
      } else {
        console.warning('Invalid input, __.QUEUE.push() expects `string | string[]`');
      }
      return __.QUEUE;
    },
    pop: next => {
      if (__.QUEUE._q.length) {
        let t = setTimeout(() => {
          __.isFn(__.QUEUE._q.pop(), true)();
          if (next) {
            __.QUEUE.pop(true);
          }
          clearTimeout(t);
        }, __.QUEUE._t);
      }
    },
    run: () => {
      __.QUEUE.pop(true);
      return __.QUEUE;
    }
  },
};

const browser = {

  query: (query, all) => document[all ? 'querySelectorAll' : 'querySelector'](query),

  copy: str => {
    const el = document.createElement('textarea');
    el.style.opacity = 0;
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  },

  getQueryParams: () => {
    const output = {};
    const pairs = location.search.slice(1).split('&');
    for (let i = 0, len = pairs.length; i < len; i++) {
      let pair = pairs[i].split('=');
      output[pair[0]] = pair[1];
    }
    return output;
  },

  getElementIndex: element => {
    let { previousSibling } = element;
    let count = 0;
    while (previousSibling) {
      count++;
      previousSibling = previousSibling.previousSibling;
    }
    return count;
  },

  cache: (key, value) => localStorage[value === void 0 ? 'getItem' : 'setItem'](key, value),

  EVENTS: {
    getDelegationEventHandlers: (name, e) => {
      let handlers = [];
      for (key of (e.target.attributes.getNamedItem(name).value || '').split(' ')) {
        handlers.push(__.EVENTS.handlers[key]);
      }
      return handlers;
    },
    executeDelegationEventHandlers: (name, e) => {
      for (handler of __.EVENTS.getDelegationEventHandlers(name, e)) {
        __.isFn(handler, true)(e);
      }
    },
    delegationEvents: {
      fnenter: {
        type: 'keypress',
        fn: e => {
          if (e.which !== 13 || !e.target.hasAttribute('fnenter')) { return; }
          __.EVENTS.executeDelegationEventHandlers('fnenter', e);
        }
      },
      fnclick: {
        type: 'click',
        fn: e => {
          if (!e.target.hasAttribute('fnclick')) { return; }
          __.EVENTS.executeDelegationEventHandlers('fnclick', e);
        }
      },
    },
    enableDelegationEvents: (_eventTypes, _element, handlersNS) => {
      let eventTypes = __.isArr(_eventTypes) ? _eventTypes : [_eventTypes];
      Object.assign(__.EVENTS.handlers, handlersNS);
      for (_event of eventTypes) {
        let event = __.EVENTS.delegationEvents[_event];
        if (event) {
          let element = _element instanceof HTMLElement ? _element : document.body;
          element.addEventListener(event.type, event.fn);
        }
      }
    },
    // reserved for storing event handlers
    handlers: {}
  },
};

try {
  // as browser script
  window.__ = __ = {
    ...common,
    ...browser,
  };
} catch(e) {
  // noop
}

try {
  // as node module
  module.exports = __ = {
    ...common,
  };
} catch(e) {
  // noop
}
