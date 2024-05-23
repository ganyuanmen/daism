export async function client(endpoint, { body, ...customConfig } = {}) {
    const headers = { 'Content-Type': 'application/json' }
    const config = {
      method: body ? 'POST' : 'GET',
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    }
    if (body) {
      config.body = JSON.stringify(body)
    }
    
    try {
      const response = await window.fetch(endpoint, config)
      if(response.status!==200){
        return {
          status: response.status,
          data:{},
          headers: response.headers,
          url: response.url,
          statusText:response.statusText
        }
      }
    
      return {
        status: response.status,
        data:await response.json(),
        headers: response.headers,
        url: response.url,
      }
    
    } catch (err) {
      return {
        status: 404,
        data:{},
        headers: response.headers,
        url: response.url,
        statusText:'fetch error:'+err.toString()
      }
    }
  }
  
  client.get = function (endpoint, method) {
    return client(endpoint, { headers:{method}, method: 'GET' })
  }
  
  client.post = function (endpoint,method,body={}) {
    return client(endpoint, { headers:{method}, body })
  }


  