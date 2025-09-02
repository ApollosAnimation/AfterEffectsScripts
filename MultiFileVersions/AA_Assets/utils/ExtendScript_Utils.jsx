$.global.AA_Scripts.ExtendScriptUtils = {};
var ExtendScriptUtils = $.global.AA_Scripts.ExtendScriptUtils;

ExtendScriptUtils.stringQuotesToArray=function (input){
    var arrayRegex = new RegExp('\"[^\"]*\"', "g");
    var items = input.match(arrayRegex);
    if (!items){return null;}
    for (var i = 0; i < items.length; i++){
        items[i] = items[i].replace(/"/g, "");
        }
    return items;
    }
ExtendScriptUtils.numberToPaddedString = function (number, total){
    var width = String(total).length;
    var newName = ("000"+number).slice(-width);
    return newName;
    }
ExtendScriptUtils.removeFrontEndQuotes = function (string){
    string = this.trimString(string);
    string = string.replace(/\u201C|\u201D/g, '"');
    string = string.replace(/"$/g, "");
    string = string.replace(/^"/g, "");
    return string;
    }
ExtendScriptUtils.trimString = function (string){
    string = string.replace(/^\s+/,'').replace(/\s+$/,'');
    return string;
    }