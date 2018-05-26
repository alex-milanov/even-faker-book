'use strict';

// lib
const Rx = require('rx');
const $ = Rx.Observable;
const time = require('../util/time');
const {Flow: VF} = require('vexflow');
const StaveText = require('vexflow/src/stavetext').StaveText;

window.VF = VF;
window.StaveText = StaveText;

let unhook = {};

const drawMeasure = (chord, context, mi = 0, mpl = 4) => {
	let width = (800 / mpl) - 20;
	var stave = new VF.Stave(10 + (mi % mpl) * width, 40 + ((mi - (mi % mpl)) / mpl * 70), width, {
		num_lines: 5,
		fill_style: '#ffffff',
		measure: 2
	});

	var chordSymbol = new StaveText(chord, 3, {
		shift_y: 54,
		shift_x: 0
	});

	// chordSymbol.setFont("Georgia", 10, "");

	stave.addModifier(chordSymbol);

	// Add a clef and time signature.
	if (mi === 0) stave.addClef("treble").addTimeSignature("4/4");

	// Connect it to the rendering context and draw!
	stave.setContext(context).draw();
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

				// Configure the rendering context.
				renderer.resize(800, 600);
				var context = renderer.getContext();
				context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

				// Create a stave of width 400 at position 10, 40 on the canvas.
				[
					'D-11', '%', '%', '%',
					'D-11', '%', '%', '%',
					'D-11', '%', '%', '%',
					'D-11', '%', '%', '%',
					'Eb-11', '%', '%', '%',
					'Eb-11', '%', '%', '%',
					'D-11', '%', '%', '%',
					'D-11', '%', '%', '%'
				].forEach((chord, i) => drawMeasure(chord, context, i));
			})
		);

	unhook = () => subs.forEach(sub => sub.unsubscribe());
};

module.exports = {
	unhook,
	hook
};
