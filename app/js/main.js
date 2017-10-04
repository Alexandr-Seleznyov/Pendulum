'use strict';
// =============================================================
// main
// Главный скрипт (Контроллер)
// =============================================================

define(['draw_tools/pendulum_ball',
        'pendulum_tools/functions',
        'my_math/math_functions',
        'my_math/equation_3',
        'my_math/equation_4',
        'draw_tools/graph',
        'other/view'
        ], function(
            pendulum_ball, // Конструктор объекта с методами для прорисовки движения маятника
            functions, // Вспомогательные функции для маятника
            math_functions, // Математические функции
            equation_3, // Решение уравнения 3-й степени
            equation_4, // Решение уравнения 4-й степени
            graph, // Работа с графиком функции
            view // Внешний вид страницы
            ){


    var
        // Анимация движения маятника:
        argPb, // Объект с аргументами для одного маятника
        creatPb, // Функция для создания объекта, для управления анимацией
        refresh, // Функция для остановки и обновления анимации одного маятника
        refreshN, // Функция для остановки и обновления анимации нескольких маятников
        begin, // Функция для подготовки к анимации
        beginEqu3, // Функция для решения уравнения 3-й степени и отрисовки её графика
        beginEqu4, // Функция для решения уравнения 4-й степени и отрисовки её графика

        // Объекты для формирования графиков (один маятник):
        optionsV, // Объект, для управления графиком изменения скорости
        optionsA, // Объект, для управления графиком изменения ускорения
        optionsAlfa, // Объект, для управления графиком изменения угла отклонения

        // Анимация движения нескольких маятников:
        argPbN, // Объект с аргументами для нескольких маятников
        optionsScales, // Функция для определения объекта, отвечающего за масштаб
        getHeight, // Функция определяющая высоту подвеса
        getBallR, // Функция определяющая радиус шарика
        getIndexMaxL, // Функция для определения индекса массива с максимальным значением длины маятника
        iMax, // Индекс массива с максимальным значением длины маятника
        n; // Максимальное количество маятников

    // Вывод в консоль даты и времени последнего обновления
    console.log('Last update: 04.10.2017 15:13');

    // Определение объектов и переменных:

    argPb = PENDULUM.argPb;
    argPbN = PENDULUM.argPbN;

    n = PENDULUM.argPbN.countN;




    // =====================================================================
    // getIndexMaxL
    // =====================================================================
    // Функция для определения индекса массива с максимальным значением длины маятника
    // arg - argPbN (Объект с аргументами для нескольких маятников)
    getIndexMaxL = function(arg){
        var i, // Переменная для цыкла
            lMax, // Максимальная длина из всех маятников
            iMax; // Индекс массива с максимальным значением длины маятника

        lMax = 0;

        for(i=0; i<n; i++) {
            if (arg.optionsN[i].l > lMax) {
                if (!argPbN.optionsN[i].n) continue;
                lMax = arg.optionsN[i].l;
                iMax = i;
            };
        };

        return iMax;
    };




    // =====================================================================
    // optionsScales
    // =====================================================================
    // Функция для определения объекта, отвечающего за масштаб
    // (Необходим один масштаб для всех маятников)
    // arg - argPbN (Объект с аргументами для нескольких маятников)
    optionsScales = function(arg){
        var x1, x2,
            y1, y2,
            padding, // Отступ шара от края canvas
            diapasons; // Диапазоны x, y, и размеры canvas

            // Определяем индекс массива с максимальным значением длины маятника
            iMax = getIndexMaxL(argPbN);

            // Определяем отступ шара от края canvas
            padding = 2 * arg.optionsN[iMax].l / 40;

            // Определяем диапазоны координат
            x1 = -arg.optionsN[iMax].l - padding;
            x2 = arg.optionsN[iMax].l + padding;

            y1 = - padding;
            y2 = arg.optionsN[iMax].l + padding;

            diapasons = functions.proportion(
                                {x1: x1, x2: x2},
                                {y1: y1, y2: y2},
                                arg.optionsN[iMax].canvas.width,
                                arg.optionsN[iMax].canvas.height);

            return {
                canvas: arg.optionsN[iMax].canvas,
                diapasonX: diapasons.x,
                diapasonY: diapasons.y
            };

    };



    // =====================================================================
    // getHeight
    // =====================================================================
    // Функция определяющая высоту подвеса
    // arg - argPbN (Объект с аргументами для нескольких маятников)
    getHeight = function(arg){
        iMax = getIndexMaxL(argPbN);

        return arg.optionsN[iMax].l;
    };



    // =====================================================================
    // getBallR
    // =====================================================================
    // Функция определяющая радиус шарика
    // arg - argPbN (Объект с аргументами для нескольких маятников)
    getBallR = function(arg){
        iMax = getIndexMaxL(argPbN);

        return arg.optionsN[iMax].l / 40;
    };



    // =====================================================================
    // creatPb
    // =====================================================================
    // Функция для создания объекта, для управления анимацией
    // return - PendulumBall - объект, для управления анимацией
    creatPb = function(options){
        // Определяем 1-ю координату X, в зависимости от угла отклонения
        options.x1 = functions.getXal(math_functions.degToRad(options.alfa), options.l);

        // Создаём объект, для управления анимацией
        return pendulum_ball.PendulumBall(options);
    };



    // =====================================================================
    // refresh
    // =====================================================================
    // Функция для остановки и обновления параметров анимации одного маятника
    // arg - argPb (Объект с аргументами для одного маятника)
    // pb - PendulumBall - объект, для управления анимацией
    refresh = function(arg){
        // Останавливаем маятник
        arg.pb.stop();

        // Установка атрибута для кнопки 'Старт/Стоп'
        arg.butStart.setAttribute('pendulum-state', 'isStopped');

        // Подготовка к анимации
        begin(arg);
    };



    // =====================================================================
    // refreshN
    // =====================================================================
    // Функция для остановки и обновления анимации нескольких маятников
    // arg - argPbN (Объект с аргументами для нескольких маятников)
    // arrayPb - PendulumBall - массив с объектами, для управления анимацией
    refreshN = function(arg){

        for(var i=0; i<n; i++) {
            if (!arg.arrayPb[i]) continue;
            // Останавливаем все маятники
            arg.arrayPb[i].stop();

            // Чистим картинку
            arg.arrayPb[i].clear();
        };

        // Установка атрибута для кнопки 'Старт/Стоп'
        arg.butStartN.setAttribute('pendulum-state', 'isStopped');

        // Подготовка к анимации
        beginN(arg);

    };



    // =====================================================================
    // begin
    // =====================================================================
    // Функция для подготовки к анимации одного маятника
    // arg - argPb (Объект с аргументами для одного маятника)
    begin = function(arg) {

        // Установка значений в DOM элементах
        arg.input.inAlfa.value = arg.options.alfa;
        arg.input.inL.value = arg.options.l;

        // Создаём объект pb - PendulumBall - объект, для управления анимацией
        arg.pb = creatPb(arg.options);

        // Чистим canvas
        arg.pb.clear();

        // Устанавливаем маятник в начальное положение
        arg.pb.begin();

        // ========= Подготовка графиков:
        // График изменения скорости V(t)
        arg.pb.draw('v', arg.canvV);

        // График изменения ускорения a(t)
        arg.pb.draw('a', arg.canvA);

        // График изменения ускорения alfa(t)
        arg.pb.draw('alfa', arg.canvAlfa);
    };



    // =====================================================================
    // beginN
    // =====================================================================
    // Функция для подготовки к анимации нескольких маятников
    // arg - argPbN (Объект с аргументами для нескольких маятников)
    beginN = function(arg) {
        var os, // Объект для масштабирования
            h,  // Высота подвеса
            r,  // Радиус шарика
            isEmpty = true,  // boolean (true - если не выбрано ниодного маятника)
            isAxis = false,  // boolean (true - если оси уже нарисованы)
            indexLostPb,  // Индекс последнего объекта для управления анимацией
            i;  // Переменная для цыкла

        h = getHeight(arg); // Высота подвеса

        r = getBallR(arg); // Радиус шарика

        for(i=0; i<n; i++) {

            // Установка значений в DOM элементах
            arg.input.n[i].checked = arg.optionsN[i].n;
            arg.input.inAlfa[i].value = arg.optionsN[i].alfa;
            arg.input.inL[i].value = arg.optionsN[i].l;

            if (!arg.optionsN[i].n) continue;

            arg.optionsN[i].canvas = arg.arrayCanvas[i];

            indexLostPb = i;
        };


        // Проверка, есть ли хоть 1 маятник
        for(i=0; i<n; i++) {
            if (!arg.optionsN[i].n) continue;

            if (isEmpty) isEmpty = false;
        };


        if (!isEmpty) {
            os = optionsScales(arg); // Объект для масштабирования
        };


        for(i=0; i<n; i++) {
            if (!arg.optionsN[i].n) continue;

            // Устанавливаем 1 масштаб для всех маятников
            arg.optionsN[i].optionsScales = {};
            arg.optionsN[i].optionsScales.canvas = arg.optionsN[i].canvas;
            arg.optionsN[i].optionsScales.diapasonX = {x1: os.diapasonX.x1, x2: os.diapasonX.x2};
            arg.optionsN[i].optionsScales.diapasonY = {y1: os.diapasonY.y1, y2: os.diapasonY.y2};

            arg.optionsN[i].name = 'pandulum - ' + i;

            // Высота подвеса, одинаковая для всех
            arg.optionsN[i].h = h;

            // Радиус шарика
            arg.optionsN[i].ballR = r;

            // Создаём объекты PendulumBall
            arg.arrayPb[i] = creatPb(arg.optionsN[i]);

            if (isAxis) {
                // Рисуем оси только 1 раз
                arg.arrayPb[i].options.axisIsVisible = false;
            } else {
                isAxis = true;
            };

            // Устанавливаем маятник в начальное положение
            arg.arrayPb[i].begin();
        };

    };



    // =====================================================================
    // beginEqu3
    // =====================================================================
    // Функция для решения уравнения 3-й степени и отрисовки её графика
    beginEqu3 = function(){
        var result,
            graph3;

        // Установка значений в DOM элементах
        PENDULUM.equations3.inDiapX1.value = PENDULUM.equations3.diapX1;
        PENDULUM.equations3.inDiapX2.value = PENDULUM.equations3.diapX2;
        PENDULUM.equations3.inDiapY1.value = PENDULUM.equations3.diapY1;
        PENDULUM.equations3.inDiapY2.value = PENDULUM.equations3.diapY2;
        PENDULUM.equations3.inScaleXY.value = PENDULUM.equations3.scaleXY;
        PENDULUM.equations3.inA.value = PENDULUM.equations3.a;
        PENDULUM.equations3.inB.value = PENDULUM.equations3.b;
        PENDULUM.equations3.inC.value = PENDULUM.equations3.c;
        PENDULUM.equations3.inD.value = PENDULUM.equations3.d;


        // Нахождение корней через - Формулу Кардано
        result = equation_3.equation3Kardano(PENDULUM.equations3.a,
                                             PENDULUM.equations3.b,
                                             PENDULUM.equations3.c,
                                             PENDULUM.equations3.d);

        // Отображаем корни на страничке
        PENDULUM.equations3.pX1.innerHTML = 'x<sub>1</sub> = нет корня';
        PENDULUM.equations3.pX2.innerHTML = 'x<sub>2</sub> = нет корня';
        PENDULUM.equations3.pX3.innerHTML = 'x<sub>3</sub> = нет корня';

        if (result.x1) PENDULUM.equations3.pX1.innerHTML = 'x<sub>1</sub> = ' + result.x1.toFixed(3);
        if (result.x2) PENDULUM.equations3.pX2.innerHTML = 'x<sub>2</sub> = ' + result.x2.toFixed(3);
        if (result.x3) PENDULUM.equations3.pX3.innerHTML = 'x<sub>3</sub> = ' + result.x3.toFixed(3);

        // Определение объекта графика функции
        graph3 = graph.Graph({
            canvas: PENDULUM.equations3.canvas,
            fun: result.f,
            diapasonX: {
                x1: PENDULUM.equations3.diapX1,
                x2: PENDULUM.equations3.diapX2
            },
            diapasonY: {
                y1: PENDULUM.equations3.diapY1,
                y2: PENDULUM.equations3.diapY2
            },
        });

        graph3.clear();
        graph3.options.axis_and_scales.drawAxis();
        if (PENDULUM.equations3.scaleXY > 0) {
            graph3.options.axis_and_scales.options.scaleX = PENDULUM.equations3.scaleXY;
            graph3.options.axis_and_scales.options.scaleY = PENDULUM.equations3.scaleXY;
            graph3.options.axis_and_scales.drawScales();
        };
        graph3.draw();
    };



    // =====================================================================
    // beginEqu4
    // =====================================================================
    // Функция для решения уравнения 4-й степени и отрисовки её графика
    beginEqu4 = function(){
        var result,
            graph4;

        // Установка значений в DOM элементах
        PENDULUM.equations4.inDiapX1.value = PENDULUM.equations4.diapX1;
        PENDULUM.equations4.inDiapX2.value = PENDULUM.equations4.diapX2;
        PENDULUM.equations4.inDiapY1.value = PENDULUM.equations4.diapY1;
        PENDULUM.equations4.inDiapY2.value = PENDULUM.equations4.diapY2;
        PENDULUM.equations4.inScaleXY.value = PENDULUM.equations4.scaleXY;
        PENDULUM.equations4.inA.value = PENDULUM.equations4.a;
        PENDULUM.equations4.inB.value = PENDULUM.equations4.b;
        PENDULUM.equations4.inC.value = PENDULUM.equations4.c;
        PENDULUM.equations4.inD.value = PENDULUM.equations4.d;
        PENDULUM.equations4.inE.value = PENDULUM.equations4.e;


        // Нахождение корней через метод Феррари
        result = equation_4.equation4Ferrari(PENDULUM.equations4.a,
                                             PENDULUM.equations4.b,
                                             PENDULUM.equations4.c,
                                             PENDULUM.equations4.d,
                                             PENDULUM.equations4.e);

        // Отображаем корни на страничке
        PENDULUM.equations4.pX1.innerHTML = 'x<sub>1</sub> = нет корня';
        PENDULUM.equations4.pX2.innerHTML = 'x<sub>2</sub> = нет корня';
        PENDULUM.equations4.pX3.innerHTML = 'x<sub>3</sub> = нет корня';
        PENDULUM.equations4.pX4.innerHTML = 'x<sub>4</sub> = нет корня';

        if (result.x[0]) PENDULUM.equations4.pX1.innerHTML = 'x<sub>1</sub> = ' + result.x[0].toFixed(3);
        if (result.x[1]) PENDULUM.equations4.pX2.innerHTML = 'x<sub>2</sub> = ' + result.x[1].toFixed(3);
        if (result.x[2]) PENDULUM.equations4.pX3.innerHTML = 'x<sub>3</sub> = ' + result.x[2].toFixed(3);
        if (result.x[3]) PENDULUM.equations4.pX4.innerHTML = 'x<sub>4</sub> = ' + result.x[3].toFixed(3);

        // Определение объекта графика функции
        graph4 = graph.Graph({
            canvas: PENDULUM.equations4.canvas,
            fun: result.f,
            diapasonX: {
                x1: PENDULUM.equations4.diapX1,
                x2: PENDULUM.equations4.diapX2
            },
            diapasonY: {
                y1: PENDULUM.equations4.diapY1,
                y2: PENDULUM.equations4.diapY2
            },
        });

        graph4.clear();
        graph4.options.axis_and_scales.drawAxis();
        if (PENDULUM.equations4.scaleXY > 0) {
            graph4.options.axis_and_scales.options.scaleX = PENDULUM.equations4.scaleXY;
            graph4.options.axis_and_scales.options.scaleY = PENDULUM.equations4.scaleXY;
            graph4.options.axis_and_scales.drawScales();
        };
        graph4.draw();
    };



    begin(argPb);  // Подготовка к анимации одного маятника

    beginN(argPbN);  // Подготовка к анимации нескольких маятников

    beginEqu3();  // Уравнение 3-й степени

    beginEqu4();  // Уравнение 4-й степени





    // =====================================================================
    // Установка событий
    // =====================================================================

    // ===========  1 маятник  ==================

    // Старт и остановка движения маятника
    argPb.butStart.addEventListener('click', function(e){

        refreshN(argPbN); // Останавливаем N маятников

        // Остановка
        if (e.target.getAttribute('pendulum-state') === 'isStarted') {
            refresh(argPb);
            return;
        };

        // Старт
        if (e.target.getAttribute('pendulum-state') === 'isStopped') {
            argPb.pb.start();
            e.target.setAttribute('pendulum-state', 'isStarted');
        };

    });


    // Изменение угла отклонения
    PENDULUM.argPb.input.inAlfa.addEventListener('input', function(e){
        argPb.options.alfa = Number(e.target.value);
        refresh(argPb);
    });


    // Изменение длины маятника
    PENDULUM.argPb.input.inL.addEventListener('input', function(e){
        argPb.options.l = Number(e.target.value);
        refresh(argPb);
    });




    // ===========  Несколько маятников  ==================

    // Настройки всех маятников (Показать/Спрятать)
    PENDULUM.argPbN.butPropN.addEventListener('click', function(){

        if (this.getAttribute('isOpen') === 'false') {
            this.setAttribute('isOpen', 'true');
            PENDULUM.argPbN.panelPropN.setAttribute('isOpen', 'true');
        } else {
            this.setAttribute('isOpen', 'false');
            PENDULUM.argPbN.panelPropN.setAttribute('isOpen', 'false');
        };

    });


    // Старт и остановка движения маятника
    PENDULUM.argPbN.butStartN.addEventListener('click', function(e){
        var i;

        refresh(argPb); // Останавливаем 1 маятник

        // Остановка
        if (e.target.getAttribute('pendulum-state') === 'isStarted') {
            refreshN(argPbN);
            return;
        };

        // Старт
        if (e.target.getAttribute('pendulum-state') === 'isStopped') {
            for(i=0; i<n; i++) {
                if (!argPbN.optionsN[i].n) continue;
                argPbN.arrayPb[i].start();
            };
            e.target.setAttribute('pendulum-state', 'isStarted');
        };

    });



    for (var i=0; i<n; i++){
        // Выбор маятника
        PENDULUM.argPbN.input.n[i].addEventListener('change', function(e){
            argPbN.optionsN[Number(e.target.id.substring(6))].n = e.target.checked;
            refreshN(argPbN);
        });

        // Изменение угла отклонения
        PENDULUM.argPbN.input.inAlfa[i].addEventListener('input', function(e){
            argPbN.optionsN[Number(e.target.id.substring(9))].alfa = Number(e.target.value);
            refreshN(argPbN);
        });

        // Изменение длины маятника
        PENDULUM.argPbN.input.inL[i].addEventListener('input', function(e){
            var index = Number(e.target.getAttribute('id').substring(6)),
                l = Number(e.target.value);

            if ( l <= 0 ) {
                argPbN.optionsN[index].l = 0.1;
            } else {
                argPbN.optionsN[index].l = l;
            };

            refreshN(argPbN);
        });
    };



    // ===========  Уравнение 3-й степени  ==================

    // Изменение значения 'a'
    PENDULUM.equations3.inA.addEventListener('input', function(e){
        if (Number(e.target.value) === 0) return;
        PENDULUM.equations3.a = Number(e.target.value);
        beginEqu3();
    });

    // Изменение значения 'b'
    PENDULUM.equations3.inB.addEventListener('input', function(e){
        PENDULUM.equations3.b = Number(e.target.value);
        beginEqu3();
    });

    // Изменение значения 'c'
    PENDULUM.equations3.inC.addEventListener('input', function(e){
        PENDULUM.equations3.c = Number(e.target.value);
        beginEqu3();
    });

    // Изменение значения 'd'
    PENDULUM.equations3.inD.addEventListener('input', function(e){
        PENDULUM.equations3.d = Number(e.target.value);
        beginEqu3();
    });


    // Изменение значения диапазона координат 'x1'
    PENDULUM.equations3.inDiapX1.addEventListener('input', function(e){
        PENDULUM.equations3.diapX1 = Number(e.target.value);
        beginEqu3();
    });

    // Изменение значения диапазона координат 'x2'
    PENDULUM.equations3.inDiapX2.addEventListener('input', function(e){
        PENDULUM.equations3.diapX2 = Number(e.target.value);
        beginEqu3();
    });

    // Изменение значения диапазона координат 'y1'
    PENDULUM.equations3.inDiapY1.addEventListener('input', function(e){
        PENDULUM.equations3.diapY1 = Number(e.target.value);
        beginEqu3();
    });

    // Изменение значения диапазона координат 'y2'
    PENDULUM.equations3.inDiapY2.addEventListener('input', function(e){
        PENDULUM.equations3.diapY2 = Number(e.target.value);
        beginEqu3();
    });


    // Изменение значения размера деления осей XY
    PENDULUM.equations3.inScaleXY.addEventListener('input', function(e){
        PENDULUM.equations3.scaleXY = Number(e.target.value);
        beginEqu3();
    });



    // ===========  Уравнение 4-й степени  ==================

    // Изменение значения 'a'
    PENDULUM.equations4.inA.addEventListener('input', function(e){
        if (Number(e.target.value) === 0) return;
        PENDULUM.equations4.a = Number(e.target.value);
        beginEqu4();
    });

    // Изменение значения 'b'
    PENDULUM.equations4.inB.addEventListener('input', function(e){
        PENDULUM.equations4.b = Number(e.target.value);
        beginEqu4();
    });

    // Изменение значения 'c'
    PENDULUM.equations4.inC.addEventListener('input', function(e){
        PENDULUM.equations4.c = Number(e.target.value);
        beginEqu4();
    });

    // Изменение значения 'd'
    PENDULUM.equations4.inD.addEventListener('input', function(e){
        PENDULUM.equations4.d = Number(e.target.value);
        beginEqu4();
    });

    // Изменение значения 'e'
    PENDULUM.equations4.inE.addEventListener('input', function(e){
        PENDULUM.equations4.e = Number(e.target.value);
        beginEqu4();
    });


    // Изменение значения диапазона координат 'x1'
    PENDULUM.equations4.inDiapX1.addEventListener('input', function(e){
        PENDULUM.equations4.diapX1 = Number(e.target.value);
        beginEqu4();
    });

    // Изменение значения диапазона координат 'x2'
    PENDULUM.equations4.inDiapX2.addEventListener('input', function(e){
        PENDULUM.equations4.diapX2 = Number(e.target.value);
        beginEqu4();
    });

    // Изменение значения диапазона координат 'y1'
    PENDULUM.equations4.inDiapY1.addEventListener('input', function(e){
        PENDULUM.equations4.diapY1 = Number(e.target.value);
        beginEqu4();
    });

    // Изменение значения диапазона координат 'y2'
    PENDULUM.equations4.inDiapY2.addEventListener('input', function(e){
        PENDULUM.equations4.diapY2 = Number(e.target.value);
        beginEqu4();
    });


    // Изменение значения размера деления осей XY
    PENDULUM.equations4.inScaleXY.addEventListener('input', function(e){
        PENDULUM.equations4.scaleXY = Number(e.target.value);
        beginEqu4();
    });


});