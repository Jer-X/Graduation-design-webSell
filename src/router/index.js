import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import home from '@/components/home/home';
import order from '@/components/order/order';
import evaluate from '@/components/evaluate/evaluate';
import business from '@/components/business/business';
import cashier from '@/components/cashier/cashier';
import payment from '@/components/payment/payment';
import goods from '@/components/goods/goods';
import ratings from '@/components/ratings/ratings';
import seller from '@/components/seller/seller';
import store from '@/components/store/store';
import pay from '@/components/pay/pay';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'index',
            component: home
        },
        {
            path: '/store',
            name: 'store',
            component: store,
            children: [{
                    path: 'order',
                    name: 'order',
                    component: order
                },
                {
                    path: 'evaluate',
                    name: 'evaluate',
                    component: evaluate
                },
                {
                    path: 'business',
                    name: 'business',
                    component: business
                },
                {
                    path: 'cashier',
                    name: 'cashier',
                    component: cashier
                }
            ]
        },
        {
            name: 'pay',
            path: '/pay',
            component: pay
        },
        {
            name: 'payment',
            path: '/payment',
            component: payment
        }
    ],
    linkActiveClass: 'active'
});