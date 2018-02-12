import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
_.each({jQuery: $, $, _, moment}, (v, k) => window[k] = v);

import 'bootstrap'; // load all scripts
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

// import 'assets/fonts';
