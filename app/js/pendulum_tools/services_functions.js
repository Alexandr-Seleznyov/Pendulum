'use strict';
// =============================================================
// services_functions
// Вспомогательные функции
// =============================================================

define([], function(){

    var XYToPix;

        // =============================================================
        // XYToPix
        // =============================================================
        // Конструктор функции преобразования значения X в количество пикселей
        // options = {canvas, diapasonX, diapasonY}
        //      canvas - DOM элемент
        //      diapasonX = {x1, x2} - крайние значения по оси X
        //      diapasonY = {y1, y2} - крайние значения по оси Y
        //      h - высота подвеса
        XYToPix = function(options){
            var xToPix, // Преобразование значения X в количество пикселей
                yToPix, // Преобразование значения Y в количество пикселей
                lengthToPix; // Преобразование длины в количество пикселей


            // Преобразование значения X в количество пикселей
            xToPix = function(x){
                var factorX; // Количество пикселей на 1 по оси X

                factorX = options.canvas.width / (options.diapasonX.x2 - options.diapasonX.x1);

                return Math.floor(Math.abs(x - options.diapasonX.x1) * factorX);
            };


            // Преобразование значения Y в количество пикселей
            // isAxis - boolean ( true - Прорисовка оси X )
            yToPix = function(y, isAxis){
                var factorY; // Количество пикселей на 1 по оси Y

                if (!isAxis && options.h && options.l) {
                    y = y + options.h - options.l;
                };

                factorY = options.canvas.height / (options.diapasonY.y2 - options.diapasonY.y1);

                return Math.floor((options.diapasonY.y2 - y) * factorY);
            };


            // Преобразование длины в количество пикселей
            lengthToPix = function(x){
                var factorX; // Количество пикселей на 1 по оси X

                factorX = options.canvas.width / (options.diapasonX.x2 - options.diapasonX.x1);

                return x * factorX;
            };


            return {
                xToPix: xToPix,
                yToPix: yToPix,
                lengthToPix: lengthToPix
            };
        };


    return {
        XYToPix: XYToPix
    };
});