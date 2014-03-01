module.exports = function(grunt){
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'dist/css/styles.css': 'sass/styles.scss'
        }
      }
    },
    uglify: {
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/js/custom/custom.min.js': 'dist/js/custom/uncompressed/*.js'
        }
      },
      dev: {
        options: {
          compress: false,
          beautify: true,
          mangle: false
        },
        files: {
          'dist/js/custom/custom.min.js': 'dist/js/custom/uncompressed/*.js'
        }  
      }
    },
    watch: {
      css: {
        files: ['sass/*.scss'],
        tasks: ['sass:dist'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['dist/js/custom/uncompressed/*.js'],
        tasks: ['uglify:dist'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['sass', 'uglify']);
}