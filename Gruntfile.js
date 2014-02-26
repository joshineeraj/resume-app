module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },

        less: {
            development: {
                files: {
                    "app/css/appNew.css": "app/less/app.less"
                }
            },
            production: {
                options: {
                    compress: true,
                    yuicompress: true
                },
                files: {
                    "app/css/app.css": "app/less/app.less"
                }
            }
        },

        watch: {
            styles: {
                // Which files to watch (all .less files recursively in the less directory)
                files: ['app/less/**/*.less'],
                tasks: ['less:development'],
                options: {
                    nospawn: true
                }
            }
        },

    });

    //grunt plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    
    
    // Default task(s).
    grunt.registerTask('watch-less', ['watch']);

};