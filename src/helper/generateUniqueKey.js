function* generateUniqueId() {
  let i = 0
  while (true) {
    yield Date.now().toString(36) + Math.random().toString(36).substring(2, 10) + i.toString() + Math.random().toString(36).substring(2, 10) + (i * Math.random()).toString(36)
    i++
  }
}

module.exports = generateUniqueId