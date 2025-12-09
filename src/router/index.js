import { createRouter, createWebHistory } from 'vue-router'
import AddCustomer from '../views/customer/AddCustomer.vue'
import EditCustomer from '../views/customer/EditCustomer.vue'
import MainContentLayout from '../layouts/MainContentLayout.vue'
import OpportunityLayout from '../views/opportunity/OpportunityLayout.vue'

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
		path: '/opportunity',
		name: 'Opportunity',
		component: OpportunityLayout
	},
	{
		path: '/customer/add',
		name: 'CustomerAdd',
		component: AddCustomer
	},
	{
		path: '/customer/:id',
		name: 'CustomerEdit',
		component: EditCustomer
	}
]
const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router

