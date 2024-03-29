$estr = function() { return js.Boot.__string_rec(this,''); }
js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = (i != null?i.fileName + ":" + i.lineNumber + ": ":"");
	msg += js.Boot.__unhtml(js.Boot.__string_rec(v,"")) + "<br/>";
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("No haxe:trace element defined\n" + msg);
	else d.innerHTML += msg;
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
	else null;
}
js.Boot.__closure = function(o,f) {
	var m = o[f];
	if(m == null) return null;
	var f1 = function() {
		return m.apply(o,arguments);
	}
	f1.scope = o;
	f1.method = m;
	return f1;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":{
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				{
					var _g1 = 2, _g = o.length;
					while(_g1 < _g) {
						var i = _g1++;
						if(i != 2) str += "," + js.Boot.__string_rec(o[i],s);
						else str += js.Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			{
				var _g = 0;
				while(_g < l) {
					var i1 = _g++;
					str += ((i1 > 0?",":"")) + js.Boot.__string_rec(o[i1],s);
				}
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		}
		catch( $e0 ) {
			{
				var e = $e0;
				{
					return "???";
				}
			}
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = (o.hasOwnProperty != null);
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) continue;
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__") continue;
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	}break;
	case "function":{
		return "<function>";
	}break;
	case "string":{
		return o;
	}break;
	default:{
		return String(o);
	}break;
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return (o.__enum__ == null);
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	}
	catch( $e1 ) {
		{
			var e = $e1;
			{
				if(cl == null) return false;
			}
		}
	}
	switch(cl) {
	case Int:{
		return Math.ceil(o%2147483648.0) === o;
	}break;
	case Float:{
		return typeof(o) == "number";
	}break;
	case Bool:{
		return o === true || o === false;
	}break;
	case String:{
		return typeof(o) == "string";
	}break;
	case Dynamic:{
		return true;
	}break;
	default:{
		if(o == null) return false;
		return o.__enum__ == cl || (cl == Class && o.__name__ != null) || (cl == Enum && o.__ename__ != null);
	}break;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = (document.all != null && window.opera == null);
	js.Lib.isOpera = (window.opera != null);
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	}
	Array.prototype.remove = (Array.prototype.indexOf?function(obj) {
		var idx = this.indexOf(obj);
		if(idx == -1) return false;
		this.splice(idx,1);
		return true;
	}:function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	});
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}}
	}
	var cca = String.prototype.charCodeAt;
	String.prototype.cca = cca;
	String.prototype.charCodeAt = function(i) {
		var x = cca.call(this,i);
		if(isNaN(x)) return null;
		return x;
	}
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		}
		else if(len < 0) {
			len = this.length + len - pos;
		}
		return oldsub.apply(this,[pos,len]);
	}
	$closure = js.Boot.__closure;
}
js.Boot.prototype.__class__ = js.Boot;
js.Lib = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Lib.prototype.__class__ = js.Lib;
Std = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	if(x < 0) return Math.ceil(x);
	return Math.floor(x);
}
Std.parseInt = function(x) {
	var v = parseInt(x);
	if(Math.isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
Std.prototype.__class__ = Std;
dt = {}
dt.bms = {}
dt.bms.BMSENoteChart = function(p) { if( p === $_ ) return; {
	this.notes = new Array();
}}
dt.bms.BMSENoteChart.__name__ = ["dt","bms","BMSENoteChart"];
dt.bms.BMSENoteChart.prototype.addNote = function(note) {
	this.notes.push(note);
	return this;
}
dt.bms.BMSENoteChart.prototype.deleteZero = function(text) {
	while(text.substr(0,1) == "0") {
		text = text.substr(1);
	}
	return text;
}
dt.bms.BMSENoteChart.prototype.exportClipboard = function() {
	var op;
	var i;
	op = new Array();
	op.push("BMSE ClipBoard Object Data Format\r\n");
	{
		var _g1 = 0, _g = this.notes.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			op.push(this.notes[i1].toString());
		}
	}
	return op.join("");
}
dt.bms.BMSENoteChart.prototype.getNotes = function() {
	return this.notes;
}
dt.bms.BMSENoteChart.prototype.notes = null;
dt.bms.BMSENoteChart.prototype.parseClipboard = function(src) {
	var lines;
	var i;
	lines = src.split("\n");
	{
		var _g1 = 0, _g = lines.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			if(lines[i1].substr(lines[i1].length - 1) == "\r") {
				lines[i1] = lines[i1].substr(0,lines[i1].length - 1);
			}
		}
	}
	if(lines[0] != "BMSE ClipBoard Object Data Format") {
		throw "Not a note chart!";
	}
	{
		var _g1 = 1, _g = lines.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.parseSingleClipboardLine(lines[i1]);
		}
	}
	return this;
}
dt.bms.BMSENoteChart.prototype.parseSingleClipboardLine = function(line) {
	if(line.length < 12) {
		return;
	}
	var channel = line.substr(0,3);
	var flag = line.substr(3,1);
	var time = Std.parseInt(this.deleteZero(line.substr(4,7)));
	var data = Std.parseFloat(line.substr(11));
	var note = new dt.bms.BMSENote(channel,flag,time,data);
	this.addNote(note);
}
dt.bms.BMSENoteChart.prototype.snapshot = function() {
	return this.notes.copy();
}
dt.bms.BMSENoteChart.prototype.snapshotByTime = function() {
	var shot = this.snapshot();
	return (function($this) {
		var $r;
		shot.sort($closure($this,"sortNoteByTime"));
		$r = shot;
		return $r;
	}(this));
}
dt.bms.BMSENoteChart.prototype.snapshotGroupedByChannel = function() {
	var shot = this.snapshotByTime();
	var group = new Hash();
	var i;
	{
		var _g1 = 0, _g = shot.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			var key = shot[i1].getChannel();
			if(!group.exists(key)) {
				group.set(key,new Array());
			}
			group.get(key).push(shot[i1]);
		}
	}
	return group;
}
dt.bms.BMSENoteChart.prototype.snapshotGroupedByTime = function() {
	var shot = this.snapshotByTime();
	var output = new Array();
	var time = -1;
	var i;
	{
		var _g1 = 0, _g = shot.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			var ctime = shot[i1].getTime();
			if(ctime != time) {
				output[ctime] = new Array();
				time = ctime;
			}
			output[ctime].push(shot[i1]);
		}
	}
	return output;
}
dt.bms.BMSENoteChart.prototype.sortNoteByTime = function(x,y) {
	return x.getTime() - y.getTime();
}
dt.bms.BMSENoteChart.prototype.__class__ = dt.bms.BMSENoteChart;
Hash = function(p) { if( p === $_ ) return; {
	this.h = {}
	if(this.h.__proto__ != null) {
		this.h.__proto__ = null;
		delete(this.h.__proto__);
	}
	else null;
}}
Hash.__name__ = ["Hash"];
Hash.prototype.exists = function(key) {
	try {
		key = "$" + key;
		return this.hasOwnProperty.call(this.h,key);
	}
	catch( $e2 ) {
		{
			var e = $e2;
			{
				
				for(var i in this.h)
					if( i == key ) return true;
			;
				return false;
			}
		}
	}
}
Hash.prototype.get = function(key) {
	return this.h["$" + key];
}
Hash.prototype.h = null;
Hash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref["$" + i];
	}}
}
Hash.prototype.keys = function() {
	var a = new Array();
	
			for(var i in this.h)
				a.push(i.substr(1));
		;
	return a.iterator();
}
Hash.prototype.remove = function(key) {
	if(!this.exists(key)) return false;
	delete(this.h["$" + key]);
	return true;
}
Hash.prototype.set = function(key,value) {
	this.h["$" + key] = value;
}
Hash.prototype.toString = function() {
	var s = new StringBuf();
	s.b[s.b.length] = "{";
	var it = this.keys();
	{ var $it3 = it;
	while( $it3.hasNext() ) { var i = $it3.next();
	{
		s.b[s.b.length] = i;
		s.b[s.b.length] = " => ";
		s.b[s.b.length] = Std.string(this.get(i));
		if(it.hasNext()) s.b[s.b.length] = ", ";
	}
	}}
	s.b[s.b.length] = "}";
	return s.b.join("");
}
Hash.prototype.__class__ = Hash;
dt.bms.BMSENote = function(channel,flag,time,data) { if( channel === $_ ) return; {
	this.setChannel(channel);
	this.setFlag(flag);
	this.setTime(time);
	this.setData(data);
}}
dt.bms.BMSENote.__name__ = ["dt","bms","BMSENote"];
dt.bms.BMSENote.prototype.channel = null;
dt.bms.BMSENote.prototype.data = null;
dt.bms.BMSENote.prototype["delete"] = function() {
	this.deleted = true;
	return this;
}
dt.bms.BMSENote.prototype.deleted = null;
dt.bms.BMSENote.prototype.flag = null;
dt.bms.BMSENote.prototype.getChannel = function() {
	return this.channel;
}
dt.bms.BMSENote.prototype.getData = function() {
	return this.data;
}
dt.bms.BMSENote.prototype.getFlag = function() {
	return this.flag;
}
dt.bms.BMSENote.prototype.getTime = function() {
	return this.time;
}
dt.bms.BMSENote.prototype.isDeleted = function() {
	return (this.deleted?true:false);
}
dt.bms.BMSENote.prototype.setChannel = function(x) {
	this.channel = x;
	return this;
}
dt.bms.BMSENote.prototype.setData = function(x) {
	this.data = x;
	return this;
}
dt.bms.BMSENote.prototype.setDeleted = function(x) {
	this.deleted = x;
	return this;
}
dt.bms.BMSENote.prototype.setFlag = function(x) {
	this.flag = x;
	return this;
}
dt.bms.BMSENote.prototype.setTime = function(x) {
	this.time = x;
	return this;
}
dt.bms.BMSENote.prototype.time = null;
dt.bms.BMSENote.prototype.toString = function() {
	if(this.isDeleted()) {
		return "";
	}
	return this.channel + this.flag + ((function($this) {
		var $r;
		var t = "0000000" + ((function($this) {
			var $r;
			var m = Std.string($this.time);
			$r = ((m == null || m == "null")?"0":m);
			return $r;
		}($this)));
		$r = t.substr(t.length - 7);
		return $r;
	}(this))) + Std.string(this.data) + "\r\n";
}
dt.bms.BMSENote.prototype.undelete = function() {
	this.deleted = false;
	return this;
}
dt.bms.BMSENote.prototype.__class__ = dt.bms.BMSENote;
StringBuf = function(p) { if( p === $_ ) return; {
	this.b = new Array();
}}
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.add = function(x) {
	this.b[this.b.length] = x;
}
StringBuf.prototype.addChar = function(c) {
	this.b[this.b.length] = String.fromCharCode(c);
}
StringBuf.prototype.addSub = function(s,pos,len) {
	this.b[this.b.length] = s.substr(pos,len);
}
StringBuf.prototype.b = null;
StringBuf.prototype.toString = function() {
	return this.b.join("");
}
StringBuf.prototype.__class__ = StringBuf;
IntIter = function(min,max) { if( min === $_ ) return; {
	this.min = min;
	this.max = max;
}}
IntIter.__name__ = ["IntIter"];
IntIter.prototype.hasNext = function() {
	return this.min < this.max;
}
IntIter.prototype.max = null;
IntIter.prototype.min = null;
IntIter.prototype.next = function() {
	return this.min++;
}
IntIter.prototype.__class__ = IntIter;
$_ = {}
js.Boot.__res = {}
js.Boot.__init();
{
	js.Lib.document = document;
	js.Lib.window = window;
	onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if( f == null )
			return false;
		return f(msg,[url+":"+line]);
	}
}
{
	String.prototype.__class__ = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = Array;
	Array.__name__ = ["Array"];
	Int = { __name__ : ["Int"]}
	Dynamic = { __name__ : ["Dynamic"]}
	Float = Number;
	Float.__name__ = ["Float"];
	Bool = { __ename__ : ["Bool"]}
	Class = { __name__ : ["Class"]}
	Enum = { }
	Void = { __ename__ : ["Void"]}
}
{
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	Math.isFinite = function(i) {
		return isFinite(i);
	}
	Math.isNaN = function(i) {
		return isNaN(i);
	}
	Math.__name__ = ["Math"];
}
js.Lib.onerror = null;
