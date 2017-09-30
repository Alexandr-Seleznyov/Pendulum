'use strict';
// =============================================================
// axis_and_scales
// Оси координат и разметка
// =============================================================

define(['pendulum_tools/services_functions'], function(services_functions){

    var As; // Конструктор


    As = function(newOptions){

        var options = {}, // Объект. Настройки для отрисовки осей и разметки
            updateOptions, // Обновление options
            drawAxis, // Функция отрисовки осей
            drawScales, // Функция отрисовки разметки
            scaleXY, // Получение объекта с координатами начальных и конечных линий разметки для осей XY
            XYToPix, // Объект с функциями {xToPix, yToPix}
            xToPix, // Преобразование значения X в pix
            yToPix; // Преобразование значения Y в pix





            // ================================================
            // options
            // ================================================
            // Настройки для отрисовки осей и разметки
            options = {
                canvas: undefined, // элемент DOM - canvas
                diapasonX: {x1: -1, x2: 1},
                diapasonY: {y1: -1, y2: 1},

                // Свойства для отрисовки осей X,Y
                isVisibleAxisX: true, // Нарисовать ось координат X ?
                isVisibleAxisY: true, // Нарисовать ось координат Y ?
                widthAxis: 1, // Толщина осей координат
                colorAxis: "rgba(0, 0, 0, 1)", // Цвет осей координат

                // Свойства для отрисовки разметки X,Y
                isVisibleScaleX: true, // Отображать деления оси X ?
                isVisibleScaleY: true, // Отображать деления оси Y ?
                scaleX: 1, // Размер деления оси X (Не в пикселах)
                scaleY: 1, // Размер деления оси Y (Не в пикселах)
                widthScales: 1, // Толщина линий разметки
                colorScales: "rgba(0, 0, 0, .2)" // Цвет разметки
            };


            // =========================================================================
            // updateOptions
            // =========================================================================
            // Обновляем options.axis_and_scales.options
            // options - Объект, из которого вносим изменения
            updateOptions = function(newOptions){
                var propertyName; // Имена передаваемых свойств объекта

                for (propertyName in newOptions) {
                    // if (options[propertyName]) {
                        options[propertyName] = newOptions[propertyName];
                    // };
                };
            }


            updateOptions(newOptions);


            XYToPix = services_functions.XYToPix(options);

            xToPix = XYToPix.xToPix;
            yToPix = XYToPix.yToPix;



            // Получение объекта с координатами начальных и конечных линий разметки для осей XY
            scaleXY = function(){
                var xStart,
                    xEnd,
                    yStart,
                    yEnd,

                    ceilScale, // Формула с округлением в бОльшую сторону
                    floorScale; // Формула с округлением в меньшую сторону

                // Формула с округлением в бОльшую сторону
                // val - значение x или y
                // s - значение options.scaleX или options.scaleY
                ceilScale = function(val, s){
                    return Math.ceil(val / s) * s;
                };

                // Формула с округлением в меньшую сторону
                // val - значение x или y
                // s - значение options.scaleX или options.scaleY
                floorScale = function(val, s){
                    return Math.floor(val / s) * s;
                };

                xStart = ceilScale(options.diapasonX.x1, options.scaleX);

                xEnd = floorScale(options.diapasonX.x2, options.scaleX);

                yStart = options.diapasonY.y1 > 0 ? floorScale(options.diapasonY.y1, options.scaleY):
                                                    ceilScale(options.diapasonY.y1, options.scaleY);

                yEnd = options.diapasonY.y2 > 0 ? floorScale(options.diapasonY.y2, options.scaleY):
                                                  ceilScale(options.diapasonY.y2, options.scaleY);

                return {xStart: xStart,
                        xEnd: xEnd,
                        yStart: yStart,
                        yEnd: yEnd
                    };
            };



            // ================================================
            // drawAxis
            // ================================================
            // Функция отрисовки осей
            drawAxis = function(){
                var axisX = {}, // Координаты 2-х точек для оси X (в пикселах)
                    axisY = {}, // Координаты 2-х точек для оси Y (в пикселах)
                    context = options.canvas.getContext("2d");

                if (options.isVisibleAxisX || options.isVisibleAxisY) {

                    // Общие координаты крайних точек системы координат (в пикселах):
                    // Ось X
                    axisX.x1 = 0;
                    axisX.x2 = options.canvas.width;
                    // Ось Y
                    axisY.y1 = 0;
                    axisY.y2 = options.canvas.height;

                    context.beginPath();
                    context.strokeStyle = options.colorAxis;
                    context.lineWidth = options.widthAxis + "";
                };


                // Ось X
                if ( options.isVisibleAxisX &&
                     ( (options.diapasonY.y2 > 0 && options.diapasonY.y1 < 0) ||
                       options.diapasonY.y2 === 0 ||
                       options.diapasonY.y1 === 0 ) ) {

                    axisX.y1 = axisX.y2 = yToPix(0,true);

                    context.moveTo(axisX.x1, axisX.y1);
                    context.lineTo(axisX.x2, axisX.y2);
                    context.stroke();
                };


                // Ось Y
                if ( options.isVisibleAxisY &&
                     ( (options.diapasonX.x1 < 0 && options.diapasonX.x2 > 0) ||
                       options.diapasonX.x1 === 0 ||
                       options.diapasonX.x2 === 0 ) ) {

                    axisY.x1 = axisY.x2 = xToPix(0);

                    context.moveTo(axisY.x1, axisY.y1);
                    context.lineTo(axisY.x2, axisY.y2);
                    context.stroke();
                };

            };  // drawAxis



            // ================================================
            // drawScales
            // ================================================
            // Функция отрисовки разметки
            drawScales = function(){
                var objScaleXY = {}, // Значения для разметки осей X,Y
                    context = options.canvas.getContext("2d"),
                    i, iMax; // Переменная для цикла for

                if (options.isVisibleScaleX || options.isVisibleScaleY) {
                    
                    context.beginPath();
                    context.lineWidth = options.widthScales + "";
                    context.strokeStyle = options.colorScales;

                    objScaleXY = scaleXY();


                    // Разметка оси X
                    if (options.isVisibleScaleX) {

                        iMax = (objScaleXY.xEnd - objScaleXY.xStart) / options.scaleX;

                        for (i = 0; i <= iMax; i++){

                            x = xToPix(objScaleXY.xStart + i * options.scaleX);

                            context.moveTo(x, 0);
                            context.lineTo(x, options.canvas.height);
                        };

                        context.stroke();
                    };


                    // Разметка оси Y
                    if (options.isVisibleScaleY) {

                        iMax = (objScaleXY.yEnd - objScaleXY.yStart) / options.scaleY;

                        for (i = 0; i <= iMax; i++){

                            y = yToPix( (objScaleXY.yStart + i * options.scaleY), true);

                            context.moveTo(0, y);
                            context.lineTo(options.canvas.width, y);

                        };

                        context.stroke();
                    };

                };

            }; // drawScales


        return {
            options: options,
            updateOptions: updateOptions,
            drawAxis: drawAxis,
            drawScales: drawScales
        }

    };



    return {
        As: As
    };

});