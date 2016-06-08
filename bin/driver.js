#!/usr/bin/env node

var shell = require("shelljs");
var yargs = require("yargs");
var fs = require('fs');
var q = require('q');
var exec = require('child_process').exec;
var argv = yargs.usage("$0 command [options]")
     .option('env', {
          type: 'string',
          describe: 'Build environment.'
     })
     .option('path', {
          type: 'string',
          describe: "(Optional) Path to the Frontend directory"
     })
	 .option('node', {
		  type: 'boolean',
		  default: true,
		  describe: '(Optional) Install node modules. Install only.'
     })
	 .option('bower', {
		  type: 'boolean',
		  default: true,
		  describe: '(Optional) Install bower components. Install only.'
     })
	 .option('l', {
		  type: 'boolean',
		  alias: 'label',
		  default: true,
		  describe: '(Optional) Label output with the folder name.'
     })
	 .option('f', {
		  type: 'boolean',
		  alias: 'force',
		  default: true,
		  describe: '(Optional) Adds the force command to all Grunt tasks. Build only.'
     })
     .command('build', '', function (yargs) {
          if (yargs.argv.path) {
               process.chdir(yargs.argv.path);
          }

          if (yargs.argv.env) {
               Build(yargs.argv.env);
          } else {
               console.log("Must specify a build environment");
          }
     })
     .command('install', '', function (yargs) {
          if (yargs.argv.path) {
               process.chdir(yargs.argv.path);
          }
		  if(yargs.argv.node){
			  InstallNodeModules();
		  }
		  if(yargs.argv.bower){
			  InstallBowerComponents();  
		  }
		  if(!yargs.argv.node && !yargs.argv.bower){
			  			  console.log("both")

			  Install();
		  }
     })
     .example('frontend-driver install', 'Runs npm install on all frontend projects')
     .example('frontend-driver install --node --bower', 'Runs npm install and bower install on all frontend projects')
     .example('frontend-driver install --path=C:\\projects\\epic\FrontEnd\\', 'Runs npm install on all frontend project directories located within the path specified.')
     .example('frontend-driver build --env=dev', 'Runs grunt dev on all frontend project directories located within the directory frontend-driver was called from.')
     .example('frontend-driver build --env=dev --path=C:\\projects\\epic\FrontEnd\\', 'Runs grunt dev on all frontend project directories located within the path specified.')
     .example('frontend-driver build --env=dev --path=C:\\projects\\epic\FrontEnd\\ -l -f', 'Runs grunt dev --force on all frontend project directories located within the path specified and labels the outout.')
     .help("h")
     .alias("h", "help")
     .argv;

function HasGruntFile(p) {
     var deferral = q.defer();

     fs.readdir(p, function (err, subitems) {
          if (subitems.indexOf("Gruntfile.js") >= 0) {
               deferral.resolve(p);
          } else {
               deferral.resolve('');
          }

     });
     return deferral.promise;
}

function HasPackageJson(p) {
     var deferral = q.defer();

     fs.readdir(p, function (err, subitems) {
          if (subitems.indexOf("package.json") >= 0) {
               deferral.resolve(p);
          } else {
               deferral.resolve('');
          }

     });
     return deferral.promise;
}

function HasBowerJson(p) {
     var deferral = q.defer();

     fs.readdir(p, function (err, subitems) {
          if (subitems.indexOf("bower.json") >= 0) {
               deferral.resolve(p);
          } else {
               deferral.resolve('');
          }

     });
     return deferral.promise;
}

function Install() {
     var deferral = q.defer();
     fs.readdir("./", function (err, items) {
          for (var i = 0; i < items.length; i++) {
               if (fs.statSync(items[i]).isDirectory()) {
                    q.when(HasPackageJson(items[i])).then(function (result) {
                         if (result) {
                              var npmInstall = exec('npm install', {
                                   cwd: shell.pwd() + "/" + result + "/"
                              });
							  
							  var label = "";
							  if(argv.label || argv.l){
								  label = result + ": ";
							  }
							  
                              npmInstall.stdout.on('data', function (data) {
                                   console.log(label + data);
                              });
                         }
                    });
               }
          }
     });
     return deferral.promise;
}

function InstallNodeModules() {
     var deferral = q.defer();
     fs.readdir("./", function (err, items) {
          for (var i = 0; i < items.length; i++) {
               if (fs.statSync(items[i]).isDirectory()) {
                    q.when(HasPackageJson(items[i])).then(function (result) {
                         if (result) {
                              var npmInstall = exec('npm install', {
                                   cwd: shell.pwd() + "/" + result + "/"
                              });
							  
							  var label = "";
							  if(argv.label || argv.l){
								  label = result + ": ";
							  }
							  
                              npmInstall.stdout.on('data', function (data) {
                                   console.log(label + data);
                              });
                         }
                    });
               }
          }
     });
     return deferral.promise;
}

function InstallBowerComponents() {
     var deferral = q.defer();
     fs.readdir("./", function (err, items) {
          for (var i = 0; i < items.length; i++) {
               if (fs.statSync(items[i]).isDirectory()) {
                    q.when(HasBowerJson(items[i])).then(function (result) {
                         if (result) {
                              var npmInstall = exec('bower install', {
                                   cwd: shell.pwd() + "/" + result + "/"
                              });

							  var label = "";
							  if(argv.label || argv.l){
								  label = result + ": ";
							  }
                              npmInstall.stdout.on('data', function (data) {
                                   console.log(label + data);
                              });
                         }
                    });
               }
          }
     });
     return deferral.promise;
}

function Build(env) {
     var deferral = q.defer();
     fs.readdir("./", function (err, items) {
          for (var i = 0; i < items.length; i++) {
               if (fs.statSync(items[i]).isDirectory()) {
                    q.when(HasGruntFile(items[i])).then(function (result) {
                         if (result) {
							 
							  var forceGrunt = "";
							  if(argv.force || argv.f){
								  forceGrunt = " --force"
							  }
							 
                              var gruntBuid = exec('grunt ' + env + forceGrunt, {
                                   cwd: shell.pwd() + "/" + result + "/"
                              });

							  var label = "";
							  if(argv.label || argv.l){
								  label = result + ": ";
							  }
							  
                              gruntBuid.stdout.on('data', function (data) {
                                   console.log(label + data);
                              });
                         }
                    });
               }
          }
     });
     return deferral.promise;
}