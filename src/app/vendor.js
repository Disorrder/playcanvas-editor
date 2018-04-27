import Vue from 'vue';
import VueRouter from 'vue-router';

import $ from 'jquery';
import _ from 'lodash';
// import moment from 'moment';
_.each({jQuery: $, $, _}, (v, k) => window[k] = v);

// import 'bootstrap'; // load all scripts
// import 'bootstrap/dist/css/bootstrap.css';
// import 'font-awesome/css/font-awesome.css';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
Vue.use(Vuetify);
