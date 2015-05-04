module.exports = function(grunt) {
  var timestamp = new Date().getTime();
  var jsSuffix = '.' + timestamp + '.js';
  var cssSuffix = '.' + timestamp + '.css';
  var htmlSuffix = '.' + timestamp + '.html';

  var replaceContent = function(content, srcpath) {
    if (srcpath.indexOf('.html') > -1) {
      return content.replace(new RegExp('\\.js', 'gm'), jsSuffix)
        .replace(new RegExp('\\.html', 'gm'), htmlSuffix)
        .replace(new RegExp('\\.css', 'gm'), cssSuffix);
    } else {
      return content;
    }
  };
  var renameFile = function(dest, file) {
    return (dest + '/' + file).replace('.js', jsSuffix)
      .replace('.css', cssSuffix)
      .replace('.html', htmlSuffix);
  };
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build'],
    uglify: {
      options: {
        compress: true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        expand: true,
        cwd: 'static',
        src: '**/*.js',
        dest: 'build/static',
        ext: jsSuffix 
      },
    },
    copy: [{
          cwd: 'lib',
          src: '**/*',
          dest: 'build/lib',
          expand: true,
          options: {
            process: replaceContent 
          }
        },
        {
          cwd: 'bower_components',
          src: '**/*',
          dest: 'build/bower_components',
          expand: true,
          options: {
            process: replaceContent 
          },
          rename: renameFile
        },
        {
          cwd: 'static',
          src: ['**/*', '!**/*.js'],
          dest: 'build/static',
          expand: true,
        },
        {
          cwd: '.',
          src: '*.js',
          dest: 'build',
          expand: true
        }]
  });


  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load copy plugin
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'uglify', 'copy']);
};
