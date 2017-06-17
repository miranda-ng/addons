// search for attachments (images, youtube..)
(function($) {
    
    // Default options
    var O = {
        zoomOut:        0.8,            // multiplier image zoom out
        zoomIn:         1.2,            // multiplier image zoom in
        zoomOutVid:     0.8,            // multiplier video zoom out
        zoomInVid:      1.2,            // multiplier video zoom in
        imgExts:        ['.bmp', '.gif', '.jpg', '.png', '.xbm', 'jpeg'],  // image extensions
        checkYoutube:   false,           // check for youtube videos - true/false
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
        embedlyKey:     null,           // your embed.ly key, visit www.embed.ly for more information
        prevImgSize:    250,            // image preview width
        prevVidWidth:   120,            // video preview width
        prevVidHeight:  90,             // video preview height
        videoWidth:     250,            // video width
        videoHeight:    148,            // video height
        hideVideoUrl:   false,          // hide video url
        titleLen:       40,             // video title char length
        descLen:        200             // video description char length
    };
    
    var lang = {
        playvideo:  'play video',
        zoomIn:     'zoom in',
        zoomOut:    'zoom out',
        close:      'close',
        rotate90:   'rotate right',
        rotate0:    'normal angle',
        rotate270:  'rotate left'
    };
        
    // Methods
    var methods = {
        init: function() {
            return this.each(function() {
                var $attachment = $('<div></div>').addClass('attachment');
                                
                $('a', this).each(function() {
                    var $url = $(this).attr('href');
                    var $link = $(this);
                    
                    // Check for images
                    var $urlExt = $url.substr($url.length - 4, 4).toLowerCase();
                    if(O.checkImages) {
                        $.each(O.imgExts, function(i, extension) {
                            if(extension == $urlExt) {
                                var ctrl  = '<a title="view image" class="tgl sicon fb-img"></a>';
                                var cont = '<a href="' + $url + '" class="image"><img width="' + O.prevImgSize + '" src="' + $url + '" alt="' + $url + '" border="0"></a>';
                                var html = methods.buildViewer(ctrl, cont, 'image');
                                $attachment.append(html);
                            }
                        });
                    }
                                       
                    // Check for Youtube Videos
                    if($url.indexOf('youtube.com/watch') !== -1 && O.checkYoutube) {
                        var ytid  = $.jYoutube($url, 'id');
                        if(ytid.length == 11) {
                            var ytimg = $.jYoutube($url, 'small');
                            var rid = Math.floor(Math.random() * 99999);
                            
                            var ctrl  = '<div class="video-thumb">';
ctrl += '  <div class="video-desc" id="yt_' + rid + '_' + ytid + '"></div>';
                                ctrl += '  <img src="' + ytimg + '" width="' + O.prevVidWidth + '" height="' + O.prevVidHeight + '" class="tglVid" alt="' + ytimg + '">';
                                ctrl += '  <a class="play-btn" title="play video"></a>';
                                
                                ctrl += '</div>';
                                ctrl += '<a class="close btn-close sicon" title="' + lang.close + '"></a>';
                            var cont = '<embed width="' + O.videoWidth + '" height="' + O.videoHeight + '" flashvars="' + O.videoWidth + '&amp;' + O.videoHeight + '" wmode="opaque" allowfullscreen="true" scale="scale" quality="high" bgcolor="#FFFFFF" src="https://www.youtube.com/v/' + ytid + '?version=3&amp;autohide=1" type="application/x-shockwave-flash">';
                            
                            var html = methods.buildViewer(ctrl, cont, 'video'); 
                            
                            $.getJSON('http://gdata.youtube.com/feeds/api/videos?callback=?', {
                                q: ytid,
                                alt: 'json'
                            }, function(xhr) {
                                var desc = '<a class="nick" href="http://www.youtube.com">www.youtube.com</a><span class="desc">No information</span>';
                                if(typeof xhr.feed.entry === 'object') {
                                    var ytobj   = xhr.feed.entry[0];
                                    var title   = (ytobj.title.$t.length > O.titleLen + 3) ? ytobj.title.$t.substr(0, O.titleLen) + '...' : ytobj.title.$t;
                                    var content = (ytobj.content.$t.length > O.descLen) ? ytobj.content.$t.substr(0, O.descLen) + '...' : ytobj.content.$t;
                                        desc    = '<a class="nick" href="' + $url + '" title="' + ytobj.title.$t + '">' + title + '</a><span class="desc">' + content + '</span>';
                                } 
                                $('#yt_' + rid + '_' + ytid).html(desc);
                            });
                            
                            $attachment.append(html);
                            
                            if(O.hideVideoUrl) {
                                $link.remove();
                            }
                        }
                    }
                    
                    // Check for alternate videos using embedly
                    if(O.checkAlt && O.embedlyKey !== null) {             
                        $.each(O.altUrls, function(i, urlregex) {
                            if($url.search(urlregex) !== -1) {
                                // insert loading animation
                                var loadingId = Math.floor(Math.random() * 999999);
                                $('<div class="loading" id="load_' + loadingId + '"></div>').appendTo($attachment);
                                // get video informations
                                $.getJSON('http://api.embed.ly/1/oembed?callback=?', {
                                    url: $url,
                                    format: 'json',
                                    key: O.embedlyKey,
                                    maxwidth: O.videoWidth,
                                    chars: O.descLen
                                }, function(xhr) {
                                    var title   = (typeof xhr.title === 'string') ? xhr.title : $url;
                                    var content = (typeof xhr.description === 'string') ? xhr.description : '';
                                    var thumb   = (typeof xhr.thumbnail_url === 'string') ? xhr.thumbnail_url : 'css/images/no-image.png';
                                    var html    = (typeof xhr.html === 'string') ? xhr.html : '';
                                    
                                    var desc    = '<a class="nick" href="' + $url + '" title="' + title + '">' + title.substr(0, O.titleLen) + '</a><span class="desc">' + content + '</span>';                               
                                    var ctrl  = '<div class="video-thumb">';
                                        ctrl += '  <img src="' + thumb + '" width="' + O.prevVidWidth + '" height="' + O.prevVidHeight + '" class="tglVid" alt="' + thumb + '">';
                                        if(html !== '') {
                                            ctrl += '  <a class="play-btn" title="play video"></a>';
                                        }
                                        ctrl += '  <div class="video-desc">' + desc + '</div>';
                                        ctrl += '</div>';
                                        ctrl += '<a class="close btn-close sicon" title="' + lang.close + '"></a>';
                                    
                                    // Workaround since embedded IE does not display iframes?
                                    var $iframe = $(html);
                                    if($iframe.is('iframe')) {
                                        var src = $iframe.attr('src');
                                        html = '<object classid="clsid:25336920-03F9-11CF-8FD0-00AA00686F13" type="text/html" data="' + src + '" width="' + xhr.width + '" height="' + xhr.height + '"></object>';
                                    }
                                    
                                    var html = methods.buildViewer(ctrl, html, 'video'); 
                                    $('#load_' + loadingId).remove();
                                    $attachment.append(html);
                                                                        
                                });
                                
                                if(O.hideVideoUrl) {
                                    $link.remove();
                                }
                            }
                        });                    
                    }
                });
                
                // append attachment to message
                $attachment.append('<div style="clear:both"></div>');
                $(this).after($attachment);
            });
        },
        buildViewer: function(control, content, cat) {    
            var zoomInClass = (cat === 'video') ? 'zoomInVid' : 'zoomIn';
            var zoomOutClass = (cat === 'video') ? 'zoomOutVid' : 'zoomOut';

            var html  = '<div class="img-viewer">';
                html += control;
                html += '  <span class="img-controls">';
                html += '    <a title="zoom in" class="sicon ' + zoomInClass + '" title="' + lang.zoomIn + '"></a>';
                html += '    <a title="zoom out" class="sicon ' + zoomOutClass + '" title="' + lang.zoomOut + '"></a>';
                if(cat == 'image') {
                
                }
                html += '  </span>';
                html += '  <div class="image-prev">';
                html += content;
                html += '  </div>';
                html += '</div>';
                
            return html;
        },
        videoZoom: function(inout) {
            return this.each(function() {
                var $vid = $(this).closest('.img-viewer').find('embed, object');
                var multiplier = (inout == 'out') ? O.zoomOutVid : O.zoomInVid;

                $vid.width($vid.width() * multiplier);
                $vid.height($vid.height() * multiplier);
            });
        },
        zoom: function(inout) {
            return this.each(function() {
                var $img = $(this).closest('.img-viewer').find('.image-prev img');   
                var multiplier = (inout == 'out') ? O.zoomOut : O.zoomIn;

                $img
                .animate({
                    width: $img.width() * multiplier,
                    height: $img.height() * multiplier
                });
            });
        }
    };
    
    $.fn.findAttachment = function(options, method) {
       
        $.extend(O, options);
        
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 2));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist');
        } 
    }; 

})(jQuery);

