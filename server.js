var express = require('express'),
	app = express(),
	compression = require('compression'),
	open = require('open'),
	port = process.env.PORT || 8888,
	publicPath = '/',
	directory = __dirname + publicPath,
	launchUrl = 'http://localhost:' + port + publicPath,
	year = 60 * 60 * 24 * 365 * 1000;

// use compress middleware to gzip content
app.use(compression());

// set default mime type to xml for ".library" files
express.static.mime.default_type = "text/xml";

// serve up content directory showing hidden (leading dot) files
app.use(publicPath, express.static(directory, { maxAge: year, hidden: true }));

// * serve resources:
app.use("/Source Code", express.static(__dirname + '/Source Code', { dotfiles: 'allow' }));

// * serve Apps:
app.use("/", express.static(__dirname + '/'));

// start server
app.listen(port);

// launch uri in default browser
open(launchUrl);

// log to server console
console.log("Server running at\n  => " + launchUrl + " \nCTRL + C to shutdown")
