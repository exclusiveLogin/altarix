
var app = angular.module("app",["ngRoute"]);

app.run(function (cityes,w_log) {
    console.log("RUN APP");
});
app.config(["$routeProvider","$locationProvider",function ($routeProvider,$locationProvider) {
    $routeProvider.when("/",{
        templateUrl:"tmpl/citylist.html"
    }).when("/weather/:city",{
        templateUrl:"tmpl/weatherlist.html"
    });
}]);
app.directive("cityitem",function (cityes,w_log,$location) {
    return{
        link:function (scope, element, attrs) {
            scope.log = w_log.getListFor(attrs.index);

            //вешаем обработчик
            element.on("click",function (e) {
                $location.path("/weather/"+attrs.index);
                scope.$apply();
            });
        },
        transclude:true,
        replace:true,
        template:`<div class="cityitem col-md-3">
                        <span class="cityname" ng-transclude></span>
                        <div class="mydevider"></div>
                        <div class="status"></div>
                        <div class="mydevider"></div>
                        <div class="temp">{{log[log.length-1].temperature}}</div>
                        <div class="pacc">{{log[log.length-1].pacc}}</div>
                    </div>`
    }
});
app.directive("witem",function (w_log,$routeParams) {
    return{
        link:function (scope, element, attrs) {
            console.log("route:",$routeParams);
            scope.log = w_log.getListFor($routeParams.city);
            scope.dateBin = scope.log[attrs.index].date;
            scope.dateString = scope.dateBin.toLocaleDateString();
            scope.toggleEdit = function(state){
                if(state){
                    $(element).find(".editBlock").show(500);
                    $(element).find(".viewBlock").hide(500);
                    $(element).find(".submitBtn").show(500);
                }else {
                    $(element).find(".editBlock").hide(500);
                    $(element).find(".viewBlock").show(500);
                    $(element).find(".submitBtn").hide(500);
                }
            };
            element.on("click",".viewBlock",function () {
                scope.toggleEdit(true);
            });
            element.on("click",".submitBtn",function () {
                scope.toggleEdit(false);
                scope.updateSubmit($routeParams.city,scope.log[attrs.index],attrs.index);
            });
        },
        replace:true,
        template:`<div class="witem col-md-3 text-center">
                        <span class="time">{{dateString}}</span><span class="label label-danger"><i class="fa fa-trash"></i></span>
                        <div class="mydevider"></div>
                        <div class="row viewBlock">
                            <span class="pacc"><i class="fa fa-tint"></i> {{log[$index].pacc}} %<i class="fa fa-pencil"></i></span>
                        </div>
                        <div class="editBlock">
                            <input type="text" class="paccin" ng-model="log[$index].pacc">
                        </div>
                        <div class="row viewBlock">
                            <span class="temp"><i class="fa fa-thermometer"></i> {{log[$index].temperature}} &deg;C<i class="fa fa-pencil"></i></span>
                        </div>
                        <div class="editBlock">
                            <input type="text" class="tempin" ng-model="log[$index].temperature">
                        </div>
                        <div class="mydevider"></div>
                        <div class="editBlock">
                            <button class="submitBtn btn btn-primary">Сохранить</button>
                        </div>
                    </div>`
    }
});
app.directive("wadd",function () {
    return{
        link:function (scope, element, attrs) {
            element.on("click",".addWeatherLink",function () {
                $(element).find(".addWeatherLink").hide(500);
                $(element).find(".addContainer").removeClass("transparentStatic");
            });
        },
        replace:true,
        template:`<div class="witem col-md-3 text-center">
                        <i class="fa fa-plus fa-4x addWeatherLink"></i>
                        <div class="addContainer transparentStatic">
                                <div class="time">Добавление данных погоды</div>
                                <input type="text" class="paccin" ng-model="addPreDate">
                                <div class="mydevider"></div>
                                <div class="pacc">Осадки</div>
                                <input type="text" class="paccin" ng-model="addPacc">
                                <div class="temp">Температура</div>
                                <input type="text" class="tempin" ng-model="addTemp">
                                <div class="mydevider"></div>
                                <button class="submitBtn btn btn-primary" ng-click="addSubmit()">Добавить данные</button>               
                        </div>     
                    </div>`
    }
});
app.controller("logctrl",function ($scope,cityes,w_log,$routeParams) {
    $scope.addPacc = 0;
    $scope.addTemp = 0;
    $scope.addPreDate = new Date().toLocaleDateString();
    $scope.listOfWeather = w_log.getListFor($routeParams.city);
    $scope.currentCity = cityes.getList()[$routeParams.city];
    console.log("START LOGCTRL");
    $scope.refreshList = function () {
        $scope.listOfWeather = w_log.getListFor($routeParams.city);
        $scope.currentCity = cityes.getList()[$routeParams.city];
    };

    $scope.addSubmit = function () {
        $scope.addPacc = Number($scope.addPacc);
        $scope.addTemp = Number($scope.addTemp);

        if(isNaN($scope.addTemp) || isNaN($scope.addPacc)){
            console.log("Вы ввели не корректный тип данных");
        }else {
            if($scope.addTemp < -100 || $scope.addTemp > 100 || $scope.addPacc < 0 || $scope.addPacc > 100){
                console.log("Значение введенных данных выходит за рамки разумного");
            }else {
                console.log("all data is ok");
            }
        }
    };
    $scope.updateSubmit = function (city,index,weather) {
        w_log.updateWeather(city,weather,index);
    };
});
app.controller("ctrl",function ($scope,cityes) {
    $scope.listOfCityes = cityes.getList();
});
app.factory("cityes",function () {
    citylist = ["Samara","Syzran","Rameno","Togliatti","Kinel","Usolie","Shiryaevo"];
    return{
        getList:function () {
            return citylist;
        }
    }
});
app.factory("w_log",function () {
    var log = [//индекс родительского массива соответствует индексу города в cityes
        [
            {
                date:new Date("21 jan 2017"),
                pacc:0.3,
                temperature:2.3
            },
            {
                date:new Date("22 jan 2017"),
                pacc:1.3,
                temperature:-1
            },
            {
                date:new Date("23 jan 2017"),
                pacc:0,
                temperature:4
            }
        ],
        [
            {
                date:new Date("21 jan 2017"),
                pacc:0.3,
                temperature:2.3
            },
            {
                date:new Date("22 jan 2017"),
                pacc:1.3,
                temperature:-1
            },
            {
                date:new Date("23 jan 2017"),
                pacc:0,
                temperature:4
            }
        ],
        [
            {
                date:new Date("21 jan 2017"),
                pacc:0.3,
                temperature:2.3
            },
            {
                date:new Date("22 jan 2017"),
                pacc:1.3,
                temperature:-1
            },
            {
                date:new Date("23 jan 2017"),
                pacc:0,
                temperature:4
            }
        ],
        [
            {
                date:new Date("21 jan 2017"),
                pacc:0.3,
                temperature:2.3
            },
            {
                date:new Date("22 jan 2017"),
                pacc:1.3,
                temperature:-1
            },
            {
                date:new Date("23 jan 2017"),
                pacc:0,
                temperature:4
            }
        ],
        [
            {
                date:new Date("21 jan 2017"),
                pacc:0.3,
                temperature:2.3
            },
            {
                date:new Date("22 jan 2017"),
                pacc:1.3,
                temperature:-1
            },
            {
                date:new Date("23 jan 2017"),
                pacc:0,
                temperature:4
            }
        ],
        [
            {
                date:new Date("21 jan 2017"),
                pacc:0.3,
                temperature:2.3
            },
            {
                date:new Date("22 jan 2017"),
                pacc:1.3,
                temperature:-1
            },
            {
                date:new Date("23 jan 2017"),
                pacc:0,
                temperature:4
            }
        ],
        [
            {
                date:new Date("21 jan 2017"),
                pacc:0.3,
                temperature:0
            },
            {
                date:new Date("22 jan 2017"),
                pacc:1.3,
                temperature:-6
            },
            {
                date:new Date("23 jan 2017"),
                pacc:0,
                temperature:6
            }
        ]
    ];
    var checkDublicates = function(id,weather) {
        if(weather) {
            let cont_date = weather.date;
            let y = cont_date.getFullYear();
            let d = cont_date.getDate();
            let m = cont_date.getMonth();
            let ret_index = _.findIndex(log[id],function (elem) {
                let t_y = elem.date.getFullYear();
                let t_d = elem.date.getDate();
                let t_m = elem.date.getMonth();
                if((y == t_y) && (m == t_m) && (d == t_d)){
                    return true;
                }
            });
            return ret_index;
        }
    };
    return{
        getListFor:function (id) {
            return log[id];
        },
        addWeather:function (id,weather) {
            let dub = checkDublicates(id,weather);
            if(dub == -1){
                //Добавляем
                console.log("Добавляем");
            }else {
                //Заменяем
                console.log("Заменяем");
            }
        },
        updateWeather:function (city,weather,index) {
            log[city][index] = weather;
            console.log("DEBUG LOG:",log);
        }
    }
});


//DOM READY
$(()=>{
    angular.bootstrap(document.body,["app"]);
});