var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'00 Amazon Product Search',
  description: 'Amazon Product Search.',
  script: __dirname+'/web.js',
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // CHANGE execPath to point to the node.exe binary
  execPath: 's:\\TOOLS\\Anaconda3\\envs\\bs\\node.exe',
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
  , workingDirectory: 's:\\PROJECTS\\amazon-product-api'
  //, allowServiceLogon: true
});

var do_install = false;
  if (do_install ){
  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svc.on('install',function(){
    svc.start();
  });
  
  svc.install();
} else {
  
  // Listen for the "uninstall" event so we know when it's done.
  svc.on('uninstall',function(){
    console.log('Uninstall complete.');
    console.log('The service exists: ',svc.exists);
  });

  // Uninstall the service.
  svc.uninstall();
}