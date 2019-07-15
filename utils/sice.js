import util from './util';
import wxExtend from './wx-extend';
import nav from './nav';
import date from './date';



export default {
    get curpage() {
        let pages = getCurrentPages();
        return pages[pages.length - 1]
    },
    set curpage(v) {
        console.log(v);
    },
    ...date,
    ...wxExtend,
    ...nav,
    ...util
}