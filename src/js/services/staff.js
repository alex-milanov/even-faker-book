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

const drawMelody = context => {
	// Create a stave of width 400 at position 10, 40 on the canvas.
	var stave = new VF.Stave(0, 0, 400);

	// Add a clef and time signature.
	stave.addClef("treble").addTimeSignature("4/4");

	var notes = [
		// A quarter-note C.
		new VF.StaveNote({clef: "treble", keys: ["b/3"], duration: "q"}),

		// A quarter-note D.
		new VF.StaveNote({clef: "treble", keys: ["f/4"], duration: "q"}),

		// A quarter-note rest. Note that the key (b/4) specifies the vertical
		// position of the rest.
		new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),

		// A C-Major chord.
		new VF.StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q"})
	];

	// Create a voice in 4/4 and add above notes
	var voice = new VF.Voice({num_beats: 4, beat_value: 4});
	voice.addTickables(notes);

	// Format and justify the notes to 400 pixels.
	var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);

	voice.draw(context, stave);
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

				const {width} = state.viewport.screen;
				let height = calcHeight(state.staff.piece, state.staff.mpl);
				// Configure the rendering context.
				renderer.resize(width, height);
				var context = renderer.getContext();
				context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

				// Create a stave of width 400 at position 10, 40 on the canvas.
				if (!state.staff.showMelody) {
					let tx = 0;
					state.staff.piece.forEach((part, k) =>
							part.forEach((chord, i) =>
								drawMeasure(context, chord, i, 10,
									calcHeight(state.staff.piece.slice(0, k), state.staff.mpl), width, 70, state.staff.mpl)));
				} else {
					drawMelody(context);
				}
			})
		);

	unhook = () => subs.forEach(sub => sub.unsubscribe());
};

module.exports = {
	unhook,
	hook
};
