'use strict';

// ================================================
// Значения по умолчанию
// ================================================


    // Определим один глобальный объект PENDULUM
    var PENDULUM = {};

    // Объект argPb для одного маятника
    PENDULUM.argPb = {};
    PENDULUM.argPb.options = {};

    // Объект argPbN для 15-ти маятников
    PENDULUM.argPbN = {};
    PENDULUM.argPbN.optionsN = new Array();

    for(var i=0; i<15; i++){
        PENDULUM.argPbN.optionsN[i] = {};
    };

    // Объект для уравнения 3-й степени
    PENDULUM.equations3 = {};

    // Объект для уравнения 4-й степени
    PENDULUM.equations4 = {};




    var i,
    n = 15,     // Максимальное количество маятников
    minL = .5,  // Минимальная длина маятника
    stepL = .08; // Шаг, для увеличения длины


// Описание каждого контента:
PENDULUM.hints = {
    home: 'Описание сайта',
    onePend: 'Модель одного математического маятника',
    manyPend: 'Модель нескольких математических маятников',
    equations: 'Решения уравнений 3-й и 4-й степени'
};


// Краткое описание выбранной страницы. По умолчанию - Home
PENDULUM.hint = PENDULUM.hints.home;




// ==============  Начальные значения ( 1 - маятник )  ================

// Объект управления анимацией
PENDULUM.argPb.pb = undefined;

// Длина маятника
PENDULUM.argPb.options.l = 2.1;

// Угол отклонения
PENDULUM.argPb.options.alfa = -60;

// Масса маятника
PENDULUM.argPb.options.m = .1;




// ==============  Начальные значения ( несколько маятников )  ================

// Максимальное количество маятников
PENDULUM.argPbN.countN = n;

// Массив объектов, для управления анимацией
PENDULUM.argPbN.arrayPb = new Array();

// Заполнение массива optionsN
for(i=0; i<n; i++){
    // Какие маятники показывать
    PENDULUM.argPbN.optionsN[i].n = true;

    // Углы отклонения
    PENDULUM.argPbN.optionsN[i].alfa = 45;

    // Длины маятников
    PENDULUM.argPbN.optionsN[i].l = parseFloat((i * stepL + minL).toFixed(2));
};



// ==============  Уравнение 3-й степени ================

PENDULUM.equations3.a = 5;
PENDULUM.equations3.b = -8;
PENDULUM.equations3.c = -8;
PENDULUM.equations3.d = 5;

PENDULUM.equations3.diapX1 = -3;
PENDULUM.equations3.diapX2 = 3;
PENDULUM.equations3.diapY1 = -10;
PENDULUM.equations3.diapY2 = 10;

PENDULUM.equations3.scaleXY = 1;



// ==============  Уравнение 4-й степени ================

PENDULUM.equations4.a = 1;
PENDULUM.equations4.b = 5;
PENDULUM.equations4.c = 5;
PENDULUM.equations4.d = -2;
PENDULUM.equations4.e = -2;

PENDULUM.equations4.diapX1 = -5;
PENDULUM.equations4.diapX2 = 3;
PENDULUM.equations4.diapY1 = -10;
PENDULUM.equations4.diapY2 = 10;

PENDULUM.equations4.scaleXY = 1;