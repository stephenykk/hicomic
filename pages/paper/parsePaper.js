var fs = require('fs');
var path = require('path');

var dataPath = path.resolve(__dirname, './data.txt');
var outDataPath = path.resolve(__dirname, './data.js');

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
	lines.forEach((line, i) => {
		var last = i === lines.length - 1;
		if(last)  {
			i = i + 1;
		}

		if(titleRe.test(line)) {
			if(!lastTitleIdx) {
				lastTitleIdx = i;
			} else {
				questions.push({title: lines[lastTitleIdx], options: lines.slice(lastTitleIdx + 1, i).join('\n')});
				lastTitleIdx = i;
			}
		}
	})

	output(questions)
	// console.log(rcon,'<0000000000')
}


function parseQuestions() {
	var questions = require('./data.js');
	questions.forEach(question => {
		question.options = parseOptions(question);
		question.type = question.options.length ? 'select' : 'judge';
	})

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



function parseTitle(question) {
	
}

function main() {
	getQuestions();
	parseQuestions();
}

main();