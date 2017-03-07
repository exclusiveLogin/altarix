var app = angular.module("app",["ngRoute","ngMockE2E"]);

app.run(function (cityes,w_log,$httpBackend,$rootScope) {
    $rootScope.blocks="true";
    $httpBackend.whenGET('http://localhost:3001/cityes').respond(function(method, url, data){
        if(data){
            data = JSON.parse(data);
            if(data.city){
                return[200,{
                    city:cityes.getList()[data.city],
                    log:w_log.getListFor(data.city)
                }];
            }else {
                return[200,cityes.getList()];
            }
        }else {
            return[200,cityes.getList()];
        }
    });
    $httpBackend.whenDELETE('http://localhost:3001/weather').respond(function(method, url, data){
        if(data){
            data = JSON.parse(data);
            if(data.city && data.index){
                w_log.removeWeather(data.city,data.index);
            }
        }
        return[200,"all ok"];
    });
    $httpBackend.whenPOST('http://localhost:3001/weather').respond(function(method, url, data){
        if(data){
            data = JSON.parse(data);
            if(data.data.city && data.data.index && data.data.weather){
                w_log.updateWeather(data.data.city,data.data.weather,data.data.index);
            }
        }
        return[200,"all ok"];
    });
    $httpBackend.whenPUT('http://localhost:3001/weather').respond(function(method, url, data){
        if(data){
            data = JSON.parse(data);
            if(data.data.city && data.data.weather){
                w_log.addWeather(data.data.city,data.data.weather);
            }
        }
        return[200,"all ok"];
    });
    $httpBackend.whenGET(/.*/).passThrough();
});
app.config(["$routeProvider","$locationProvider",function ($routeProvider,$locationProvider) {
    $routeProvider.when("/",{
        templateUrl:"tmpl/citylist.html"
    }).when("/weather/:city",{
        templateUrl:"tmpl/weatherlist.html"
    });
}]);
app.directive("cityitem",function (cityes,w_log,$location,$http) {
    return{
        link:function (scope, element, attrs) {
            function remClass() {
                $(element).find(".innerWitem").removeClass("cold aver hot dri liq");
                $(element).find(".wicon").removeClass("sun cloud snow rain snowrain hot");
            }
            function refreshStyle() {
                if(Number(scope.log[scope.log.length-1].temperature) >= 25){
                    remClass();
                    $(element).find(".innerWitem").addClass("hot");
                    $(element).find(".wicon").addClass("hot");
                }
                if(Number(scope.log[scope.log.length-1].temperature) <= 0){
                    remClass();
                    $(element).find(".innerWitem").addClass("cold");
                    $(element).find(".wicon").addClass("snow");
                }
                if(Number(scope.log[scope.log.length-1].temperature) >= 0 && Number(scope.log[scope.log.length-1].temperature) <= 10) {
                    remClass();
                    $(element).find(".innerWitem").addClass("aver");
                    $(element).find(".wicon").addClass("cloud");
                }
                if(Number(scope.log[scope.log.length-1].temperature) >= 10 && Number(scope.log[scope.log.length-1].temperature) <= 25) {
                    remClass();
                    $(element).find(".innerWitem").addClass("aver");
                    $(element).find(".wicon").addClass("sun");
                }
                if(Number(scope.log[scope.log.length-1].pacc) >= 70){
                    remClass();
                    $(element).find(".innerWitem").addClass("liq");
                    $(element).find(".wicon").addClass("rain");
                }
                if(Number(scope.log[scope.log.length-1].pacc) >= 70 && Number(scope.log[scope.log.length-1].temperature) <= 0){
                    remClass();
                    $(element).find(".innerWitem").addClass("liq");
                    $(element).find(".wicon").addClass("snowrain");
                }
            }

            $http.get("http://localhost:3001/cityes",{data:{city:attrs.index}}).then(function (data) {
                scope.log = data.data.log;
                refreshStyle();
            });
            //вешаем обработчик
            element.on("click",function (e) {
                $location.path("/weather/"+attrs.index);
                scope.$apply();
            });

        },
        transclude:true,
        replace:true,
        template:`<div class="cityitem col-md-3 col-lg-2 col-sm-4 col-xs-6 text-center">
                        <div class="innerWitem">
                            <span class="cityname" ng-transclude></span>
                            <div class="mydevider"></div>
                            <div class="wicon"></div>
                            <div class="mydevider"></div>
                            <div class="pacc"><i class="fa fa-tint"></i> {{log[log.length-1].pacc}}</div>
                            <div class="temp"><i class="fa fa-thermometer"></i> {{log[log.length-1].temperature}}</div>
                        </div>                        
                    </div>`
    }
});
app.directive("witem",function (w_log,$routeParams) {
    return{
        link:function (scope, element, attrs) {
            //scope.log = w_log.getListFor($routeParams.city);
            scope.log = scope.listOfWeather;
            function remClass() {
                $(element).find(".innerWitem").removeClass("cold aver hot dri liq");
                $(element).find(".wicon").removeClass("sun cloud snow rain snowrain hot");
            }
            function refreshStyle() {
                if(Number(scope.log[attrs.index].temperature) >= 25){
                    remClass();
                    $(element).find(".innerWitem").addClass("hot");
                    $(element).find(".wicon").addClass("hot");
                }
                if(Number(scope.log[attrs.index].temperature) <= 0){
                    remClass();
                    $(element).find(".innerWitem").addClass("cold");
                    $(element).find(".wicon").addClass("snow");
                }
                if(Number(scope.log[attrs.index].temperature) >= 0 && Number(scope.log[attrs.index].temperature) <= 10) {
                    remClass();
                    $(element).find(".innerWitem").addClass("aver");
                    $(element).find(".wicon").addClass("cloud");
                }
                if(Number(scope.log[attrs.index].temperature) >= 10 && Number(scope.log[attrs.index].temperature) <= 25) {
                    remClass();
                    $(element).find(".innerWitem").addClass("aver");
                    $(element).find(".wicon").addClass("sun");
                }
                if(Number(scope.log[attrs.index].pacc) >= 70){
                    remClass();
                    $(element).find(".innerWitem").addClass("liq");
                    $(element).find(".wicon").addClass("rain");
                }
                if(Number(scope.log[attrs.index].pacc) >= 70 && Number(scope.log[attrs.index].temperature) <= 0){
                    remClass();
                    $(element).find(".innerWitem").addClass("liq");
                    $(element).find(".wicon").addClass("snowrain");
                }
            }
            refreshStyle();
            scope.dateBin = new Date(scope.log[attrs.index].date);
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
            element.on("click",".fa-trash",function () {
                scope.removeWeather(attrs.index);
            });
            element.on("click",".viewBlock",function () {
                scope.toggleEdit(true);
            });
            element.on("click",".submitBtn",function () {
                scope.toggleEdit(false);
                scope.updateSubmit($routeParams.city,attrs.index,scope.log[attrs.index]);
                refreshStyle();
            });
        },
        replace:true,
        template:`<div class="witem col-md-3 col-lg-2 col-sm-4 col-xs-6 text-center">
                        <div class="innerWitem">
                            <div class="time">{{dateString}}<i class="label label-danger"><i class="fa fa-trash"></i></i></div>
                            <div class="wicon sun"></div>
                            <div class="row viewBlock">
                                <div class="pacc"><i class="fa fa-tint left"></i> {{log[$index].pacc}} %<i class="fa fa-pencil right"></i></div>
                            </div>
                            <div class="editBlock">
                                <input type="text" class="paccin" ng-model="log[$index].pacc">
                            </div>
                            <div class="row viewBlock">
                                <div class="temp"><i class="fa fa-thermometer"></i> {{log[$index].temperature}} &deg;C<i class="fa fa-pencil"></i></div>
                            </div>
                            <div class="editBlock">
                                <input type="text" class="tempin" ng-model="log[$index].temperature">
                            </div>
                            <div class="editBlock">
                                <button class="submitBtn btn btn-primary">Сохранить</button>
                            </div>
                        </div>
                    </div>`
    }
});
app.directive("wadd",function () {
    return{
        controller:"logctrl",
        link:function (scope, element, attrs, ctrl) {
            $(element).find(".addContainer").hide();
            console.log("ctrl:",ctrl);
            element.on("click",".addWeatherLink",function () {
                $(element).find(".addWeatherLink").hide(500);
                $(element).find(".addContainer").show(500);
            });
            element.on("click",".addBtn",function () {
                scope.addSubmit();
                $(element).find(".addWeatherLink").show(500);
                $(element).find(".addContainer").hide(500);
            });
            $(".preDate").datepicker({
                dateFormat: "yy.mm.dd"
            });
        },
        replace:true,
        template:`<div class="wadd col-md-3 col-lg-2 col-sm-4 col-xs-6 text-center">
                        <div class="innerWadd">
                            <i class="fa fa-plus fa-4x addWeatherLink"></i>
                            <div class="addContainer">
                                    <div class="time">Добавление данных погоды</div>
                                    <input type="text" class="preDate" ng-model="addPreDate" >
                                    <div class="mydevider"></div>
                                    <div class="pacc">Осадки</div>
                                    <input type="text" class="paccin" ng-model="addPacc" dirpacc="addPacc">
                                    <div class="temp">Температура</div>
                                    <input type="text" class="tempin" ng-model="addTemp" dirtemp="addTemp">
                                    <div class="mydevider"></div>
                                    <button class="addBtn btn btn-warning">Добавить данные</button>
                            </div>  
                        </div>
                    </div>`
    }
});
app.controller("logctrl",function ($scope,cityes,w_log,$routeParams,$http) {
    $scope.addPacc = 0;
    $scope.addTemp = 0;
    let option={
        weekday:"narrow", "year": "numeric"};
    $scope.addPreDate = new Date();
    $scope.refreshList = function () {
        $http.get("http://localhost:3001/cityes",{data:{city:$routeParams.city}}).then(function (data) {
            $scope.currentCity = data.data.city;
            $scope.listOfWeather = data.data.log;
        });
    };
    $scope.refreshList();
    $scope.removeWeather = function (index) {
        $http.delete("http://localhost:3001/weather",{data:{city:$routeParams.city,index:index}}).then(function (data) {
            console.log("delete:",data);
        });
        $scope.refreshList();
    };
    $scope.addSubmit = function () {
        $scope.addPacc = Number($scope.addPacc);
        $scope.addTemp = Number($scope.addTemp);
        $scope.addPreDate = new Date($scope.addPreDate);

        if(isNaN($scope.addTemp) || isNaN($scope.addPacc)){
            alert("Вы ввели не корректный тип данных");
        }else {
            if($scope.addTemp < -100 || $scope.addTemp > 100 || $scope.addPacc < 0 || $scope.addPacc > 100){
                alert("Значение введенных данных выходит за рамки разумного");
            }else {
                //Отправляем запрос
                let weather = {
                    date:$scope.addPreDate,
                    pacc:$scope.addPacc,
                    temperature:$scope.addTemp
                };
                $http.put("http://localhost:3001/weather",{data:{city:$routeParams.city,weather:weather}}).then(function (data) {
                    $scope.refreshList();
                });
            }
        }
    };
    $scope.updateSubmit = function (city,index,weather) {
        let upPacc = Number(weather.pacc);
        let upTemp = Number(weather.temperature);
        let upPreDate = new Date(weather.date);

        if(isNaN(upTemp) || isNaN(upPacc)){
            alert("Вы ввели не корректный тип данных");
        }else {
            if(upTemp < -100 || upTemp > 100 || upPacc < 0 || upPacc > 100){
                alert("Значение введенных данных выходит за рамки разумного");
            }else {
                //Отправляем запрос
                let weather_r = {
                    date:upPreDate,
                    pacc:upPacc,
                    temperature:upTemp
                };
                $http.post("http://localhost:3001/weather",{data:{city:city,index:index,weather:weather_r}}).then(function (data) {
                });
            }
        }
    };
});
app.controller("ctrl",function ($scope,$http) {
    $http.get("http://localhost:3001/cityes").then(function (data) {
        $scope.listOfCityes = data.data;
    });
});
app.controller("menuctrl",function ($scope,$rootScope) {
    $scope.tableToggle = function(state){
        if(state){
            $rootScope.blocks="true";
        }else {
            $rootScope.blocks="false";
        }
    }
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
            let cont_date = new Date(weather.date);
            let y = cont_date.getFullYear();
            let d = cont_date.getDate();
            let m = cont_date.getMonth();
            let ret_index = _.findIndex(log[id],function (elem) {
                let t_date = new Date(elem.date);
                let t_y = t_date.getFullYear();
                let t_d = t_date.getDate();
                let t_m = t_date.getMonth();
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
                log[id].push(weather);
            }else {
                //Заменяем
                log[id][dub] = weather;
            }

        },
        updateWeather:function (city,weather,index) {
            log[city][index] = weather;
        },
        removeWeather:function (city,index) {
            log[city].splice(index,1);
        }
    }
});


//DOM READY
$(()=>{
    angular.bootstrap(document.body,["app"]);
});