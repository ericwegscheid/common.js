# Common JS

Simple JavaScript utility library with zero dependencies.

## Use

Node.js

```javascript
const __ = require('./common.js');
```

Browser

```html
<script src="https://ericwegscheid.github.io/common.js/common.js"></script>
```
```js
// returns single element
const specialElement = __.query('#special-element');
// returns list of elemsnts
const buttons = __.query('button', true);
```

Examples

```javascript
function specialFunction(a, b, c) {
  const arr = __.isArr(a, true) || [];

  for (const item of arr) {
    // ... 
  }

  if (__.isNum(b)) {
    // ...
  }

  // returns noop if false
  __.isFn(c, true)();

  // just returns boolean
  if (__.isFn(c)) {
    // ...  
  }
}
```


## Develop

Run unit tests.

```sh
./test
```


## TODOs

* [ ] - add JSDocs
* [ ] - more unit tests
* [ ] - ...


