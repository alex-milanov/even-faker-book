'use strict';

// lib
const Rx = require('rx');
const $ = Rx.Observable;
const time = require('../util/time');
const VF = require('vexflow').Flow;

window.VF = VF;

let unhook = {};

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
				var renderer = new VF.Renderer(canvas, VF.Renderer.Backends.SVG);

				// Configure the rendering context.
				renderer.resize(500, 500);
				var context = renderer.getContext();
				context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

				// Create a stave of width 400 at position 10, 40 on the canvas.
				var stave = new VF.Stave(10, 40, 400);

				// Add a clef and time signature.
				stave.addClef("treble").addTimeSignature("4/4");

				// Connect it to the rendering context and draw!
				stave.setContext(context).draw();
			})
		);

	unhook = () => subs.forEach(sub => sub.unsubscribe());
};

module.exports = {
	unhook,
	hook
};
