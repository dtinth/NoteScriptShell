package dt.bms;
class BMSENote {
	private var channel  : String;
	private var flag     : String;
	private var time     : Int;
	private var data     : Float;
	private var deleted  : Bool;
	/**
	 * Creates a new note object.
	 * Each note object has a channel, flag, time, and data, and deleted field.
	 * If the note is deleted, it will not be exported.
	 */
	public function new(channel : String, flag : String, time : Int, data : Float) {
		setChannel (channel);
		setFlag    (flag);
		setTime    (time);
		setData    (data);
	}
	public function getChannel()  { return channel; }
	public function getFlag()     { return flag; }
	public function getTime()     { return time; }
	public function getData()     { return data; }
	public function isDeleted()   { return deleted ? true : false; }
	public function setChannel(x) { channel = x;     return this; }
	public function setFlag(x)    { flag = x;        return this; }
	public function setTime(x)    { time = x;        return this; }
	public function setData(x)    { data = x;        return this; }
	public function delete()      { deleted = true;  return this; }
	public function undelete()    { deleted = false; return this; }
	public function setDeleted(x) { deleted = x;     return this; }
	/**
	 * Exports the note into BMSE format.
	 * If the note is deleted, returns a blank string.
	 */
	public function toString() {
		if (isDeleted()) {
			return "";
		}
		return channel + flag + ({
			var t = "0000000" + ({
				var m = Std.string(time);
				(m == null || m == "null") ? "0" : m;
			});
			t.substr(t.length - 7);
		}) + Std.string(data) + "\r\n";
	}
}