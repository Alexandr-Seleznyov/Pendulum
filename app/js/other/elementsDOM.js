'use strict';
//- Передача необходимых элементов DOM в глобальный объект PENDULUM


var i;

// ===========================================================================
// Элементы DOM ( 1 - маятник )
// ===========================================================================

// Анимация маятника - canvas - Элемент DOM
PENDULUM.argPb.options.canvas = document.querySelector('#pendulum-animation canvas');

// Кнопка - "Старт / Стоп" - Элемент DOM
PENDULUM.argPb.butStart = document.getElementById('start');

// График скорости - canvas - Элемент DOM
PENDULUM.argPb.canvV = document.querySelector('#pendulum-graph-v canvas');

// График ускорения - canvas - Элемент DOM
PENDULUM.argPb.canvA = document.querySelector('#pendulum-graph-a canvas');

// График изменения угла - canvas - Элемент DOM
PENDULUM.argPb.canvAlfa = document.querySelector('#pendulum-graph-alfa canvas');




PENDULUM.argPb.input = {
    // Поле ввода угла отклонения
    inAlfa: document.getElementById('alfa'),

    // Поле ввода длины маятника
    inL: document.getElementById('l')
};


// ===========================================================================
// Элементы DOM ( несколько маятников )
// ===========================================================================

// Анимация маятников - canvas - Элемент DOM
PENDULUM.argPbN.arrayCanvas = new Array();

for (i=0; i<15; i++){
    PENDULUM.argPbN.arrayCanvas[i] = document.querySelector('#can-' + (i+1));
};

// Кнопка - "Старт / Стоп" - Элемент DOM
PENDULUM.argPbN.butStartN = document.getElementById('start-n');

// Кнопка - "Опции" - Элемент DOM
PENDULUM.argPbN.butPropN = document.getElementById('prop-n');

// Панель с опциями
PENDULUM.argPbN.panelPropN = document.getElementById('prop-n-panel');

PENDULUM.argPbN.input = {
    n: new Array(),  // Выбор маятника
    inAlfa: new Array(),  // Поле ввода угла отклонения
    inL: new Array()  // Поле ввода длины маятника
};

for (i=0; i<15; i++){
    PENDULUM.argPbN.input.n[i] = document.getElementById('inp-n-' + i);
    PENDULUM.argPbN.input.inAlfa[i] = document.getElementById('inp-alfa-' + i);
    PENDULUM.argPbN.input.inL[i] = document.getElementById('inp-l-' + i);
};


// ===========================================================================
// Элементы DOM (Уравнения 3-й степени)
// ===========================================================================

// Корни
PENDULUM.equations3.pX1 = document.getElementById('equ-3-x1');
PENDULUM.equations3.pX2 = document.getElementById('equ-3-x2');
PENDULUM.equations3.pX3 = document.getElementById('equ-3-x3');

// Коэффициенты
PENDULUM.equations3.inA = document.getElementById('equ-3-inA');
PENDULUM.equations3.inB = document.getElementById('equ-3-inB');
PENDULUM.equations3.inC = document.getElementById('equ-3-inC');
PENDULUM.equations3.inD = document.getElementById('equ-3-inD');

// canvas (График)
PENDULUM.equations3.canvas = document.getElementById('equ-3-canvas');

// Диапазоны координат
PENDULUM.equations3.inDiapX1 = document.getElementById('equ-3-dx1');
PENDULUM.equations3.inDiapX2 = document.getElementById('equ-3-dx2');
PENDULUM.equations3.inDiapY1 = document.getElementById('equ-3-dy1');
PENDULUM.equations3.inDiapY2 = document.getElementById('equ-3-dy2');

// Размер деления осей XY
PENDULUM.equations3.inScaleXY = document.getElementById('equ-3-sc');


// ===========================================================================
// Элементы DOM (Уравнения 4-й степени)
// ===========================================================================

// Корни
PENDULUM.equations4.pX1 = document.getElementById('equ-4-x1');
PENDULUM.equations4.pX2 = document.getElementById('equ-4-x2');
PENDULUM.equations4.pX3 = document.getElementById('equ-4-x3');
PENDULUM.equations4.pX4 = document.getElementById('equ-4-x4');

// Коэффициенты
PENDULUM.equations4.inA = document.getElementById('equ-4-inA');
PENDULUM.equations4.inB = document.getElementById('equ-4-inB');
PENDULUM.equations4.inC = document.getElementById('equ-4-inC');
PENDULUM.equations4.inD = document.getElementById('equ-4-inD');
PENDULUM.equations4.inE = document.getElementById('equ-4-inE');

// canvas (График)
PENDULUM.equations4.canvas = document.getElementById('equ-4-canvas');

// Диапазоны координат
PENDULUM.equations4.inDiapX1 = document.getElementById('equ-4-dx1');
PENDULUM.equations4.inDiapX2 = document.getElementById('equ-4-dx2');
PENDULUM.equations4.inDiapY1 = document.getElementById('equ-4-dy1');
PENDULUM.equations4.inDiapY2 = document.getElementById('equ-4-dy2');

// Размер деления осей XY
PENDULUM.equations4.inScaleXY = document.getElementById('equ-4-sc');