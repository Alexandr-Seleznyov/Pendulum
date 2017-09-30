'use strict';
// =============================================================
// period
// Период колибаний математического маятника
// =============================================================

define(['my_math/math_functions'], function(math_functions){

    var period; // Функция, возвращающая период колибаний математического маятника

    // ====================================================================================
    // period
    // ====================================================================================
    // Функция, возвращающая период колибаний математического маятника
    // arg = {alfa, l, g, n}
    //      alfa - угла наклона,
    //      l - его длины,
    //      g - ускорения свободного падения
    //      n - точность (количество слагаемых ряда элиптического интеграла)
    // Если n = 0, то период будет расчитан по классической формуле для малых углов отклонения
    period = function(arg){
        var t, // Период для малых колебаний (классический) при n = 0
            k; // коэф. для более точного определения периода для больших углов

        // Значения по умолчанию:
        if (!arg.g) arg.g = 9.8;
        if (!arg.n) arg.n = 0;

        t = 2 * Math.PI * Math.sqrt(arg.l / arg.g);

        if (arg.n > 0) {
            k = 1 + Math.pow(math_functions.doubleFac(2 * arg.n - 1) / math_functions.doubleFac(2 * arg.n), 2) * Math.pow(Math.sin(arg.alfa / 2), 2 * arg.n);
        } else {
            k = 1;
        };

        return t * k;
    };



    return {
        period: period
    };

});