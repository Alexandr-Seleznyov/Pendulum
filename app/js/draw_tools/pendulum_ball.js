'use strict';
// =============================================================
// pendulum_ball
// Конструктор объекта PendulumBall, для прорисовки движения маятника
// =============================================================

define(['pendulum_tools/functions',
        'pendulum_tools/services_functions',
        'draw_tools/axis_and_scales',
        'draw_tools/graph',
        'my_math/math_functions'],
       function(functions, // Вспомогательные функции для маятника
                services_functions, // Вспомогательные функции
                axis_and_scales, // Оси координат и разметка
                graph, // Методы для рисования графиков функций
                math_functions){ // Математические функции


    var Pb; // Конструктор

    // ================================================================
    // Pb
    // ================================================================
    // Конструктор объекта с методами для прорисовки движения маятника
    // options = {
    //     ============== Необходимые начальные параметры: ===========
    //     canvas - элемент DOM
    //     l - Длина маятника
    //     alfa - Начальный угол отклонения (Не изменяется)
    //
    //     ============== Другие параметры: ==========================
    //     alfa1 - Угол отклонения в 1-й точке
    //     alfa2 - Угол отклонения во 2-й точке
    // 
    //     x0 - Начальная координата X (Не изменяемая)
    //     x1 - Координата X 1-й точки
    //     x2 - Координата X 2-й точки
    // 
    //     a1 - Ускорение по оси X в 1-й точке
    //     a2 - Ускорение по оси X во 2-й точке
    // 
    //     at1 - Ускорение по касательной в 1-й точке
    //     at2 - Ускорение по касательной во 2-й точке
    //
    //     v1 - Скорость по оси X в 1-й точке
    //     v2 - Скорость по оси X во 2-й точке
    //
    //     vt1 - Скорость по касательной в 1-й точке
    //     vt2 - Скорость по касательной во 2-й точке
    //
    //     dt - Время прохождения от x1 до x2
    //
    //     g - Ускорение свободного падения
    //     countX - Количество операций за четверть периода
    //
    //     ballR - радиус шара
    //     ballColor - цвет шара
    //
    //     axisIsVisible - Отображать оси координат
    //     optionsScales - Объект, отвечающий за масштаб
    //     h - Высота подвеса
    //
    //     ============== Параметры для построения графиков: ==============
    //     arrayV    - Массив - диапазон значений скорости в интервале времени
    //     arrayA    - Массив - диапазон значений ускорения в интервале времени
    //     arrayAlfa - Массив - диапазон значений угла отклонения в интервале времени
    //     arrayT    - Массив - диапазон значений времени в интервале всего времени
    //     intervalT - Интервал времени
    // }

    Pb = function(options){

        var shot, // Функция для вывода одного фрагмента анимации
            begin, // Функция для отображения картинки при начальных условиях
            start, // Функция для запуска анимации
            stop,  // Функция для остановки анимации
            clear, // Функция очистки canvas
            timer, // Идентификатор счётчика (Для остановки маятника)
            axisScales, // Объект с методами для отрисовки осей координат и разметки
            optionsScales, // Объект для масштабирования
            proportion, // Функция для установки пропроции 1х1
            diapasons, // Диапазоны XY
            diapasonGraphV = {},    // Диапазон XY для графика V(t)
            diapasonGraphA = {},    // Диапазон XY для графика A(t)
            diapasonGraphAlfa = {}, // Диапазон XY для графика Alfa(t)
            diapasonT = {}, // Диапазон Y (по времени)
            XYToPix, // Объект с функциями {xToPix, yToPix}
            xToPix, // Преобразование значения X в pix
            yToPix, // Преобразование значения Y в pix
            period, // Период колебаний
            padding, // Отступ
            x1, x2, y1, y2, // Вспомогательные переменные
            nextOptions, // Функция установки следующих параметров
            isStarted = false, // Состояние маятника

            addArrays, // Функция заполнения массивов V, A, Alfa, T
            draw, // Функция отрисовки графиков x(t)
            objArray = {}; //Объект для определения массивов

            objArray.arrayV = new Array();
            objArray.arrayA = new Array();
            objArray.arrayAlfa = new Array();
            objArray.arrayT = new Array();


        // Установка некоторых свойств по умолчанию:
        if (!options.g)              options.g = 9.8;
        if (!options.countX)         options.countX = 100;
        if (!options.axisIsVisible)  options.axisIsVisible = true;
        if (!options.ballR)          options.ballR = options.l / 40;
        if (!options.ballColor)      options.ballColor = '#AB0000';

        options.alfa1 = math_functions.degToRad(options.alfa);

        // Определение периода:
        period = functions.period({
            l: options.l,
            alfa: options.alfa1,
            n: 0
        });

        if (!options.optionsScales) {

            // Определение расположения и масштаба содержимого canvas:

            padding = 2 * options.ballR; // Отступ шара от края canvas

            // Определяем диапазоны координат
            x1 = -options.l - padding;
            x2 = options.l + padding;

            y1 = - padding;
            y2 = options.l + padding;

            diapasons = functions.proportion(
                                {x1: x1, x2: x2},
                                {y1: y1, y2: y2},
                                options.canvas.width,
                                options.canvas.height);

            optionsScales = {
                canvas: options.canvas,
                diapasonX: diapasons.x,
                diapasonY: diapasons.y
            };

        } else {
            optionsScales = options.optionsScales;
        };

        optionsScales.h = options.h;
        optionsScales.l = options.l;

        XYToPix = services_functions.XYToPix(optionsScales);

        xToPix = XYToPix.xToPix;
        yToPix = XYToPix.yToPix;
        lengthToPix = XYToPix.lengthToPix;

        // Определение объекта для отображения разметки и осей координат
        axisScales = axis_and_scales.As(optionsScales);
        axisScales.options.colorAxis = "rgba(0, 0, 0, .1)";




        // ========================================================================
        // shot
        // ========================================================================
        // Функция для вывода одного фрагмента анимации
        // x, y - координаты шарика
        shot = function(x, y){
            ctx = options.canvas.getContext("2d");

            // Рисуем оси координат
            if (options.axisIsVisible) {
                axisScales.drawAxis();
            };

            // Рисуем нить:
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 0, 0, .3)';
            ctx.lineWidth = '1';
            ctx.moveTo(xToPix(x), yToPix(y));
            ctx.lineTo(xToPix(0), yToPix(options.l));
            ctx.stroke();

            // Рисуем шар:
            ctx.beginPath();
            ctx.arc(xToPix(x), yToPix(y), lengthToPix(options.ballR), 0, 2*Math.PI, false);
            ctx.fillStyle = options.ballColor;
            ctx.closePath();
            ctx.fill();

        };




        // ========================================================================
        // begin
        // ========================================================================
        // Функция для отображения картинки при начальных условиях
        begin = function(){

            options.y1 = functions.getY(options.x1, options.l);
            shot(options.x1, options.y1);

        };




        // ========================================================================
        // start
        // ========================================================================
        // Функция для запуска анимации
        // diap - boolean
        //      true - Значит функция просто вычисляет диапазон значений по оси X
        //             для отображения графиков скорости, ускорения, изменения угла от времени
        start = function(diap){
            var step,  // Рекурсивная функция отрисовки и определения следующего dt
                getDt, // Функция определения dt
                dx, dt, // Отрезок расстояния и времени
                iZOld, x1Old, // Предыдущее значение iZ и x1
                dtV2; // {dt, v2, iZ}

            // =========================================================
            // getDt
            // =========================================================
            // определение dt
            getDt = function(){
                var dt;

                // Определение x2
                if ( (iZOld === 1 && options.x1 < 0) ||
                     (iZOld === 1 && options.x1 === 0 && x1Old < 0) ||
                     (iZOld === -1 && options.x1 > 0) ) {

                    options.x2 = options.x1 + dx;

                } else {
                    options.x2 = options.x1 - dx;
                };

                if ( Math.abs(Math.round( options.x2 / dx ) ) === 0 ) {
                    options.x2 = 0;
                };

                options.y2 =  functions.getY(options.x2, options.l);

                // Определение dt и v2
                dtV2 = functions.getDTV(options); // arg = {x1, x2, v1, g, l}
                dt = dtV2.dt;
                options.v2 = dtV2.v2;

                iZOld = dtV2.iZ;

                options.a2 = functions.getA({
                    g: options.g,
                    l: options.l,
                    x: options.x2,
                    alfa: options.alfa2
                });

                options.at2 = options.g * Math.sin(options.alfa2);
                options.vt2 = options.v2 / Math.cos(options.alfa2);
                options.alfa2 = functions.getAlfa({
                    x1: options.x2,
                    l: options.l
                });

                return dt;
            };



            // =========================================================
            // step
            // =========================================================
            // Рекурсивная функция отрисовки и определения следующего dt
            step = function(dt){
                var calculating; // Функция для вычисления следующих значений

                // Вычисление следующих значений
                calculating = function() {
                    var buffer;

                    if (options.v2 === 0 &&
                        options.x2 === 0 &&
                        options.y2 === 0) {

                        isStarted = false;
                        return;
                    };

                    // Установка n-го состояния:
                    x1Old = options.x1;
                    options.x1 = options.x2;
                    options.v1 = options.v2;
                    options.y1 = options.y2;
                    options.a1 = options.a2;
                    options.at1 = options.at2;
                    options.vt1 = options.vt2;
                    options.alfa1 = options.alfa2;

                    // Определение n-го значения dt ( изменяется 2-е состояние options.x2 ... )
                    dt = getDt();

                    if (!diap) {
                        // Определение массивов
                        if ( objArray.graphV ||
                             objArray.graphA ||
                             objArray.graphAlfa ) {

                            if (isFinite(dt)) {
                                objArray.dt = dt; // dt - отрезок времени
                                // if (objArray.graphV)    { objArray.v = options.v2; }; // v1 - скорость по оси X
                                if (objArray.graphV)    { objArray.v = options.vt2; }; // скорость по касательной
                                // if (objArray.graphA)    { objArray.a = options.a2; }; // a1 - ускорение по оси X
                                if (objArray.graphA)    { objArray.a = options.at2; }; //ускорение по касательной
                                if (objArray.graphAlfa) { objArray.alfa = options.alfa2; }; // alfa1 - угол отклонения
                                addArrays();
                            };
                        };
                    };

                    // Определение диапазонов ( n-е состояние )
                    if (diap) {

                        // Диапазон Y (по времени)
                        diapasonT.x2 += dt;

                        // Диапазон XY для графика V(t)
                        if (options.vt1 < diapasonGraphV.y1) {
                            diapasonGraphV.y1 = options.vt1;
                        } else {
                            if (options.vt1 > diapasonGraphV.y2) {   diapasonGraphV.y2 = options.vt1;   };
                        };

                        // Диапазон XY для графика A(t)
                        if (options.at1 < diapasonGraphA.y1) {
                            diapasonGraphA.y1 = options.at1;
                        } else {
                            if (options.at1 > diapasonGraphA.y2) {   diapasonGraphA.y2 = options.at1;   };
                        };

                        // Диапазон XY для графика Alfa(t)
                        if (options.alfa1 < diapasonGraphAlfa.y1) {
                            diapasonGraphAlfa.y1 = options.alfa1;
                        } else {
                            if (options.alfa1 > diapasonGraphAlfa.y2) {   diapasonGraphAlfa.y2 = options.alfa1;   };
                        };

                        if (options.alfa1 === 0) {
                            diap = false;

                            diapasonT.x2 *= 4;

                            buffer = diapasonGraphV.y2 - diapasonGraphV.y1;
                            diapasonGraphV.y1 = -buffer;
                            diapasonGraphV.y2 = buffer;

                            buffer = diapasonGraphA.y2 - diapasonGraphA.y1;
                            diapasonGraphA.y1 = -buffer;
                            diapasonGraphA.y2 = buffer;

                            buffer = diapasonGraphAlfa.y2 - diapasonGraphAlfa.y1;
                            diapasonGraphAlfa.y1 = -buffer;
                            diapasonGraphAlfa.y2 = buffer;
                        };

                    };
                }; // calculating


                if (!isStarted && !diap) {
                    return;
                };


                if (isNaN(dt) ) {
                    isStarted = false;
                    return;
                };


                if (!isFinite(dt)) {
                    // Маятник остановился на подъёме
                    iZOld = 1;
                };


                if (diap) {

                    calculating();
                    step(dt);

                } else {

                    timer = setTimeout(function(){

                        // Очищаем canvas
                        clear();

                        // Рисуем одно положение маятника
                        shot(options.x2, options.y2);

                        // Вычисление следующих переменных
                        calculating();

                        // Анимация (Рекурсия)
                        step(dt);

                    }, dt * 1000);

                };

            };  // step()



            // Установка 1-го состояния:
            options.y1 = functions.getY(options.x1, options.l);
            options.v1 = 0;
            iZOld = 1;
            x1Old = options.x1;
            if (!diap) {
                isStarted = true;
            };

            options.alfa1 = functions.getAlfa({
                x1: options.x1,
                l: options.l
            });

            options.a1 = functions.getA({
                g: options.g,
                l: options.l,
                x: options.x1,
                alfa: options.alfa1
            });

            options.at1 = options.g * Math.sin(options.alfa1); //ускорение по касательной
            options.vt1 = 0; // Скорость по касательной



            // Определение диапазонов ( 1-е состояние )
            if (diap) {

                // Диапазон Y (по времени)
                diapasonT.x1 = 0;
                diapasonT.x2 = 0;

                // Диапазон XY для графика V(t)
                diapasonGraphV.y1 = options.vt1;
                diapasonGraphV.y2 = options.vt1;

                // Диапазон XY для графика A(t)
                diapasonGraphA.y1 = options.at1;
                diapasonGraphA.y2 = options.at1;

                // Диапазон XY для графика Alfa(t)
                diapasonGraphAlfa.y1 = options.alfa1;
                diapasonGraphAlfa.y2 = options.alfa1;
            };

            // Прорисовка 1-го состояния:
            if (!diap) {
                begin();
            };

            // Определение dx
            dx = Math.abs(options.x1) / options.countX;

            // Определение 1-го dt
            dt = getDt();

            // Определение 1-го значения массивов
            if (!diap) {
                if ( objArray.graphV ||
                     objArray.graphA ||
                     objArray.graphAlfa ) {

                    objArray.t = options.intervalT; // t - Интервал времени
                    objArray.dt = 0; // dt - отрезок времени
                    if (objArray.graphV) { objArray.v = options.vt1; }; // v1 - скорость по оси X
                    if (objArray.graphA) { objArray.a = options.at1; }; // at1 - ускорение по касательной
                    if (objArray.graphAlfa) {objArray.alfa = options.alfa1; }; // alfa1 - угол отклонения

                    addArrays();
                };
            };


            // Анимация (Рекурсия)
            step(dt);

        }; // start()







        // ========================================================================
        // stop
        // ========================================================================
        // Функция для остановки анимации
        stop = function(){
            clearTimeout(timer);
            isStarted = false;
        };







        // ==========================
        // clear
        // ==========================
        // Функция очистки canvas'ов
        clear = function(){
            var context; // canvas.getContext("2d")

            context = options.canvas.getContext("2d");
            context.clearRect(0, 0, options.canvas.width, options.canvas.height);
        };







        // ==========================
        // addArrays
        // ==========================
        // Функция определения массивов V, A, Alfa, T
        addArrays = function(){
            var resol = true, // Вспомогательная переменная
                diapX = {}, // Диапазон по оси X ({x1, x2})
                push, // Добавление элементов в конец массивов
                shift, // Удаление 1-го элемента массива
                points; // Построение графика по заданным точкам


            // Добавление элементов в конец массивов
            // array - массив
            // gr - объект graph (для построения графиков)
            // y - Добавляемое значение
            push = function(array, gr, y){
                if (gr){
                    array.push(y);
                };
            };


            // Удаление 1-го элемента массива
            // array - массив
            // gr - объект graph (для построения графиков)
            shift = function(array, gr){
                if (gr) {
                    array.shift();
                    gr.options.diapasonX = diapX;
                };
            };


            // Построение графика по заданным точкам
            // array - массив
            // gr - объект graph (для построения графиков)
            points = function(array, gr){
                if (gr) {
                    gr.options.points = {
                        x: objArray.arrayT,
                        y: array
                    };

                    gr.clear();
                    gr.options.axis_and_scales.drawAxis();
                    gr.options.axis_and_scales.drawScales();
                    gr.draw();
                };
            };


            if ( !objArray.graphV &&
                 !objArray.graphA &&
                 !objArray.graphAlfa ) {
                return;
            };

            if (objArray.arrayT.length === 0) {
                objArray.arrayT[0] = objArray.dt;
            } else {
                objArray.arrayT.push(objArray.arrayT[objArray.arrayT.length - 1] + objArray.dt);
            };

            push(objArray.arrayV, objArray.graphV, objArray.v);
            push(objArray.arrayA, objArray.graphA, objArray.a);
            push(objArray.arrayAlfa, objArray.graphAlfa, objArray.alfa);


            while (resol) {

                if ( (objArray.arrayT[objArray.arrayT.length - 1] - objArray.arrayT[0]) > objArray.t) {

                    objArray.arrayT.shift();
                    diapX = {x1: objArray.arrayT[0], x2: objArray.arrayT[objArray.arrayT.length - 1]};

                    shift(objArray.arrayV, objArray.graphV);
                    shift(objArray.arrayA, objArray.graphA);
                    shift(objArray.arrayAlfa, objArray.graphAlfa);

                } else {
                    resol = false;
                };
            };

            points(objArray.arrayV, objArray.graphV);
            points(objArray.arrayA, objArray.graphA);
            points(objArray.arrayAlfa, objArray.graphAlfa);

        };  // addArrays()







        // ========================================================================
        // draw
        // ========================================================================
        // Функция отрисовки графика x(t) по массивам данных
        // x =
        //      'v' - скорости
        //      'a' - ускорения
        //      'alfa' - угла отклонения
        // canvas - элемент DOM
        draw = function(x, canvas){
            var newOptions = Object.create(options),
                x1 = options.x1,
                sX,  // Определение scaleX
                sc;  // Установка scaleX и scaleY


            // Установка scaleX и scaleY
            // gr - Объект graph
            sc = function(gr){
                gr.options.axis_and_scales.options.scaleX = sX;
                gr.options.axis_and_scales.options.scaleY = (newOptions.diapasonY.y2 - newOptions.diapasonY.y1) / 4;
            };


            newOptions.canvas = canvas;

            if (!diapasonT.x1 || !diapasonT.x2) {
                // Определение диапазонов отображения графиков
                // Ось X. (t - время) Для каждого графика один диапазон.
                // Определяем значения за четверть периода
                start(true);
            };

            diapasonT.x2 *= 2;
            newOptions.diapasonX = diapasonT;
            sX = diapasonT.x2 / 8;

            // Определение объекта 'graph' для заданого графика
            if (x === 'v') {
                newOptions.diapasonY = diapasonGraphV;
                objArray.graphV = graph.Graph(newOptions);
                sc(objArray.graphV);
            };

            if (x === 'a') {
                newOptions.diapasonY = diapasonGraphA;
                objArray.graphA = graph.Graph(newOptions);
                sc(objArray.graphA);
            };

            if (x === 'alfa') {
                newOptions.diapasonY = diapasonGraphAlfa;
                objArray.graphAlfa = graph.Graph(newOptions);
                sc(objArray.graphAlfa);
            };

            options.x1 = x1;
            options.intervalT = diapasonT.x2;
        };



        return {
            options: options,
            shot: shot,
            begin: begin,
            start: start,
            stop: stop,
            clear: clear,
            axisScales: axisScales,
            period: period,
            draw: draw
        };
    };



    return {
        PendulumBall: Pb
    };

});