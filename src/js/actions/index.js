'use strict';

const {obj, arr} = require('iblokz-data');

// namespaces=
// const counter = require('./counter');

// initial
const initial = {
	staff: {
		mpl: 4,
		showMelody: false,
		piece: [
			[
				'D-11', '%', '%', '%',
				'D-11', '%', '%', '%'
			],
			[
				'D-11', '%', '%', '%',
				'D-11', '%', '%', '%'
			],
			[
				'Eb-11', '%', '%', '%',
				'Eb-11', '%', '%', '%'
			],
			[
				'D-11', '%', '%', '%',
				'D-11', '%', '%', '%'
			]
		]
	},
	viewport: {
		screen: {
			width: 800,
			height: 600
		}
	}
};

// actions
const ping = () => state => state;
const set = (key, value) => state => obj.patch(state, key, value);
const toggle = key => state => obj.patch(state, key, !obj.sub(state, key));
const arrToggle = (key, value) => state =>
	obj.patch(state, key,
		arr.toggle(obj.sub(state, key), value)
	);

module.exports = {
	initial,
	ping,
	set,
	toggle,
	arrToggle
};