// Status
(function($) {

    $.fn.writeStatus = function(options) {
    
        var getClassName = function() {
            return (options.text.indexOf('offline') !== -1) ? ' offline' : '';
        };
        
        var options = $.extend({
            name: '',
            text: '',
            history: '',
            tpl: {
                outer: '<div class="msg-outer status icon ' + getClassName() + ' ' + options.history + '"></div>',
                inner: '<span class="nick">' + options.name + '</span> <span class="info-txt">' + options.text + '</span>'
            }
        }, options);
        
        var $html = $(options.tpl.outer);
        $html.html(options.tpl.inner);
        $html.appendTo('body').fadeIn();
    }
    
})(jQuery);

// Support for flash-avatar
(function($) {
    $.fn.showAvatar = function(avatarUrl, options) {
        var options = $.extend({
            width: 32,
            height: 32
        }, options);
        return this.each(function() {
            var html;
            if(avatarUrl.substr(avatarUrl.length - 4, 4).toLowerCase() == '.swf') {
                html = '<embed type="application/x-shockwave-flash" width="' + options.width + '" height="' + options.height + '" src="' + avatarUrl + '">';
            } else {
                html = '<img src="' + avatarUrl + '" alt="Avatar">';
            }
            $(this).html(html);
        });
    };
})(jQuery);

