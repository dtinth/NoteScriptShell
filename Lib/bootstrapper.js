window = {};
document = {};

/* Util */
function toAZ(x) {
	return x.toString(36);
}
function parseAZ(x) {
	return parseInt(x, 36);
}
function isBPM(x) {
	return x.getChannel() == '008';
}
function isNote(x) {
	return (parseInt(x.getChannel(), 10) >= 11 && parseInt(x.getChannel(), 10) <= 19) || (parseInt(x.getChannel(), 10) >= 21 && parseInt(x.getChannel(), 10) <= 29);
}
function isAuto(x) {
	return (parseInt(x.getChannel(), 10) > 100);
}
function evalu(code, chart, alert, noCopy) {
	var print = undefined;
	eval (code);
}
function executeCode(js, clipboard) {
	function enc(x) {
		return x.split('_').join('_U').split('\r').join('_R').split('\n').join('_N').split(':').join('_C');
	}
	function msg(n, v) {
		print ('\n>'+n+':'+enc(v)+'\n');
	}
	var chart = new dt.bms.BMSENoteChart();
	var oldnotes = 0;
	chart.parseClipboard (clipboard);
	chart.snapshot().forEach(function(note) {
		note.already = 1;
		note.oldChannel = note.getChannel();
		note.oldTime    = note.getTime();
		note.oldFlag    = note.getFlag();
		note.oldData    = note.getData();
		oldnotes ++;
	});
	chart.createNote = function(channel, flag, time, data) {
		return new dt.bms.BMSENote(channel, flag, time, data);
	};
	var nx = 0;
	evalu (js, chart, function(x) {
		msg ('alert', x)
	}, function() {
		nx = 1;
	});
	if (!nx) {
		var added = 0, deleted = 0, modified = 0, unmodified = oldnotes;
		chart.snapshot().forEach(function(note) {
			if (!note.already) {
				added ++;
			} else if (note.isDeleted()) {
				deleted ++;
				unmodified --;
			} else if (note.getTime() != note.oldTime ||
				note.getData()    != note.oldData ||
				note.getFlag()    != note.oldFlag ||
				note.getChannel() != note.oldChannel) {
				modified ++;
				unmodified --;
			}
		});
		msg ('status', 'Script complete.\n' + added + ' added, ' + deleted + ' deleted, ' + modified + ' changed and ' + unmodified + ' unmodified.');
		msg ('result', chart.exportClipboard());
	}
}
