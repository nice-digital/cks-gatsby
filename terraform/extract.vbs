Set colArgs = WScript.Arguments.Named
strPath = colArgs.Item("path")
'The location of the zip file.
ZipFile=strPath
'The folder the contents should be extracted to.
ExtractTo="c:\terraform\"

'If the extraction location does not exist create it.
Set fso = CreateObject("Scripting.FileSystemObject")

If fso.FolderExists(ExtractTo) Then
   fso.DeleteFolder(ExtractTo)
End If

If NOT fso.FolderExists(ExtractTo) Then
   fso.CreateFolder(ExtractTo)
End If

'Extract the contants of the zip file.
set objShell = CreateObject("Shell.Application")
set FilesInZip=objShell.NameSpace(ZipFile).items
objShell.NameSpace(ExtractTo).CopyHere(FilesInZip)
Set fso = Nothing
Set objShell = Nothing
