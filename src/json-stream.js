'use strict'

import stream from 'stream'

/**
 * Transforms a stream of objects to JSON.
 */
class JsonStream extends stream.Transform {
	constructor() {
		super({
			writableObjectMode: true
		})

		/**
		 * A value indicating whether the first object has been transformed.
		 * @type {Boolean}
		 */
		this._started = false
	}

	/**
	 * Converts an object to JSON.
	 * @param {CapitalGains} chunk    The object.
	 * @param {string}       encoding The encoding type (always 'Buffer').
	 * @param {function}     callback A callback for when the transformation is complete.
	 */
	_transform(chunk, encoding, callback) {
		this.push(this._started ? ',' : '[')
		this._started = true
		this.push(JSON.stringify(chunk))
		callback()
	}

	/**
	 * Writes the end of the JSON.
	 * @param {function} callback A callback for when the transformation is complete.
	 */
	_final(callback) {
		this.push(']')
		callback()
	}
}

export default function(...args) {
	return new JsonStream(...args)
}
