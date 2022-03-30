module.exports = function (grunt) {

// Project configuration.
grunt.initConfig({
	jshint: {
		all: ['Gruntfile.js', 'Source Code/SPLU-Current.js']
	}
});


// Load the plugin that provides the task.
grunt.loadNpmTasks('grunt-contrib-jshint');

grunt.registerTask('default', ['jshint']);

};
