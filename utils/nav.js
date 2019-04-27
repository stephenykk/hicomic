import wxExtend from './wx-extend';

export default {
    goPaper() {
        wxExtend.navigateTo('/pages/paper/paper');
    },
    goEnroll() {
        wxExtend.navigateTo('/pages/tools/enroll/enroll')
    },
    goLogs() {
        wxExtend.navigateTo('/pages/logs/logs');
    },
}