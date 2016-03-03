
# Soundcloudfire
This webapp extens the functionality of soundcloud.
Features:
- On the Go Playlist
- share tracks in groups
- collect played  tracks history 
- analyze track (get some interessing metrics) 

Progress: https://waffle.io/paszin/soundcloudfire


Code Quality: 
 [![Codacy Badge](https://api.codacy.com/project/badge/grade/b5b9605432e04bb082280f88e5874181)](https://www.codacy.com/app/pascalslogin/soundcloudfire) 
[![Code Climate](https://codeclimate.com/github/paszin/soundcloudfire/badges/gpa.svg)](https://codeclimate.com/github/paszin/soundcloudfire) 
[![Issue Count](https://codeclimate.com/github/paszin/soundcloudfire/badges/issue_count.svg)](https://codeclimate.com/github/paszin/soundcloudfire) 

npm: [![Dependencies](https://david-dm.org/paszin/soundcloudfire.svg)](https://david-dm.org/paszin/soundcloudfire)

bower: [![Dependency Status](https://gemnasium.com/paszin/soundcloudfire.svg)](https://gemnasium.com/paszin/soundcloudfire)


This projects builds on AngularJS Cordova generator:

https://nodei.co/npm/generator-angularjs-cordova/


### Design Consistency

- Every button is represented by an icon. Every button has a mouse-over with info
- A Track can be represented as a card or list item (row)
- Every Track view can be toggled
- Current Track is always shown on top
- Every group of functionality is accessible via tabs
- Every List Item (Group, Playlist) has the same style: Icon + Title + Additional info (one line) + show-more-button
- Show more button is always chevron (up for hide, down for show)


