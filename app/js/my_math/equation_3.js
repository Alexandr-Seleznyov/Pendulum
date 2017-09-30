'use strict';
// =============================================================
// equation_3
// Решение уравнения 3-й степени
// =============================================================

define(['my_math/math_functions'], function(math_functions){

    var equation3Kardano, // Кубическое уравнение - Формула Кардано
        equation3Vieta;   // Кубическое уравнение - Тригонометрическая формула Виета




    // =========================================================================================
    // equation3Kardano
    // =========================================================================================
    // Кубическое уравнение ax^3 + bx^2 + cx + d = 0
    // Условие: a !== 0
    // Нахождение корней через - Формулу Кардано
    // a, b, c, d - коэффициенты этого уравнения
    // Результат - объект {x1, x2, x3, f, message}
    //      x1, x2, x3 - корни уравнения
    //      f - функция f(x) = ax^3 + bx^2 + cx + d
    //      message - Сообщение
    equation3Kardano = function(a, b, c, d){
        var f, // Функция f(x)
            xy, // Функция x(y) для приведения к виду y^3 + py + q = 0   при   x = y - (b / (3a))
            p, q, // Новые параметры уравнения
            Q, alfa, beta, y1, y2, buffer1, buffer2, fi, // Вспомогательные переменные
            result = {}; // Результат

        if (arguments.length < 4) {
            result.message = 'Недостаточно параметров. (Уравнение ax^3 + bx^2 + cx + d = 0, Параметры a, b, c, d при a <> 0)';
            return result;
        };

        f = function(x){
            return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
        };

        result.f = f;

        if (a === 0) {
            result.message = 'Ошибка в параметре a. (Условие a <> 0)';
            return result;
        };

        // Приведём к виду y^3 + py + q = 0   при   x = y - (b / (3a))
        xy = function(y){
            return y - b / (3 * a);
        };

        p = c / a - Math.pow(b, 2) / (3 * Math.pow(a, 2));
        q = 2 * Math.pow(b, 3) / (27 * Math.pow(a, 3)) - b * c / (3 * Math.pow(a, 2)) + d / a;

        // Q - Дискриминант кубического уравнения
        Q = Math.pow((p / 3), 3) + Math.pow((q / 2), 2);

        if (Q < 0){
        // Q < 0 =================================================================

            buffer1 = Math.atan( Math.sqrt(-Q) / (-q / 2) );
            if (q < 0){
                fi = buffer1;
            } else {

                if (q > 0){
                    fi = buffer1 + Math.PI;
                } else { // q = 0

                    fi = Math.PI / 2;
                };
            };

            buffer1 = 2 * Math.sqrt(-p/3);
            y1 = buffer1 * Math.cos(fi / 3);
            y2 = buffer1 * Math.cos(fi / 3  +  2 * Math.PI / 3);
            y3 = buffer1 * Math.cos(fi / 3  +  4 * Math.PI / 3);

            result.x1 = xy(y1);
            result.x2 = xy(y2);
            result.x3 = xy(y3);

            return result;

        } else {

            if (Q > 0){
        // Q > 0 =================================================================

                alfa = Math.cbrt(-q / 2 + Math.sqrt(Q));
                beta = Math.cbrt(-q / 2 - Math.sqrt(Q));

                y1 = alfa + beta;

                buffer1 = -y1 / 2;
                buffer2 = (alfa - beta)*Math.sqrt(3) / 2;

                y2 = {k1: buffer1, k2: buffer2}; // Комплексное число
                y3 = {k1: buffer1, k2: -buffer2}; // Комплексное число

                result.x1 = xy(y1);

                return result;

            } else {
        // Q = 0 =================================================================

                if (p === 0) {
                    result.x1 = xy(0);
                    return result;
                };

                buffer1 = Math.cbrt(-q / 2);
                y1 = 2 * buffer1;
                y2 = - buffer1;

                result.x1 = xy(y1);
                result.x2 = xy(y2);

                return result;
            };
        };

        return result;
    };




    // =========================================================================================
    // equation3Vieta
    // =========================================================================================
    // Кубическое уравнение ax^3 + bx^2 + cx + d = 0
    // Условие: a !== 0
    // Решение - Тригонометрическая формула Виета
    // ax, bx, cx, dx - коэффициенты этого уравнения
    // Результат - объект {x1, x2, x3, f, message}
    // x1, x2, x3 - корни уравнения
    // f - функция f(x) = ax^3 + bx^2 + cx + d
    // message - Сообщение
    equation3Vieta = function(ax, bx, cx, dx){
        var f, // Функция f(x)
            result = {}, // Результат
            a, b, c, // Новые коэфициенты  x^3 + a*x^2 + b*x + c = 0
            q, s, r, fi, k, buffer1, buffer2; // Вспомогательные переменные

        if (arguments.length < 4) {
            result.message = 'Недостаточно параметров. (Уравнение ax^3 + bx^2 + cx + d = 0, Параметры a, b, c, d при a <> 0)';
            return result;
        };

        if (ax === 0) {
            result.message = 'Ошибка в параметре a. (Условие a <> 0)';
            return result;
        };


        f = function(x){
            return ax * Math.pow(x, 3) + bx * Math.pow(x, 2) + cx * x + dx;
        };

        result.f = f;


        a = bx / ax;
        b = cx / ax;
        c = dx / ax;


        q = (Math.pow(a, 2) - 3 * b) / 9;
        r = (2 * Math.pow(a, 3) - 9 * a * b + 27 * c) / 54;
        s = Math.pow(q, 3) - Math.pow(r, 2);

        if (s > 0) {
            fi = Math.acos(r / Math.sqrt(Math.pow(q, 3))) / 3;

            result.x1 = -2 * Math.sqrt(q) * Math.cos(fi) - a / 3;
            result.x2 = -2 * Math.sqrt(q) * Math.cos(fi + (2 / 3) * Math.PI) - a / 3;
            result.x3 = -2 * Math.sqrt(q) * Math.cos(fi - (2 / 3) * Math.PI) - a / 3;

            return result;
        };

        if (s < 0) {

            if (q > 0) {

                k = Math.abs(r) / Math.sqrt(Math.pow(q, 3));

                fi = math_functions.arch(k) / 3;

                buffer1 = math_functions.sgn(r) * Math.sqrt(q) * math_functions.ch(fi);
                buffer2 = Math.sqrt(3) * Math.sqrt(q) * math_functions.sh(fi);

                result.x1 = -2 * buffer1 - a / 3;

                result.x2 = { 
                    k1: (buffer1 - a / 3),
                    k2: buffer2
                }; // Комплексное число

                result.x3 = {
                    k1: buffer1 - a / 3,
                    k2: -buffer2
                }; // Комплексное число

                return result;
            };



            if (q < 0) {

                k = Math.abs(r) / Math.sqrt(Math.pow(Math.abs(q), 3));

                fi = math_functions.arsh(k) / 3;

                buffer1 = math_functions.sgn(r) * Math.sqrt(Math.abs(q)) * math_functions.sh(fi);
                buffer2 = Math.sqrt(3) * Math.sqrt(Math.abs(q)) * math_functions.ch(fi);

                result.x1 = -2 * buffer1 - a / 3;

                result.x2 = {
                    k1: buffer1,
                    k2: buffer2
                }; // Комплексное число

                result.x3 = {
                    k1: buffer1,
                    k2: -buffer2
                }; // Комплексное число

                return result;
            };


            // if (q === 0)

            result.x1 = -Math.cbrt(c - Math.pow(a, 3) / 27) - a / 3;

            buffer1 = -(a + result.x1) / 2;
            buffer2 = Math.sqrt(Math.abs( (a - 3 * result.x1) * (a + result.x1) - 4*b )) / 2;


            result.x2 = {
                k1: buffer1,
                k2: buffer2
            }; // Комплексное число

            result.x3 = {
                k1: buffer1,
                k2: -buffer2
            }; // Комплексное число

            return result;
        };


        buffer1 = math_functions.sgn(r) * Math.sqrt(q);
        buffer2 = a / 3;

        result.x1 = -2 * buffer1 - buffer2;
        result.x2 = buffer1 - buffer2;

        return result;

    };




    return {
        equation3Kardano : equation3Kardano,
        equation3Vieta : equation3Vieta
    };

});