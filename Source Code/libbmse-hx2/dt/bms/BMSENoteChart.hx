package dt.bms;
import dt.bms.BMSENote;

class BMSENoteChart {
	private var notes : Array<BMSENote>;
	
	/**
	 * Initializes a blank notechart
	 */
	public function new() {
		notes = new Array();
	}
	
	/**
	 * Add new note to the notechart
	 */
	public function addNote(note:BMSENote) : BMSENoteChart {
		notes.push (note);
		return this;
	}
	
	/**
	 * Returns a reference to the list of notes.
	 */
	public function getNotes() : Array<BMSENote> {
		return this.notes;
	}
	
	/**
	 * Returns a copy of the current list of notes.
	 */
	public function snapshot() : Array<BMSENote> {
		return this.notes.copy();
	}
	
	/**
	 * Returns a copy of the current list of notes, sorted by time.
	 */
	public function snapshotByTime() : Array<BMSENote> {
		var shot = snapshot();
		return { shot.sort(sortNoteByTime); shot; };
	}
	
	/**
	 * Returns a copy of the current list of list of notes, sorted and grouped
	 * by time.
	 */
	public function snapshotGroupedByTime() : Array<Array<BMSENote>> {
		var shot : Array<BMSENote> = snapshotByTime();
		var output : Array<Array<BMSENote>> = new Array();
		var time : Int = -1;
		var i : Int;
		for (i in 0...shot.length) {
			var ctime = shot[i].getTime();
			if (ctime != time) {
				output[ctime] = new Array();
				time = ctime;
			}
			output[ctime].push (shot[i]);
		}
		return output;
	}
	
	/**
	 * Returns a copy of the current list of list of notes in a hash table.
	 * The key of the hash table is the channel of the note.
	 */
	public function snapshotGroupedByChannel() : Hash<Array<BMSENote>> {
		var shot = snapshotByTime();
		var group = new Hash();
		var i : Int;
		for (i in 0...shot.length) {
			var key : String = shot[i].getChannel();
			if (!group.exists(key)) {
				group.set (key, new Array());
			}
			group.get(key).push (shot[i]);
		}
		return group;
	}
	private function sortNoteByTime(x : BMSENote, y : BMSENote) : Int {
		return x.getTime() - y.getTime();
	}
	private function deleteZero(text : String) : String {
		while (text.substr(0, 1) == "0") {
			text = text.substr(1);
		}
		return text;
	}
	private function parseSingleClipboardLine(line : String) : Void {
		if (line.length < 12) { return; }
		var channel = line.substr(0, 3);
		var flag    = line.substr(3, 1);
		var time    = Std.parseInt(deleteZero(line.substr(4, 7)));
		var data    = Std.parseFloat(line.substr(11));
		var note    = new BMSENote(channel, flag, time, data);
		addNote (note);
	}
	
	/**
	 * Parses the note from the string "src", formatted in BMSE Note Data
	 * Format.
	 */
	public function parseClipboard(src : String) : BMSENoteChart {
		var lines : Array<String>;
		var i : Int;
		lines = src.split("\n");
		for (i in 0...lines.length) {
			if (lines[i].substr(lines[i].length - 1) == "\r") {
				lines[i] = lines[i].substr(0, lines[i].length - 1);
			}
		}
		if (lines[0] != "BMSE ClipBoard Object Data Format") {
			throw "Not a note chart!";
		}
		for (i in 1...lines.length) {
			parseSingleClipboardLine (lines[i]);
		}
		return this;
	}
	
	/**
	 * Exports the notechart into BMSE Format, which can be copied to the
	 * clipboard and pasted into BMSE directly.
	 */
	public function exportClipboard() : String {
		var op : Array<String>;
		var i : Int;
		op = new Array();
		op.push ("BMSE ClipBoard Object Data Format\r\n");
		for (i in 0...notes.length) {
			op.push (notes[i].toString());
		}
		return op.join("");
	}
}