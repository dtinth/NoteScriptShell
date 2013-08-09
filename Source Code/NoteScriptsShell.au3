#include <Array.au3>
#include <GUIConstantsEx.au3>
#include <GUIConstants.au3>
#include <WindowsConstants.au3>
#Include <File.au3>

$gui = GUICreate("NoteScriptShell", 180, 320, -1, -1, $WS_SIZEBOX + $WS_SYSMENU + $WS_MINIMIZEBOX, $WS_EX_TOPMOST)
$list = GUICtrlCreateList("", 10, 50, 160, 160)
$refresh = GUICtrlCreateButton("Refresh", 10, 210, 65, 30)
$run = GUICtrlCreateButton("Run Script", 80, 210, 90, 30)
$label = GUICtrlCreateLabel("Please select a script and click Run.", 10, 10, 160, 40)

GUICtrlSetResizing ($list, 2 + 4 + 32 + 64)
GUICtrlSetResizing ($refresh, 2 + 64 + 256 + 512)
GUICtrlSetResizing ($run, 2 + 4 + 64 + 512)

$editconf = GUICtrlCreateButton("Config", 10, 250, 90, 30)
$resetconf = GUICtrlCreateButton("Reset", 105, 250, 65, 30)
GUICtrlSetResizing ($editconf,  2 + 4 + 64 + 512)
GUICtrlSetResizing ($resetconf, 4 + 64 + 256 + 512)

GUICtrlSetFont ($refresh, 9, 400, 0, "Verdana")
GUICtrlSetFont ($run, 9, 900, 0, "Verdana")
GUICtrlSetFont ($editconf, 9, 400, 0, "Verdana")
GUICtrlSetFont ($resetconf, 9, 400, 0, "Verdana")
GUICtrlSetFont ($label, 7, 400, 0, "Tahoma")

Func RefreshList()
	Local $files = _FileListToArray('Scripts', '*.txt')
	Local $data = ""
	For $i = 1 To $files[0]
		If $i > 1 Then
			$data &= "|"
		EndIf
		$data &= $files[$i]
	Next
	GUICtrlSetData ($list, "")
	GUICtrlSetData ($list, $data)
EndFunc

Func EncodeCode($text)
	Local $length = StringLen($text)
	Local $out = "('"
	For $i = 1 To $length
		$out &= "\u" & Hex(AscW(StringMid($text, $i, 1)), 4)
	Next
	Return $out & "')"
EndFunc

