//#region Import Vue
import Vue from 'vue';
//#endregion

//#region Import Axios
import axios from 'axios'

Vue.prototype.$axios = axios
//#endregion

//#region Components
import app from './app';
import madeBy from './pages/made-by';
import home from './pages/home';
import lobby from './pages/lobby';
import list from './pages/lobby/list';
import create from './pages/lobby/create';
import stats from './pages/lobby/stats';
import detail from './pages/lobby/detail';

Vue.component('made-by', madeBy);
//#endregion

//#region Vue Router
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: home
    },
    {
      path: '/lobby',
      component: lobby,
      children: [
        {
          path: '/:id',
          component: list
        },
        {
          path: '/:id/create',
          component: create
        },
        {
          path: '/:id/stats',
          component: stats
        },
        {
          path: '/:id/:detail',
          component: detail
        }
      ]
    }
  ]
})
//#endregion

//#region Bootstrap, Jquery and IconsPlugin
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

window.$ = require("jquery");
window.JQuery = require("jquery");

Vue.use(IconsPlugin);
//#endregion

//#region Custom SCSS
import './assets/style.scss'
//#endregion

//#region Import JSON Files
import content from "./contents.json";
//#endregion

//#region Global Variables
Vue.prototype.$content = content;
Vue.prototype.$api = "https://lig123.firebaseio.com/id/";
//#endregion

//#region Root Instance
const myVue = new Vue({
  el: '#app',
  router,
  render: h => h(app)
})
//#endregion
