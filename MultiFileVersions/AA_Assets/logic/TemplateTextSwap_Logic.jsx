var includedFiles = [ "../utils/Lyr_Utils.jsx", "../utils/Project_Utils.jsx", "../utils/System_Utils.jsx", "../utils/TextLyr_Utils.jsx","../utils/Comp_Utils.jsx", "../utils/ExtendScript_Utils.jsx"];


var LyrUtils = $.global.AA_Scripts.LyrUtils;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var SystemUtils = $.global.AA_Scripts.SystemUtils;
var TextLyrUtils = $.global.AA_Scripts.TextLyrUtils;
var CompUtils = $.global.AA_Scripts.CompUtils;
var ExtendScriptUtils = $.global.AA_Scripts.ExtendScriptUtils;


$.global.AA_Scripts.TemplateTextSwapFuncs = {};
var TemplateTextSwapFuncs = $.global.AA_Scripts.TemplateTextSwapFuncs;

TemplateTextSwapFuncs.generateLayerNamesDocument = function (compArray, csvItemName){
    app.beginUndoGroup("Import CSV Layer Names");
    //$.writeln ("generateLayerNamesDocument Started");
    var templateFolder = ProjectUtils.findAddFolder ("04_TemplatePieces", null);
    var csvFolder = ProjectUtils.findAddFolder("CSVs", "04_TemplatePieces");
    var csvItem = ProjectUtils.findFootage(csvItemName);
    if (csvItem !== null) return csvItem;
    var compArray = ProjectUtils.verifyInstanceOfArray(compArray, CompItem, [app.project.activeItem]);
    if (compArray == null) {alert("Selection or the active Item is not a comp"); return null;}
    var templateLayerNames = [["Primary Comps: "]];
    var templateLayers = [];
    var preCompLayers = [];
    //$.writeln("Current File Directory: " + app.project.file.path);
    var templateDocs = new Folder (app.project.file.parent.fsName + "/ScriptingFolder");
    //$.writeln("templateDocs: " + templateDocs.fsName);
    if (!(templateDocs.exists)) templateDocs.create();
    var layerNamesDocPath = new File(templateDocs.fsName + "/LayerNamesDoc.csv");
    var layerNamesDoc = new File(layerNamesDocPath);
    if (layerNamesDoc.exists) {
         csvItem = ProjectUtils.importCSV(layerNamesDoc, csvFolder, csvItemName);
        return csvItem;
        }
    for (var i = 0; i< compArray.length; i++){
        //preCompLayers.push(compArray[i]);
        var gotTemplateLayers = this.getTemplateLayers(compArray[i], templateLayers, preCompLayers)
        //templateLayers = gotTemplateLayers[0];
        //preCompLayers.push(gotTemplateLayers[1]);
        }
    for (var i = 0; i< compArray.length; i++){
        templateLayerNames[0][0] = templateLayerNames[0][0].concat('\"'+ compArray[i].name+'\" ');
        }
    templateLayerNames[0][0] = templateLayerNames[0][0].concat("Nested Comps: ");
    for (var i = 0; i< preCompLayers.length; i++){
        templateLayerNames[0][0] = templateLayerNames[0][0].concat('\"'+ preCompLayers[i].name+'\" ');
        }
    for (var i = 0; i< templateLayers.length; i++){
        templateLayerNames[0].push(templateLayers[i].name);
        }
    //$.writeln("layerNamesDocPath: " + layerNamesDocPath.fsName);
    //$.writeln("layerNamesDoc: " + layerNamesDoc.fsName);
    layerNamesDoc.open("w");
    layerNamesDoc.write(templateLayerNames[0].join(",") + "\nNew Text/Img Name:");
    layerNamesDoc.close();
    
    csvItem = ProjectUtils.importCSV(layerNamesDoc, csvFolder, csvItemName);
    app.endUndoGroup();
    return csvItem;
    }

