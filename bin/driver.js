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
	 .option('s', {
		  type: 'boolean',
		  alias: 'sync',
		  default: true,
		  describe: '(Optional) Runs Grunt on the projects synchronously.'
     })
     .command('build', '', function (yargs) {
          if (yargs.argv.path) {
               process.chdir(yargs.argv.path);
          }
          if (yargs.argv.env) {
			if(yargs.argv.s || yargs.argv.sync){
				BuildSync(yargs.argv.env);
			} 
			else{
				Build(yargs.argv.env);
			}
          } else {
               console.log("Must specify a build environment");
          }
     })
     .command('install', '', function (yargs) {
		  var scriptDirectory  = shell.pwd();
          if (yargs.argv.path) {
               process.chdir(yargs.argv.path);
          }
		  if(yargs.argv.node){
			  shell.cd(scriptDirectory);
			  if(yargs.argv.s || yargs.argv.sync){
				InstallNodeModulesSync();
			  }
			  else{
				InstallNodeModules();  
			  }
		  }
		  if(yargs.argv.bower){
			shell.cd(scriptDirectory);
			  if(yargs.argv.s || yargs.argv.sync){
				InstallBowerComponentsSync();
			  }
			  else{
				InstallBowerComponents();  
			  } 
		  }
		  if(!yargs.argv.node && !yargs.argv.bower){
			  shell.cd(scriptDirectory);
			  Install();
		  }
     })
     .example('frontend-driver install', 'Runs npm install on all frontend projects')
     .example('frontend-driver install --node --bower', 'Runs npm install and bower install on all frontend projects.')
     .example('frontend-driver install --node --bower -s', 'Runs npm install and bower install on all frontend projects synchronously.')
     .example('frontend-driver install --path=C:\\projects\\epic\FrontEnd\\', 'Runs npm install on all frontend project directories located within the path specified.')
     .example('frontend-driver build --env=dev', 'Runs grunt dev on all frontend project directories located within the directory frontend-driver was called from.')
     .example('frontend-driver build --env=dev --path=C:\\projects\\epic\FrontEnd\\', 'Runs grunt dev on all frontend project directories located within the path specified.')
     .example('frontend-driver build --env=dev --path=C:\\projects\\epic\FrontEnd\\ -l -f', 'Runs grunt dev --force on all frontend project directories located within the path specified and labels the output.')
     .example('frontend-driver build --env=dev --path=C:\\projects\\epic\FrontEnd\\ -l -f -s', 'Runs grunt dev --force synchronously on all frontend project directories located within the path specified and labels the output.')
     .help("h")
     .alias("h", "help")
     .argv;

function HasConfigFile(p, configFile) {
     var deferral = q.defer();
     fs.readdir(p, function (err, subitems) {
          if (subitems.indexOf(configFile) >= 0) {
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
                    q.when(HasConfigFile(items[i], "package.json")).then(function (result) {
                         if (result) {
                              var npmInstall = exec('npm install', {
                                   cwd: shell.pwd() + "/" + result + "/"
                              });
							  
							  var label = "";
							  if(yargs.argv.label || yargs.argv.l){
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
                    q.when(HasConfigFile(items[i], "package.json")).then(function (result) {
                         if (result) {
                              var npmInstall = exec('npm install', {
                                   cwd: shell.pwd() + "/" + result + "/"
                              });
							  
							  var label = "";
							  if(yargs.argv.label || yargs.argv.l){
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

function InstallNodeModulesSync() {
     var projectList = [];
     var files = fs.readdirSync("./");
          for (var i in files) {
               if (fs.statSync(files[i]).isDirectory()) {
                    if(HasConfigFile(files[i], "package.json")){
                         projectList.push(files[i]);
                    }
               }
          }
	 var scriptDirectory  = shell.pwd();
     projectList.forEach(function(entry) {
		console.log("Installing Npm modules for " + entry);
		shell.cd(scriptDirectory + "\\" + entry + "\\")
		var npmInstall = shell.exec('npm install ', {silent:false}).stdout;
     }) 
}

function InstallBowerComponents() {
     var deferral = q.defer();
     fs.readdir("./", function (err, items) {
          for (var i = 0; i < items.length; i++) {
               if (fs.statSync(items[i]).isDirectory()) {
                    q.when(HasConfigFile(items[i], "bower.json")).then(function (result) {
                         if (result) {
                              var bowerInstall = exec('bower install', {
                                   cwd: shell.pwd() + "/" + result + "/"
                              });

							  var label = "";
							  if(yargs.argv.label || yargs.argv.l){
								  label = result + ": ";
							  }
                              bowerInstall.stdout.on('data', function (data) {
                                   console.log(label + data);
                              });
                         }
                    });
               }
          }
     });
     return deferral.promise;
}

function InstallBowerComponentsSync() {
     var projectList = [];
     var files = fs.readdirSync("./");
          for (var i in files) {
               if (fs.statSync(files[i]).isDirectory()) {
                    if(HasConfigFile(files[i], "bower.json")){
                         projectList.push(files[i]);
                    }
               }
          }
	 var scriptDirectory  = shell.pwd();
     projectList.forEach(function(entry) {
		console.log("Installing bower components for " + entry);
		shell.cd(scriptDirectory + "\\" + entry + "\\")
		var npmInstall = shell.exec('bower install ', {silent:false}).stdout;
     }) 
}

function Build(env) {
     var deferral = q.defer();
     fs.readdir("./", function (err, items) {
          for (var i = 0; i < items.length; i++) {
               if (fs.statSync(items[i]).isDirectory()) {
                    q.when(HasConfigFile(items[i], "Gruntfile.js")).then(function (result) {
                         if (result) {
							 
							  var forceGrunt = "";
							  if(yargs.argv.force || yargs.argv.f){
								  forceGrunt = " --force"
							  }
							 
                              var gruntBuild = exec('grunt ' + env + forceGrunt, {
                                   cwd: shell.pwd() + "/" + result + "/"
                              });

							  var label = "";
							  if(yargs.argv.label || yargs.argv.l){
								  label = result + ": ";
							  }
							  
                              gruntBuild.stdout.on('data', function (data) {
                                   console.log(label + data);
                              });
                         }
                    });
               }
          }
     });
     return deferral.promise;
}

function BuildSync(env) {
     var projectList = [];
     var files = fs.readdirSync("./");
          for (var i in files) {
               if (fs.statSync(files[i]).isDirectory()) {
                    if(HasConfigFile(files[i], "Gruntfile.js")){
                         projectList.push(files[i]);
                    }
               }
          }
	 var scriptDirectory  = shell.pwd();
     projectList.forEach(function(entry) {
		console.log("Building " + entry);
		var forceGrunt = "";
		if(yargs.argv.force || yargs.argv.f){
			forceGrunt = " --force"
	    }
		shell.cd(scriptDirectory + "\\" + entry + "\\")
		var gruntBuild = shell.exec('grunt ' + env + forceGrunt , {silent:false}).stdout;
     })          
};