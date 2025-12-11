const axios = require("axios").default

class Axios {
  async get(host, options = {}) {
    try {
      const axiosOptions = {
        headers: { ...options.headers },
      }
      // Support responseType for binary data (arraybuffer, blob, etc.)
      if (options.responseType) {
        axiosOptions.responseType = options.responseType
      }
      // Support timeout to prevent hanging requests
      if (options.timeout) {
        axiosOptions.timeout = options.timeout
      }
      const resp = await axios.get(host, axiosOptions)
      return resp.data
    } catch (error) {
      throw error
    }
  }

  async post(host, options) {
    const requestOptions = {
      method: "POST",
      url: host,
      headers: options.headers,
      data: options.data,
    }

    let result = axios
      .request(requestOptions)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        throw error
      })

    return result
  }

  // Create an axios POST request
  async postFormData(url, form) {
    let options = {
      ...form,
    }

    let result = await axios
      .post(url, options.formData, {
        headers: { ...options.headers },
        maxContentLength: process.env.AXIOS_SIZE_FILE_MAX,
        maxBodyLength: process.env.AXIOS_SIZE_FILE_MAX,
      })
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        throw error
      })
    return result
  }

  async put(host, form) {
    let options = {
      ...form,
    }
    try {
      const resp = await axios.put(host, options)
      return resp.data
    } catch (error) {
      throw error
    }
  }

  async patch(host, data, options = {}) {
    try {
      const axiosOptions = {
        headers: { "Content-Type": "application/json", ...options.headers },
      }
      const resp = await axios.patch(host, data, axiosOptions)
      return resp.data
    } catch (error) {
      throw error
    }
  }

  async delete(host, options = {}) {
    try {
      const axiosOptions = {
        headers: { ...options.headers },
      }
      if (options.timeout) {
        axiosOptions.timeout = options.timeout
      }
      const resp = await axios.delete(host, axiosOptions)
      return resp.data
    } catch (error) {
      throw error
    }
  }
}

module.exports = new Axios()
