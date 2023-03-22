import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';


const productModal = {
    //當id變動時，取得遠端並呈現Modal
    props: ['id', 'addToCart', 'openModal'],
    data() {
        return {
            modal: {},
            tempProduct: {},
            'apiUrl': "vue3-course-api.hexschool.io",
            'apiPath': 'jlhex',
            qty: 1
        };
    },
    template: '#userProductModal', //樣板字面值，x-tempelate、Vite
    watch: {
        id() {
            const url = `https://${this.apiUrl}/v2/api/${this.apiPath}/product/${this.id}`;
            axios.get(url)
                .then((res) => {
                    this.tempProduct = res.data.product;
                    this.modal.show();
                })
                .catch((err) => {
                    alert("can't get id Data")
                })
        }
    },
    methods: {
        hide() {
            this.modal.hide();

        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal); //監聽DOM，當Modal關閉時，要做其他事情
        this.$refs.modal.addEventListener('hidden.bs.modal', (event) => {
            this.openModal(''); // 改 ID
        });
    }
}
const app = {
    data() {
        return {
            products: [],
            productId: '',
            cart: {},
            loadingItem:'', //存id
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
              },
            'apiUrl': "vue3-course-api.hexschool.io",
            'apiPath': 'jlhex',
            

        };

    },
    components: {   //註冊元件
        productModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods: {
        getData() {
            const url = `https://${this.apiUrl}/v2/api/${this.apiPath}/products/all`;
            axios.get(url)
                .then((res) => {
                    this.products = res.data.products;
                    console.log("產品列表", res.data.products)
                })
                .catch((err) => {
                    console.log("can't get product Data")
                })
        },
        openModal(id) {
            this.productId = id;
        },
        addToCart(product_id, qty = 1) {
            const data = {
                product_id,
                qty
            }
            // const url = `https://${this.apiUrl}/v2/api/${this.apiPath}/cart`;
            axios.post(`https://${this.apiUrl}/v2/api/${this.apiPath}/cart`, {
                    data
                })
                .then((res) => {
                    this.$refs.productModal.hide();
                    this.getCarts();
                })
                .catch((err) => {
                    alert("can't get add Data")
                })
        },
        getCarts() {
            const url = `https://${this.apiUrl}/v2/api/${this.apiPath}/cart`;
            axios.get(url)
                .then((res) => {
                    this.cart = res.data.data
                    console.log("購物車", res.data)
                })
                .catch((err) => {
                    console.log("can't get carts Data")
                })
        },
        updateCartItem(item) { //購物車的id, 產品的id
            // const url = `https://${this.apiUrl}/v2/api/${this.apiPath}/cart/${item.id}`;
            const data = {
                product_id: item.product.id,
                qty: item.qty
            };
            this.loadingItem = item.id;
            axios.put(`https://${this.apiUrl}/v2/api/${this.apiPath}/cart/${item.id}`, {
                    data
                })
                .then((res) => {
                    console.log("更新購物車", res.data)
                    this.getCarts();
                    this.loadingItem = '';

                })
                .catch((err) => {
                    console.log("can't get update Data")
                })
        },
        deleteItem(item) { //購物車的id, 產品的id
            const url = `https://${this.apiUrl}/v2/api/${this.apiPath}/cart/${item.id}`;
            this.loadingItem = item.id;
            axios.delete(url)
                .then((res) => {
                    console.log("刪除購物車", res.data)

                    this.loadingItem = '';
                    this.getCarts();
                })
                .catch((err) => {
                    console.log("can't get delete Data")
                })
        },
        createOrder(){
            const url = `https://${this.apiUrl}/api/${this.apiPath}/order`;
            const order = this.form;
            axios.post(url)
            .then((res) => {
                this.$refs.form/resetForm();    //重置表單
                this.getCarts();
            })
            .catch((err) => {
                console.log("can't get delete Data")
            })
        },
    
    },
 
    mounted() {
        this.getData();
        this.getCarts();
    }
}


// app.component('VForm', VeeValidate.Form);
// app.component('VField', VeeValidate.Field);
// app.component('ErrorMessage', VeeValidate.ErrorMessage);

// app.mount('#app');

createApp(app).mount('#app');