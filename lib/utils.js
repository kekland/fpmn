module.exports.awaitForMilliseconds = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}