Func ParseScript($filename)
	$buffer = "";
	$file = StringSplit(FileRead("Scripts\" & $filename), @Lf);
	If FileExists("Conf\config-" & $filename) Then
		For $i = 1 To $file[0]
			If StringStripWS($file[$i], 8) = "//</configuration>" Then
				$file[$i] &= @Lf & FileRead("Conf\config-" & $filename) & @Lf
			EndIf
		Next
	EndIf
	$output = ""
	For $i = 1 To $file[0]
		If $i > 1 Then
			$output &= @CrLf
		EndIf
		$output &= $file[$i]
	Next
	Return $output
EndFunc

Func ExtractConfig($filename)
	$buffer = "";
	$file = StringSplit(FileRead("Scripts\" & $filename), @Lf);
	$output = "";
	$started = 0;
	For $i = 1 To $file[0]
		If StringStripWS($file[$i], 8) = "//<configuration>" Then
			$started = 1
		ElseIf StringStripWS($file[$i], 8) = "//</configuration>" Then
			Return $output
		ElseIf $started Then
			$output &= $file[$i] & @Lf;
		EndIf
	Next
	Return $output
EndFunc


Func EditConfig()
	If Not GUICtrlRead($list) Then
		MsgBox (0, "No Script Selected", "No script selected!", 0, $gui)
		Return
	EndIf
	Local $filename = GUICtrlRead($list)
	If Not FileExists("Conf\config-" & $filename) Then
		$cfg = ExtractConfig($filename);
		If Not $cfg Then
			MsgBox (0, "Config", "This script does not have a configuration info.", 0, $gui)
			Return
		EndIf
		FileWrite("Conf\config-" & $filename, $cfg)
	EndIf
	Run ("notepad """ & "Conf\config-" & $filename & """", ".")
EndFunc

Func DeleteConfig()
	If Not GUICtrlRead($list) Then
		MsgBox (0, "No Script Selected", "No script selected!", 0, $gui)
		Return
	EndIf
	Local $filename = GUICtrlRead($list)
	If FileExists("Conf\config-" & $filename) Then
		FileDelete ("Conf\config-" & $filename);
	EndIf
	MsgBox (0, "Done!", "Done!", 0, $gui);
EndFunc

Func RunCode()
	If Not GUICtrlRead($list) Then
		MsgBox (0, "No Script Selected", "No script selected!", 0, $gui)
		Return
	EndIf
	Local $file = GUICtrlRead($list)
	Local $code = FileRead("Lib\bootstrapper.js") & @CrLf & FileRead("Lib\libbmse-hx2.js") & @CrLf & "executeCode(" & EncodeCode(ParseScript($file)) & "," & EncodeCode(ClipGet()) & ");"
	FileDelete ("temp_code.js")
	FileWrite ("temp_code.js", $code)
	Local $process = Run("js.exe temp_code.js", ".", @SW_HIDE, 1 + 2 + 4)
	Local $line
	Local $errors = ""
	Local $output = ""
	Local $start = TimerInit()
	While 1
		$diff = TimerDiff($start)
		If $diff > 15000 Then
			MsgBox (0, "Timeout", "Script timeout!", 0, $gui)
			ProcessClose ($process)
			Return
		EndIf
		$line = StderrRead($process)
		If @error Then ExitLoop
		$errors &= $line
	Wend
	If $errors <> "" Then
		TrayTip ("JavaScript Code Error", $errors, 10)
		Return
	EndIf
	While 1
		$line = StdoutRead($process)
		If @error Then ExitLoop
		$output &= $line
	Wend
	FileDelete ("temp_code.js")
	$lines = StringSplit($output, @Lf)
	For $i = 1 To $lines[0]
		$line = $lines[$i]
		If StringLeft($line, 1) = ">" Then
			$data = StringSplit(StringMid($line, 2), ":")
			If $data[0] = 2 Then
				$message = $data[1]
				$value = SimpleDecode($data[2])
				If $message = "alert" Then
					MsgBox (0, "The script says:", $value, 0, $gui)
				ElseIf $message = "result" Then
					ClipPut (StringReplace(StringStripCR(StringStripWS($value, 1 + 2)), @Lf, @CrLf) & @CrLf)
				ElseIf $message = "status" Then
					TrayTip ("Script Statistics", $value, 10)
				EndIf
			EndIf
		EndIf
	Next
EndFunc

Func SimpleDecode($x)
	$x = StringReplace($x, "_C", ":")
	$x = StringReplace($x, "_R", @Cr)
	$x = StringReplace($x, "_N", @Lf)
	$x = StringReplace($x, "_U", "_")
	Return $x
EndFunc

RefreshList ()

GUISetState (@SW_SHOW)

$msg = 0



While $msg <> $GUI_EVENT_CLOSE

	$msg = GUIGetMsg()
	Select
		Case $msg = $list
			If GUICtrlRead($list) Then
				$data = FileReadLine("Scripts\" & GUICtrlRead($list))
				$help = "No help is available for this script."
				If (StringLeft($data, 2) = "//") Then
					$help = StringStripWS(StringMid($data, 3), 1 + 2)
				EndIf
				GUICtrlSetData ($label, $help)
			EndIf
		Case $msg = $run
			GUICtrlSetState ($run, $GUI_DISABLE)
			RunCode ()
			FileDelete ("temp_code.js")
			GUICtrlSetState ($run, $GUI_ENABLE)
		Case $msg = $editconf
			EditConfig ()
		Case $msg = $resetconf
			DeleteConfig ()
		Case $msg = $refresh
			RefreshList ()
	EndSelect

WEnd















