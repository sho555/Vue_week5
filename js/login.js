import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';


const app = {
  data(){
    return {
      'apiUrl': "vue3-course-api.hexschool.io",
      'apiPath':'jlhex'
    }
  },
  methods: {
    login() {

      const userData = {
         username : document.querySelector('#username').value,
         password : document.querySelector('#password').value
      }
      //路徑, 資料
      axios.post(`https://${this.apiUrl}/v2/admin/signin`, userData)
        .then((res) =>{
          const {token, expired} = res.data;
          document.cookie = `token = ${token}; expires = ${expired};`;
          window.location = 'products.html';

        })
        .catch((err) => {
          alert('帳密錯誤')
        })

    },
   
  },
}

createApp(app).mount('#app');
