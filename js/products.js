import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';
import pagination from './pagination.js'

let productModal = {};
let delProductModal = {};

const app = {
  data() {
    return {
      products: [],
      product_detail: {},
      'apiUrl': "vue3-course-api.hexschool.io",
      'apiPath': 'jlhex',
      newProd: false,
      tempProduct: {
        imagesUrl: []
      },
      page: {}
    };

  },
  methods: {
    check() {

      axios.post(`https://${this.apiUrl}/v2/api/user/check`)
        .then(res => {
          this.getData();

        })
        .catch((err) => {
          window.location = 'login.html';
          alert("尚未登入");
        });
    },
    getData(page = 1) { //取得產品資料 預設參數
      const url = `https://${this.apiUrl}/v2/api/${this.apiPath}/admin/products/?page= ${page}`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
          this.page = res.data.pagination;
          console.log(this.page)

        })
        .catch((err) => {
          alert("can't getData")
        })
    },
    updateProducts() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      if (!this.newProd) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url, { data: this.tempProduct }).then((res) => {
        alert(res.data.message);
        productModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.data.message);
      })

    },
    openModal(newProd, product){
      if(newProd == 'new'){
        this.tempProduct = {
          imagesUrl: []
        };
        this.newProd = true;
        productModal.show();
      } else if (newProd == 'edit'){
        this.tempProduct = { ...product };
        this.newProd = false;
        productModal.show();
      } else if (newProd == 'delete') {
        this.tempProduct = { ...product };
        delProductModal.show();
      }
    },
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((res) =>{
        alert(res.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    createImages(){
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.pust('');
    }
  },
  components: {
    pagination
  },

  mounted() {
      // bootstrap 方法
    // 1.初始化 new
    // 2.呼叫方法 show / hide
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    })
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    //defaults: 每次都會帶入
    this.check();
  }
}

createApp(app).mount('#app');