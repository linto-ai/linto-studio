const request = require('request')

request(`http://localhost`, error => {
  if (error) {
    throw error
  }
})
