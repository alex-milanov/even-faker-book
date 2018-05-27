'use strict';
// lib
const Rx = require('rx');
const $ = Rx.Observable;

let unhook = {};

const hook = ({state$, actions}) => {
	let subs = [];
	// mouse movement
	/*
	$.fromEvent(document, 'mousemove')
		.subscribe(ev => actions.set(['viewport', 'mouse'], {
			x: ev.pageX,
			y: ev.pageY
		}));
	*/
	subs.push(
		$.fromEvent(window, 'resize')
			.startWith({})
			.subscribe(ev => actions.set(['viewport', 'screen'], {
				width: window.innerWidth,
				height: window.innerHeight
			}))
	);

	unhook = () => subs.forEach(sub => sub.unsubscribe());
};

module.exports = {
	unhook,
	hook
};
