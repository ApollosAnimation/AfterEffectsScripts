$.global.AA_Scripts ={};
var includedFiles = ["ui/uiElements.jsx", "ui/testUI.jsx", "utils/Testing_Utils.jsx", "utils/System_Utils.jsx"];
var currentScript = new File($.fileName);
var scriptBaseDir = currentScript.parent.parent;
for (var i=0; i<includedFiles.length; i++){
    $.writeln ("evaluating: " + scriptBaseDir.fullName + "/" + includedFiles[i]);
    $.evalFile(scriptBaseDir.fullName + "/" + includedFiles[i]);
    }
$.writeln ("evaluating complete");
var TestObject = $.global.AA_Scripts.SystemUtils;
var TestUtils = $.global.AA_Scripts.TestUtils;

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
    if (allButtons["canWriteFiles"]){allButtons["canWriteFiles"].onClick = function() {alert(TestObject["canWriteFiles"]())};}
    if (allButtons["checkPSDExists"]){allButtons["checkPSDExists"].onClick = function() {alert(TestObject["checkPSDExists"](app.project.activeItem.selectedLayers[0].source))};}
    if (allButtons["findAddBannerArea"]){testTab.remove(allButtons["findAddBannerArea"]);}
    //testTab.add("Button",undefined ,"Ping").onClick = function(){TestUtils.alertTest("Testing")};
    
    if (allButtons["altParseCSV"]){allButtons["altParseCSV"].onClick = function() {
            var csvTestFile = File.openDialog("Find CSV");
            $.writeln("csvTestFile: " + csvTestFile.displayName);
            if (csvTestFile){
                var csvArray = TestObject["altParseCSV"](csvTestFile);
                //TestUtils.reflectAll(csvArray);
                for (var i = 1; i < csvArray.length; i++){
                    $.writeln("Row " + i + ": " + csvArray[i].join(" | "));
                    }
                }
        }
    }
    if (allButtons["standardizeQuotes"]){testTab.remove(allButtons["standardizeQuotes"]);}


    testPanel.layout.layout(true);//refresh the layout
    UI.createWindow(testPanel);
    UI.savePanelToGlobal(new File ($.fileName), testPanel)
}
main(this);