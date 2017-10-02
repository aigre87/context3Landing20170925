function contactsMap(){
    var $page = $("#contactsMap");
    if( $page.length == 0 ){return false}
    var myContactsMap;
    ymaps.ready(init);
    function init(){
        myContactsMap = new ymaps.Map('contactsMap', {
            center: [55.708652, 37.653438],
            zoom: 16,
            controls: []
        });
        /* Custom zoom control buttons*/
        myContactsMap.behaviors.disable('scrollZoom');
        // Создадим пользовательский макет ползунка масштаба.
        var ZoomLayout = ymaps.templateLayoutFactory.createClass("<div>\
                <div id='yaPanorama' class='btn'><i class='icon-panorama'></i></div>\
                <div id='zoom-in' class='btn'><i class='icon-plus'></i>\
                </div><div id='zoom-out' class='btn'><i class='icon-minus'></i></div>\
            </div>", {

            // Переопределяем методы макета, чтобы выполнять дополнительные действия
            // при построении и очистке макета.
            build: function () {
                // Вызываем родительский метод build.
                ZoomLayout.superclass.build.call(this);

                // Привязываем функции-обработчики к контексту и сохраняем ссылки
                // на них, чтобы потом отписаться от событий.
                this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                // Начинаем слушать клики на кнопках макета.
                $('#zoom-in').bind('click', this.zoomInCallback);
                $('#zoom-out').bind('click', this.zoomOutCallback);
                $('#yaPanorama').on('click', function(){
                    $(".contactsMapPanorama-wrapper").css({"z-index": 1});
                    $("#contactsMap").css({"z-index": 0});
                });
            },

            clear: function () {
                // Снимаем обработчики кликов.
                $('#zoom-in').unbind('click', this.zoomInCallback);
                $('#zoom-out').unbind('click', this.zoomOutCallback);

                // Вызываем родительский метод clear.
                ZoomLayout.superclass.clear.call(this);
            },

            zoomIn: function () {
                var map = this.getData().control.getMap();
                // Генерируем событие, в ответ на которое
                // элемент управления изменит коэффициент масштабирования карты.
                this.events.fire('zoomchange', {
                    oldZoom: map.getZoom(),
                    newZoom: map.getZoom() + 1
                });
                if(  map.getZoom() < 15  ){

                }
            },

            zoomOut: function () {
                var map = this.getData().control.getMap();
                this.events.fire('zoomchange', {
                    oldZoom: map.getZoom(),
                    newZoom: map.getZoom() - 1
                });
            }
        }),
        zoomControl = new ymaps.control.ZoomControl({ options: { layout: ZoomLayout } });
        /*END CUSTOM ZOOM CONTROL BUTTONS*/

        /*лайаут балуна*/
        var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                '<div class="parkingBallon">\
                    <div class="baloonContent">$[[options.contentLayout]]</div>\
                    <div class="closeBut"></div>\
                    <div class="bottomHelper"><div class="arrow"></div><div class="circle"></div></div>\
                </div>', {
                /**
                 * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
                 * @function
                 * @name build
                 */
                build: function () {
                    this.constructor.superclass.build.call(this);

                    this._$element = $('.parkingBallon', this.getParentElement());

                    this.applyElementOffset();

                    this._$element.find('.closeBut')
                        .on('click', $.proxy(this.onCloseClick, this));
                },

                /**
                 * Удаляет содержимое макета из DOM.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
                 * @function
                 * @name clear
                 */
                clear: function () {
                    this._$element.find('.closeBut')
                        .off('click');

                    this.constructor.superclass.clear.call(this);
                },

                /**
                 * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name onSublayoutSizeChange
                 */
                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if(!this._isElement(this._$element)) {
                        return;
                    }

                    this.applyElementOffset();

                    this.events.fire('shapechange');
                },

                /**
                 * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name applyElementOffset
                 */
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight + this._$element.find('.bottomHelper')[0].offsetHeight)
                    });
                },

                /**
                 * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name onCloseClick
                 */
                onCloseClick: function (e) {
                    e.preventDefault();

                    this.events.fire('userclose');
                },

                /**
                 * Используется для автопозиционирования (balloonAutoPan).
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
                 * @function
                 * @name getClientBounds
                 * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
                 */
                getShape: function () {
                    if(!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight + this._$element.find('.bottomHelper')[0].offsetHeight
                        ]
                    ]));
                },

                /**
                 * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
                 * @function
                 * @private
                 * @name _isElement
                 * @param {jQuery} [element] Элемент.
                 * @returns {Boolean} Флаг наличия.
                 */
                _isElement: function (element) {
                    return element && element[0] && element.find('.bottomHelper')[0];
                }
            }),

    // Создание вложенного макета содержимого балуна.
        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                        '<div class="name">$[properties.balloonName]</div>\
                        <div class="time">$[properties.balloonTime]</div>\
                        <div class="options">$[properties.balloonOptions]</div>'
        );

        /*КОНЕЦ ЛАЙАУТ БАЛУНА*/
        /*парковки*/



        // myParkingPinCollection = new ymaps.GeoObjectCollection();
        // var parkingPins = {
        //     "1": {
        //         "coordinates" : [55.768151, 37.588764],
        //         "name"        : "Парковка №3203 (120)",
        //         "time"        : "Круглосуточная",
        //         "options"     : "•  60 руб./час<br />•  10 мест (2 для инвалидов)"
        //     },
        //     "2": {
        //         "coordinates" : [55.768707, 37.589923],
        //         "name"        : "Парковка №3203 (120)",
        //         "time"        : "Круглосуточная",
        //         "options"     : "•  60 руб./час<br />•  10 мест (2 для инвалидов)"
        //     }
        // };

        // for(var el in parkingPins) {
        //     var myPlacemark = new ymaps.Placemark([ parkingPins[el]['coordinates'][0] , parkingPins[el]['coordinates'][1] ], { // Создаем метку с такими координатами и суем в переменную
        //             balloonName: parkingPins[el]['name'],
        //             balloonTime: parkingPins[el]['time'],
        //             balloonOptions: parkingPins[el]['options']
        //         }, {
        //         iconLayout: 'default#image',
        //         iconImageHref: '/cwrussia-theme/images/yaMap-parking.png?v2', // картинка иконки
        //         iconImageSize: [26, 32], // размер иконки
        //         iconImageOffset: [-13, -32], // позиция иконки

        //         balloonShadow: false,
        //         balloonLayout: MyBalloonLayout,
        //         balloonContentLayout: MyBalloonContentLayout,
        //         balloonPanelMaxMapArea: 0
        //         // Не скрываем иконку при открытом балуне.
        //         // hideIconOnBalloonOpen: false,
        //         // И дополнительно смещаем балун, для открытия над иконкой.
        //         // balloonOffset: [3, -40]
        //     });
        //     /* Добавляем */
        //     myParkingPinCollection.add(myPlacemark);
        // }
        /*PANORAMS*/
        if (ymaps.panorama.isSupported()) {
            // Ищем панораму в переданной точке.
            ymaps.panorama.locate([55.709287, 37.653816]).done(
                function (panoramas) {
                    // Убеждаемся, что найдена хотя бы одна панорама.
                    if (panoramas.length > 0) {
                        // Создаем плеер с одной из полученных панорам.
                        var player = new ymaps.panorama.Player(
                                'contactsMapPanorama',
                                // Панорамы в ответе отсортированы по расстоянию
                                // от переданной в panorama.locate точки. Выбираем первую,
                                // она будет ближайшей.
                                panoramas[0],
                                // Зададим направление взгляда, отличное от значения
                                // по умолчанию.
                                { 
                                    direction: [180, 15],
                                    //zoom: 1,
                                    suppressMapOpenBlock: true,
                                    controls: ['zoomControl']
                                }
                            );


                    }
                },
                function (error) {
                    // Если что-то пошло не так, сообщим об этом пользователю.
                    alert(error.message);
                }
            );
        }
        /*END PANORAMS*/
        $("body").on("click", ".ballon .closeBut", function(){
            myContactsMap.balloon.close();
        });
        
        /* Фикс кривого выравнивания кастомных балунов */
        myContactsMap.geoObjects.events.add([
            'balloonopen'
        ], function (e) {
            var geoObject = e.get('target');
            myContactsMap.panTo(geoObject.geometry.getCoordinates(), {
                delay: 0
            });
            //$(".ballon").css({ "margin-top" : -$(".ballon").outerHeight()/2 });
        });
        $(window).on('resize', function() {
            setTimeout(function(){
                myContactsMap.container.fitToViewport();
            }, 500);
            
        });

        /*основной пин*/
        var main = new ymaps.Placemark(myContactsMap.getCenter(), {
            balloonContent: '<div class="ballon">\
             <div class="title">Наши контакты</div>\
             <div class="t1">Телефон: +7 (495) 120-32-30</div>\
             <div class="t2">Почта: <a href="mailto:newbusines@corpguru.ru">newbusines@corpguru.ru</a></div>\
             <div class="t3">Арес: 115280, Россия, Москва,<br/>ул. Ленинская Слобода, д.19,<br/>БЦ «Омега Плаза»</div>\
             <div class="closeBallon"></div>\
         </div>'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '../images/mapPin.png', // картинка иконки
            iconImageSize: [51, 71], // размер иконки
            iconImageOffset: [-25, -71], // позиция иконки
            balloonContentSize: [388, 100], // размер нашего кастомного балуна в пикселях
            balloonLayout: "default#imageWithContent", // указываем что содержимое балуна кастомная херь
            //balloonImageHref: '/bitrix/templates/interrosacamp/img/map/mapPin.png', // Картинка заднего фона балуна
            balloonImageOffset: [99, -5], // смещание балуна, надо подогнать под стрелочку
            //balloonImageSize: [260, 89], // размер картинки-бэкграунда балуна
            balloonShadow: false,
            hideIconOnBalloonOpen: false,
            balloonAutoPan: false // для фикса кривого выравнивания
        });


        /*Линия*/
        // Создаем ломаную линию.
        var polyline = new ymaps.Polyline([
            [55.769411, 37.596591], [55.768976, 37.595819], [55.769623, 37.594714], [55.769164, 37.593737], [55.770040, 37.592246], [55.768716, 37.589832]
        ], {
            hintContent: "Путь от метро"
        }, {
            draggable: false,
            strokeColor: '#e4002b',
            strokeWidth: 4,
            opacity: 0.6,
            // Первой цифрой задаем длину штриха. Второй цифрой задаем длину разрыва.
            strokeStyle: '1 0'
        });

        // Устанавливаем карте границы линии.
        //myContactsMap.setBounds(polyline.geometry.getBounds());

        // добавляем обьекты на карту
        myContactsMap.geoObjects
            //.add(myParkingPinCollection)
            //.add(polyline)
            .add(main);

        /* add custom zoom buttons*/
        myContactsMap.controls.add(zoomControl, {
            float: 'none',
            position: {
                right: 16,
                bottom: 44
            }
        });
        /**/

        $("body").on("click", ".ballon .closeBallon", function(){
            main.balloon.close();
        });
        myContactsMap.events.add('boundschange', function (e) {
            main.options.set('visible', true);
        });


        myContactsMap.geoObjects.events.add([
            'balloonopen'
        ], function (e) {
            var geoObject = e.get('target');
            myContactsMap.panTo(geoObject.geometry.getCoordinates(), {
                delay: 0
            });
            $(".ballon").css({ "margin-top" : -$(".ballon").outerHeight()/2 });
            $(".ballon").addClass("complete");
        });
        $(window).on('resize', function() {
            setTimeout(function(){
                myContactsMap.container.fitToViewport();
            }, 500);
            
        });
        main.balloon.open();

        var timerId = setInterval(function() {
            if( $(".ballon").length > 0 ){
                $(".ballon").css({ "margin-top" : -$(".ballon").outerHeight()/2 });
                $(".ballon").addClass("complete");
                clearInterval(timerId);
            }
        }, 250);

        $(window).on("debouncedresize", function(){
            myContactsMap.container.fitToViewport();
        });
        if (!ymaps.panorama.isSupported()) {
            $("body").addClass("yaMapPanoramaNotSup");
        }
    }/*END INIT*/





    $('.contactsMapPanorama-back').on('click', function(){
        $("#contactsMapPanorama").css({"z-index": 0});
        $("#contactsMap").css({"z-index": 1});
    });
};