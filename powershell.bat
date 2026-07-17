@echo off
set "args=%*"
set "args=%args:-Command =%"
C:\Windows\System32\cmd.exe /c %args%
