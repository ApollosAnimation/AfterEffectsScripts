/*
var includedFiles = ["../inits/EffectsWindow_Vars.jsx", "../utils/System_Utils.jsx", "../utils/Comp_Utils.jsx", "../utils/ShapeLyr_Utils.jsx", "../utils/TextLyr_Utils.jsx"];

var EffectsVars = $.global.AA_Scripts.EffectsVars;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var LyrUtils = $.global.AA_Scripts.LyrUtils;
var TextLyrUtils = $.global.AA_Scripts.TextLyrUtils;
var CompUtils = $.global.AA_Scripts.CompUtils;
var ShapeLyrUtils = $.global.AA_Scripts.ShapeLyrUtils;
*/
if (!$.global.AA_Scripts) {$.global.AA_Scripts = {};}
$.global.AA_Scripts.ReferenceTestUI = {};
var ReferenceTestUI = $.global.AA_Scripts.ReferenceTestUI;

ReferenceTestUI.buildPanel = function (windowObj){
    var myTestPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Effects Buttons", undefined, {resizeable:true});
    var myTestTabs = myTestPanel.add("tabbedpanel",undefined);
    var basicTestTab = myTestTabs.add("tab", undefined, "Basic Effects", {orientation:'row',alignment:['left','top']});
    basicTestTab.orientation = 'row';
    basicTestTab.add("Button",undefined ,"Ping").onClick = function(){alert("Ping")};
    return myTestPanel;
    }
