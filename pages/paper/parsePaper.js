var fs = require('fs');
var path = require('path');

var dataPath = path.resolve(__dirname, './data.txt');
var outDataPath = path.resolve(__dirname, './data.js');

function lineLog(label, value) {
	console.log(`\n\n\n------------- ${label} below -------------`)
	console.log(value);
}

function output(data) {
	if(typeof data === 'object') {
		data = JSON.stringify(data, null, 2)
	}

	fs.writeFileSync(outDataPath, `module.exports = ${data}`, 'utf8');
}

function getQuestions() {
	var con = fs.readFileSync(dataPath, 'utf8');
	var lines = con.split(/\n/);
	lines = lines.filter(line => {
		line = line.replace(/^\s*|\s*$/, '');
		return !!line;
	})

	var questions = [];
	var titleRe = /^(\d+\s*\.[\s\S]*?)$/;
	var lastTitleIdx = null;

	var singleSelectRe = /^\s*?单选题\s*?$/;
	var singleSelectIndex = 0;
	var multiSelectRe = /^\s*?多选题\s*?$/;
	var multiSelectIndex = Infinity;

	var beforeSingles = []

	lines.forEach((line, i) => {
		var last = i === lines.length - 1;
		if(last)  {
			i = i + 1;
		}

		if(singleSelectRe.test(line)) {
			singleSelectIndex = i;
		}

		if(multiSelectRe.test(line)) {
			multiSelectIndex = i;
		}

		if(titleRe.test(line)) {
			if(!lastTitleIdx) {
				lastTitleIdx = i;
			} else {
				let isSingle = null;
				if(lastTitleIdx < singleSelectIndex) {
					beforeSingles.push(line);
				} else if(lastTitleIdx > singleSelectIndex && lastTitleIdx < multiSelectIndex) {
					isSingle = true;
				} else if(lastTitleIdx > multiSelectIndex) {
					isSingle = false;
				}

				questions.push({title: lines[lastTitleIdx], options: lines.slice(lastTitleIdx + 1, i).join('\n'), single: isSingle});
				lastTitleIdx = i;
			}
		}
	})

	lineLog('beforeSingles', beforeSingles)

	output(questions)
	// console.log(rcon,'<0000000000')
}


function parseQuestions() {
	var invalidOptions = [];
	var questions = require('./data.js');
	questions.forEach(question => {
		let options = parseOptions(question);

		let type = options.length ? 'select' : 'judge';
		if(options.length === 2 && options.includes('正确') && options.includes('错误')) {
			type = 'judge';
			options = [];
		}

		options = options.map(opt => {
			let item = {}
			item.text = opt.replace(/^\s*?([a-f])\s*?\.?/i, (m,l) => {
				item.value = l.toUpperCase();
				return ''
			})

			if(!item.value) {
				invalidOptions.push(item);
			}

			return item
		})

		options = options.filter(opt => !opt.text.match(/^(单选|多选|判断)题/))

		question.options = options
		question.type = type
	})

	lineLog('invalidOptions', invalidOptions);

	output(questions);
}

function parseOptions(question) {
	if(Array.isArray(question.options)) {
		return question.options;
	}


	if(typeof question.options !== 'string') {
		console.log('BAD OPTIONS');
		console.log('question: ', question);
		throw new Error('stop and check it..')
	}

	var options = question.options.split(/\n|\r/);
	options = options.filter(opt => {
		opt = opt.replace(/^\s*|\s*$/g, '');
		return !!opt;
	})

	if(options.length === 1) {
		options = options[0].match(/[A-G]\s*?\.(.(?![A-G]\s*?\.))*./g)
		options = options.map(opt => opt.trim());
	}

	options = options.map(opt => opt.trim());

	console.log('[INFO] parse options: ', question.options , '-->', options);

	return options;
}


function parseAnswers() {
	var data = require('./data');
	var noAnswers  = [];
	var unknowTypes = [];
	data.forEach(question => {
		let title = question.title.replace(/[.。\s]*?$/, '');
		question.title = title = title.replace(/^\s*?(\d+)\s*?\.\s*?/, (m, n) => {
			question.rawIndex = n;
			return ''
		})
		let answerRe = /[a-f]+$/i;
		let answerMidRe = /[(（][a-f\s]+[)）]|[-_]{2,}[a-f\s]+[-_]{2,}/i;
		let aMatched = title.match(answerRe);
		if(question.type === 'select') {

			if(aMatched) {
				question.answer = aMatched[0];
				question.title = title.replace(answerRe
					, m => {
						return '';
					})
			}else {
				let amMatched = title.match(answerMidRe);
				if(amMatched) {
					let am = amMatched[0].replace(/[^a-f]/ig, '');
					if(!am) {
						noAnswers.push(title);
						return;
					}
					question.answer = am;
					question.title = title.replace(answerMidRe, m => {
						return m.replace(/[a-f]/gi, '');
					}) 
				}else {
					// 从标题解析不到选择题答案
					noAnswers.push(title);
				}
			}
		} else if(question.type === 'judge') {
			let janswerRe = /[（(]\s*?[ⅩX×√]\s*?[）)]/i
			let jaMatched = title.match(janswerRe);
			if(jaMatched) {
				question.answerMark = jaMatched[0].replace(/[^ⅩX×√]/g, '');
				question.answer = 'ⅩX×'.includes(question.answerMark) ? 'N' : 'Y'
				question.title = title.replace(janswerRe, m => {
					return m.replace(/[ⅩX×√]/ig, '');
				})
			} else {
				debugger;
				noAnswers.push(title);
			}
		} else {
			console.log('[ERR] unknow type:', question.type, question);
			unknowTypes.push(question);
		}

		if(question.answer) {
			question.answer = question.answer.toUpperCase()

		}
	})

	lineLog('noAnswers', noAnswers);
	lineLog('unknowTypes', unknowTypes);

	output(data);
}

function main() {
	getQuestions();
	parseQuestions();
	parseAnswers();
}

main();