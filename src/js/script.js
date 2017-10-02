(function () {
	// SmoothScroll({ 
	//     // Scrolling Core
	//     animationTime    : 400, // [ms]
	//     stepSize         : 80, // [px]

	//     // Acceleration
	//     accelerationDelta : 50,  // 50
	//     accelerationMax   : 3,   // 3

	//     // Keyboard Settings
	//     keyboardSupport   : true,  // option
	//     arrowScroll       : 50,    // [px]

	//     // Pulse (less tweakable)
	//     // ratio of "tail" to "acceleration"
	//     pulseAlgorithm   : true,
	//     pulseScale       : 4,
	//     pulseNormalize   : 1,

	//     // Other
	//     touchpadSupport   : false, // ignore touchpad by default
	//     fixedBackground   : true, 
	//     excluded          : ''    
	// 	}
	// );


  function isJSON(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

	/*ОТКЛЮЧЕНИЕ ВКЛЮЧЕНИЕ СКРОЛА*/
	var keys = {37: 1, 38: 1, 39: 1, 40: 1};

	function preventDefault(e) {
	  e = e || window.event;
	  if (e.preventDefault)
	      e.preventDefault();
	  e.returnValue = false;  
	};
	function preventDefaultForScrollKeys(e) {
	    if (keys[e.keyCode]) {
	        preventDefault(e);
	        return false;
	    }
	};
	function disableScroll() {
	  if (window.addEventListener) // older FF
	      window.addEventListener('DOMMouseScroll', preventDefault, false);
	  window.onwheel = preventDefault; // modern standard
	  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	  window.ontouchmove  = preventDefault; // mobile
	  document.onkeydown  = preventDefaultForScrollKeys;
	};
	function enableScroll() {
	    if (window.removeEventListener)
	        window.removeEventListener('DOMMouseScroll', preventDefault, false);
	    window.onmousewheel = document.onmousewheel = null; 
	    window.onwheel = null; 
	    window.ontouchmove = null;  
	    document.onkeydown = null;  
	};

	/*ОТКЛЮЧЕНИЕ ВКЛЮЧЕНИЕ СКРОЛА END*/

	scroll(0,0);
	var controller = new ScrollMagic.Controller();

	function getRandom(min, max) {
	  return min + Math.random() * (max - min);
	}

	function animateB1(){

		function prepareArrow( thisSvgId ){
      var s = Snap('#'+thisSvgId);
      var path = s.select('path');
  		var len = path.getTotalLength();
			path.attr({
	        "stroke-dasharray": len + " " + len,
	        "stroke-dashoffset": len
	    })
		}
		function prepareText(){
	    $("#b1 .text .iw .text").each(function (i) {
	        $(this).html( $(this).text().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
	    });
		}
		prepareText();
		$("#b1 svg[id*='arrow']").each(function(){
			var $this = $(this),
					thisId = $this.attr("id");

			prepareArrow( thisId );
			$this.css({"display" : "block"});
		})

    function animateArrow( thisSvgId ){
      var s = Snap('#'+thisSvgId);
      var path = s.select('path');
  		var len = path.getTotalLength();

	    path.animate(
	        {"stroke-dashoffset": 0},
	        600,
	        mina.easeout
	    );
    }

		var tl = new TimelineMax();

		tl.add(function(){ TweenMax.staggerFromTo( $(".iconsRow .b1 .iw .text span"), 0.2, {autoAlpha:0, rotationX:-10, x: 20 }, {autoAlpha:1, rotationX:0, x: 0}, 0.025 ) })
		.to( $(".iconsRow .b1 .iconB"), 0.75, { ease: Back.easeOut.config(1.4), scale: 1 }, "b1")
			
			//.staggerFromTo( , 0.1, {autoAlpha:0, x: -30, force3D:true}, {autoAlpha:1,x: 0,force3D:true}, 0.018, "b1")
			.add( function(){ animateArrow("arrow1") }, "-=0.35" )
			.add(function(){ TweenMax.staggerFromTo( $(".iconsRow .b2 .iw .text span"), 0.2, {autoAlpha:0, rotationX:-10, x: 20 }, {autoAlpha:1, rotationX:0, x: 0}, 0.025 ) })
			.to($(".iconsRow .b2 .iconB"), 0.75, { ease: Back.easeOut.config(1.4), scale: 1, delay: 0.2 }, "b2")
			.add( function(){ animateArrow("arrow2") }, "-=0.35" )
			.add(function(){ TweenMax.staggerFromTo( $(".iconsRow .b3 .iw .text span"), 0.2, {autoAlpha:0, rotationX:-10, x: 20 }, {autoAlpha:1, rotationX:0, x: 0}, 0.025 ) })
			.to($(".iconsRow .b3 .iconB"), 0.75, { ease: Back.easeOut.config(1.4), scale: 1, delay: 0.2 }, "b3")
			.add( function(){ animateArrow("arrow3") }, "-=0.35" )
			.add(function(){ TweenMax.staggerFromTo( $(".iconsRow .b4 .iw .text span"), 0.2, {autoAlpha:0, rotationX:-10, x: 20 }, {autoAlpha:1, rotationX:0, x: 0}, 0.025 ) })
			.to($(".iconsRow .b4 .iconB"), 0.75, { ease: Back.easeOut.config(1.4), scale: 1, delay: 0.2 }, "b4")
			.add( function(){ animateArrow("arrow4") }, "-=0.35" )
			.add(function(){ TweenMax.staggerFromTo( $(".iconsRow .b5 .iw .text span"), 0.2, {autoAlpha:0, rotationX:-10, x: 20 }, {autoAlpha:1, rotationX:0, x: 0}, 0.025 ) })
			.to($(".iconsRow .b5 .iconB"), 0.75, { ease: Back.easeOut.config(1.4), scale: 1, delay: 0.2 }, "b5")
			.add(function(){ contactsMap(); });

		$("#b1 .button").on("click", function(){
			disableScroll();
			TweenLite.to(window, 0.8, { ease: Sine.easeInOut, scrollTo: $("#contacts").offset().top+100, onComplete: function(){
					enableScroll();
				} 
			});
		});

	}

	function animateB5(){
		var $items = $("#b5 .shopsBlock .item"),
				itemsL = $items.length,
				itemW = $items.outerWidth(),
				$visibleItems,
				visibleItemsL,
				popupW = 315;

		function calc_outOfBound(){
			$items.each(function(){
				var $this = $(this),
						thisOL = $this.offset().left,
						thisPL = $this.position().left,
						WW = window.innerWidth;

						if( thisOL+itemW > WW || thisOL < 0 ){
							$this.addClass("outOfBound");
						}else{
							if( thisOL+itemW + popupW > WW || thisPL+itemW + popupW > 1920  ){
								$this.addClass("right");
							}else{
								$this.removeClass("right");
							}
							$this.removeClass("outOfBound");
						}
						$visibleItems = $items.filter(":not(.outOfBound)");
						visibleItemsL = $visibleItems.length;
			});
		}
		calc_outOfBound();

		$(window).on("debouncedresize", function( event ) {
			calc_outOfBound();
		});


    var timerId = setInterval(function() {

    	var $oldActive = $items.filter(".active");
    	var $newActive = $visibleItems.filter(":not(.active)").eq( Math.round(getRandom(0, visibleItemsL-1)) );

    	$oldActive.removeClass("active");
    	setTimeout(function(){
				TweenMax.set( $oldActive , { zIndex: 0 });
    	}, 250);

    	setTimeout(function(){
	  		$newActive.addClass("active");
	  		TweenMax.set( $newActive , { zIndex: 1 });
    	}, 500);


    }, 4000);
	}

	function animateB6(){
		var tween = TweenMax.staggerFromTo(".bubles .item", 2, {y: 300, autoAlpha: 0}, {y: 0, autoAlpha: 1, ease: Elastic.easeOut.config(1, 0.5) }, 0.15);

		// build scene
		var scene = new ScrollMagic.Scene({triggerElement: "#b6 .triggerHelper"})
						.setTween(tween)
						//.addIndicators({name: "staggering"}) // add indicators (requires plugin)
						.addTo(controller);
	}

	function getRecallForm(){

		$(".getRecall_Js").on("click", function(e){
			e.preventDefault();

			var $form = $(".getRecallForm");
      $.magnificPopup.open({
          items: {
              src: "<div class='defaultPopupContent mfp-with-anim'>"+$form[0].outerHTML+"<div class='response'></div></div>",
              type: 'inline'
          },
          removalDelay: 500, //delay removal by X to allow out-animation
          closeBtnInside: true,
          mainClass: 'mfp-with-zoom',
          callbacks: {
              beforeOpen: function() {
                  this.st.mainClass = "mfp-zoom-in defaultPopup";
              },
							open: function() {
								
								var $form = $(".mfp-content .getRecallForm");
								$form.find("input[name='email']").inputmask("email",{ 
						        "onincomplete": function(){ 
						        	$(this).removeClass("complete"); 
						        	$(this).addClass("uncomplete");
						        },
						        "oncomplete": function(){ 
						        	$(this).addClass("complete");
						        	$(this).removeClass("uncomplete");
						        }
						    });
								$form.find("input[name='phone']").inputmask("+7(999)999-99-99",{ 
						        "onincomplete": function(){ 
						        	$(this).removeClass("complete"); 
						        	$(this).addClass("uncomplete");
						        },
						        "oncomplete": function(){ 
						        	$(this).addClass("complete");
						        	$(this).removeClass("uncomplete");
						        }
						    });

						    var submit = $form.find("input[name='submit']");
						    $form.on('submit', function(event) {
						      if( 
						      	submit.hasClass("loading") || 
						      	$form.find("input.ajax:not(.complete)").length > 0 
						      ){
						        $(".mfp-content .response").removeClass("error good").html("Заполните необходимые поля").addClass("error");

						      	$form.find("input.ajax").each(function(){
						    			var $this = $(this);
						    			if( !$this.inputmask("isComplete") ){
						    				$this.addClass("uncomplete");
						    			}
						      	});
						      	
						        return false;
						      }

						      event.preventDefault();
						      submit.addClass('loading');

						      var data = {};
						      $form.find("input.ajax").each(function(index, one) {
						        var value = decodeURIComponent(this.value);
						        data[this.name] = isJSON(value) ? JSON.parse(value) : value;
						      });


						      $.ajax({
						        type: 'POST',
						        url: $form.attr("action"),
						        data: data,
						        dataType: 'json',
						        success: function(response){
						          submit.removeClass('loading');
						          if( response.status == 'ok' ){
							          $(".mfp-content .response").removeClass("error good").html("Ошибка сервера, попробуйте отправить еще раз или позвоните по телефону +7 (495) 120-32-30").addClass("error");
						          }else{
						          	$(".mfp-content .response").removeClass("error good").html("Заявка принята, спасибо. В ближайшее время мы свяжемся с вами<br/><br/>Если у вас есть вопросы - звоните, будем рады:<br/>+7 (495) 120-32-30").addClass("good");
						          }


						        },
						        error : function(){
						        	$(".mfp-content .response").removeClass("error good").html("При отправке произошла ошибка").addClass("error");
						        }
						      });

						    });

							},
              beforeClose: function() {
                  
              },
          },
          midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
      });

		});
	}

	function getOfferForm(){
		var $form = $("#getOfferFrom");

		$form.find("input[name='email']").inputmask("email",{ 
        "onincomplete": function(){ 
        	$(this).removeClass("complete"); 
        	$(this).addClass("uncomplete");
        },
        "oncomplete": function(){ 
        	$(this).addClass("complete");
        	$(this).removeClass("uncomplete");
        }
    });

    var submit = $form.find("input[name='submit']");
    $form.on('submit', function(event) {
      if( 
      	submit.hasClass("loading") || 
      	$form.find("input.ajax:not(.complete)").length > 0 
      ){
        $.magnificPopup.open({
            items: {
                src: "<div class='defaultPopupContent mfp-with-anim'>Заполните необходимые поля</div>",
                type: 'inline'
            },
            removalDelay: 500, //delay removal by X to allow out-animation
            closeBtnInside: true,
            mainClass: 'mfp-with-zoom',
            callbacks: {
                beforeOpen: function() {
                    this.st.mainClass = "mfp-zoom-in defaultPopup";
                },
                beforeClose: function() {
                    
                },
            },
            midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
        });
      	$form.find("input.ajax").each(function(){
    			var $this = $(this);
    			if( !$this.inputmask("isComplete") ){
    				$this.addClass("uncomplete");
    			}
      	});
      	
        return false;
      }

      event.preventDefault();
      submit.addClass('loading');

      var data = {};
      $form.find("input.ajax").each(function(index, one) {
        var value = decodeURIComponent(this.value);
        data[this.name] = isJSON(value) ? JSON.parse(value) : value;
      });


      $.ajax({
        type: 'POST',
        url: $form.attr("action"),
        data: data,
        dataType: 'json',
        success: function(response){
          submit.removeClass('loading');
          if( response.status == 'ok' ){
	          $.magnificPopup.open({
	              items: {
	                  src: "<div class='defaultPopupContent mfp-with-anim'>Ошибка сервера, попробуйте отправить еще раз или позвоните по телефону +7 (495) 120-32-30</div>",
	                  type: 'inline'
	              },
	              removalDelay: 500, //delay removal by X to allow out-animation
	              closeBtnInside: true,
	              mainClass: 'mfp-with-zoom',
	              callbacks: {
	                  beforeOpen: function() {
	                      this.st.mainClass = "mfp-zoom-in defaultPopup";
	                  },
	                  beforeClose: function() {
	                      
	                  },
	              },
	              midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
	          });
          }else{
	          $.magnificPopup.open({
	              items: {
	                  src: "<div class='defaultPopupContent mfp-with-anim'>Заявка принята, спасибо. В ближайшее время мы свяжемся с вами<br/><br/>Если у вас есть вопросы - звоните, будем рады:<br/>+7 (495) 120-32-30</div>",
	                  type: 'inline'
	              },
	              removalDelay: 500, //delay removal by X to allow out-animation
	              closeBtnInside: true,
	              mainClass: 'mfp-with-zoom',
	              callbacks: {
	                  beforeOpen: function() {
	                      this.st.mainClass = "mfp-zoom-in defaultPopup";
	                  },
	                  beforeClose: function() {
	                      
	                  },
	              },
	              midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
	          });
          }


        },
        error : function(){
          $.magnificPopup.open({
              items: {
                  src: "<div class='defaultPopupContent mfp-with-anim'>При отправке произошла ошибка</div>",
                  type: 'inline'
              },
              removalDelay: 500, //delay removal by X to allow out-animation
              closeBtnInside: true,
              mainClass: 'mfp-with-zoom',
              callbacks: {
                  beforeOpen: function() {
                      this.st.mainClass = "mfp-zoom-in defaultPopup";
                  },
                  beforeClose: function() {
                      
                  },
              },
              midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
          });
        }
      });

    });

	}

	function contactsForm(){
		var $form = $("#requestForm");

		$form.find("input[name='name']").inputmask("A{2,40}",{ 
				definitions: {
			    "A": {
			      validator: "[а-яА-ЯA-Za-z0-9 ]",
			      cardinality: 1
			    }
			  },
        "onincomplete": function(){ 
        	$(this).removeClass("complete"); 
        	$(this).addClass("uncomplete");
        },
        "oncomplete": function(){ 
        	$(this).addClass("complete");
        	$(this).removeClass("uncomplete");
        }
    });	
		$form.find("input[name='email']").inputmask("email",{ 
        "onincomplete": function(){ 
        	$(this).removeClass("complete"); 
        	$(this).addClass("uncomplete");
        },
        "oncomplete": function(){ 
        	$(this).addClass("complete");
        	$(this).removeClass("uncomplete");
        }
    });
		$form.find("input[name='phone']").inputmask("+7(999)999-99-99",{ 
        "onincomplete": function(){ 
        	$(this).removeClass("complete"); 
        	$(this).addClass("uncomplete");
        },
        "oncomplete": function(){ 
        	$(this).addClass("complete");
        	$(this).removeClass("uncomplete");
        }
    });
		$form.find("input[name='url']").inputmask({
        mask: "http://*{1,100}",
        definitions: {
          '*': {
            validator: "[0-9A-Za-z!#$%&.,'*+/=?^_`{|}~\-]",
            cardinality: 1,
            casing: "lower"
          }
        },
        "onincomplete": function(){ 
        	$(this).removeClass("complete"); 
        	$(this).addClass("uncomplete");
        },
        "oncomplete": function(){ 
        	$(this).addClass("complete");
        	$(this).removeClass("uncomplete");
        }
    });
    $form.find("input[name='rules']").on("change", function(){
    	var $this = $(this);
    			if( $this.prop('checked') ){
    				$this.addClass("complete");
    				$this.removeClass("uncomplete");
    			}else{
    				$this.addClass("uncomplete");
    				$this.removeClass("complete");
    			}
    });


    var submit = $form.find("input[name='submit']");
    $form.on('submit', function(event) {
      if( 
      	submit.hasClass("loading") || 
      	$form.find("input[name='rules']:not(.complete)").length > 0 || 
      	$form.find("input.ajax:not(.complete)").length > 0 
      ){
        $.magnificPopup.open({
            items: {
                src: "<div class='defaultPopupContent mfp-with-anim'>Заполните необходимые поля</div>",
                type: 'inline'
            },
            removalDelay: 500, //delay removal by X to allow out-animation
            closeBtnInside: true,
            mainClass: 'mfp-with-zoom',
            callbacks: {
                beforeOpen: function() {
                    this.st.mainClass = "mfp-zoom-in defaultPopup";
                },
                beforeClose: function() {
                    
                },
            },
            midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
        });
      	$form.find("input.ajax").each(function(){
    			var $this = $(this);
    			if( !$this.inputmask("isComplete") ){
    				$this.addClass("uncomplete");
    			}
      	});
      	if( !$form.find("input[name='rules']").prop('checked') ){
      		$form.find("input[name='rules']").addClass("uncomplete");
      	}
      	
        return false;
      }

      event.preventDefault();
      submit.addClass('loading');

      var data = {};
      $form.find("input.ajax").each(function(index, one) {
        var value = decodeURIComponent(this.value);
        data[this.name] = isJSON(value) ? JSON.parse(value) : value;
      });


      $.ajax({
        type: 'POST',
        url: $form.attr("action"),
        data: data,
        dataType: 'json',
        success: function(response){
          submit.removeClass('loading');
          if( response.status == 'ok' ){
	          $.magnificPopup.open({
	              items: {
	                  src: "<div class='defaultPopupContent mfp-with-anim'>Ошибка сервера, попробуйте отправить еще раз или позвоните по телефону +7 (495) 120-32-30</div>",
	                  type: 'inline'
	              },
	              removalDelay: 500, //delay removal by X to allow out-animation
	              closeBtnInside: true,
	              mainClass: 'mfp-with-zoom',
	              callbacks: {
	                  beforeOpen: function() {
	                      this.st.mainClass = "mfp-zoom-in defaultPopup";
	                  },
	                  beforeClose: function() {
	                      
	                  },
	              },
	              midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
	          });
          }else{
	          $.magnificPopup.open({
	              items: {
	                  src: "<div class='defaultPopupContent mfp-with-anim'>Заявка принята, спасибо. В ближайшее время мы свяжемся с вами<br/><br/>Если у вас есть вопросы - звоните, будем рады:<br/>+7 (495) 120-32-30</div>",
	                  type: 'inline'
	              },
	              removalDelay: 500, //delay removal by X to allow out-animation
	              closeBtnInside: true,
	              mainClass: 'mfp-with-zoom',
	              callbacks: {
	                  beforeOpen: function() {
	                      this.st.mainClass = "mfp-zoom-in defaultPopup";
	                  },
	                  beforeClose: function() {
	                      
	                  },
	              },
	              midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
	          });
          }


        },
        error : function(){
          $.magnificPopup.open({
              items: {
                  src: "<div class='defaultPopupContent mfp-with-anim'>При отправке произошла ошибка</div>",
                  type: 'inline'
              },
              removalDelay: 500, //delay removal by X to allow out-animation
              closeBtnInside: true,
              mainClass: 'mfp-with-zoom',
              callbacks: {
                  beforeOpen: function() {
                      this.st.mainClass = "mfp-zoom-in defaultPopup";
                  },
                  beforeClose: function() {
                      
                  },
              },
              midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
          });
        }
      });

    });
	}

	function paralaxBgs(){
		var lay;
		if( $('.check1920lay').is(':visible') ){
			lay = "lt1920";
		}else{
			lay = "gt1920";
		}

		function isChangePageLayout() {
			if( $('.check1920lay').is(':visible') && lay == "gt1920" ) {
				lay = "lt1920";
				return true;
			} else if( !$('.check1920lay').is(':visible') && lay == "lt1920" ){
				lay = "gt1920";
				return true;
			} else {
				return false;
			}
		}


		var dur1,
				dur2,
				dur3;

		function calcDur(){
			var WH = $(window).height();

			dur1 = $("#b1").height()+50;
			dur2 = $("#b3").height() > WH ? $("#b3").height() : WH;
			dur3 = $("#b6").height() > WH ? $("#b6").height() : WH;
		}
		calcDur();

		function createParalax(){
			if( lay == "gt1920" ){
				var p1Y = 26-50;
				var p2Y = 27-50;
				var p3Y = 21-50;

				var p1YE = -50-26;
				var p2YE = -50-26;
				var p3YE = -50-17;
			}else{
			 	var p1Y = 26-50;
			 	var p2Y = 22-50;
			 	var p3Y = 20-50;

				var p1YE = -50-20;
				var p2YE = -50-24;
				var p3YE = -50-17;
			}


			TweenMax.set( $("#parallax1"), {y: p1Y+"%" });
			TweenMax.set( $("#parallax2"), {y: p2Y+"%" });
			TweenMax.set( $("#parallax3"), {y: p3Y+"%" });

			var scene1 = new ScrollMagic.Scene({triggerElement: "body" , duration: dur1, triggerHook: "onLeave" })
							.setTween("#parallax1", {y: p1YE+"%", ease: Linear.easeNone})
							//.addIndicators()
							.addTo(controller);

			var scene2 = new ScrollMagic.Scene({triggerElement: "#b3" , duration: dur2*2, triggerHook: "onEnter" })
							.setTween("#parallax2", {y: p2YE+"%", ease: Linear.easeNone})
							//.addIndicators()
							.addTo(controller);

			var scene3 = new ScrollMagic.Scene({triggerElement: "#b6" , duration: dur3*2, triggerHook: "onEnter" })
							.setTween("#parallax3", {y: p3YE+"%", ease: Linear.easeNone})
							//.addIndicators()
							.addTo(controller);
		}
		createParalax();


		$(window).on("debouncedresize", function( event ) {
			if( isChangePageLayout() ){
				calcDur();
				createParalax();
			}else{
				calcDur();
				scene1.duration(dur1);
				scene2.duration(dur2*2);
				scene3.duration(dur3*2);	
			}
		});
	}

	$(document).ready(function(){
	//$(window).on("load", function(){
		svg4everybody({});
		$(window).scrollTop(0);
		paralaxBgs();
  	setTimeout(function(){
			animateB1();
  	}, 1000);
		animateB5();
		animateB6();
		contactsForm();
		getRecallForm();
		getOfferForm();
	});

})();
window.onbeforeunload = function () {
  scroll(0,0);
}