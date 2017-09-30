'use strict';
// =============================================================
// graph
// Конструктор объекта с методами для отрисовки графика
// =============================================================

define(['draw_tools/axis_and_scales',
        'pendulum_tools/services_functions'],
       function(axis_and_scales, // Оси координат и разметка
                services_functions){ // Вспомогательные функции

    var Graph, // Конструктор объекта с методами для отрисовки графика
        updateOptions; // Обновление объекта options значениями из arg



    // =========================================================================
    // updateOptions
    // =========================================================================
    // Обновление объекта options значениями из arg
    // arg - {canvas, fun}
    // options - Объект, в который вносим изменения из arg и
    //           обновляем axis_and_scales
    updateOptions = function(arg, options){
        var propertyName; // Имена передаваемых свойств объекта

        for (propertyName in arg) {
            if (options[propertyName]) {
                options[propertyName] = arg[propertyName];
            };
        };


        if (arg) {
            options.canvas = options.axis_and_scales.options.canvas = arg.canvas;
            options.fun = arg.fun;
        };

        // Обновляем options.axis_and_scales.options
        options.axis_and_scales.updateOptions(options);
    };






    // =========================================================================
    // Graph
    // =========================================================================
    // Конструктор. Отрисовка графика заданной функции F(x)
    // arg - Объект с любыми свойствами объекта options, которые необходимо изменить
    // Обязательные свойства объекта arg:
    //      canvas - элемент DOM - canvas

    Graph = function(arg){



        var options, // Настройки графика функции
            draw, // Функция отрисовки графика
            clear; // Функция очистки canvas

        options = {
            canvas: undefined, //arg.canvas, // элемент DOM - canvas
            fun: undefined, //arg.fun, // Математическая функция F(x). ( function(x) { ... return y; } )

            amountX: 100, // Количество передаваемых значений X
            colorFun: '#FF0000', // Цвет линии графика (формат css)
            widthFun: 2, // Толщина линии графика

            diapasonX: {x1: -1, x2: 1}, // Диапазон значений X
            diapasonY: {y1: -1, y2: 1}, // Диапазон значений Y

            points: undefined,

            axis_and_scales: axis_and_scales.As()
        };

        updateOptions(arg, options); //  Обновляем options


        // ==========================
        // draw
        // ==========================
        // Функция отрисовки графика
        // arg - Объект с любыми свойствами объекта options
        draw = function(arg){
            var context, // canvas.getContext("2d")
                i, // Переменная для цикла for
                step, // Шаг задаваемых значений X
                funX, // Массив значений X
                funY, // Массив значений Y
                x, y, // Координаты в пикселах
                buff, // Временная переменная
                XYToPix, // Объект с функциями {xToPix, yToPix}
                xToPix, // Преобразование значения X в pix
                yToPix; // Преобразование значения Y в pix

            XYToPix = services_functions.XYToPix(options);

            xToPix = XYToPix.xToPix;
            yToPix = XYToPix.yToPix;

            updateOptions(arg, options); //  Обновляем options

            context = options.canvas.getContext("2d");

            // Проверяем диапозон X
            if (options.diapasonX.x1 > options.diapasonX.x2) {
                buff = options.diapasonX.x1;
                options.diapasonX.x1 = options.diapasonX.x2;
                options.diapasonX.x2 = buff;
            };

            // Проверяем диапозон Y
            if (options.diapasonY.y1 > options.diapasonY.y2) {
                buff = options.diapasonY.y1;
                options.diapasonY.y1 = options.diapasonY.y2;
                options.diapasonY.y2 = buff;
            };


            // ================================
            //  Рисуем график функции
            // ================================
            funX = [];
            funY = [];

            step = (options.diapasonX.x2 - options.diapasonX.x1) / options.amountX;

            context.beginPath();
            context.lineWidth = options.widthFun + "";
            context.strokeStyle = options.colorFun;
            context.lineJoin = "round";


            if (!options.points) {

                for (i = 0; i <= options.amountX; i++){
                    funX[i] = options.diapasonX.x1 + i * step;
                    funY[i] = options.fun(funX[i]);
                    x = xToPix(funX[i]);
                    y = yToPix(funY[i]);
                    i === 0 ? context.moveTo(x, y) : context.lineTo(x, y);
                };

            } else {

                // Строим график по заданным точкам
                for (i = 0; i < options.points.x.length; i++){
                    i === 0 ? context.moveTo(xToPix(options.points.x[0]), yToPix(options.points.y[0])) :
                              context.lineTo(xToPix(options.points.x[i]), yToPix(options.points.y[i]));
                };

            };


            context.stroke();
        }; // draw



        // ==========================
        // clear
        // ==========================
        // Функция очистки canvas
        clear = function(){
            var context; // canvas.getContext("2d")

            context = options.canvas.getContext("2d");

            context.clearRect(0, 0, options.canvas.width, options.canvas.height);
        };




        return {
            draw: draw,
            clear: clear,
            options: options,
            updateOAS: options.axis_and_scales.updateOptions
        };

    }; // Graph




    // Возвращаемые функции:
    return {
        Graph: Graph
    };
});