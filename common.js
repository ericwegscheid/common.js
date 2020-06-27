// TODO - unit tests

(() => {

  window.__ = window.__ || {

    _return: (param, fn, _return) => {
      const result = fn();
      return _return
        ? result
          ? param
          : void 0
        : result;
    },

    isArr: (param, _return) =>
      __._return(
        param,
        () => Array.isArray(param),
        _return
      ),

    isFn: (param, _return) =>
      __._return(
        param,
        () => typeof param == 'function',
        _return
      ),

    isStr: (param, _return) =>
      __._return(
        param,
        () => typeof param == 'string',
        _return
      ),

    isNum: (param, _return) =>
      __._return(
        param,
        () => typeof param == 'number',
        _return
      ),

    isBool: (param, _return) =>
      __._return(
        param,
        () => typeof param == 'boolean',
        _return
      ),

    isObj: (param, _return) =>
      __._return(
        param,
        () => param &&
          !__.isArr(param) &&
          !__.isFn(param) &&
          !__.isStr(param) &&
          !__.isNum(param) &&
          !__.isBool(param),
        _return
      ),

    isNill: (param, _return) =>
      __._return(
        param,
        () => param === void 0 || param === null,
        _return
      ),

    isSet: param => param !== void 0,

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

    capitalize: str => str[0].toUpperCase() + str.slice(1),

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

    noop: () => {},

    cache: (key, value) => localStorage[value === void 0 ? 'getItem' : 'setItem'](key, value),

    QUEUE: {
      _q: [],
      timeout: 1000,
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
          }, __.QUEUE.timeout);
        }
      },
      run: () => {
        __.QUEUE.pop(true);
        return __.QUEUE;
      }
    },

    // TODO - make me a HTTP interface > 
    HTTP: {
      get: (uri, onSuccess, onFail) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = () => {
          if (req.readyState === 4) {
            if (req.status === 200) {
              (__.isFn(onSuccess, true) || __.noop)(req);
            } else {
              (__.isFn(onFail, true) || __.noop)(req);
            }
          }
        }
        req.open('Get', uri);
        req.send();
      },
      post: () => console.warn('HTTP.post not supported yet'),
      put: () => console.warn('HTTP.put not supported yet'),
      delete: () => console.warn('HTTP.delete supported yet')
    },

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

})();
