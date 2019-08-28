/*!
 * @package tweento.js
 * @version v0.1.0
 * @author Przemysław Tyczyński | https://tyczynski.pl
 * @license MIT
 */
import calliffn from 'calliffn';

/** @const defaultConfig default Tweento configuration object */
const defaultConfig = {
	// Options
	css: {},
	paused: false,

	// Events
	onStart: null,
	onTransitionStart: null,
	onTransitionEnd: null,
};

/**
 * Tweento class
 *
 * @class
 */
class Tweento {
	/**
	 * @param {HTMLElement} element
	 * @param {Object} config
	 */
	constructor(element, config) {
		this.element = element;

		this.config = { ...defaultConfig, ...config };
		this.state = {
			transitionStartCount: 0,
			transitionEndCount: this.config.css.transition
				? this.config.css.transition.split(',').length
				: 0,
			dirty: false,
		};

		this.transitionStart = this.transitionStart.bind(this);
		this.transitionEnd = this.transitionEnd.bind(this);

		this.bindEvents();

		if (!this.config.paused) {
			this.start();
		}
	}

	/**
	 * Method that starts the transition of the element
	 *
	 * @return {void}
	 */
	start() {
		if (this.state.dirty) return;

		calliffn(this.config.onStart);

		this.bindEvents();
		this.setStyles();
	}

	/**
	 * Bind 'transitionend' and 'transitionstart' event to the element
	 *
	 * @return {void}
	 */
	bindEvents() {
		this.element.addEventListener('transitionstart', this.transitionStart);
		this.element.addEventListener('transitionend', this.transitionEnd);
	}

	/**
	 * Set passed inline styles to the element
	 *
	 * @return {void}
	 */
	setStyles() {
		const { css } = this.config;

		for (const key in css) {
			if (Object.prototype.hasOwnProperty.call(css, key)) {
				this.element.style[key] = css[key];
			}
		}
	}

	/**
	 * Callback for the element 'transitionstart' event
	 *
	 * @return {void}
	 */
	transitionStart() {
		this.state.transitionStartCount += 1;

		if (this.state.transitionStartCount === 1) {
			this.element.removeEventListener('transitionstart', this.transitionStart);

			calliffn(this.config.onTransitionStart);
		}
	}

	/**
	 * Callback for the element 'transitionend' event
	 *
	 * @return {void}
	 */
	transitionEnd() {
		this.state.transitionEndCount -= 1;

		if (this.state.transitionEndCount === 0) {
			this.element.removeEventListener('transitionend', this.transitionEndCount);

			calliffn(this.config.onTransitionEnd);
		}
	}
}

/**
 * @param {HTMLElement} element
 * @param {Object} config
 * @return {Tweento}
 */
function tweento(element, config = {}) {
	if (!(element instanceof HTMLElement)) {
		throw new Error('Passed element must be an HTMLElement instance.');
	}

	return new Tweento(element, config);
}

export default tweento;