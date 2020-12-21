var frame_width         = 8192; /* Standard width */
var frame_height        = 4608; /* Standard height */
var ratio               = 1;    /* Current ratio */
var idle_second         = 300;
var current_idle        = 0;
var current_function    = "";
var segmentTimer;

function init_home_page(){
    
    $(function(){
        
        /* Adjust standard dimension for main page. */
        frame_width = 1920;
        frame_height = 1080;
        
        /* Hide buttons. */
        $("#volume-container").hide();
        $("#home-button").hide();
        
        calculateRatio();
        
        /* Transform scale for different screen resolution. */
        $('#container').css('transform', 'scale(' + ratio + ')');
        
        clearPage();
        clearTimer();
        changeBackground("./assets/images/Video-Homepage.png");
        current_function = "init_home_page";
        
        var r = new Array(), j = -1;
        r[++j] = "<div class='tuas-south-video-button'></div>";
        r[++j] = "<div class='semakau-video-button'></div>";
        
        var obj = $(r.join(""));
        $("#page-container").append(obj);
        
        $(".tuas-south-video-button").click(function(event){
            $(".tuas-south-video-button").off("click");
            init_play_animation();
        });
        
        $(".semakau-video-button").click(function(event){
            $(".semakau-video-button").off("click");
            playSemakauLandfillVideo();
        });
    });
}

function playSemakauLandfillVideo(){
    // 5:25 to 7:41 = 137 seconds (inclusive)
    /* Clear existing popup */
    $(".semakau-popup").remove();
    
    var r = new Array(), j = -1;
    r[++j] = "<div class='semakau-popup'>";
    r[++j] =    "<div id='semakau-video-container'>";
    r[++j] =        "<video id='semakau-video' width='1152' height='864' autoplay preload='auto'>";
    r[++j] =            "<source src='./assets/video/Semakau Landfill Corporate Video.mp4' type='video/mp4'>";
    r[++j] =        "</video>";
    r[++j] =    "</div>";
    r[++j] = "</div>";
    
    var obj = $(r.join(""));
    $("#page-container").append(obj);
    
    /* Jump to play */
    $("#semakau-video")[0].currentTime = 325;
    $("#semakau-video").prop("volume", 1);  
    $("#semakau-video")[0].play();
    
    /* Timer to stop video and fade out. Set segmentTimer to timer. */
    segmentTimer = setTimeout(function(){
        var dim = 0;
        var fadeOutInterval = setInterval(function(){
            dim++; 
            $("#semakau-video-container").css("backgroundColor","rgba(0,0,0," + (dim/100) + ")");
            $("#semakau-video").prop("volume", (1-(dim/100)));
            if(dim >= 100){
                clearInterval(fadeOutInterval);
                $(".semakau-popup").delay(900).fadeOut(1300, function(){
                    init_home_page();
                });
            }
        }, 35);
    }, 135900);
   
    $("#home-button").addClass('semakau-home-button');

    $("#home-button").show();
   
    $("#home-button").click(function(event){
        init_home_page();
    }); 
}

function init_play_animation(){
    
    /* Adjust standard dimension for animation. */
    frame_width = 8192;
    frame_height = 4608;
    
    $("#volume-container").show();
    
    /* Home Button */
    $("#home-button").removeClass('semakau-home-button');
    $("#home-button").show();
    
    calculateRatio();
        
    /* Transform scale for different screen resolution. */
    $('#container').css('transform', 'scale(' + ratio + ')');
    
    /* click audio */
    clearPage();
    clearTimer();
    changeBackground("./assets/images/Home-Main.png");
    current_function = "init_play_animation";
    
    /* Wait all images loaded first. */
    segmentTimer = setTimeout(function(){
        $(".page-background").ready(function(){
            playAnimation("segment_0", true);    
        });
    }, 800);
    
    $("#volume-container").off("click");
    
    $("#volume-container").click(function(event){
        toggleVolume();
    });   
    
    $("#home-button").click(function(event){
        $("#audio-player")[0].pause();
        $("#scale-container").css('transition-duration', "0s").css("transform", "none");
        init_home_page();
    }); 
}

function toggleVolume(){
    
    if($("#audio-player").prop("volume") != 1){
        $("#audio-player").prop("volume", 1);    
        $("#volume-container").html('<i class="fa fa-volume-up"></i>');
    }else{
        $("#audio-player").prop("volume", 0);
        $("#volume-container").html('<i class="fa fa-volume-off"></i><i class="fa fa-ban"></i>');
    }    
}

