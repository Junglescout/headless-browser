import assert = require('assert')
import HeadlessBrowser from '../src'


suite('index', () => {})


test('set cookies from response', () => {
  const browser = new HeadlessBrowser()

  const cookies = ['NID']

  return browser.get({uri: 'http://www.google.com'}).then(res => {
    assert.equal(200, res.statusCode)
    assert.deepEqual(cookies, Object.keys(browser.getCookies()))
  })
})