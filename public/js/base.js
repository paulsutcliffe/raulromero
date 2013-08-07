$(document).ready(function(){

	//PreLoader
	var header =$("#wrapHeader");
	var underLayer =$('#underlayer');
	$(window).load(function() {
		$("#wrapHeader,#underlayer").css('opacity',0);
		$("#status").fadeOut();
		$("#preloader").delay(350).fadeOut("slow",function() {
			header.stop().animate({top:0,opacity:1},800,'easeOutSine',function() {
				underLayer.css('opacity',1);
			});
		});
	})

	//Menu
	var menu =$('#menu');
	var close =$('#close');
	var closeShownSubpage = function() {
		var subpage = $(menu.find('a.show').not('#btmap,#newslettersub').removeClass("show").addClass("hide").attr("href"));
		var subpageHeight = subpage.height('auto').height();
		$(subpage).stop().animate({height:"0px",opacity:0},1000,'easeInOutCirc',function() {
			$(subpage).css({height:subpageHeight,top:'-1000%'});
		});
		close.css({'position':'fixed',top :70 + header.offset().top}).stop().animate({right:"-100px"},'slow');
	}
	
	close.on('click',function(){
		closeShownSubpage();
	});
	
	menu.find('a').not("#btmap").on('click',function(e){
		e.preventDefault();
		$('#togglemenu').trigger('click');
	});
	
	menu.find('a').not("#btmap,#newslettersub").on('click',function(e){
		e.preventDefault();
		if($(this).hasClass("show"))
		{
			closeShownSubpage();	
		}
		else
		{
			closeShownSubpage();
			var subpage = $($(this).removeClass("hide").addClass("show").attr("href"));
			var subpageHeight = subpage.height('auto').height();
			subpage.css({height:0,top:"70px"}).stop().animate({height:subpageHeight,opacity:1},900,'easeInOutQuart',function() {
				subpage.css({height:''});
			});
			close.css({top :70 + header.offset().top}).stop().animate({right:"0px"},'slow',function() {
				close.css({'position':'absolute',top:70});
			});
		}
    });

	//Newsletter
	$('#newsletterSubmit').click( function(event) {
		sub_email(event);
	});
	$('#newsletterInput').on('keyup keypress', function(event) {
		checkemail($(this),event);
	});
	
	var newsletterlink = $("#newslettersub");
	var closeUnderlayer = function() {
		underLayer.stop().animate({height:"70px"},1000,"easeInOutExpo");
		$("#primaryContent,#wrapHeader").stop().animate({top:"0px"},1000,"easeInOutExpo");
		newsletterlink.removeClass("show").addClass("hide");
	}

	newsletterlink.on("click", function(e) {
		e.preventDefault();
		var tempUnderlatHeight = underLayer.height();
		var underlayerHeight = underLayer.height('auto').height();
		underLayer.height(tempUnderlatHeight);
		if($(this).hasClass('hide')) {
			$("#primaryContent").stop().animate({top:underlayerHeight+$(window).scrollTop()},1000,"easeInOutExpo");
			$("#wrapHeader").stop().animate({top:underlayerHeight},1000,"easeInOutExpo");
			underLayer.stop().animate({height:underlayerHeight},1000,"easeInOutExpo");
			$(this).removeClass("hide").addClass("show");
			
		}
		else {
			closeUnderlayer();
		}
	});

	$(window).scroll(function() {
		if(newsletterlink.hasClass('show'))
		{
			underLayer.stop().animate({height:"70px"},1000,"easeInOutExpo");
			$("#primaryContent,#wrapHeader").stop().animate({top:"0px"},200);
			$("#newslettersub").removeClass("show").addClass("hide");
		}	
	});
	
	var valid_email = false;
	var button = $('#newsletterSubmit');
	$("body").prepend("<div id='newsletterSubmitValid' style='display:none'></div>");
	var newsletterSubmitValid = $('#newsletterSubmitValid').css("background-color");
	$('#newsletterSubmitValid').remove();
	$("body").prepend("<div id='newsletterSubmitInvalid' style='display:none'></div>");
	var newsletterSubmitInvalid = $('#newsletterSubmitInvalid').css("background-color");
	$('#newsletterSubmitInvalid').remove();
	var newsletter_subbut_color = button.css("background-color");
	function checkemail(obj, event){
		if(!event) event = window.event;
		but = document.getElementById('newsletterSubmit');
		var messageContainer = $('#newsletterMessage');
		email = obj.val();
		emailfilter=/^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i;

		if(emailfilter.test(email)){
			button.stop().animate({
			"background-color": newsletterSubmitValid
			},'fast');
			valid_email = true;

			if(event.keyCode == 13){
				but.click();
				if(event.preventDefault) {
					event.preventDefault();
				}
				else
				{
					event.returnValue = false;
				}
			}
		}
		else{
			if(event.keyCode == 13){
				if(event.preventDefault) {
					event.preventDefault();
				}
				else
				{
					event.returnValue = false;
				}
			}
			 button.stop().animate({
			 "background-color": newsletter_subbut_color
			 },'fast');
			 valid_email = false;
			
		}
	}
	function createXMLHttpRequest() 
	{

	   try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
	   try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
	   try { return new XMLHttpRequest(); } catch(e) {}
	   alert("XMLHttpRequest not supported");
	   return null;
	   
	 }
	 
	function sub_email(event){
		if(!event) event = window.event;
		var ajReq;
		email = document.getElementById('newsletterInput').value;
		res_area = $('#newsletter,#newsletterInput');
		if(!valid_email){
			button.stop().animate({"background-color": newsletterSubmitInvalid},'slow').delay(1600).queue(function() {
				button.stop().animate({"background-color": newsletter_subbut_color},'slow');
				return $(this).dequeue();
			});
		}
		else
		{
		
			ajReq = createXMLHttpRequest();
			ajReq.open( "GET", "php/newsletter.php?e="+email, true );
			ajReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			ajReq.onreadystatechange = function(){
				if ( ajReq.readyState != 4 ) return;
				res_area.stop().animate({opacity:0},'slow',function() {
					$(this).css('display','none');
				});
				if($('#newsletterMessage').length == 0)
				{
				$('#newsletter').parent().append('<p id="newsletterMessage" class="text-center"></p>');
				}
				newslettermessage = $('#newsletterMessage');
				newslettermessage.html(ajReq.responseText).animate({opacity:1},'slow');
				
			}
			ajReq.send( null );
		}
		if(event.preventDefault) {
			event.preventDefault();
		}
		else
		{
			event.returnValue = false;
		}
	}

	//Contact Form
	var options = {target:'#alert'};
	$(".message").hide("slow");
	$('#contactform').ajaxForm(options); 
	$.fn.clearForm = function() {
		return this.each(function() {
			var type = this.type, tag = this.tagName.toLowerCase();
			if (tag == 'form')
			return $(':input',this).clearForm();
			if (type == 'text' || tag == 'textarea')
			this.value = '';
		});
	};
	
	//Social Icon hover effect
	var socialBoxBgHover;
	var baxSocial =$("#box-social");
	var SocialIconBgColor;
	baxSocial.find("a").on("mouseenter", function() {
		$("body").prepend("<div id='iconhover'></div>");
		socialBoxBgHover = $('#iconhover').css("background-color");
		$('#iconhover').remove();
		SocialIconBgColor = $('.icon a').css('background-color');
		$(this).stop().animate({"text-indent":"-56px",backgroundColor :socialBoxBgHover},300,"easeInQuart",function() {
			$(this).css("text-indent","20px").stop().animate({"text-indent":"0px"},300,"easeInQuart");
		});
	}).on("mouseleave", function() {
		$(this).stop().animate({"text-indent":"50px",backgroundColor : SocialIconBgColor},300,function() {
			$(this).css("text-indent","-26px").stop().animate({"text-indent":"0px"});
		})
	});


	// Google map
	var mapButton =$("#btmap");
	var mapholder =$("#canvas_holder");
	window.gmap = function(options) {		
		var opt = {
		style :
			[{
				featureType: "all",
				stylers: [
					{ weight: 1 },
					{ saturation: -100 },
					{ Gamma: 0.75 }
				]
			}],
		lat:48.825183,
		lng:2.1975769,
		mapType : "ROADMAP",
		markericon:'img/marker1.png',
		infoText:''
		};
		
		var setting = $.extend(opt,options);
		initialize(setting.style,setting.lat,setting.lng,setting.mapType,setting.markericon,setting.infoText);

		var mapButtonBgColor;
		mapButton.on("click", function() {
			if($(this).hasClass('hide')) {
				closeUnderlayer();
				closeShownSubpage();
				mapButtonBgColor = mapButton.css("background-color");
				menu.find("a").not("#btmap").stop().animate({opacity:0},600,function() {
					mapholder.stop().animate({top : '0px'},800);
				});
				$(this).stop().animate({"text-indent":"-100px","background-position":"100%",backgroundColor:"#fff"},'slow').removeClass("hide").addClass("show");
				var tooltip = '<div id="menu-tooltip" class="hidden-phone"></div>';
				$('body').append(tooltip);
				$("#menu-tooltip").html(mapButton.data("original-title")).stop().animate({opacity:1,right:"95px"},600);
			}
			else
			{
				$(this).stop().animate({"text-indent":"0px","background-position":"0%", backgroundColor: mapButtonBgColor},'slow',function() {
					$(this).removeClass("show").addClass("hide")
					menu.find("a").not("#btmap").animate({opacity:1},600);
					$(this).removeAttr('style');
				});
				mapholder.stop().animate({top : '-120%'},1000,"easeInOutCirc");
				$("#menu-tooltip").stop().animate({opacity:0,right:"100px"},1000,function() {
					$('#menu-tooltip').remove();
				});
			}
	});
	}
	//this function initialize and load the googlemap
	function initialize(style,lat,lng,mapType,markericon,infoText) {
		var styledMap = new google.maps.StyledMapType(style,{name: "Styled Map"});
		var latLng = new google.maps.LatLng(lat,lng); 
		var markerlatlng = new google.maps.LatLng(lat,lng);
		var googlemapType =google.maps.MapTypeId.ROADMAP;
		if (mapType == "SATELLITE")
		{
			googlemapType =google.maps.MapTypeId.SATELLITE;
		}
		else if (mapType == "HYBRID")
		{
			googlemapType =google.maps.MapTypeId.HYBRID;
		}
		else if (mapType == "TERRAIN")
		{
			googlemapType =google.maps.MapTypeId.TERRAIN;
		}
		var myOptions = {
			panControl: true,
			panControlOptions :{ position: google.maps.ControlPosition.LEFT_TOP},
			zoomControl: true,
			zoomControlOptions: {style: google.maps.ZoomControlStyle.DEFAULT,position: google.maps.ControlPosition.LEFT_TOP},
			mapTypeControl: true,
			scaleControl: true,
			streetViewControl: false,
			overviewMapControl: true,
			draggable: true,
			disableDoubleClickZoom: false,
			scrollwheel: true,
			zoom: 10,
			center: latLng,
			mapTypeId: googlemapType,
			mapTypeControlOptions: { position: google.maps.ControlPosition.LEFT_TOP}
		};
		
		var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		map.mapTypes.set('map_style', styledMap);
		map.setMapTypeId('map_style');
		var marker = new google.maps.Marker({position: markerlatlng,icon: markericon});
		marker.setMap(map);

		if(infoText != "") 
		{
		var boxText = document.createElement("div");

			boxText.innerHTML = "<div class='info-text'>"+ infoText + "</div><div class='tipbox'></div>";
					
			var myOptions = {
					 content: boxText
					,disableAutoPan: false
					,maxWidth: 0
					,pixelOffset: new google.maps.Size(-140,-20)
					,zIndex: null
					,boxStyle: {
					  opacity: 1
					  ,width: "280px"
					 }
					,closeBoxMargin: "7px 6px 2px 2px"
					,alignBottom : true
					,closeBoxURL: "img/infobox-close.png"
					,infoBoxClearance: new google.maps.Size(1, 1)
					,isHidden: false
					,pane: "floatPane"
					,enableEventPropagation: false
			};

			var ib = new InfoBox(myOptions);
			ib.open(map, marker);
			google.maps.event.addListener(marker, 'click', function() {ib.open(map, marker);});
			google.maps.event.addListener(marker, 'dragstart', function(){ib.close();});
		}
	}
});