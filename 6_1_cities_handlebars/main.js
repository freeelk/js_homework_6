/*
6.1 - Переделать предыдущее ДЗ с загрузкой списка городов по AJAX.

 После загрузки страницы, происходит загрузка городов через AJAX.
 Города сортируются по имени и выводятся на странице при помощи шаблонизатора Handlebars.
 При вводе значений в текстовое поле, должны скрываться те города,
 в названии которых нет подстроки, указанной в текстовом поле.

 Предыдущее ДЗ с загрузкой списка городов по AJAX.

 Загрузить города при помощи AJAX из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 (сервер поддерживает AJAX CORS)
 Отсортировать города по алфавиту и вывести на странице.
 Использование промисов обязательно.
 Запрещено использование любых библиотек (включая jQuery) и фреймворков.
 */

const URL = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

//Загрузка списка городов после загрузки страницы
window.addEventListener('load', () => {

    let promise = new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', URL);
        xhr.responseType = 'json';

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.statusText);
                }
            }
        };

        xhr.send();
    });

    document.getElementById('error-message').innerHTML = '';

    promise.then((response) =>{
        let cities = sortByKey(response, 'name');
        outCitiesList(cities);
    }, (error) => {
        document.getElementById('error-message').innerHTML = 'Ошибка получения списка городов: ' + error;
    })

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

})

//Фильтрация списка городов по значению в поле ввода
document.getElementById('cities-input').addEventListener('input', (e) => {
    filterCitiesList(e.target.value );
});

function outCitiesList(cities) {
    let source   = document.getElementById("entry-template").innerHTML;
    let template = Handlebars.compile(source);
    let html  = template(cities);
    document.getElementById("cities-list").innerHTML = html;
}

function filterCitiesList(filter) {
    let citiesElements = document.querySelectorAll('#cities-list li');

    for (let i=0;i<citiesElements.length;i++) {
        if (filter === '' || citiesElements[i].innerHTML.indexOf(filter) > -1) {
            citiesElements[i].style.display = '';
        } else {
            citiesElements[i].style.display = 'none';
        }
    }
}