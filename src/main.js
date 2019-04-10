'use strict'

import getopt, {usage} from '@davidosborn/getopt'
import csvParse from 'csv-parse'
import fs from 'fs'
import process from 'process'
import utf8 from 'to-utf-8'
import jsonStream from './json-stream'
import normalizeStream from './normalize-stream'

export default async function main(args) {
	// Parse the arguments.
	let opts = getopt(args, {
		options: [
			{
				short: 'h',
				long: 'help',
				description: 'Display this usage information and exit.',
				callback: usage
			},
			{
				short: 'o',
				long: 'output',
				argument: 'file',
				description: 'Write the output to the specified file.'
			}
		],
		usage: {
			header: 'Crypto History Parser',
			program: 'crypto-history-parser',
			spec: '[option]... <csv-file>'
		},
		callback: function(opts, args, settings) {
			// Show the usage when there is no input.
			if (opts.parameters.length < 1 || !opts.parameters[0].value)
				usage(settings)
		}
	})

	let source = opts.parameters[0].value
	let destination = opts.options.output?.value

	// Create a stream to parse the history.
	let stream = fs.createReadStream(source)
		.pipe(utf8())
		.pipe(csvParse({
			auto_parse: true,
			auto_parse_date: true,
			columns: true,
			skip_empty_lines: true
		}))
		.pipe(normalizeStream())
		.pipe(jsonStream())

	// Pipe the stream to the output file.
	stream.pipe(destination ? fs.createWriteStream(destination) : process.stdout)
}
