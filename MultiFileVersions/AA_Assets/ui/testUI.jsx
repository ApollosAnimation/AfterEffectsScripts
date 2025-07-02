#include "uiElements.jsx"

$.global.TestUI = {};

TestUI.createAlertTestPanel= function (windowObj){
    var alertPanel = UI.createPanel(windowObj, "AlertPanel");
    var myEffectsTabs = alertPanel.add("tabbedpanel",undefined);
    /*
    var basicEffectsTab = myEffectsTabs.add("tab", undefined, "Basic Effects", {orientation:'row',alignment:['left','top']});
     basicEffectsTab.orientation = 'row';
     var transitionEffectsTab = myEffectsTabs.add("tab", undefined, "Transition Effects", {orientation:'row',alignment:['left','top']});
     transitionEffectsTab.orientation = 'row';
     var layersTab = myEffectsTabs.add("tab", undefined, "Layers and Time", {orientation:'row'});
     layersTab.orientation = 'row';
     var fontsTab = myEffectsTabs.add("tab", undefined, "Fonts", {orientation:'row'});
     fontsTab.orientation = 'row';
     */
    var testTab = myEffectsTabs.add("tab", undefined, "Button Tests", {orientation:'row',alignment:['left','top']});
    testTab.title = "Button Tests"
     testTab.orientation = 'row';
    /*
     var effectsColumn01 = basicEffectsTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
     effectsColumn01.alignment = ['left','top'];
     effectsColumn01.orientation = 'column';
     */
     //testTab.add("Button",undefined ,"Ping").onClick = function(){alert("Ping")};
     
     alertPanel.layout.layout(true);
     
    return alertPanel;
    //alert("Ping");
    }
TestUI.fillAlertTestPanel= function (panel){
    //var alertPanel = UI.createPanel(windowObj, "AlertPanel");
    var myEffectsTabs = panel.add("tabbedpanel",undefined);
    var basicEffectsTab = myEffectsTabs.add("tab", undefined, "Basic Effects", {orientation:'row',alignment:['left','top']});
     basicEffectsTab.orientation = 'row';
     var transitionEffectsTab = myEffectsTabs.add("tab", undefined, "Transition Effects", {orientation:'row',alignment:['left','top']});
     transitionEffectsTab.orientation = 'row';
     var layersTab = myEffectsTabs.add("tab", undefined, "Layers and Time", {orientation:'row'});
     layersTab.orientation = 'row';
     var fontsTab = myEffectsTabs.add("tab", undefined, "Fonts", {orientation:'row'});
     fontsTab.orientation = 'row';
     
     var effectsColumn01 = basicEffectsTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
     effectsColumn01.alignment = ['left','top'];
     effectsColumn01.orientation = 'column';
     effectsColumn01.add("Button",undefined ,"Ping").onClick = function(){alert("Ping")};
     
     
    return panel;
    //alert("Ping");
    }
TestUI.addObjButton = function (panel, obj, key,args){
    var button = panel.add("button", undefined, key);
    button.onClick = function() {
        if(args !== undefined && args !== null){obj[key](args);
            }else{obj[key]();}
        }
    return button;
    }
TestUI.adjButton = function (button, obj, name,args){
    button.onClick = function() {if(args !== undefined && args !== null){obj[name](args);}else{obj[name]();}}
    return button;
}