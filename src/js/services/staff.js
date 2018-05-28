'use strict';

// lib
const Rx = require('rx');
const $ = Rx.Observable;
const time = require('../util/time');
const {Flow: VF} = require('vexflow');
const StaveText = require('vexflow/src/stavetext').StaveText;
// const Parser = require('vexflow/src/parser').Parser;

window.VF = VF;
window.StaveText = StaveText;

let unhook = {};

const calcHeight = (piece, mpl, lh = 70) =>
	piece.reduce((h, part) => h + (part.length - (part.length % mpl)) / mpl * lh, 0);

const drawMeasure = (context, chord, mi = 0, x = 10, y = 40, w = 800, h = 70, mpl = 4) => {
	let width = (w / mpl) - 20;
	var stave = new VF.Stave(x + (mi % mpl) * width, y + ((mi - (mi % mpl)) / mpl * h), width, {
		num_lines: 5,
		fill_style: '#ffffff',
		left_bar: mi === 0 || (mi % mpl) > 0
	});

	var chordSymbol = new StaveText(chord, 3, {
		shift_y: 54,
		shift_x: 0
	});

	// chordSymbol.setFont("Georgia", 10, "");

	stave.addModifier(chordSymbol);

	// Add a clef and time signature.
	if (mi === 0 && y === 0) stave
		// .addClef("treble")
		.addTimeSignature("4/4");

	// Connect it to the rendering context and draw!
	stave.setContext(context).draw();
};

const drawMelody = renderer => {
	var vf = new VF.Factory({renderer});
	var score = vf[`EasyScore`]();
	var system = vf[`System`]();
	system.addStave({
		options: {
			x: 10,
			y: 40,
			width: 300
		},
		voices: [score.voice(
			score.notes('B4/8/r')
				.concat(score.beam(score.notes('B3/8, F4, G4')))
				.concat(score.beam(score.notes('A4/8, B4, C5, A4', {stem: 'up'})))
		)]
	}).addClef('treble').addTimeSignature('4/4');

	vf.draw();
};

const hook = ({state$, actions}) => {
	let subs = [];

	// set up canvas
	subs.push(
		time.frame()
			.map(() => document.querySelector('#staff'))
			.distinctUntilChanged(canvas => canvas)
			.filter(canvas => canvas)
			.combineLatest(state$, (canvas, state) => ({canvas, state}))
			.subscribe(({canvas, state}) => {
				canvas.innerHTML = '';

				var renderer = new VF.Renderer(canvas, VF.Renderer.Backends.SVG);

				const {width} = state.viewport.screen;
				let height = calcHeight(state.staff.piece, state.staff.mpl);
				// Configure the rendering context.

				// Create a stave of width 400 at position 10, 40 on the canvas.
				if (!state.staff.showMelody) {
					renderer.resize(width, height);
					var context = renderer.getContext();
					context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
					let tx = 0;
					state.staff.piece.forEach((part, k) =>
							part.forEach((chord, i) =>
								drawMeasure(context, chord, i, 10,
									calcHeight(state.staff.piece.slice(0, k), state.staff.mpl), width, 70, state.staff.mpl)));
				} else {
					canvas.innerHTML = '';
					drawMelody(renderer);
				}
			})
		);

	unhook = () => subs.forEach(sub => sub.unsubscribe());
};

module.exports = {
	unhook,
	hook
};