function init_idle_timeout(){
    
    if(idle_second != 0){
        var idle = setInterval(function(){ 
            current_idle++;
            if(current_idle > idle_second){
                current_idle = 0;
                init_home_page();
            }
        }, 1000);
        
        $('body').click(function(){
            current_idle = 0;
        });    
    }
}

function zoomSegment(currentSegment){
    
    /* Animate box movement. Calculate parameter based on ratio. */
    var segmentData = segments[currentSegment];
    
    var x = segmentData.x;
    var y = segmentData.y;
    var zoom_ratio = segmentData.zoom;
    var zoom_duration = segmentData.zoom_duration;
   
    $("#scale-container")
        .css('transition-duration', zoom_duration + 's')
        .css({transform:'translate3d(' + (x*zoom_ratio) + 'px, ' + (y*zoom_ratio) + 'px,0) scale(' + zoom_ratio + ')'});
}

function playAnimation(currentSegment, jumpAudio){
    
    var segmentData = segments[currentSegment];
    
    /* Audio - if true then play. */
    if(jumpAudio){
        playAudio(segmentData.time);
    }
    
    /* Zoom Segment */
    zoomSegment(currentSegment);
   
    switch(currentSegment){
        
        case "segment_0": 
            
            /* Clear All */
            clearPage();
            
            segmentTimer = setTimeout(function(){ playAnimation("segment_1", false); }, segmentData.duration * 1000);
            
            /* Graphic - Lorry */
            var obj = $("<div id='lorry' class='lorry-animation'><img class='tile-thumbnail' src='./assets/images/Lorry.png'/></div>");
            $("#page-container").append(obj);
            
            obj.fadeIn(4000);
            
            /* Graphic - Lorry Door */
            var obj = $("<div id='lorry-door' class='lorry-door-animation'><img class='tile-thumbnail' src='./assets/images/Lorry-Door.png'/></div>");
            $("#page-container").append(obj);
            
            obj.fadeIn(4000);
            
            /* Graphic - Lorry Yellow Arrow */
            var r = new Array(), j = -1;
            r[++j] = "<div id='lorry-arrow-box'>";
            r[++j] =    "<div id='lorry-arrow-1' class='lorry-yellow-arrow'><img class='tile-thumbnail' src='./assets/images/Lorry-Yellow-Arrow.png'/></div>";
            r[++j] =    "<div id='lorry-arrow-2' class='lorry-yellow-arrow'><img class='tile-thumbnail' src='./assets/images/Lorry-Yellow-Arrow.png'/></div>";
            r[++j] =    "<div id='lorry-arrow-3' class='lorry-yellow-arrow'><img class='tile-thumbnail' src='./assets/images/Lorry-Yellow-Arrow.png'/></div>";
            r[++j] =    "<div id='lorry-arrow-4' class='lorry-yellow-arrow'><img class='tile-thumbnail' src='./assets/images/Lorry-Yellow-Arrow.png'/></div>";
            r[++j] =    "<div id='lorry-arrow-5' class='lorry-yellow-arrow'><img class='tile-thumbnail' src='./assets/images/Lorry-Yellow-Arrow.png'/></div>";
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            /* Graphic -  Cut Small Pieces Text */
            var obj = $("<div id='cut-small-pieces'><img class='tile-thumbnail' src='./assets/images/Cut-Or-Crushed-Into-Small-Pieces.png'/></div>");
            $("#page-container").append(obj);
            
            /* Graphic - Grab Box */
            var r = new Array(), j = -1;
            r[++j] = "<div id='grab-box'>";
            r[++j] =    "<div id='grab-cable-box'>"; /* Grab Cable Hook Box*/
            r[++j] =        "<div id='grab-cable'><img class='tile-thumbnail' src='./assets/images/Grab-Cable.png'/></div>"; /* Grab Cable*/
            r[++j] =        "<div id='grab-hook-box'>"; /* Left hook, right hook box */
            r[++j] =            "<div id='grab-left-hook'><img class='tile-thumbnail' src='./assets/images/Grab-Left-Hook.png'/></div>"; 
            r[++j] =            "<div id='grab-right-hook'><img class='tile-thumbnail' src='./assets/images/Grab-Right-Hook.png'/></div>"; 
            r[++j] =        "</div>";
            r[++j] =    "</div>";
            r[++j] = "</div>";
           
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            obj.fadeIn(4000);
            
            break;
            
        case "segment_1": 
        
            segmentTimer = setTimeout(function(){ playAnimation("segment_2", false); }, segmentData.duration * 1000);
            
            /* Graphic -  Overhead Grab Cranes Text */
            var obj = $("<div id='Overhead-Grab-Cranes'><img class='tile-thumbnail' src='./assets/images/Overhead-Grab-Cranes.png'/></div>");
            $("#page-container").append(obj);
            
            /* Graphic - Green Arrow */
            var r = new Array(), j = -1;
            r[++j] = "<div id='green-arrow-box'>";
            r[++j] =    "<div id='green-arrow-1' class='green-arrow'><img class='tile-thumbnail' src='./assets/images/Green-Arrow.png'/></div>";
            r[++j] =    "<div id='green-arrow-2' class='green-arrow'><img class='tile-thumbnail' src='./assets/images/Green-Arrow.png'/></div>";
            r[++j] =    "<div id='green-arrow-3' class='green-arrow'><img class='tile-thumbnail' src='./assets/images/Green-Arrow.png'/></div>";
            r[++j] =    "<div id='green-arrow-4' class='green-arrow'><img class='tile-thumbnail' src='./assets/images/Green-Arrow.png'/></div>";
            r[++j] =    "<div id='green-arrow-5' class='green-arrow'><img class='tile-thumbnail' src='./assets/images/Green-Arrow.png'/></div>";
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            break;
            
        case "segment_2": 
        
            segmentTimer = setTimeout(function(){ playAnimation("segment_3", false); }, segmentData.duration * 1000);
            
            /* Graphic - Fire */
            var r = new Array(), j = -1;
            r[++j] = "<div id='fire-box'>";
            r[++j] =    "<div id='fire-1'><img class='tile-thumbnail' src='./assets/images/Big-Fire.png'/></div>";
            r[++j] =    "<div id='fire-2'><img class='tile-thumbnail' src='./assets/images/Big-Fire.png'/></div>";
            r[++j] =    "<div id='fire-3'><img class='tile-thumbnail' src='./assets/images/Big-Fire.png'/></div>";
            r[++j] =    "<div id='fire-4'><img class='tile-thumbnail' src='./assets/images/Big-Fire.png'/></div>";
            r[++j] =    "<div id='fire-5'><img class='tile-thumbnail' src='./assets/images/Big-Fire.png'/></div>";
            r[++j] =    "<div id='flame-fire'><img class='tile-thumbnail' src='./assets/images/Flame-Fire.png'/></div>";
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            /* Graphic - Combustion Sustained */
            var obj = $("<div id='combustion-sustained'><img class='tile-thumbnail' src='./assets/images/Combustion-Sustained.png'/></div>");
            $("#page-container").append(obj);
            
            break;
            
        case "segment_3":
         
            segmentTimer = setTimeout(function(){ playAnimation("segment_4", false); }, segmentData.duration * 1000);
            
            /* Graphic - Blue Arrow Box */
            var r = new Array(), j = -1;
            r[++j] = "<div id='blue-arrow-box'>";
            r[++j] =    "<div id='blue-arrow-head-1' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-2' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-3' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-4' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-5' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-6' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-7' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-8' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-9' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-10' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    "<div id='blue-arrow-head-11' class='blue-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Arrow-Head.png'/></div>";
            r[++j] =    '<svg width="628" height="84" viewBox="0 0 628 84">';
            r[++j] =        '<rect id="blue-stroke" x="9" y="9" rx="33" ry="33" width="610" height="66" fill="none" stroke="#184798" stroke-width="18" stroke-dashoffset="0" stroke-dasharray="60"/>';
            r[++j] =        'Sorry, your browser does not support inline SVG.';
            r[++j] =    '</svg>';
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
        
            /* Graphic - Stroker Grate */
            var obj = $("<div id='stoker-grate'><img class='tile-thumbnail' src='./assets/images/Stoker-Grate-Text.png'/></div>");
            $("#page-container").append(obj);
            
            /* Graphic - Pre-heated Air */
            var obj = $("<div id='pre-heated-air'><img class='tile-thumbnail' src='./assets/images/Preheated-Air-Text.png'/></div>");
            $("#page-container").append(obj);
            
            /* Graphic - Yellow Heat Arrow. Container and inner container for 4 rows. Timer arrow swing. */
            var r = new Array(), j = -1;
            r[++j] = "<div id='yellow-heat-arrow-container'>";
            r[++j] =    "<canvas class='yellow-arrow-canvas' id='yellow-arrow-canvas-1' width='205' height='96'></canvas>";
            r[++j] =    "<canvas class='yellow-arrow-canvas' id='yellow-arrow-canvas-2' width='205' height='96'></canvas>";
            r[++j] =    "<canvas class='yellow-arrow-canvas' id='yellow-arrow-canvas-3' width='205' height='96'></canvas>";
            r[++j] =    "<canvas class='yellow-arrow-canvas' id='yellow-arrow-canvas-4' width='205' height='96'></canvas>";
            r[++j] = "</div>";
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            for(var i = 1; i <= 4; i++){
                var canvas = document.getElementById('yellow-arrow-canvas-' + i);
                drawYellowArrow(canvas, 0, 1);
            }
            
            break;
            
        case "segment_4": 
        
            segmentTimer = setTimeout(function(){ playAnimation("segment_5", false); }, segmentData.duration * 1000);
            
            /* Graphic - Operating Temperature */
            var obj = $("<div id='Operating-Tempeature'><img class='tile-thumbnail' src='./assets/images/Operating-Temperature-Text.png'/></div>");
            $("#page-container").append(obj);
                
            /* Graphic - Flue Gas */
            var obj = $("<div id='flue-gas'><img class='tile-thumbnail' src='./assets/images/Flue-Gas-Text.png'/></div>");
            $("#page-container").append(obj);
            
            /* Graphic - Boiler */
            var obj = $("<div id='boiler'><img class='tile-thumbnail' src='./assets/images/Boiler-Text.png'/></div>");
            $("#page-container").append(obj);
            
            /* Graphic - Blue Rotating Arrows */
            var r = new Array(), j = -1;
            r[++j] = "<div id='blue-furnace-arrow-container'>";
            
            for(var i = 0; i < 16; i++){
                r[++j] =    "<div style='animation-delay: -" + (i * 3) + "s' class='blue-furnace-arrow-head'><img class='tile-thumbnail' src='./assets/images/Blue-Furnace-Arrow-Head.png'/></div>";
            }
            
            r[++j] =    '<svg height="898" width="716" viewBox="0 0 716 898">';
            r[++j] =        '<path id="blue-furnace-stroke" d="M 679.5 542 L679.5 214.5 A 178 178 0 0 0 323.5 214.5 L323.5 716.5 A 145 145 0 0 1 33.5 716.5 L33.5 0" stroke="#184798" stroke-width="36" fill="none" stroke-dashoffset="0" stroke-dasharray="66,140" />';
            r[++j] =    '</svg>';
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            /* Graphic - Super Heated Steam */
            var obj = $("<div id='super-heated-steam'><img class='tile-thumbnail' src='./assets/images/Super-Heated-Steam-Text.png'/></div>");
            $("#page-container").append(obj);
            
            break;
            
        case "segment_5": 
        
            segmentTimer = setTimeout(function(){ playAnimation("segment_6", false); }, segmentData.duration * 1000);
            
            /* Graphic - Reactor Heat */
            var r = new Array(), j = -1;
            r[++j] = "<div id='reactor-container'>";
            r[++j] =    "<div id='reactor-segment'><img class='tile-thumbnail' src='./assets/images/Reactor-Segment.png'/></div>";
            r[++j] =    "<div class='reactor-heat'><img class='tile-thumbnail' src='./assets/images/Reactor-Heat.png'/></div>";
            r[++j] =    "<div class='reactor-heat'><img class='tile-thumbnail' src='./assets/images/Reactor-Heat.png'/></div>";
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            /* Graphic - Super Heated Steam Arrow */
            var r = new Array(), j = -1;
            r[++j] = "<div id='reactor-arrow-container'>";
            for(var i = 0; i < 16; i++){
                r[++j] =    "<div style='animation-delay: " + (-i * 3) + "s' class='reactor-arrow-head'><img class='tile-thumbnail' src='./assets/images/Reactor-Arrow-Head.png'/></div>";
            }
            
            r[++j] =    '<svg height="636" width="1740" viewBox="0 0 1740 636">';
            r[++j] =        '<path id="reactor-arrow-stroke" d="M 1694 0 L 1694 483 A 85 85 0 0 1 1506 525 A 85 85 0 0 0 1453 450 L 0 450" stroke="#007575" stroke-width="46" fill="none" stroke-dashoffset="0" stroke-dasharray="86,146" />';
            r[++j] =    '</svg>';
            r[++j] = "</div>";
            
            r[++j] = "<div id='reactor-arrow-container-red'>";
            for(var i = 0; i < 16; i++){
                r[++j] =    "<div style='animation-delay: " + (-i * 3) + "s' class='reactor-arrow-head'><img class='tile-thumbnail' src='./assets/images/Reactor-Arrow-Head-Red.png'/></div>";
            }
            
            r[++j] =    '<svg height="636" width="1740" viewBox="0 0 1740 636">';
            r[++j] =        '<path id="reactor-arrow-stroke-red" d="M 1694 0 L 1694 483 A 85 85 0 0 1 1506 525 A 85 85 0 0 0 1453 450 L 0 450" stroke="#f07351" stroke-width="46" fill="none" stroke-dashoffset="0" stroke-dasharray="86,146" />';
            r[++j] =    '</svg>';
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            break;
            
        case "segment_6": 
        
            segmentTimer = setTimeout(function(){ playAnimation("segment_7", false); }, segmentData.duration * 1000);
            
            /* Graphic - Chimney Arrow */
            var r = new Array(), j = -1;
            
            r[++j] = "<div id='chimney-container'>";
            for(var i = 0; i < 16; i++){
                r[++j] =    "<div style='animation-delay: " + (-i * 3) + "s' class='chimney-arrow-head'><img class='tile-thumbnail' src='./assets/images/Chimney-Arrow-Head.png'/></div>";
            }
            
            r[++j] =    '<svg width="742" height="1463" viewBox="0 0 742 1463">';
            r[++j] =        '<path id="chimney-arrow-stroke" d="M 742 1417 L 85 1417 A 85 85 0 0 1 46 1378 L 46 0" stroke="#184798" stroke-width="46" fill="none" stroke-dashoffset="0" stroke-dasharray="85,144" />';
            r[++j] =    '</svg>';
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            /* Graphic - Chimney Height Text */
            var obj = $("<div id='chimney-150m'><img class='tile-thumbnail' src='./assets/images/Chimney-150m.png'/></div>");
            $("#page-container").append(obj);
            
            /* Graphic - Chimney Arrow Top */
            var r = new Array(), j = -1;
            r[++j] = "<div id='chimney-top-arrow-container'>";
            r[++j] =    "<div id='chimney-top-arrow'><img class='tile-thumbnail' src='./assets/images/Long-Arrow.png'/></div>";
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
           
            /* Graphic - Chimney Arrow Bottom */
            var r = new Array(), j = -1;
            r[++j] = "<div id='chimney-bottom-arrow-container'>";
            r[++j] =    "<div id='chimney-bottom-arrow'><img class='tile-thumbnail' src='./assets/images/Long-Arrow.png'/></div>";
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            break;
            
        case "segment_7": 
        
            segmentTimer = setTimeout(function(){ playAnimation("segment_8", false); }, segmentData.duration * 1000);
            
            /* Graphic - Vibrating Conveyors Text */
            var obj = $("<div id='vibrating-conveyor'><img class='tile-thumbnail' src='./assets/images/Vibrating-Conveyor-Text.png'/></div>");
            $("#page-container").append(obj);
            
            /* Graphic - Electromagnetic Separator Text */
            var obj = $("<div id='electromagnetic-separator'><img class='tile-thumbnail' src='./assets/images/Electromagnetic-Separator-Text.png'/></div>");
            $("#page-container").append(obj);
           
            /* Graphic - Vibrating Conveyor */
            var r = new Array(), j = -1;
            r[++j] = "<div id='vibrating-conveyor-container'>";
            for(var i = 0; i < 19; i++){
                r[++j] =    "<div style='animation-delay: " + (-i * 3) + "s' class='vibrating-conveyor-arrow-head'><img class='tile-thumbnail' src='./assets/images/Vibrating-Conveyor-Arrow-Head.png'/></div>";
            }
            
            r[++j] =    '<svg width="1152" height="134" viewBox="0 0 1152 134">';
            r[++j] =        '<path id="vibrating-conveyor-stroke" d="M 71.5 115.5 L 1080.5 115.5 A 50 50 0 0 0 1080.5 18.5 L 71.5 63.5 A 27.5 27.5 0 0 0 71.5 115.5 Z" stroke="#184798" stroke-width="19" fill="none" stroke-dashoffset="0" stroke-dasharray="53,64" />';
            r[++j] =    '</svg>';
            r[++j] = "</div>";
            
            var obj = $(r.join(""));
            $("#page-container").append(obj);
            
            break;
            
        case "segment_8":
            
            /* Hide before replay. */
            setTimeout(function(){
                
                $("#lorry-door").fadeOut(1000);
                $("#lorry").fadeOut(1000);
                $("#lorry-arrow-box").fadeOut(1000);
                $("#stoker-grate").fadeOut(1000); 
                $("#Overhead-Grab-Cranes").fadeOut(1000); 
                $("#grab-box").fadeOut(1000);
                
            }, 3000);
            
            clearTimer();
            
            segmentTimer = setTimeout(function(){ init_home_page(); }, segmentData.duration * 1000);
            
            break;
    }
}