TemplateTextSwapFuncs.getTemplateLayers = function (comp, layerArray, preCompLayers){
    $.writeln ("getTemplateLayers Started in" + comp.name);
    comp = ProjectUtils.verifyInstanceOfCompActive(comp)
    if (comp == null) {return null;}
    //$.writeln("Layers Length: "+comp.layers.length);
    var compPreComps = []
    for (var i = 1; i< comp.layers.length+1; i++){
        if (comp.layers[i] instanceof ShapeLayer){continue;}
        if (comp.layers[i] instanceof TextLayer){
            var textLayerText = comp.layers[i].sourceText.value.text;
            var textLayerTextNormalized = textLayerText.replace(/[\r\n]+/g," ").replace(/^\s+|\s+$/g, "");
            var textLayerNameNormalized = comp.layers[i].name.replace(/[\r\n]+/g," ").replace(/^\s+|\s+$/g, "");
            //$.writeln("Layer "+ comp.layers[i].name +" Text: "+textLayerNameNormalized);
            //$.writeln(textLayerNameNormalized.indexOf(textLayerTextNormalized + " "));
            if (textLayerTextNormalized === textLayerNameNormalized ||
                textLayerNameNormalized.indexOf(textLayerTextNormalized + " ") === 0){
                continue;
                }
            }
        if (comp.layers[i].source instanceof CompItem){
            var imagePrecompRegex = new RegExp("^TemplatePicture\\d*\_preComp$");
            if (imagePrecompRegex.test(comp.layers[i].name)){
                $.writeln("Adding Comp to List: "+comp.layers[i].name);
                preCompLayers.push(comp.layers[i].source);
                compPreComps.push(comp.layers[i])
                }
            continue;
            }
        $.writeln("addingLayer: "+comp.layers[i].name);
        layerArray.push(comp.layers[i])
        }
    if (compPreComps.length != 0){
        for (var i = 0; i< compPreComps.length; i++){
            $.writeln("Entering Comp: "+compPreComps[i].source.name);
            this.getTemplateLayers(compPreComps[i].source, layerArray, preCompLayers)
            //layerArray.push(gotTemplateLayers[0]);
            //preCompLayers.push(gotTemplateLayers[1]);
            }
        }
    //return [layerArray, preCompLayers];
    }


TemplateTextSwapFuncs.createTemplatesFromCSV = function (csvItemName){
    app.beginUndoGroup("Create Templates From CSV");
    var csvItem = ProjectUtils.findFootage(csvItemName);
    if (csvItem == null) {
        $.writeln("Could not find CSV Imported File");
        return null;
        }
    var textArray = SystemUtils.altParseCSV(csvItem.file,true);
    //var compRegExp = new RegExp ('\"[^\"]*\"');
    var csvCompCell = textArray[0][0];
    var allTemplateCompNames = ExtendScriptUtils.stringQuotesToArray(csvCompCell);
    var allTemplateComps = ProjectUtils.findComps(allTemplateCompNames, null);
    if (!allTemplateComps) return null;
    var baseTemplateCompNames = this.primaryCompsStringToArray(csvCompCell)
    var baseTemplateComps = ProjectUtils.findComps(baseTemplateCompNames, null);
    if (!baseTemplateComps) return null;
    var templateFolder = ProjectUtils.findAddFolder ("04_TemplatePieces", null);
    var templateCompsFolder = ProjectUtils.findAddFolder("TemplateComps", templateFolder);
    var templateComps = [];
    var newBaseComps = [];
    for (var i = 1; i <textArray.length; i++){
        templateComps.push(this.createTemplateFromCSV(textArray[i], i, textArray.length-1, allTemplateComps, textArray[0], templateCompsFolder, baseTemplateComps, newBaseComps));
        }
    var templateRenderQueueItems = [];
    //var outputFolder = SystemUtils.findSystemFolder("/TemplateRenders");
    var outputFolder = new Folder (app.project.file.parent.parent.fsName + "/AE_Renders");
    //if (outputFolder.exists) {outputFolder = new Folder (app.project.file.parent.parent.fsName + "/AE_Renders");}
    if (!(outputFolder.exists)) {outputFolder = new Folder (app.project.file.parent.fsName + "/TemplateRenders");}
    if (!(outputFolder.exists)) outputFolder.create();
    for (var i = 0; i<newBaseComps.length;i++){
        //$.writeln ("New Comp in newBaseComps: " + newBaseComps[i].name);
        var renderQueueItem = app.project.renderQueue.items.add(newBaseComps[i]);
        templateRenderQueueItems.push(renderQueueItem);
        $.writeln ("Editing RenderQueue Item: " + templateRenderQueueItems[i].comp.name);
        var outputModule1 = renderQueueItem.outputModule[1];
        var outputModule2 = renderQueueItem.outputModules.add();
        }
    for (var i = 0; i<templateRenderQueueItems.length;i++){
        //renderQueueItems.push(app.project.renderQueue.items.add(newBaseComps[i]))
        }
    app.endUndoGroup();
    }

