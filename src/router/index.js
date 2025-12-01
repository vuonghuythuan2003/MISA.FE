import { createRouter, createWebHistory } from 'vue-router'
import AddCustomer from '../views/customer/AddCustomer.vue'
import EditCustomer from '../views/customer/EditCustomer.vue'
import MainContentLayout from '../layouts/MainContentLayout.vue'

const routes = [
	{
		path: '/',
		redirect: '/customer'
	},
	{
		path: '/customer',
		name: 'Customer',
		component: MainContentLayout
	},
	{
		path: '/customer/add',
		name: 'CustomerAdd',
		component: AddCustomer
	},
    {
        path: '/customer/edit',
		name: 'CustomerEdit',
		component: EditCustomer
    }
]
const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router

