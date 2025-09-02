var includedFiles = [ "../utils/Lyr_Utils.jsx", "../utils/Project_Utils.jsx", "../utils/System_Utils.jsx", "../utils/TextLyr_Utils.jsx"];
var LyrUtils = $.global.AA_Scripts.LyrUtils;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var SystemUtils = $.global.AA_Scripts.SystemUtils;
var TextLyrUtils = $.global.AA_Scripts.TextLyrUtils;

$.global.AA_Scripts.TextUpdateFuncs = {};
var TextUpdateFuncs = $.global.AA_Scripts.TextUpdateFuncs;

TextUpdateFuncs.updateText = function (textCsvFile, nameCsvFile, fontCsvFile){// updating text based on CSV files that contain comp names, layer names, and the new Text and Text that is to be italicized
    app.beginUndoGroup("UpdateText");
    //aT();
    var textCSV = ProjectUtils.findFootage(textCsvFile).file;
    var textArray = SystemUtils.altParseCSV(textCSV, true, true);
    var nameCSV = ProjectUtils.findFootage(nameCsvFile).file;
    var nameArray = SystemUtils.altParseCSV(nameCSV);
    var fontCSV = ProjectUtils.findFootage(fontCsvFile).file;
    var fontArray = SystemUtils.altParseCSV(fontCSV);
    var textArrayLen = textArray[0].length - 1;    
    for(var i=1; i< textArray.length; i++){
         for(var j=1; j<=textArrayLen; j++){
            var compName = nameArray[i][0];//Comp name is the first column of the current row in the Legend CSV
            var layerName = nameArray[i][j];//Layer name is the coordinates i,j in the Legend CSV
            var layerText = textArray[i][j];//the new text  is the coordinates i,j in the TextCSV, in the same position of the Layer name in a second file
            //var italicizeString = textArray[i][0];//the strings to find and italicize in the new text string, found in the first column of the current row, and seperated by semicolons
            //var fontPostName = fontArray[0].toString();// Base Text Font
            //var italicizedFontPostName =  fontArray[1].toString();// Italics Text Font
            TextLyrUtils.updateTextLayer(compName, layerName, layerText, fontArray)//for every item in the new text array, update the layer with the new text and italicize the given string
            }
        }
    
    app.endUndoGroup();
    }