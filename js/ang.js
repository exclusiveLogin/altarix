
var app = angular.module("app",[]);

app.run(function (cityes) {
   console.log("from run city list:",cityes.getList());
});
app.directive("cityitem",function (w_log) {
    return{
        link:function (scope, element, attrs) {
            scope.log = w_log.getListFor(attrs.index);
            console.log("log:",scope.log);

            //вешаем обработчик
            element.on("click",function (e) {
                console.log("Element:",element);
                console.log("Event:",e);
                console.log("Attributes:",attrs);
            });
        },
        transclude:true,
        replace:true,
        template:`<div class="cityitem col-md-3">
                        <span class="cityname" ng-transclude></span>
                        <div class="mydevider"></div>
                        <div class="pacc">{{log[log.length-1].pacc}}</div>
                        <div class="temp">{{log[log.length-1].temperature}}</div>
                    </div>`
    }
});
/*app.directive("cityitem",function (w_log) {
    return{
        link:function (scope, element, attrs) {
            scope.log = w_log.getListFor(attrs.index);
            console.log(scope.log);
            element.on("click",".pacc",function () {
                let val = $(element).find(".pacc").html();
                console.log("val:",val);
                $(element).find(".paccin").removeClass("transparent").val(val);
            });
            element.on("click",".temp",function () {
                let val = $(element).find(".temp").html();
                console.log("val:",val);
                $(element).find(".tempin").removeClass("transparent").val(val);
            });
        },
        transclude:true,
        replace:true,
        template:`<div class="cityitem col-md-3">
                        <span class="cityname" ng-transclude></span>
                        <div class="mydevider"></div>
                        <div class="pacc">{{log[log.length-1].pacc}}</div>
                        <input type="text" placeholder="pacc" class="paccin transparent">
                        <div class="temp">{{log[log.length-1].temperature}}</div>
                        <input type="text" placeholder="temperature" class="tempin transparent">
                        <button class="submitBtn button button-danger">Сохранить</button>
                    </div>`
    }
});*/
app.controller("ctrl",function ($scope,cityes,w_log) {
    $scope.addPacc = false;
    $scope.addTemp = false;
    $scope.addPreDate = false;
    $scope.listOfCityes = cityes.getList();
    console.log("from ctrl",$scope);
    let list = cityes.getList();
    console.log(list);
    console.log("log for Syzran",w_log.getListFor(1));
    $scope.addWeather = function(id){
        if($scope.addPacc && $scope.addTemp && $scope.addPreDate){
            let weather = {};
            let t_date = $scope.
            w_log.addWeather(id,weather);
        }
    };
    $scope.submitWeather = function(id,weather,index){
        w_log.updateWeather(id,weather,index);
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
        updateWeather:function (id,weather,index) {
            log[id][index] = weather;
        }
    }
});


//DOM READY
$(()=>{
    angular.bootstrap(document.body,["app"]);
});