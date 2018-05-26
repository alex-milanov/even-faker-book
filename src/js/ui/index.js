'use strict';

// dom
const {
	h1, a, div, header,
	section, button, span
} = require('iblokz-snabbdom-helpers');
// components
const counter = require('./counter');

module.exports = ({state, actions}) => section('#ui', [
	header([
		h1('TheFakerBook')
	])
	// counter({state, actions})
]);
