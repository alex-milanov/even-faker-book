'use strict';

// lib
const Rx = require('rx');
const $ = Rx.Observable;
const time = require('../util/time');
const {Flow: VF} = require('vexflow');
const {StaveText} = require('vexflow/src/stavetext');
const {Barline} = require('vexflow/src/stavebarline');
const {StaveModifier} = require('vexflow/src/stavemodifier');
const {StaveSection} = require('vexflow/src/stavesection');
// const Parser = require('vexflow/src/parser').Parser;

window.VF = VF;
window.StaveText = StaveText;

let unhook = {};

const calcHeight = (piece, mpl, lh = 70) =>
	piece.reduce((h, part) => h + (part.length - (part.length % mpl)) / mpl * lh, 0);

const sections = ['A', 'B', 'C', 'D'];

const drawMeasure = (context, chord, mi = 0, section = 0, x = 10, y = 40, w = 800, h = 70, mpl = 4) => {
	let width = (w / mpl) - 20;
	var stave = new VF.Stave(x + (mi % mpl) * width, y + ((mi - (mi % mpl)) / mpl * h), width, {
		num_lines: 5,
		fill_style: '#ffffff',
		left_bar: mi === 0 || (mi % mpl) > 0,
		right_bar: (mi % mpl) === mpl - 1 && !(chord.modifiers)
	});

	if (mi === 0) {
		const staveSection = new StaveSection(sections[section],
			y === 0
				? chord.modifiers ? -31 : -11
				: 8,
			y * 0.01 + 15);
		stave.addModifier(staveSection);
	}

	var chordSymbol = new StaveText(
		typeof chord === 'string' ? chord : chord.chord,
		3,
		{
			shift_y: 54,
			shift_x: 0
		}
	);

	// chordSymbol.setFont("Georgia", 10, "");

	stave.addModifier(chordSymbol);

	if (typeof chord === 'object' && chord.modifiers) {
		chord.modifiers.forEach(mod => {
			if (mod[0] === 'Barline') {
				let modifier = new Barline(Barline.type[mod[1]]);
				if (mod[2]) modifier.setPosition(StaveModifier.Position[mod[2]]);
				stave.addModifier(modifier);
			}
		});
	}

	// Add a clef and time signature.
	if (mi === 0 && y === 0) stave
		// .addClef("treble")
		.addTimeSignature("4/4");

	// Connect it to the rendering context and draw!
	stave.setContext(context).draw();
};

const drawMelody = (renderer, melodyLine) => {
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
			melodyLine[0].reduce(
				(notes, pattern) => [].concat(
					notes,
					pattern[0] === 'beam'
						? score.beam(score.notes(...pattern.slice(1)))
						: score.notes(...pattern)
				),
				[]
			)
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
				let piece = state.library[state.staff.piece];
				let progression = state.library[state.staff.piece].progression;
				let height = calcHeight(progression, state.staff.mpl);
				// Configure the rendering context.

				// Create a stave of width 400 at position 10, 40 on the canvas.
				if (!state.staff.showMelody) {
					renderer.resize(width, height);
					var context = renderer.getContext();
					context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
					let tx = 0;
					progression.forEach((part, k) =>
							part.forEach((chord, i) =>
								drawMeasure(context, chord, i, k, 40,
									calcHeight(progression.slice(0, k), state.staff.mpl), width, 70, state.staff.mpl)));
				} else {
					canvas.innerHTML = '';
					drawMelody(renderer, piece.melodyLine);
				}
			})
		);

	unhook = () => subs.forEach(sub => sub.unsubscribe());
};

module.exports = {
	unhook,
	hook
};
