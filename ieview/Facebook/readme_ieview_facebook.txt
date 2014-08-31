Title: Facebook IEView Template for Miranda IM
By: hummer
Contact: homer2k@gmx.net
Date: 19.03.2012

--------------------------------------------------
Attachment options can be customized in js/functions.php:

zoomOut:        0.6,            // multiplier image zoom out
zoomIn:         1.8,            // multiplier image zoom in
zoomOutVid:     0.8,            // multiplier video zoom out
zoomInVid:      1.2,            // multiplier video zoom in
imgExts:        ['.bmp', '.gif', '.jpg', '.png', '.xbm', 'jpeg'],  // image extensions
checkYoutube:   true,           // check for youtube videos - true/false
checkImages:    true,           // check for images - true/false
checkAlt:       true,           // check for alternate videos, visit www.embed.ly for more information
altUrls:        [               // url regex videohosters
                    /^http:\/\/(www.)?myvideo.de\/watch\/(.*)/i,
                    /^http:\/\/(www.)?liveleak.com\/view?(.*)/i,
                    /^http:\/\/video.google.(.*)\/videoplay?(.*)/i,
                    /^http:\/\/(www.)?metacafe.com\/(watch|w)\/(.*)/i,
                    /^http:\/\/(www.)?myspace.com\/video\/(.*)/i,
                    /^http:\/\/(.*)justin.tv\/(.*)\/(b|w)\/(.*)/i,
                    /^https?:\/\/(www.)?facebook.com\/video\/video.php(.*)/i,
                    /^https?:\/\/(www.)?facebook.com\/v\/(.*)/i,
                    /^http:\/\/(www.)?comedycentral.com\/(.*)\/(.*)\/(.*)/i,
                    /^http:\/\/(www.)?clipfish.de\/(.*)\/([0-9]+)\/(.*)/i,
                    /^http:\/\/(www.)?dailymotion.com\/video\/(.+)/i
                ],
embedlyKey:     'abcdefghijkl1234567890',           // your embed.ly key, visit www.embed.ly for more information
prevImgSize:    120,            // image preview width
prevVidWidth:   120,            // video preview width
prevVidHeight:  90,             // video preview height
videoWidth:     398,            // video width
videoHeight:    224,            // video height
hideVideoUrl:   false,          // hide video url
titleLen:       45,             // video title char length
descLen:        100             // video description char length


OR for specified message in facebook.ivt, e.g:

$('.message:last').findAttachment({
    checkImages: false,
    videoWidth: 600,
    videoHeight: 400
});

--------------------------------------------------
Version info:
0.3 (19.03.2012)
- Added video title/description
- Implemented embedly. (Visit www.embed.ly)

0.2 (06.03.2012)
- Added missing noavatar.jpg
- Added youtube and image preview (attachment)
- Added flash avatar support
- Changed filetransfer icon
- Fixed history message bug

0.1 (03.03.2012)
- First release
