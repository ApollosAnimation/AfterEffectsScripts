(function(windowObj) {
    if (!$.global.AA_Scripts) {$.global.AA_Scripts = {};}
    var rootFolder = new File($.fileName).parent;
    var assetFolder = new Folder (rootFolder.fsName + "/AA_Assets");
    var mainScript = new File(assetFolder.fsName + "/AA_TextUpdateScript_main.jsx");//Define the specific main script to start loadign dependencies from  //Change the object here when making a new script
    function  mainScriptFunc (windowObj){$.global.AA_Scripts.mainTextUpdateScript(windowObj);}//Define the main function that will be called to make the window
    
    var evaluatedFiles = {};

    function loadFile(filePath){
        var file = new File(filePath);
        var absPath = file.fsName;
        $.writeln ("evaluating: " + file.fsName +". Exists: " + file.exists);
        if (!file.exists || evaluatedFiles[absPath])return;
        evaluatedFiles[absPath] = true;
        var deps = getIncludedFiles (file);// adds file names from a scripts includedFiles variable to also look through
        $.writeln ("evaluating: " + file.displayName +". Files Needed: " + deps.join(", "));
        for (var i = 0; i < deps.length; i++){
            var depFile = new File (file.parent.fsName + "/" + deps[i]);
            loadFile (depFile.fsName);// Recursive call to look through the includedFiles for more includedFiles
            }
        //$.writeln ("evaluating: " + file.fsName);
        $.evalFile(file);
        }
    
    function getIncludedFiles(file){
    if (!file.exists) return [];
    file.open("r");
    var content = file.read();
    file.close;
    var match = content.match(/var\s+includedFiles\s*=\s*(\[[^\]]*\])/);//after loading the script, look for a line that reads like "var includedFiles = [ "ui/uiElements.jsx", "ui/EffectWindow_ui.jsx"];"
    if(match && match[1]){
        try {
            return eval(match[1]);//in any included files, return only an array of those file names
            } catch (e){
                $.writeln("Error parsing " + file.name + ": " + e.toString());
                return [];
                }
        }
    return [];
    }
loadFile(mainScript.fsName)
if (typeof mainScriptFunc === "function"){
    mainScriptFunc(windowObj)
    }
})(this);