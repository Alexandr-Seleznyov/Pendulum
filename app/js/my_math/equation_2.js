'use strict';
// =============================================================
// equation_2
// Решение квадратного уравнения
// =============================================================

define([], function(){
    var equation2; // Квадратное уравнение

    // =========================================================================================
    // equation2
    // =========================================================================================
    // Квадратное уравнение ax^2 + bx + c = 0
    // a, b, c - коэффициенты этого уравнения
    // Условие: a !== 0
    // Результат - объект {x1, x2, f, message}
    //      x1, x2 - корни уравнения
    //      f - функция f(x) = ax^2 + bx + c
    //      message - Сообщение
    equation2 = function(a, b, c){
        var d, // Дискриминан
            f, // Функция f(x)
            result = {}; // Результат

            if (arguments.length < 3) {
                result.message = 'Недостаточно параметров. (Уравнение ax^2 + bx + c = 0, Параметры a, b, c при a !== 0)';
                return result;
            };

            f = function(x){
                return a * Math.pow(x, 2) + b * x + c;
            };

            result.f = f;

            if (a === 0) {
                result.message = 'Ошибка в параметре a. (Условие a !== 0)';
                return result;
            };

            d = Math.pow(b, 2) - 4 * a * c;

            if (d > 0) {
                result.message = 'Два корня';
                result.x1 = (-b + Math.sqrt(d)) / (2 * a);
                result.x2 = (-b - Math.sqrt(d)) / (2 * a);
                return result;
            };

            if (d === 0) {
                result.message = 'Один корень';
                result.x1 = - b / (2 * a);
                return result;
            };

            result.message = 'Корней на множестве действительных чисел нет.';

            return result;
    };



    return {
        equation2: equation2
    }
});