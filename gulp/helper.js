var Lazy = require("lazy.js");
var config = require('./config');

var helpers = {
	getJsdelivrLocal : function(cdns) {
		var urls = [];
		Lazy(cdns).compact().each(function(cdn) {
			if ( typeof cdn.files === 'string' && cdn.files.length > 0) {
				cdn.files.split('+').forEach(function(file) {
					var segs = file.split('/');
					var name = segs[segs.length - 1];
					urls.push('bower_components/' + cdn.package + '/**/' + name);
				});
			} else {
				var main = getPath(cdn.package).split(',')[0].replace('/./', '/');
				urls.push(main);
			}
		});
		return urls;
	}
};

function one(pagename) {
	var resource = require('./resource/' + pagename + '.json');
	var helper = {};
	helper.jsdelivrLocalJs = helpers.getJsdelivrLocal(resource.jsdelivr.js);
	helper.jsdelivrLocalCss = helpers.getJsdelivrLocal(resource.jsdelivr.css);

	var units = [resource.test];
	helper.karmaFiles = Lazy([resource.cdn.js, helper.jsdelivrLocalJs, resource.local.js, units]).flatten().compact().toArray();
	return helper;
}

function all(pagenames) {
	var tmp = {
		jsdelivrLocalJs : [],
		jsdelivrLocalCss : [],
		karmaFiles : []
	};
	Lazy(pagenames).each(function(pagename) {
		var helper = one(pagename);
		tmp.jsdelivrLocalJs.push(helper.jsdelivrLocalJs);
		tmp.jsdelivrLocalCss.push(helper.jsdelivrLocalCss);
		tmp.karmaFiles.push(helper.karmaFiles);
	});
	helpers.jsdelivrLocalJs = Lazy(tmp.jsdelivrLocalJs).flatten().uniq().compact().toArray();
	helpers.jsdelivrLocalCss = Lazy(tmp.jsdelivrLocalCss).flatten().uniq().compact().toArray();

	var units = [config.scripts.src, config.scripts.tpl, config.test.fixtures, config.test.unit];
	helpers.karmaFiles = Lazy([tmp.karmaFiles, units]).flatten().uniq().compact().toArray();
}

all(config.pages);

module.exports = helpers;