TemplateTextSwapFuncs.createTemplateFromCSV = function (newLayerInformation, templateNumber, TemplateNumberTotal, allTemplateComps, defaultInformation, templateCompsFolder, baseTemplateComps, newBaseComps){
    var newTemplateComps = [];
    var compChecks = false;
    for (var i = 0; i<allTemplateComps.length; i++){
        var newCompName = "Template" + ExtendScriptUtils.numberToPaddedString(templateNumber, TemplateNumberTotal) + "_" + allTemplateComps[i].name;
        var compCheck = ProjectUtils.findComp(newCompName, templateCompsFolder);
        if (compCheck){
            newTemplateComps.push(compCheck);
            compChecks = true;
            } else{
                var baseTemplateCheck = ProjectUtils.isCompInArray(allTemplateComps[i], baseTemplateComps);
                var newComp = allTemplateComps[i].duplicate();
                newComp.name = "Template" + ExtendScriptUtils.numberToPaddedString(templateNumber, TemplateNumberTotal) + "_" + allTemplateComps[i].name;
                newComp.parentFolder = templateCompsFolder;
                newTemplateComps.push(newComp);
                if (baseTemplateCheck) newBaseComps.push(newComp);
                }
        }
    if (compChecks) return newTemplateComps;
    for (var i = 0; i<newTemplateComps.length; i++){
        var newTemplateComp = newTemplateComps[i];
        for (var j = 0; j<allTemplateComps.length; j++){
            //$.writeln ("Looking for: " +   allTemplateComps[j].name + " in " + newTemplateComp.name);
            var nestedCompLayer = LyrUtils.findLayer (newTemplateComp, allTemplateComps[j])
            if (nestedCompLayer){
                var currentTemplatename = newTemplateComps[i].name;
                var currentTemplateLabel =currentTemplatename.match(/^Template\d+_/);
                if (currentTemplateLabel == null) continue;
                //$.writeln ("Looking for: " + currentTemplateLabel[0] + nestedCompLayer.name);
                var newLayerSource = ProjectUtils.findComp(currentTemplateLabel[0] + nestedCompLayer.name);
                if (newLayerSource) {
                    nestedCompLayer.replaceSource(newLayerSource, false);
                    nestedCompLayer.name = newLayerSource.name;
                    }
                }
            }
        for (var j = 1; j<defaultInformation.length; j++){
            //$.writeln ("Current Item: " + defaultInformation.length);
            if (!(newLayerInformation[j])||newLayerInformation[j] == "") continue;
            //$.writeln ("Looking for: " +  defaultInformation[j] + " in " + newTemplateComp.name);
            var changingLayer = LyrUtils.findLayer (newTemplateComp, defaultInformation[j]);
            if (!changingLayer) continue;
            if (changingLayer instanceof TextLayer) {TextLyrUtils.replaceLines(newLayerInformation[j], [changingLayer]);}
            if (changingLayer instanceof AVLayer) {
                var newSourceItem = ProjectUtils.findCompFootage(newLayerInformation[j]);
                if (newSourceItem) changingLayer.replaceSource(newSourceItem, false);
                }
            }
        }
    return newTemplateComps;  
    }

TemplateTextSwapFuncs.primaryCompsStringToArray = function (csvString){
    var compNames = [];
    var primarySelection = csvString.match(/Primary Comps:\s*((?:"[^"]*"\s*)*)Nested Comps:/);
    if(primarySelection && primarySelection[1]){
        var quotedMatches = primarySelection[1].match(/"[^"]*"/g);
        if (quotedMatches){
            for (i=0; i < quotedMatches.length; i++){
                //$.writeln ("Simplifying " + quotedMatches[i]);
                var compName = ExtendScriptUtils.removeFrontEndQuotes(quotedMatches[i]);
                compNames.push(compName);
                }
            }
        }
    if (compNames.length == 0) return null;
    return compNames;
    }
