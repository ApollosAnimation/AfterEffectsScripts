var includedFiles = ["../utils/Lyr_Utils.jsx", "../utils/Project_Utils.jsx"];
var LyrUtils = $.global.AA_Scripts.LyrUtils;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;

if (!$.global.AA_Scripts) {$.global.AA_Scripts = {};}
$.global.AA_Scripts.DuplicatorUI = {};
var DuplicatorUI = $.global.AA_Scripts.DuplicatorUI;

DuplicatorUI.buildPanel = function (windowObj){
    var myEffectsPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Duplicate Tool", undefined, {resizeable:true});
          
     var myEffectsTabs = myEffectsPanel.add("tabbedpanel",undefined);
     var duplicateTab = myEffectsTabs.add("tab", undefined, "Duplicate Tool", {orientation:'row',alignment:['left','top']});
     duplicateTab.orientation = 'row';
     
     var duplicateColumn01 = duplicateTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
     duplicateColumn01.orientation = 'column';
     var duplicateValue = duplicateColumn01.add('edittext{text:2, characters:4, justify:"center", active:true, enterKeySignalsOnChange:flase}');
     duplicateColumn01.add("Button",undefined ,"Duplicate Sel Layers").onClick = function(){LyrUtils.duplicateSelectedLayers(Number(duplicateValue.text), null)};
     duplicateColumn01.add("Button",undefined ,"Duplicate Sel Items").onClick = function(){ProjectUtils.duplicateSelectedItems(Number(duplicateValue.text), null)};
    return myEffectsPanel;
    }