$.global.AA_Scripts.TestUtils = {};
var TestUtils = $.global.AA_Scripts.TestUtils;

TestUtils.reflectAll = function (reflectable){//this is a debugging function that lists all information about a given element, and is a great break point to analyze in Extendscript
        alert(reflectable.reflect.name);
        alert(reflectable.reflect.properties);
        alert(reflectable.reflect.methods);
        }
TestUtils.alertTest = function (message){
            message = (message !== undefined) ? message : "Ping";
            alert(message);
        }