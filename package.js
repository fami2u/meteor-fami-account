Package.describe({
    name: 'fami:account',
    version: '0.0.7',
    summary: 'fami base account',
    git: 'https://github.com/fami2u/meteor-fami-account',
    documentation: 'README.md'
});

Package.on_use(function(api) {

    api.use(["templating@1.1.5", "natestrauser:animate-css@3.4.0", "fortawesome:fontawesome@4.4.0"], 'client');
    api.use(["email@1.0.8","jparker:crypto-md5@0.1.1", "http@1.1.1" ], 'server');
    // api.use(["accounts-base@1.2.2"], ['client','server']);
    
    api.addFiles(["account-model.js","account.js"], ['client', 'server']);
    api.addFiles(["account-base.css","account-client.css","account-client.html","account-client.js"], ['client']);
    api.addFiles(["account-server.js"], ['server']);

    api.export(['facc','Users'], ['client', 'server']);
});