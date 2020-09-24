import assert = require('assert')
import Cookie from '../src/cookie'


suite('cookie', () => {})


test('serialize', () => {
  assert.equal('a=5; b=hello; ', Cookie.serialize({a: 5, b: 'hello'}))
  assert.equal('', Cookie.serialize({}))
  assert.equal('a=5; ', Cookie.serialize({a: 5, b: undefined}))
  // Shouldn't replace dashes, etc., with html encoded characters
  assert.equal('csm-hit=AHX25TWCSQG4JBMJWGED+s-M8MW8TQ1HRYMHWDXD8J1|1481044401071; ', Cookie.serialize({'csm-hit': 'AHX25TWCSQG4JBMJWGED+s-M8MW8TQ1HRYMHWDXD8J1|1481044401071'}))
})


test('parse', () => {
  assert.deepEqual({a: '5', b: 'hello'}, Cookie.parse('a=5; b=hello; '))
  assert.deepEqual({}, Cookie.parse(''))
  assert.deepEqual({}, Cookie.parse(undefined))
  assert.deepEqual({
    'NID': '96=rqWTIA5Qo7ynYeM6EFYSFO_tZ-Or8ZoAcBI2tFEf7stZCfCpEACdj6Lbh9zHyyNLTS3BD_yfRt496cGw8-5A2F4Sua_LInc1k8mHEtrlj84UROLBxdMugU0HrWdSnRVY',
    'domain': '.google.ca',
    'expires': 'Thu, 10-Aug-2017 03:43:13 GMT',
    'path': '/'
  }, Cookie.parse('NID=96=rqWTIA5Qo7ynYeM6EFYSFO_tZ-Or8ZoAcBI2tFEf7stZCfCpEACdj6Lbh9zHyyNLTS3BD_yfRt496cGw8-5A2F4Sua_LInc1k8mHEtrlj84UROLBxdMugU0HrWdSnRVY; expires=Thu, 10-Aug-2017 03:43:13 GMT; path=/; domain=.google.ca; HttpOnly'))
})


test('assign', () => {
  assert.deepEqual('a=5; b=hello; ', Cookie.assign('a=5;', 'b', 'hello'))
  assert.deepEqual('a=5; b=bye; ', Cookie.assign('a=5; b=hello', 'b', 'bye'))
  assert.deepEqual('a=5; ', Cookie.assign('a=5; b=hello', 'b', undefined))
})


test('parseSetString', () => {
  assert.deepEqual('UserPref=-', Cookie.parseSetString('UserPref=-; path=/; domain=.www.amazon.es; expires=Mon, 14-Feb-2005 23:10:43 GMT'))
})

test('isExpired ===  true', () => {
  assert.equal(true, Cookie.isExpired('UserPref=-; path=/; domain=.www.amazon.es; expires=Mon, 14-Feb-2005 23:10:43 GMT'))
})

test('isExpired ===  false', () => {
  assert.equal(false, Cookie.isExpired('UserPref=-; path=/; domain=.www.amazon.es; expires=Mon, 14-Feb-2200 23:10:43 GMT'))
})