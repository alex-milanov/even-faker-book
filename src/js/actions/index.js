'use strict';

const {obj, arr} = require('iblokz-data');

// namespaces=
// const counter = require('./counter');

// initial
const initial = {
	library: [
		{
			title: 'So What',
			author: 'Miles Davis',
			progression: [
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
			],
			melodyLine: [
				[
					['B4/8/r'],
					['beam', 'B3/8, F4, G4'],
					['beam', 'A4/8, B4, C5, A4', {stem: 'up'}]
				]
			]
		}
	],
	staff: {
		mpl: 4,
		showMelody: false,
		piece: 0
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
