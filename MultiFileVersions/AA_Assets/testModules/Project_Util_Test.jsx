var includedFiles = ["ui/uiElements.jsx", "ui/testUI.jsx", "utils/Testing_Utils.jsx", "utils/Project_Utils.jsx"];
var currentScript = new File($.fileName);
var scriptBaseDir = currentScript.parent.parent;
for (var i=0; i<includedFiles.length; i++){
    $.evalFile(scriptBaseDir.fullName + "/" + includedFiles[i]);
    }

var TestObject = ProjectUtils;

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
    if (allButtons["findComp"]){allButtons["findComp"].onClick = function() {alert((TestObject["findComp"]("Comp 1") !== null))}};
    if (allButtons["findFootage"]){allButtons["findFootage"].onClick = function() {alert((TestObject["findFootage"]("Null 1") !== null))}};
    if (allButtons["findAddFolder"]){allButtons["findAddFolder"].onClick = function() {alert((TestObject["findAddFolder"]("folderGenTest")))}};
    if (allButtons["findItemWithType"]){allButtons["findItemWithType"].onClick = function() {alert((TestObject["findItemWithType"]("BaseNumbers01.png", FootageItem)))}};
    if (allButtons["findItemWithType"]){allButtons["findItemWithType"].onClick = function() {alert((TestObject["findItemWithType"]("folderGenTest", FolderItem)))}};
    //if (allButtons["findAddBannerArea"]){testTab.remove(allButtons["findAddBannerArea"]);}
    //testTab.add("Button",undefined ,"Ping").onClick = function(){TestUtils.alertTest("Testing")};
        
    testPanel.layout.layout(true);//refresh the layout
    UI.createWindow(testPanel);
    UI.savePanelToGlobal(new File ($.fileName), testPanel)
}
main(this);