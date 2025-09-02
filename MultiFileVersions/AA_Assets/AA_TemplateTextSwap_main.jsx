var includedFiles = ["ui/TemplateTextSwap_ui.jsx"];//define which UI to pull from directly, along with general UI Elements

var ScriptUI = $.global.AA_Scripts.mainTemplateTextSwap;//define the specific UI for the rest of the script. To be the specified import from the specific UI

$.global.AA_Scripts.mainTemplateTextSwap = function (windowObj) {
    if (scriptPanel instanceof Window && !scriptPanel.hidden){scriptPanel.close()}//close any previous version of this panel if they exist
    //alert(ScriptUI);
    var scriptPanel = ScriptUI.buildPanel(windowObj);//make a window
    scriptPanel.layout.layout(true);//refresh the layout
    
    //if (scriptPanel != null && scriptPanel instanceof Window){
    if (!(windowObj instanceof Panel)){
    scriptPanel.center();
    scriptPanel.show();
    }
    
    var scriptFileName = new File ($.fileName).name.replace(/\.[^\.]+$/, "");
    if(!$.global.AA_Scripts.myPanels) $.global.AA_Scripts.myPanels = {};
    $.global.AA_Scripts.myPanels[scriptFileName] = scriptPanel;
}
//main(this);