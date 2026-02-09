@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
echo Starting build with JAVA_HOME=%JAVA_HOME%
call gradlew.bat assembleDebug --info --stacktrace
