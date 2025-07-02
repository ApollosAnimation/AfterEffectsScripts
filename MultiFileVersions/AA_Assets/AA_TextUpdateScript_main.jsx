var includedFiles = [ "ui/uiElements.jsx", "ui/TextUpdateScript_ui.jsx"];//define which UI to pull from directly, along with general UI Elements //Change the object here when making a new script

var ScriptUI = $.global.AA_Scripts.TextUpdateUI;//define the specific UI for the rest of the script. To be the specified import from the specific UI //Change the object here when making a new script
var UI = $.global.AA_Scripts.UI;//define the general UI for the rest of the script to be the general UI import 

$.global.AA_Scripts.mainTextUpdateScript = function (windowObj) {//Change where the global variable is stored
    if (scriptPanel instanceof Window && !scriptPanel.hidden){scriptPanel.close()}//close any previous version of this panel if they exist
    var scriptPanel = ScriptUI.buildPanel(windowObj);//make a window
    scriptPanel.layout.layout(true);//refresh the layout
    
    UI.createWindow(scriptPanel);//show the panel
    UI.savePanelToGlobal(new File ($.fileName), scriptPanel)// save the panel to the Global scope so it it not grabage collected
}