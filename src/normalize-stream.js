'use strict'

import stream from 'stream'

/**
 * Normalizes a stream of historical records.
 */
class NormalizeStream extends stream.Transform {
	/**
	 * The converters that can be used to normalize a record, indexed by the keys of the record.
	 * @type {Object.<String, Function.<Object>>}
	 */
	static _converters = {
		'Date|Price|Open|High|Low|Vol.|Change %': function(x) {
			return {
				time:   new Date(x.Date).getTime(),
				open:   NormalizeStream._parseNumber(x.Open),
				close:  NormalizeStream._parseNumber(x.Price),
				high:   NormalizeStream._parseNumber(x.High),
				low:    NormalizeStream._parseNumber(x.Low),
				volume: NormalizeStream._parseNumber(x['Vol.']),
				change: NormalizeStream._parseNumber(x['Change %'])
			}
		},
		'Date|Price|Open|High|Low|Change %': function(x) {
			return {
				time:   new Date(x.Date).getTime(),
				open:   NormalizeStream._parseNumber(x.Open),
				close:  NormalizeStream._parseNumber(x.Price),
				high:   NormalizeStream._parseNumber(x.High),
				low:    NormalizeStream._parseNumber(x.Low),
				change: NormalizeStream._parseNumber(x['Change %'])
			}
		}
	}

	constructor() {
		super({
			objectMode: true
		})
	}

	/**
	 * Normalizes a historical record.
	 * @param {object}   chunk    The historical record.
	 * @param {string}   encoding The encoding type (always 'Buffer').
	 * @param {function} callback A callback for when the transformation is complete.
	 */
	_transform(chunk, encoding, callback) {
		delete chunk.flatten
		delete chunk.flatMap

		let keys = Object.keys(chunk).join('|')
		let converter = NormalizeStream._converters[keys]
		if (converter)
			chunk = converter(chunk)

		this.push(chunk)
		callback()
	}

	/**
	 * Parses a number.
	 * @param {string} s The string.
	 * @returns {number} The number.
	 */
	static _parseNumber(s) {
		return parseFloat(s.replace(',', ''))
	}
}

export default function(...args) {
	return new NormalizeStream(...args)
}
