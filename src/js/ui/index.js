'use strict';

// dom
const {
	h1, a, div, header, canvas,
	section, button, span
} = require('iblokz-snabbdom-helpers');
// components
const counter = require('./counter');

module.exports = ({state, actions}) => section('#ui', [
	header([
		h1('TheFakerBook')
	]),
	div('#staff[width=800][height=600]')
	// counter({state, actions})
]);
