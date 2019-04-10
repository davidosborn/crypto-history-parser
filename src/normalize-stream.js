'use strict'

import stream from 'stream'

/**
 * Normalizes a stream of historical records.
 */
class NormalizeStream extends stream.Transform {
	static _converters = {
		'Date|Price|Open|High|Low|Vol.|Change %': function(x) {
			return {
				time: new Date(x.Date).getTime(),
				open: parseFloat(x.Open),
				close: parseFloat(x.Price),
				high: parseFloat(x.High),
				low: parseFloat(x.Low),
				volume: parseFloat(x['Vol.']),
				change: parseFloat(x['Change %'])
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
	 * @param {CapitalGains} chunk    The historical record.
	 * @param {string}       encoding The encoding type (always 'Buffer').
	 * @param {function}     callback A callback for when the transformation is complete.
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
}

export default function(...args) {
	return new NormalizeStream(...args)
}
