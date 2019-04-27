'use strict';

function foo() {
	console.log('arguments: ', arguments);
	// console.log('arguments.callee: ', arguments.callee);

	function sub() {
	console.log('sub arguments: ', arguments);
	console.log('sub this: ', this);

	}

	sub('hi', 'no');
}

setTimeout(function() {

	console.log('\n\n\n\n ---------------------');
	function test() {
		console.log('test this: ', this);
	}

	test();

	foo('will', 'be', 'here');
}, 1000)

foo(1,2,3);