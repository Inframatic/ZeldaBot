// http://api.jquery.com/animate/
// var url = "http://localhost:8071/motion-control/update";
    var url = "http://192.168.0.105:8071/motion-control/update";
jQuery(document).ready(function() {    
    // Cache DOM Items
    var ball     = jQuery("#ball");
    var ballSize = {
        height: ball.height(),
        width : ball.width()
    };
    
    var boss     = jQuery("#boss");
    var bossSize = {
        height: boss.height(),
        width : boss.width()
    };
    
    var avatar     = jQuery("#avatar");
    var avatarSize = {
        height: avatar.height(),
        width : avatar.width()
    };
 // $(document).keydown(function(e){
 //      if(e.which == 65) {  
 //        var dir = (left) ? 1 : -1;
 //        console.log(dir);
 //        $(this).css({"-webkit-transform": "scaleX("+dir+")"});
 //        left = !left;
 //    }
 //  });


  $(document).keydown(function(key){
    key = parseInt(key.which, 10);

    // keypress: w
    if (key == 87) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { forward: 1 } } );

      $('#avatar').animate({ top: "-=10px"}, 15);


    // keypress: a
    } else if (key == 65) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { turn: -1 } } );

      $('#avatar').animate({ left: "-=10px"}, 15);
      $("#avatar").css({"-webkit-transform": "scaleX(-1)"});

    // keypress: s
    } else if (key == 83) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { forward: -1 } } );

      $('#avatar').animate({ top: "+=10px"}, 15);


    // keypress: d
    } else if (key == 68) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { turn: 1 } } );

      $('#avatar').animate({ left: "+=10px"}, 15);
        $("#avatar").css({"-webkit-transform": "scaleX(1)"});

    // keypress: q
    } else if (key == 81) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { strafe: -1 } } );

      $('#avatar').animate({ left: "-=10px"}, 15);


    // keypress: e
    } else if (key == 69) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { strafe: 1 } } );

      $('#avatar').animate({ left: "+=10px"}, 15);
    }
  });

  $(document).keyup(function(key){
    key = parseInt(key.which, 10);

    // keypress: w
    if (key == 87) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { forward: 0 } } );

    // keypress: a
    } else if (key == 65) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { turn: 0 } } );

    // keypress: s
    } else if (key == 83) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { forward: 0 } } );

    // keypress: d
    } else if (key == 68) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { turn: 0 } } );

    // keypress: q
    } else if (key == 81) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { strafe: 0 } } );

    // keypress: e
    } else if (key == 69) {
      $.ajax(url, {
        dataType: 'jsonp',
        type: 'POST',
        data: { strafe: 0 } } );
    }
  });

    var explosion = jQuery("#explosion");
    
    // Not all browsers support OGG (http://html5doctor.com/native-audio-in-the-browser/)
    var sound = new Audio("");
    
    // Generate Random Range (for speed & direction)
    function randomMinMax(min, max) {
        return Math.floor(min + (1 + max- min) * Math.random());
    }
    
    // function mirrorImage() {
    //     var dir = (left) ? 1 : -1;
    //     console.log(dir);
    //     $(this).css({"-webkit-transform": "scaleX("+dir+")"});
    //     left = !left;
    //     });
            // }
    // Collision Testing
    // item1 position & item1 size
    // item2 position & item2 size
    function testCollision(position1, size1, position2, size2) {
        if (((position1.left + size1.width)  > position2.left) &&
            ((position1.top  + size1.height) > position2.top)  &&
            ((position2.left + size2.width)  > position1.left) &&
            ((position2.top  + size2.height) > position1.top)) {
            
            // BadaBoom !
            triggerExplosion(position1.top, position1.left);
        }
    }
    
    // Boss Blink Animation (count must be even number)
    function blinkBall(count) {
        if (count > 0) {
            count--;
            
            ball.animate({ "opacity": "toggle" }, {
                duration: 75,
                queue   : false,
                complete: function() {
                    blinkBall(count);
                }
            });  
        }
    }

    function blinkAvatar(count) {
        if (count > 0) {
            count--;
            
            avatar.animate({ "opacity": "toggle" }, {
                duration: 75,
                queue   : false,
                complete: function() {
                    blinkAvatar(count);
                }
            });  
        }
    }
    
    var deathInProgress = false;
    function triggerDeath(top, left) {
        if (!deathInProgress) {
            deathInProgress = true;
            
            sound.play();
            blinkAvatar(4);
            
            explosion
                .css({ top: top, left: left })
                .show(300)
                .hide(100, function() {
                    deathInProgress = false;
                    avatar.css({ "opacity": 1 });
            });
        }
    }
    // Explosion Animation
    var explosionInProgress = false;
    function triggerExplosion(top, left) {
        if (!explosionInProgress) {
            explosionInProgress = true;
            
            sound.play();
            blinkBall(4);
            
            explosion
                .css({ top: top, left: left })
                .show(300)
                .hide(100, function() {
                    explosionInProgress = false;
                    ball.css({ "opacity": 1 });
            });
        }
    }
    
    // Loop Ball Animation
    function animateBall() {
        var top   = randomMinMax(50 , 250);
        var left  = randomMinMax(0  , 460);
        var speed = randomMinMax(500, 2000);

        // 1) Animate Ball
        ball.animate({ top: top, left: left }, {
            duration: speed,
            step    : function(now, fx) {
                testCollision(ball.position(), ballSize, boss.position(), bossSize);
            },
            queue   : false,
            complete: animateBall
        });        
    }
    
    function avatarCollision() {
        testCollision(avatar.position(), avatarSize, boss.position(), bossSize);
    }

    // Loop Boss Animation    
    function animateBoss() {
        var top   = randomMinMax(125 , 235);
        var left  = randomMinMax(0   , 390);    
        var speed = randomMinMax(1000, 3000);
        
        // 2) Animate Boss
        boss.animate({ top: top, left: left }, {
            duration: speed,
            queue   : false,
            complete: animateBoss
        });
    }
    


    // Start Animations
    animateBall();
    animateBoss();
});
