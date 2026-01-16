var testIncludedFiles = ["ui/uiElements.jsx", "ui/testUI.jsx", "utils/Testing_Utils.jsx", "utils/ExtendScript_Utils.jsx", "utils/Lyr_Utils.jsx",  "logic/EffectsWindow_Logic.jsx", "utils/ShapeLyr_Utils.jsx", "utils/Project_Utils.jsx", "utils/Comp_Utils.jsx"];
var currentScript = new File($.fileName);
var scriptBaseDir = currentScript.parent.parent;
$.writeln("For loop Starting at length of:" + testIncludedFiles.length);
for (var i=0; i<testIncludedFiles.length; i++){
    var path = scriptBaseDir.fullName + "/" + testIncludedFiles[i];
    var scriptFile = new File(path);
    if (!scriptFile.exists){$writeln("File "+ i+ "Does Not Exist."); continue;}
    $.writeln (i+": "+ path);
    $.evalFile(path);
    $.writeln ("Completed " + i +": "+path);
    }
$.writeln("For Loop Complete");

var TestObject = AA_Scripts.EffectsFuncs;

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
    /**
    if (allButtons["addEffect"]){allButtons["addEffect"].onClick = function() {TestObject["addEffect"]("ADBE Fill")};}
    if (allButtons["addEffect"]){testTab.remove(allButtons["addEffect"]);}
    if (allButtons["addDrift"]){allButtons["addDrift"].onClick = function() {TestObject["addDrift"](app.project.activeItem.selectedLayers)};}
    if (allButtons["addDrift"]){testTab.remove(allButtons["addDrift"]);}
    if (allButtons["addEase"]){allButtons["addEase"].onClick = function() {TestObject["addEase"](0, 80, 0, .1)};}
    if (allButtons["iterateEaseOverProps"]){testTab.remove(allButtons["iterateEaseOverProps"]);}
    if (allButtons["positionEase"]){testTab.remove(allButtons["positionEase"]);}
    if (allButtons["matchCompSize"]){allButtons["matchCompSize"].onClick = function() {TestObject["matchCompSize"](1)};}
    if (allButtons["checkLayerForNewPSDs"]){allButtons["checkLayerForNewPSDs"].onClick = function() {TestObject["checkLayerForNewPSDs"](app.project.activeItem.selectedLayers, false)};}
    if (allButtons["findLayer"]){allButtons["findLayer"].onClick = function() {TestObject["findLayer"](alert(TestObject["findLayer"](app.project.activeItem, "Null 1")))};}
    if (allButtons["findLayer"]){testTab.remove(allButtons["findLayer"]);}
    if (allButtons["stillToPSDComp"]){testTab.remove(allButtons["stillToPSDComp"]);}
    if (allButtons["addParalaxComp"]){testTab.remove(allButtons["addParalaxComp"]);}
    //testTab.add("Button",undefined ,"Ping").onClick = function(){TestUtils.alertTest("Testing")};
    **/
        
    testPanel.layout.layout(true);//refresh the layout
    UI.createWindow(testPanel);
    UI.savePanelToGlobal(new File ($.fileName), testPanel)
}
main(this);