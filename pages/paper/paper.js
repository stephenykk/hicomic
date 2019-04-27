import sice from '../../utils/sice';

var questions = require('./data');
var backupQuestions = sice.clone(questions);


Page({

    /**
     * 页面的初始数据
     */
    data: {
        question: {options: []},
        singleIndex: {},
        multiIndex: {},
        judgeIndex: {},
        activeIndex: 0,
        total: questions.length,
        sn: 1
    },

    getChooseValue(ev) {
        var value = ev.detail.value;
        if (Array.isArray(value)) {
            value = value.join('');
        }
        return value;
    },

    onJudgeChoose(ev) {
        this.handleChoose(ev);
    },

    onMultiChoose(ev) {
        this.handleChoose(ev);
    },

    onSingleChoose(ev) {
        this.handleChoose(ev);
    },

    handleChoose(ev) {
        let chooseValue = this.getChooseValue(ev);
        let { question, activeIndex } = this.data;
        question.options.forEach(opt => {
            opt.isChoose = chooseValue.includes(opt.value);
        });
        question.userAnswer = chooseValue;

        questions[activeIndex] = question;

    },

    goto(index) {
        index = Math.min(index, this.data.total - 1)
        index = Math.max(index, 0);

        this.setData({ activeIndex: index, question: questions[index] });
    },

    onInputSn(ev) {
        let value = ev.detail.value;
        // this.setData({activeIndex: value - 1});
        this.data.sn = value;
    },

    onJump() {
        let sn = this.data.sn;
        this.goto(sn - 1);
    },

    goPrev() {
        this.goto(this.data.activeIndex - 1);
    },

    checkCorrect() {
        let { question, activeIndex } = this.data;
        let { userAnswer = '', answer = '' } = question;
        userAnswer = userAnswer.toUpperCase();
        answer = answer.toUpperCase();

        if (!userAnswer) {
            return null
        }


        let correct = userAnswer === answer;

        if (!correct) {
            question.isShowAnswer = true;
            sice.toast('回答有误,请检查');
        } else {
            question.isShowAnswer = false;
        }

        questions[activeIndex] = question;
        this.setData({ question });


        return correct;
    },

    goNext() {
        let correct = this.checkCorrect()
        if (correct == null) {
            correct = true; // 没选择 则直接跳过该题
        }


        if (!correct) {
            setTimeout(() => {

                this.goto(this.data.activeIndex + 1);
            }, 2000);
        } else {
            this.goto(this.data.activeIndex + 1);

        }
    },

    resetQuestions() {
        questions = backupQuestions;
        // let q1 = questions.slice(0, 5);
        // let q2 = questions.filter(q => q.type == 'select' && !q.single).slice(0, 5);
        // let q3 = questions.filter(q => q.type == 'judge').slice(0, 5);

        // // questions = questions.slice(0, 10);
        // questions = q1.concat(q2).concat(q3)

        questions.forEach(question => {
            if (question.type === 'judge') {
                question.options = [{ value: 'Y', text: '正确', id: question.rawIndex }, { value: 'N', text: '错误', id: question.rawIndex }]
            }

            question.options.forEach(opt => {
                if (question.answer.includes(opt.value)) {
                    opt.right = true;
                }
            })
        })

        questions = questions.sort((a, b) => {
            if (a.type === 'select') {
                a = a.single ? 1 : 2
            } else {
                a = 3;
            }

            if (b.type === 'select') {
                b = b.single ? 1 : 2
            } else {
                b = 3;
            }
            return a - b;
        })

        var singleIndex = questions.findIndex(q => q.type === 'select' && q.single)
        var multiIndex = questions.findIndex(q => q.type === 'select' && !q.single);
        var judgeIndex = questions.findIndex(q => q.type === 'judge');
        var question = questions[0];
        var total = questions.length;
        var sn = 1;
        var activeIndex = 0;

        var data = {question, singleIndex, multiIndex, judgeIndex, activeIndex, total, sn}
        this.setData(data);

        console.questions = questions;

    },

    onLoad() {
        this.resetQuestions()
    }
})