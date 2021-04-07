function* generateUniqueId() {
  let i = 0
  while (true) {
    yield Date.now().toString(36) + Math.random().toString(36).substring(2, 8) + i.toString()
    i++
  }
}

module.exports = generateUniqueId