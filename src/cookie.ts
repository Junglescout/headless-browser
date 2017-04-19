function serialize(object) {
  let str = ''

  for (let key in object) {
    const val = object[key]
    if (typeof val != 'undefined') {
      str += `${key}=${val}; `
    }
  }

  return str
}


function parse(string: string) {
  if (!string) {
    return {}
  }

  let cookies = {}

  for (let pair of string.split(';')) {
    const parts = pair.trim().split('=')
    const name = parts[0]
    const value = parts.slice(1).join('=')
    if (name && value != '') {
      cookies[name] = value
    }
  }

  return cookies
}


function assign(string, key, value) {
  const object = parse(string)
  object[key] = value
  return serialize(object)
}


function parseSetString(string: string) {
  return string.split(';')[0]
}


export default { serialize, parse, assign, parseSetString }