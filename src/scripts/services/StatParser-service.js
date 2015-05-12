'use strict';

angularApp.service('StatParser', function() {
	var parse = function(data) {

		var domains = {};
		var status = [];
		var names = [];
		angular.forEach(data, function(stat, url) {
			url = url.split(':')[1].slice(2);
			var parts = url.split('.');
			var name = parts.shift();
			var dname = parts.map(function(p) {
				return p.charAt(0);
			}).reduce(function(a, b) {
				return a + b;
			});

			// Prepare domain
			var d = domains[dname];
			if (!d) {
				d = domains[dname] = {};
			}

			// Prepare Ping Period
			if (!d.PingTotal) {
				d.PingTotal = 0;
			}
			d.PingTotal += stat.PingTotal;
			if (!d.PingNum) {
				d.PingNum = 0;
			}
			d.PingNum += stat.PingNum;

			// DomainStatus
			status.push({
				x : name + '.' + dname,
				y : [stat.Success, dname.Fail]
			});

			//Sub Domain Success Fail
			names.push(name);
			if (!d.Success) {
				d.Success = [];
			}
			d.Success.push(stat.Success || 1);
			if (!d.Fail) {
				d.Fail = [];
			}
			d.Fail.push(stat.Fail || 1);
		});

		var dataPingDistance = [];
		var dataDomainSuccess = [];
		var dataDomainFail = [];
		Object.keys(domains).forEach(function(domain, name) {
			dataPingDistance.push({
				x : name,
				y : domain.PingTotal === 0 ? 0 : 1e9 * domain.PingNum / domain.PingTotal
			});

			dataDomainSuccess.push({
				x : name,
				y : domain.Success
			});
			dataDomainFail.push({
				x : name,
				y : domain.Fail
			});
		});

		var result = {};

		result.PingDistance = {
			series : ['Capability / Second'],
			data : dataPingDistance
		};
		result.DomainSuccess = {
			series : names,
			data : dataDomainSuccess
		};
		result.DomainFail = {
			series : names,
			data : dataDomainFail
		};

		result.DomainStatus = {
			series : ['Success', 'Fail'],
			data : status
		};

		return result;
	};

	return {
		parse : parse
	};
});