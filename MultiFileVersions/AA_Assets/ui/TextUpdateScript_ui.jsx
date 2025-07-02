var includedFiles = ["../logic/TextUpdateScript_Logic.jsx"];
var TextUpdateFuncs = $.global.AA_Scripts.TextUpdateFuncs;
$.global.AA_Scripts.TextUpdateUI = {};
var TextUpdateUI = $.global.AA_Scripts.TextUpdateUI;

TextUpdateUI.buildPanel = function (windowObj){
    var textUpdatePanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Text CSV Update Tool", undefined, {resizeable:true});

    var tabs = textUpdatePanel.add("tabbedpanel",undefined);
    var tab = tabs.add("tab", undefined, "Text CSV Update Tool", {orientation:'row',alignment:['left','top']});
    tab.orientation = 'row';
    var textReplaceColumn01 = tab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
    textReplaceColumn01.orientation = 'column';
    textReplaceColumn01 .add('statictext {text: "CSV Footage Name:",  justify: "center"}');
    var textCsvFile = textReplaceColumn01 .add('edittext{text:"TextCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
    textReplaceColumn01 .add('statictext {text: "CSV Legend Name:",  justify: "center"}');
    var legendCsvFile = textReplaceColumn01 .add('edittext{text:"LegendCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
    textReplaceColumn01 .add('statictext {text: "CSV Font Name:",  justify: "center"}');
    var fontCsvFile = textReplaceColumn01 .add('edittext{text:"FontCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
    textReplaceColumn01 .add("Button",undefined ,"Update Text").onClick = function(){TextUpdateFuncs.updateText(textCsvFile.text, legendCsvFile.text,fontCsvFile.text)};
    //textReplaceColumn01 .add("Button",undefined ,"Get Font Name").onClick = function(){getFontName()};
    return textUpdatePanel;
    }