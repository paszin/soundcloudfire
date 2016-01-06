all:
	grunt build
	cordova build android
	mv  platforms\android\builds\apk\android-debug.apk C:\Users\Paaascal\Dropbox\\soundcloudfire.apk
	
