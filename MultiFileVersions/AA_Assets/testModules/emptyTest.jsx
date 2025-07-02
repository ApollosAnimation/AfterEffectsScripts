var currentScript = new File($.fileName);
var scriptBaseDir = currentScript.parent.parent;
var files = ["Foop","Poof"];
//files.forEach(function(name){alert(scriptBaseDir + fileString);});
for (var i=0; i<files.length; i++){
    alert(files[i]);
    }