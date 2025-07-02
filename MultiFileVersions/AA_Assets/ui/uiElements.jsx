$.global.AA_Scripts.UI = {};
var UI = $.global.AA_Scripts.UI;
UI.createPanel = function (windowObj, name){
    var panel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", name, undefined, {resizeable:true});
    return panel;
    }
UI.createWindow = function(panel){
var scriptShower = panel;
    //if (scriptShower != null && scriptShower instanceof Window){
    if (!(scriptShower instanceof Panel)){
    scriptShower.center();
    scriptShower.show();
    }
}
UI.savePanelToGlobal = function (file, panel){
    var scriptFileName = file.name.replace(/\.[^\.]+$/, "");
    if(!$.global.AA_Scripts.myPanels) $.global.AA_Scripts.myPanels = {}
    $.global.AA_Scripts.myPanels[scriptFileName] = panel;
    }