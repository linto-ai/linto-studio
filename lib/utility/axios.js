const debug = require('debug')('linto:components:utility:axios')
const axios = require('axios').default

class Axios {
  async get(url, options = { headers: {} }) {
    try {
      const resp = await axios.get(url, { headers: { ...options.headers } })
      return resp.data
    } catch (error) {
      throw error
    }
  }

  async post(host, options) {
    const requestOptions = {
      method: 'POST',
      url: host,
      headers: options.headers,
      data: options.data
    }

    let result = axios.request(requestOptions).then(function (response) {
      return response.data
    }).catch(function (error) {
      throw error
    })

    return result
  }

  // Create an axios POST request
  async postFormData(url, form) {
    let options = {
      ...form
    }

    let result = await axios.post(url,
      options.formData,
      {
        headers: { ...options.headers },
        maxContentLength: process.env.AXIOS_SIZE_FILE_MAX,
        maxBodyLength: process.env.AXIOS_SIZE_FILE_MAX,
      }).then(function (response) {
        return response.data
      }).catch(function (error) {
        throw error
      })
    return result
  }


  async put(url, form) {
    let options = {
      ...form
    }
    try {
      const resp = await axios.put(url, options)
      return resp.data
    } catch (error) {
      throw error
    }
  }
}

module.exports = new Axios()