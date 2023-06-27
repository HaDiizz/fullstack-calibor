export const nodejs = `const axios = require("axios");
const options = {
    method: 'GET',
    url: 'https://calibor-server.onrender.com/api/schedule',
    params: {
      email: 'Your Email',
    },
  };
  
axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});`

export const python = `import requests
url = 'https://calibor-server.onrender.com/api/schedule'
payload = {
    'email': 'Your Email',
}
response = requests.get(url, json=payload)
if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f'Request failed with status code {response.status_code}')`