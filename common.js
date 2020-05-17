(() => {

  console.log('it is working');

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

    select: (query, all) => document[all ? 'querySelectorAll' : 'querySelector'](query),

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
      for( let i = 0, len = pairs.length; i < len; i++ ) {
        let pair = pairs[i].split('=');
        output[pair[0]] = pair[1];
      }
      return output;
    },

    getElementIndex: element => {
      let { previousSibling } = element;
      let count = 0;
      while( previousSibling ) {
        count++;
        previousSibling = previousSibling.previousSibling;
      }
      return count;
    },

    noop: () => {},

    // TODO - make me a HTTP interface > 
    HTTP: {
      get: (uri, onSuccess, onFail) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = () => {
          if( req.readyState === 4 ) {
            if( req.status === 200 ) {
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
    }

  };

})();
