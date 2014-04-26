#!/usr/bin/env node
'use strict';

/*
#
#	▒█░▒█ █▀▀ █▀▀█ ▒█▀▀▄ █▀▀ ▀▀█▀▀ █▀▀█ █▀▀█ ▀▀█▀▀ 
#	▒█▀▀█ █▀▀ █▄▄█ ▒█░▒█ ▀▀█ ░▒█░░ █▄▄█ █▄▄▀ ░▒█░░ 
#	▒█░▒█ ▀▀▀ ▀░░▀ ▒█▄▄▀ ▀▀▀ ░▒█░░ ▀░░▀ ▀░▀▀ ░▒█░░ 
#
#	A worry-free front-end workflow
#	➳  https://github.com/flovan/headstart
#
*/

var 
	path = require('path'),
	fs = require('fs'),
	chalk = require('chalk'),
	_ = require('lodash'),

	Liftoff = require('liftoff'),
	gulp = require('gulp'),
	gulpFile = require(path.join(path.dirname(fs.realpathSync(__filename)), '../gulpfile.js'))
;

// CLI configuration ----------------------------------------------------------
//

var cli = new Liftoff({
	name: 'headstart',
	// completions: require('../lib/completion') TODO
}).on('require', function (name, module) {
	console.log(chalk.grey('Requiring external module: '+name+'...'));
	if (name === 'coffee-script') {
		module.register();
	}
}).on('requireFail', function (name, err) {
	console.log(chalk.black.bgRed('Unable to load:', name, err));
});

// Launch CLI -----------------------------------------------------------------
//

cli.launch(launcher);

function launcher (env) {

	var 
		argv = env.argv,
		cliPackage = require('../package'),
		versionFlag = argv.v || argv.version,

		allowedTasks = ['init', 'serve', 'build', 'i', 'info'],
		task = argv._,
		numTasks = task.length
	;

	// Check for version flag
	if (versionFlag) {
		console.log('Headstart CLI version', cliPackage.version);
		process.exit(0);
	}

	// Log info if no tasks are passed in
	if (!numTasks) {
		logInfo();
		process.exit(0);
	}

	// Warn if more than one tasks has been passed in
	if (numTasks > 1) {
		console.log(chalk.red('\nOnly one task can be provided. Aborting.\n'));
		logTasks();
		process.exit(0);
	}

	// Check if task is valid
	if (_.indexOf(allowedTasks, task[0]) < 0) {
		console.log(chalk.red('\nThe provided task "' + task[0] + '" was not recognized. Aborting.\n'));
		logTasks();
		process.exit(0);
	}

	// Change directory to where Headstart was called from
	if (process.cwd() !== env.cwd) {
		process.chdir(env.cwd);
		console.log(chalk.cyan('Working directory changed to', chalk.magenta(env.cwd)));
	}

	// Start the task through Gulp
	process.nextTick(function() {
		gulp.start.apply(gulp, task);
	});
}

// Helper logging functions ---------------------------------------------------
//

function logInfo () {
	console.log(chalk.cyan(
		'\n' +
		'▒█░▒█ █▀▀ █▀▀█ ▒█▀▀▄ █▀▀ ▀▀█▀▀ █▀▀█ █▀▀█ ▀▀█▀▀ \n' +
		'▒█▀▀█ █▀▀ █▄▄█ ▒█░▒█ ▀▀█ ░▒█░░ █▄▄█ █▄▄▀ ░▒█░░ \n' +
		'▒█░▒█ ▀▀▀ ▀░░▀ ▒█▄▄▀ ▀▀▀ ░▒█░░ ▀░░▀ ▀░▀▀ ░▒█░░ \n' +
		'\n',
		chalk.grey('A worry-free front-end workflow\n' +
		'➳  https://github.com/flovan/headstart\n' +
		'\n' +
		'-------\n')
	));
	logTasks();
}

function logTasks () {
	console.log('Please use one of the following tasks:\n');
	console.log(
		chalk.magenta('init'),
		'\t\tAdd the boilerplate files to the current directory'
	);
	console.log(
		chalk.magenta('serve'),
		'\t\tKickstart the engine and start developing'
	);
	console.log(
		chalk.magenta('build'),
		'\t\tBuild the project\n',
		chalk.grey('--production'),
		'\tMake a production ready build\n',
		chalk.grey('--serve'),
		'\tServe the files on a static address\n',
		chalk.grey('--open'),
		'\tOpen up a browser for you\n',
		chalk.grey('--nolr'),
		'\tDisables the livereload snippet\n'
	);
	console.log(
		chalk.magenta('i'),
		' or ',
		chalk.magenta('info'),
		' to print out this message'
	);
	console.log(
		chalk.magenta('-v'),
		'or ',
		chalk.magenta('--version'),
		' to print out the version of your Headstart CLI\n'
	);
}
