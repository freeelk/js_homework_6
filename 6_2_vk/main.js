/*
Создать приложение для ВКонтакте, которое загружает список ваших друзей
и выводит их на страницу в следующем формате: Фото, ФИО, Возраст, Дата рождения.
Друзья должны быть отсортированы по дате рождения в порядке убывания.
То есть на самом верху списка расположен друг с ближайший датой рождения.
Использование шаблонизатора приветствуется.
*/

new Promise(function(resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.init({
            apiId: 5574381
        });
        VK.Auth.login(function(response) {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 6);
    });
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.api('friends.get', {'fields': 'bdate, photo_50'},
            function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    outData(prepareFriendsList(response.response));
                    resolve();
                }
            });
    })
}).catch(function(e) {
    alert('Ошибка: ' + e.message);
});

function prepareFriendsList(response) {

    for (let i=0;i<response.length;i++) {
        response[i].birthday = getBirthDay(response[i].bdate);
        response[i].age = getAge(response[i].bdate);
        response[i].daysToBirthDay = getDaysToBirthDay(response[i].bdate);
    }

    response = sortByKey(response, 'daysToBirthDay');
    console.log(response);
    return response;
}

function getAge(bdate) {

    if (bdate) {
        let yearArr = bdate.split('.');
        if (yearArr.length == 3) {
            let now = new Date();
            return now.getFullYear() - yearArr[2];
        }
    }

    return 'не указан';

}

function getBirthDay(bdate) {
    let monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    let birthDay = 'не указан';
    if (bdate) {
        let bdateArr = bdate.split('.');
        if (bdateArr.length >= 2) {
            birthDay = bdateArr[0] + ' ' + monthNames[bdateArr[1] - 1];
        }
    }
    return birthDay;
}

function getDaysToBirthDay(bdate) {
    if (!bdate) {
        return 366; //put to end, if bdate is not exists
    }

    let bdateArr = bdate.split('.');

    let now = new Date();
    now = new Date(now.getFullYear(), now.getMonth(), now.getDay()); //Only year, month and day need

    let birthDay = new Date(now.getFullYear(), bdateArr[1]-1, bdateArr[0]);
    if (birthDay < now) {
        birthDay = new Date(now.getFullYear() + 1, bdateArr[1]-1, bdateArr[0]); //If birthday has been this year
    }

    var diff = birthDay - now;
    var oneDay = 1000 * 60 * 60 * 24;

    return Math.ceil(diff / oneDay);
}

function outData(data) {
    let source   = document.getElementById("entry-template").innerHTML;
    let template = Handlebars.compile(source);
    let html  = template(data);
    document.getElementById("friends-list").innerHTML = html;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

//test getDaysToBirthDay()
/*
document.getElementById('birthday-btn').addEventListener('click', () =>{
   let birthday = document.getElementById('birthday').value;
    document.getElementById('days-to-birthday').innerHTML = getDaysToBirthDay(birthday);

});*/
