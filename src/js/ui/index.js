'use strict';

// dom
const {
	h1, h2, a, div, header, canvas,
	section, button, span, input, i
} = require('iblokz-snabbdom-helpers');
// components

const calcHeight = (piece, mpl, lh = 70) =>
	piece.reduce((h, part) => h + (part.length - (part.length % mpl)) / mpl * lh, 0);

module.exports = ({state, actions}) => section('#ui', [
	header([
		button({
			on: {
				click: ev => actions.toggle(['staff', 'showMelody'])
			}
		}, i('.fa.fa-music')),
		h1('EvenFakerBook'),
		input(`[type=number][size=3]`, {
			on: {
				change: ev => actions.set(['staff', 'mpl'], ev.target.value)
			},
			props: {
				value: state.staff.mpl
			}
		})
	]),
	h2('So What'),
	div(`#staff[width=${state.viewport.screen.width}][height=${calcHeight(state.staff.piece, state.staff.mpl)}]`)
	// counter({state, actions})
]);
