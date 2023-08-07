const __ = require('./common.js');

test('_return returns same value as 2nd param function', () => {
  expect(__._return(1, () => true)).toBe(true);
  expect(__._return(1, () => false)).toBe(false);
  expect(__._return(1, () => 1)).toBe(1);
  expect(__._return(1, () => 'test')).toBe('test');
  expect(__._return(1, () => 0)).toBe(0);
  expect(__._return(1, () => null)).toBe(null);
  expect(__._return(1, () => [])).toStrictEqual([]);
  const arr = [];
  expect(__._return(1, () => arr)).toStrictEqual(arr);
  const obj = {};
  expect(__._return(1, () => obj)).toStrictEqual(obj);
});

test('_isArr returns false is param is not an array', () => {
  expect(__.isArr({})).toBe(false);
  expect(__.isArr('test')).toBe(false);
  expect(__.isArr(null)).toBe(false);
  expect(__.isArr(1)).toBe(false);
  expect(__.isArr(false)).toBe(false);
});
