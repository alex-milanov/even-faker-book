'use strict';

// dom
const {
	h1, h2, a, div, header, canvas,
	section, button, span, input, i, ul, li
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
	h2(
		span('.dropdown', {style: {float: 'none'}}, [
			span('.handle', state.library[state.staff.piece].title),
			ul(state.library
				.map((data, piece) => ({data, piece}))
				.filter(({piece}) => piece !== state.staff.piece)
				.map(({data, piece}) =>
					li({on: {click: () => actions.set(['staff', 'piece'], piece)}},
						span(data.title))
				))
		])
	),
	div(`#staff[width=${state.viewport.screen.width}][height=${
		calcHeight(state.library[state.staff.piece].progression, state.staff.mpl)
	}]`)
	// counter({state, actions})
]);
