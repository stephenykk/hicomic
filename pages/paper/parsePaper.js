var fs = require('fs');
var path = require('path');

var dataPath = path.resolve(__dirname, './data.txt');
var outDataPath = path.resolve(__dirname, './data.js');

function output(data) {
	fs.writeFileSync(outDataPath, data, 'utf8');
}

function main() {
	var con = fs.readFileSync(dataPath, 'utf8');
	var questionRe = /^(\d+\s*\.[\s\S]*?)$^(?!\d+)\n?([\s\S]*?)/mg;
	var questions = [];
	var i = 0;
	var rcon = con.replace(questionRe, (match, title, options) => {
		console.log('[MSG] match:', match);
		console.log('[MSG] title:', title);
		console.log('[MSG] options:', options);
		i++;
		if(i > 5) {
			throw new Error('stop and see')
		}
		// questions.push({title, options});
		return '';
	});

	// output(JSON.stringify(questions, null, 2))
	// console.log(rcon,'<0000000000')
}

main();