function drawYellowArrow(canvas, curvePoint, direction){
    
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    
    curvePoint += (direction);
    
    /* Draw 3 arrows */
    for(var i = 0; i < 3; i++){
        ctx.beginPath();
        ctx.moveTo(25 + (68*i), 0);
        ctx.lineTo(0 + (68*i), 26);
        ctx.lineTo(50 + (68*i), 26);
        ctx.moveTo(12.5 + (68*i), 25);
        ctx.quadraticCurveTo((12.5 + curvePoint) + (68*i), 50, 12.5 + (68*i), 75); /* Curve = 10px */
        ctx.lineTo(37.5 + (68*i), 75);
        ctx.quadraticCurveTo((37.5 + curvePoint) + (68*i), 50, 37.5 + (68*i), 25); /* Curve = 10px */
        ctx.lineTo(12.5 + (68*i), 25);
        ctx.strokeStyle="#F2BD31";
        ctx.stroke();
        ctx.fillStyle = "#F2BD31";
        ctx.fill();   
    }
    
    if(curvePoint >= 15){
        direction = -.9;
    }
    
    if(curvePoint <= -15){
        direction = .9;
    }
    
    requestAnimationFrame(function(){
        drawYellowArrow(canvas, curvePoint, direction);
    });
}

function playAudio(currentTime){
    $("#audio-player")[0].currentTime = currentTime;
    $("#audio-player")[0].play();
}

