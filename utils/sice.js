import util from './util';
import wxExtend from './wx-extend';
import nav from './nav';
import date from './date';



export default {
	...date,
    ...wxExtend,
    ...nav,
    ...util
}