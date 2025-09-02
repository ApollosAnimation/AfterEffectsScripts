
var includedFiles = ["../logic/TemplateTextSwap_Logic.jsx"/*"../inits/EffectsWindow_Vars.jsx", "../utils/System_Utils.jsx", "../utils/Comp_Utils.jsx", "../utils/ShapeLyr_Utils.jsx", "../utils/TextLyr_Utils.jsx"*/];
var TemplateTextSwapFuncs = $.global.AA_Scripts.TemplateTextSwapFuncs;
/*
var EffectsVars = $.global.AA_Scripts.EffectsVars;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var LyrUtils = $.global.AA_Scripts.LyrUtils;
var TextLyrUtils = $.global.AA_Scripts.TextLyrUtils;
var CompUtils = $.global.AA_Scripts.CompUtils;
var ShapeLyrUtils = $.global.AA_Scripts.ShapeLyrUtils;
*/
if (!$.global.AA_Scripts) {$.global.AA_Scripts = {};}
$.global.AA_Scripts.mainTemplateTextSwap = {};
var TemplateTextSwapUI = $.global.AA_Scripts.mainTemplateTextSwap;

TemplateTextSwapUI.buildPanel = function (windowObj){
    var layerSwapPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Template Text Swap", undefined, {resizeable:true});
    var layerSwapTabs = layerSwapPanel.add("tabbedpanel",undefined);
    var layerSwapButtonTab = layerSwapTabs.add("tab", undefined, "Template Prep", {orientation:'row',alignment:['left','top']});
    layerSwapButtonTab.orientation = 'row';
    layerSwapButtonTab.add("Button",undefined ,"Write Layer Names Document").onClick = function(){TemplateTextSwapFuncs.generateLayerNamesDocument([app.project.activeItem], layerNameCsvFile.text)};
    layerSwapButtonTab.orientation = 'row';
    layerSwapButtonTab.add("Button",undefined ,"Create Templates from CSV").onClick = function(){TemplateTextSwapFuncs.createTemplatesFromCSV(layerNameCsvFile.text)};
    {
    var csvTab = layerSwapTabs.add("tab", undefined, "File Names", {orientation:'row',alignment:['left','top']});
    var csvColumn01 = csvTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
     csvColumn01.orientation = 'column';
     csvColumn01 .add('statictext {text: "CSV Layer Names:",  justify: "center"}');
     var layerNameCsvFile = csvColumn01.add('edittext{text:"TemplateLayerSwapsCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
     /*
     csvColumn01 .add('statictext {text: "CSV Footage Name:",  justify: "center"}');
     var textCsvFile = csvColumn01 .add('edittext{text:"TextCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
     csvColumn01 .add('statictext {text: "CSV Legend Name:",  justify: "center"}');
     var legendCsvFile = csvColumn01 .add('edittext{text:"LegendCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
     csvColumn01 .add('statictext {text: "CSV Font Name:",  justify: "center"}');
     var fontCsvFile = csvColumn01 .add('edittext{text:"FontCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
     csvColumn01 .add('statictext {text: "CSV Comps:",  justify: "center"}');
     var compCsvFile = csvColumn01 .add('edittext{text:"CompCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
     */}
    return layerSwapPanel;
    }