function calculateRatio(){
    var container_width = $("#container").width();
    ratio = container_width / frame_width;
}

function changeBackground(src){
    $(".page-background").remove();
    $("#scale-container").append('<img class="page-background" src="' + src + '"/>');
}

function clearPage(){
    $("#page-container").empty();
    calculateRatio();
}

function clearTimer(){
    clearTimeout(segmentTimer);
}

function rescale(obj, options){
    
    $.each(obj, function(){
        $(this).width($(this).width() * ratio).height($(this).height() * ratio);
        var target_obj = $(this);
        
        if(typeof options !== 'undefined'){
            $.each(options, function(i, val){
                switch(val){
                    case "left":
                        target_obj.css("left", (target_obj.position().left * ratio) + "px");
                        break;
                    case "top": 
                        target_obj.css("top", (target_obj.position().top * ratio) + "px");
                        break;
                    case "right": 
                        target_obj.css("right", (parseInt(target_obj.css("right").replace("px", "")) * ratio) + "px");
                        break;
                    case "font":
                        target_obj.css("font-size", (parseInt(target_obj.css("font-size").replace("px", "")) * ratio) + "px");
                        break;
                    case "padding": 
                        target_obj.css("padding", (parseInt(target_obj.css("padding").replace("px", "")) * ratio) + "px");
                        break;
                    case "border-radius": 
                        target_obj.css("border-radius", (parseInt(target_obj.css("border-radius").replace("px", "")) * ratio) + "px");
                        break;
                    case "border-width":
                        target_obj.css("borderWidth", (parseInt(target_obj.css("borderWidth").replace("px", "")) * ratio) + "px"); 
                        break;
                }
            });
        }
    });    
}