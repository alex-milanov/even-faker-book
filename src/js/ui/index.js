'use strict';

// dom
const {
	h1, h2, a, div, header, canvas,
	section, button, span
} = require('iblokz-snabbdom-helpers');
// components

module.exports = ({state, actions}) => section('#ui', [
	header([
		h1('EvenFakerBook')
	]),
	h2('So What'),
	div(`#staff[width=${state.viewport.screen.width}][height=${state.viewport.screen.height - 120}]`)
	// counter({state, actions})
]);
