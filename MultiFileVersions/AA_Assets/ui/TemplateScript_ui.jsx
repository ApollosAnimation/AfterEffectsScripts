
var includedFiles = ["../logic/TemplateScript_Logic.jsx",  /*"../inits/EffectsWindow_Vars.jsx", "../utils/System_Utils.jsx", "../utils/Comp_Utils.jsx", "../utils/ShapeLyr_Utils.jsx", "../utils/TextLyr_Utils.jsx"*/];
var TemplateFuncs = $.global.AA_Scripts.TemplateFuncs;
/*
var EffectsVars = $.global.AA_Scripts.EffectsVars;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var LyrUtils = $.global.AA_Scripts.LyrUtils;
var TextLyrUtils = $.global.AA_Scripts.TextLyrUtils;
var CompUtils = $.global.AA_Scripts.CompUtils;
var ShapeLyrUtils = $.global.AA_Scripts.ShapeLyrUtils;
*/
var scriptFile = new File ($.fileName);
var scriptName = scriptFile.name.replace(/\.[^\.]+$/,"");
if (!$.global.AA_Scripts) {$.global.AA_Scripts = {};}
$.global.AA_Scripts[scriptName] = {};
var TemplateUI = $.global.AA_Scripts[scriptName];

TemplateUI.buildPanel = function (windowObj){
    var myButtonPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Effects Buttons", undefined, {resizeable:true});
     var myButtonTabs = myButtonPanel.add("tabbedpanel",undefined);
     var buttonTab = myButtonTabs.add("tab", undefined, "Controls", {orientation:'row',alignment:['left','top']});
     var csvTab = myButtonTabs.add("tab", undefined, "File Names", {orientation:'row',alignment:['left','top']});
     {var column01 = buttonTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
     column01.orientation = 'column';
     column01.add("Button",undefined ,"Prep Project").onClick = function(){prepProject (compCsvFile.text)};
     column01.add("Button",undefined ,"Populate Project").onClick = function(){populateProject (compCsvFile.text)};
     column01.add("Button",undefined ,"Add GFX").onClick = function(){addGFX (compCsvFile.text, textCsvFile.text, legendCsvFile.text,fontCsvFile.text)};
     column01.add("Button",undefined ,"Check For Comps").onClick = function(){checkForCompsWithFile (compCsvFile.text)};
     column01.add("Button",undefined ,"Check For New PSDs").onClick = function(){checkLayerForNewPSDs(null, false);};
     //column01.add("Button",undefined ,"BuildCheck").onClick = function(){buildCheck (compCsvFile.text, textCsvFile.text, legendCsvFile.text,fontCsvFile.text)};
     }
     {var csvColumn01 = csvTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
     csvColumn01.orientation = 'column';
     csvColumn01 .add('statictext {text: "CSV Footage Name:",  justify: "center"}');
     var textCsvFile = csvColumn01 .add('edittext{text:"TextCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
     csvColumn01 .add('statictext {text: "CSV Legend Name:",  justify: "center"}');
     var legendCsvFile = csvColumn01 .add('edittext{text:"LegendCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
     csvColumn01 .add('statictext {text: "CSV Font Name:",  justify: "center"}');
     var fontCsvFile = csvColumn01 .add('edittext{text:"FontCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
     csvColumn01 .add('statictext {text: "CSV Comps:",  justify: "center"}');
     var compCsvFile = csvColumn01 .add('edittext{text:"CompCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
     }
    myButtonPanel.layout.layout(true);
    return myButtonPanel;
    }
