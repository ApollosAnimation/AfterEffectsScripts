var includedFiles = ["ui/uiElements.jsx", "ui/testUI.jsx", "utils/Testing_Utils.jsx", "utils/TextLyr_Utils.jsx"];
var currentScript = new File($.fileName);
var scriptBaseDir = currentScript.parent.parent;
for (var i=0; i<includedFiles.length; i++){
    $.evalFile(scriptBaseDir.fullName + "/" + includedFiles[i]);
    }

var TestObject = TextLyrUtils;

function main(windowObj) {
    if (testPanel instanceof Window && !testPanel.hidden){testPanel.close()}//close any previous version of this panel if they exist
    var testPanel = TestUI.createAlertTestPanel(windowObj);//make a window
    var testTab =  testPanel.children[0].find("Button Tests");
    testTab.orientation = 'column';
    var allButtons = {};
    for (var key in TestObject){
        if (typeof TestObject[key] === "function"){
            allButtons[key] = TestUI.addObjButton(testTab, TestObject, key, null);
            }
        }
    if (allButtons["addTextAnim"]){allButtons["addTextAnim"].onClick = function() {TestObject["addTextAnim"](/*"Ramp Up"*//*"Ramp Down"*/"Smooth")};}
    if (allButtons["changeFontType"]){allButtons["changeFontType"].onClick = function() {TestObject["changeFontType"](/*"fontHelvetica",1*/"fontFutura",4)};}
    if (allButtons["changeFont"]){allButtons["changeFont"].onClick = function() {TestObject["changeFont"]("fontMont", "Montserrat-Black")};}
    if (allButtons["changeFont"]){testTab.remove(allButtons["changeFont"]);}
    //testTab.add("Button",undefined ,"Ping").onClick = function(){TestUtils.alertTest("Testing")};
        
    testPanel.layout.layout(true);//refresh the layout
    UI.createWindow(testPanel);
    UI.savePanelToGlobal(new File ($.fileName), testPanel)
}
main(this);