// bind event-handler
$('body')
.on('click', '.zoomIn', function() {
    $(this).findAttachment({}, 'zoom', 'in');
})
.on('click', '.zoomOut', function() {
    $(this).findAttachment({}, 'zoom', 'out');
})
.on('click', '.zoomInVid', function() {
    $(this).findAttachment({}, 'videoZoom', 'in');
})
.on('click', '.zoomOutVid', function() {
    $(this).findAttachment({}, 'videoZoom', 'out');
})
.on('click', '.rotate', function() {
    var angle = $(this).attr('data-angle');
    $(this).closest('.img-viewer').find('.image-prev img').rotate(angle);
})
.on('click', '.closeVid', function() {
    $(this).closest('.img-viewer').find('.image-prev').fadeOut(function() {
        $(this).prev('.img-controls').fadeOut();
    });
})
.on('click', '.close', function() {
    var $container = $(this).closest('.img-viewer');
    $(this).fadeOut();
    $container.find('.img-controls, .image-prev').fadeOut(function() {
        $container.find('.video-thumb').fadeIn();
    });
})
.on('click', '.play-btn', function() {
    var $container = $(this).closest('.img-viewer');
    $(this).closest('.video-thumb').fadeOut(function() {
        $container.find('.img-controls, .image-prev').fadeIn();
        $(this).closest('.img-viewer').find('.close').fadeIn();
    });
})
.on('click', '.tgl', function() {
    if($(this).attr('title') == 'view image') {
        $(this).attr('title', 'close image').addClass('btn-close');
    } else {
        $(this).attr('title', 'view image').removeClass('btn-close');
    }
    var $container = $(this).closest('.img-viewer').find('.image-prev');
    $container.fadeToggle(function() {
        $(this).prev('.img-controls').fadeToggle();
    });
})
.on('click', '.img-prev-tgl', function() {
    $(this).fadeToggle(function() {
        $(this).closest('.img-viewer').find('.image-prev').fadeToggle(function() {
            $(this).prev('.img-controls').fadeToggle();
        });
    });
});
