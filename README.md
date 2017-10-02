# Pendulum
Математическая модель движения маятника.
***
Этот проект создан в образовательных целях.  
Его суть заключается в построении модели математического маятника.  
Сама модель реализована в библиотеке, написанной на JavaScript.  
Демонстрация реализована на сайте http://pendulum.000webhostapp.com/, исходники которого находятся здесь.
Проект реализован в системе сборки gulp.

### Структура:

Папка / файл     | Коментарий
-----------------|----------------------
app              | Исходный код
bower_components | Компоненты Bower, необходимые для автоматической сборки проекта
dist             | Готовый собранный проект
node_modules     | Модули NodeJS, необходимые для автоматической сборки проекта
gulpfile.js      | Логика сборки
package.json     | Информация о проекте

#### app

Папка     | Коментарий
----------|----------------------
css       | css файлы, сформированные из sass файлов
fonts     | Шрифты
html      | html файлы, сформированные из jade файлов
img       | Графические файлы
jade      | jade файлы, которые в последствии преобразуются в html
js        | JavaScript файлы
other     | Вспомогательные библиотеки и фреймворки
sass      | sass файлы, которые в последствии преобразуются в css

#### Библиотека состоит из следующих файлов:
>draw_tools – Отображение в DOM элементе canvas...  

>>Файл                 | Коментарий
>>---------------------|----------------------
>>axis_and_scales.js   | Объект для отображения осей координат и разметки
>>graph.js             | Объект для отображения графиков функций
>>pendulum_ball.js     | Объект для отображения маятника

>my_math – Математические операции

>>Файл                 | Коментарий
>>---------------------|----------------------
>>equation_2.js        | Решение квадратного уравнения
>>equation_3.js        | Решение уравнения 3-й степени
>>equation_4.js        | Решение уравнения 4-й степени
>>math_functions.js    | Различные математические функции

>pendulum_tools – Вспомогательные функции для маятника

>>Файл                  | Коментарий
>>----------------------|----------------------
>>functions.js          | Вспомогательные функции
>>period.js             | Определение периода колебаний
>>services_functions.js | Различные преобразования (координат, пикселей)

#### Другие скрипты:
>other
>>Файл            | Коментарий
>>----------------|----------------------
>>default.js      | Значения по умолчанию
>>elementsDOM.js  | Необходимые элементы DOM
>>view.js         | Функции влияющие на отображение страницы
>main.js - Контроллер

В демонстрации проекта показан объектно-ориентированный подход использования библиотеки, позволяющий моделировать ситуации с несколькими маятниками, имеющие каждый свои характеристики.