'use strict'
// =============================================================
// view
// Внешний вид страницы
// =============================================================
// clickMenuButton - Установка текста, для описания сайта
// divSize - Установка высоты canvas для отображения нескольких маятников

$(function(){
    var 
        // Функции
        clickMenuButton, // Установка текста, для описания сайта
        divSize; // Установка высоты canvas для отображения нескольких маятников



    // Текст, для описания сайта (По умолчанию)
    $('#hint').text(PENDULUM.hint);


    // // Корни уравнения 3-й степени
    // $('#equ-3-x1').text('x1 = ' + PENDULUM.equations3.x1);
    // $('#equ-3-x2').text('x2 = ' + PENDULUM.equations3.x2);
    // $('#equ-3-x3').text('x3 = ' + PENDULUM.equations3.x3);




    // =============================================
    // clickMenuButton
    // =============================================
    // Установка текста, для описания сайта
    // e - Кнопка, которая была нажата
    clickMenuButton = function(e){

        $('#menu-buttons .pendulum-button p').removeClass('selected');
        e.target.classList.add('selected');
        $('div[contentName]').attr('isSelected', 'false');

        switch ( e.target.closest('.pendulum-button').getAttribute('id') ) {

            //- ================  'Главная'  =====================
            case 'menu-home' :  $('div[contentName="home"]').attr('isSelected', 'true');
                PENDULUM.hint = PENDULUM.hints.home;
                break;

            //- ================  '1 маятник'  =====================
            case 'menu-one-pend' :  $('div[contentName="one-pend"]').attr('isSelected', 'true');
                PENDULUM.hint = PENDULUM.hints.onePend;
                break;

            //- ================  'N маятников'  =====================
            case 'menu-many-pend' :  $('div[contentName="many-pend"]').attr('isSelected', 'true');
                PENDULUM.hint = PENDULUM.hints.manyPend;
                break;

            //- ================  'Уравнения'  =====================
            case 'menu-equations' :  $('div[contentName="equations"]').attr('isSelected', 'true');
                PENDULUM.hint = PENDULUM.hints.equations;
        };

        $('#hint').text(PENDULUM.hint);

    };



    // =============================================
    // clickMenuButton
    // =============================================
    // Установка высоты canvas для отображения нескольких маятников
    divSize = function(){
        $('#div-back').css('height', $('#can-1').css('height'));
    };





    // =====================================================================
    // Установка событий
    // =====================================================================

    // Кнопки меню
    $('#menu-buttons .pendulum-button').click( function(e){
        clickMenuButton(e);
    });


    // Окно браузера
    $(window).resize(function(){
        divSize();
    });


    // Кнопка 'N маятников'
    $('#menu-many-pend').click(divSize);

});