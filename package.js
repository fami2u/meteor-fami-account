Package.describe({
    name: 'fami:account',
    version: '0.0.1',
    summary: 'fami base account',
    git: 'https://github.com/fami2u/meteor-fami-account',
    documentation: 'README.md'
});



Package.on_use(function(api) {

    api.use(["templating", "natestrauser:animate-css", "fortawesome:fontawesome"], 'client');
    api.use(["email","jparker:crypto-md5", "http" ], 'server');
    

    api.addFiles(["account-model.js","account.js"], ['client', 'server']);
    api.addFiles(["account-base.css","account-client.css","account-client.html","account-client.js"], ['client']);
    api.addFiles(["account-server.js"], ['server']);

    api.export(['facc','Users'], ['client', 'server']);
});
