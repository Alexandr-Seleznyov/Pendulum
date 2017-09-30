'use strict';
// =============================================================
// equation_4
// Решение уравнения 4-й степени
// =============================================================

define(['my_math/equation_3'], function(equation_3){
    // equation_3 - Решение уравнения 3-й степени

    var equation4Ferrari; // Уравнение 4-й степени. Решение методом Феррари

    // =========================================================================================
    // equation4Ferrari
    // =========================================================================================
    // Уравнение 4-й степени ax^4 + bx^3 + cx^2 + dx + e = 0
    // Условие: a !== 0
    // Решение методом Феррари
    // Результат - объект {x, f, message}
    //      x - массив с корнями уравнения
    //      f - функция f(x) = ax^4 + bx^3 + cx^2 + dx + e
    //      message - Сообщение
    equation4Ferrari = function(a, b, c, d, e){
        var f, // Функция f(x)
            xy, // Функция x(y) для приведения к виду y^4 + py^2 + qy + r = 0   при   x = y - (b / (4a))
            addX, // Функция добавления действительных корней в массив 'x';
            p, q, r, // Новые параметры уравнения
            z, buffer1, buffer2, buffer3, buffer4, x,// Вспомогательные переменные
            z0, // Любой из кореней кубического уравнения
            result = {}; // Результат

        x = new Array();

        addX = function(xn){
            if (((typeof xn) === 'number') && !isNaN(xn)){
                x[x.length] = xn;
            };
        };


        if (arguments.length < 5) {
            result.message = 'Недостаточно параметров. (Уравнение ax^4 + bx^3 + cx^2 + dx + e = 0, Параметры a, b, c, d, e при a !== 0)';
            return result;
        };

        f = function(x){
            return a * Math.pow(x, 4) + b * Math.pow(x, 3) + c * Math.pow(x, 2) + d * x + e;
        };

        result.f = f;

        if (a === 0) {
            result.message = 'Ошибка в параметре a. (Условие a !== 0)';
            return result;
        };

        // Приведём к виду y^4 + py^2 + qy + r = 0   при   x = y - (b / (3a))
        xy = function(y){
            return y - b / (4 * a);
        };

        p = (8 * a * c - 3 * Math.pow(b, 2)) / (8 * Math.pow(a, 2));
        q = (8 * Math.pow(a, 2) * d + Math.pow(b, 3) - 4 * a * b * c) / (8 * Math.pow(a, 3));
        r = (16 * a * Math.pow(b, 2) * c - 64 * Math.pow(a, 2) * b * d - 3 * Math.pow(b, 4) + 256 * Math.pow(a, 3) * e) / (256 * Math.pow(a, 4));


        if (q !== 0 ) {

            // Определяем z0 - один из кореней кубического уравнения
            z = equation_3.equation3Kardano(1,
                                            p,
                                            ((Math.pow(p, 2) - 4 * r) / 4),
                                            (-Math.pow(q, 2) / 8));

            z0 = z.x1;

            buffer1 = Math.sqrt(2 * z0);
            buffer2 = Math.sqrt(2 * z0 - 4 * (p / 2 + z0 + q / (2 * Math.sqrt(2 * z0))));
            buffer3 = Math.sqrt(2 * z0 - 4 * (p / 2 + z0 - q / (2 * Math.sqrt(2 * z0))));

            addX( xy((buffer1 - buffer2) / 2) );
            addX( xy((buffer1 + buffer2) / 2) );
            addX( xy((-buffer1 - buffer3) / 2) );
            addX( xy((-buffer1 + buffer3) / 2) );

        } else {
            // q === 0
            buffer1 = Math.sqrt((-p - Math.sqrt(Math.pow(p, 2) - 4 * r)) / 2);
            buffer2 = Math.sqrt((-p + Math.sqrt(Math.pow(p, 2) - 4 * r)) / 2);

            addX( xy(buffer1) );
            addX( xy(-buffer1) );
            addX( xy(buffer2) );
            addX( xy(-buffer2) );

        };

        result.x = x;

        return result;
    };


    return {
        equation4Ferrari: equation4Ferrari
    }


});