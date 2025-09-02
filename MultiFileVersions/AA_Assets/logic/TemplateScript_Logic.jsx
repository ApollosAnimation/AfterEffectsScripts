var includedFiles = [ "../utils/Lyr_Utils.jsx", "../utils/Project_Utils.jsx", "../utils/System_Utils.jsx", "../utils/TextLyr_Utils.jsx","../utils/Comp_Utils.jsx" ];
var LyrUtils = $.global.AA_Scripts.LyrUtils;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var SystemUtils = $.global.AA_Scripts.SystemUtils;
var TextLyrUtils = $.global.AA_Scripts.TextLyrUtils;
var CompUtils = $.global.AA_Scripts.CompUtils;

$.global.AA_Scripts.TemplateFuncs = {};
var TemplateFuncs = $.global.AA_Scripts.TextUpdateFuncs;

TemplateFuncs.prepProject = function (compCsvFile){//Undoable; Returns nothing; creates the template folder that will contain all future imports and comps
    app.beginUndoGroup("prepFile");
    ProjectUtils.findAddFolder("04_TemplatePieces");
    var compArray = SystemUtils.csvNameToArray(compCsvFile);
    var folderList = new Array;
    for (var i=1; i<=compArray.length-1; i++){
        if (compArray[i][5] == "") {continue;}
         var includedList = compArray[i][5].split(/\;\s?/);
         for (var j=0; j<includedList.length; j++){
             if ((includedList[i] == null)|(includedList[i] == undefined)){continue;}
             folderList.push(includedList[j]);
             }
    }
    for (var i=0; i<=folderList.length; i++){
        if ((folderList[i] == null)|(folderList[i] == undefined)){continue;}
        ProjectUtils.findAddFolder(folderList[i], "04_TemplatePieces");
    }
    //var folderList = compArray[1][5].split(/\;\s?/);            
    //var footageSplitTest = compArray[1][5].split(/\;\s?/);            
    var builtComps = [];
    var buildFolder = ProjectUtils.findAddFolder("TemplateComps", "04_TemplatePieces");
    for (var i=1; i<compArray.length; i++){
        var comp = ProjectUtils.findAddComp(compArray[i]);
        builtComps.push(comp);
        comp.parentFolder = buildFolder;
        }
    
    app.endUndoGroup();
    }
TemplateFuncs.populateProject = function(compCsvFile){//Undoable; Returns nothing, looks for CSV defined comps, adds layers in csv specified folders and comps, precomping and adds fades between them
    app.beginUndoGroup("prepFile");
    var templateCompFolder = ProjectUtils.findAddFolder("TemplateComps");
    if (templateCompFolder.numItems == 0){alertTest ("No Comps in Template Comps Folder"); return -1;}
    var compArray = csvNameToArray(compCsvFile);
    for (var i=1; i<=templateCompFolder.numItems; i++){
        var comp = ProjectUtils.findComp(compArray[i][0], templateCompFolder);
        //skip comp of found comps if there are layers present already (Maybe move this to front of for loop?)
            if (comp.numLayers !=0){continue;}
            if(compArray[i][5] == ""){continue;}
            var includedItems = [];
            var includedFolders = compArray[i][5].split(/\;\s?/);
            for (var j=0; j<includedFolders.length; j++){
                var contentFolder = ProjectUtils.findAddFolder(includedFolders[j]);
                for (var k=1; k<=contentFolder.numItems; k++){
                    includedItems.push(contentFolder.items[k]);
                    }
                }
            var includedComps = [];
            var templatePreCompsFolder =  findAddFolder("TemplatePreComps", "04_TemplatePieces");
            for (var j=0; j<includedItems.length; j++){
                    var item = includedItems[j];
                    if (item instanceof CompItem) {includedComps.push(item); continue;}
                    if (!(item instanceof FootageItem)) { continue;}
                    var psdStill = LyrUtils.stillToPSDComp(item);
                    if (stillToPSDComp(item) != null){includedComps.push(psdStill); continue}
                    var itemCompName = item.name.split(/\.\s?/);
                    itemCompName.pop();
                    itemCompName.push("_preComp")
                    itemCompName = itemCompName.join("");
                    var itemCompDuration = (item.duration !=0) ? item.duration : 30;
                    var itemCompFrameRate = (item.frameRate !=0) ? item.frameRate : 24;
                    var itemComp = ProjectUtils.findAddComp([itemCompName, item.width, item.height, itemCompDuration, itemCompFrameRate])
                    itemComp.parentFolder = templatePreCompsFolder;
                    if (itemComp.numLayers == 0){itemComp.layers.add(item);}
                    includedComps.push(itemComp);                        
                }
            var additionalComps = compArray[i][6].split(/\;\s?/);
            for (var j=0; j<additionalComps.length; j++){
                additionalComp = ProjectUtils.findComp(additionalComps[j]);
                if (additionalComp != null) {includedComps.push(additionalComp);}
                }
            //now that we have collected all the items we want to include in the comp and turned them all into comps, we can start adding the tiems to the comp
            var segmentLength = (comp.duration/includedComps.length);
            for (var j=0; j<includedComps.length; j++){
                CompUtils.addParalaxComp(includedComps[j]);
                var newLayer = comp.layers.add(includedComps[j]);
                newLayer.moveToEnd();
                var frameTransitionTime = (compArray[i][7] !="") ? Number(compArray[i][7]) : 10;
                //if (j == (includedComps.length-1)){newLayer.outPoint = segmentLength; newLayer.startTime = segmentLength*j;; continue;}
                newLayer.outPoint = segmentLength+(frameTransitionTime*comp.frameDuration);
                newLayer.startTime = segmentLength*j;
                var opacityProp = newLayer.property("Opacity");
                opacityProp.setValueAtTime(segmentLength*(j+1), 100);
                opacityProp.setValueAtTime(segmentLength*(j+1)+(frameTransitionTime*comp.frameDuration), 0);
                var easeLow = new KeyframeEase(0, 0.1);
                var easeHigh = new KeyframeEase(0, 80);
                opacityProp.setTemporalEaseAtKey(1, [easeLow], [easeHigh]);
                opacityProp.setTemporalEaseAtKey(2, [easeHigh], [easeLow]);
                var compWidthRatio = comp.width/newLayer.width;
                var compHeightRatio = comp.height/newLayer.height;
                var newLayerScale = (compWidthRatio > compHeightRatio) ? (compWidthRatio*100) : (compHeightRatio*100);
                //newLayer.property("Scale").setValue([10,10])
                newLayer.property("Scale").setValue([newLayerScale, newLayerScale]);
                }
            }
    app.endUndoGroup();
    }
TemplateFuncs.addGFX = function(compCsvFile, textCsvFile, nameCsvFile, fontCsvFile){//Undoable; Returns nothing, makes an array of comps from a CSV Fileadd banners to those comps, add/find text to those comps. call addFindDefaultGraphics, add/find fades
    app.beginUndoGroup("addGFX");
    {//Gathering Array
    var compArray = SystemUtils.csvNameToArray(compCsvFile);
    var textArray = SystemUtils.csvNameToArray(textCsvFile);
    var nameArray = SystemUtils.csvNameToArray(nameCsvFile);
    var fontArray = SystemUtils.csvNameToArray(fontCsvFile);
    }
    for (var i=1; i<compArray.length; i++){
        //alertTest(i);
        var comp = ProjectUtils.findComp(compArray[i][0]);
        var banner = ShapeLyrUtils.findAddBannerArea(comp);//add optional banner blur setup using mattes
        this.templateAddFindTextFromCSVs(comp, textArray, nameArray, fontArray);//go through the CSV for text layers to start adding text layers (Anticipating website, adress, phone number)
        //Add Logo if present
        //look for QR image and give it a matte as well, and "Scan here"
        TemplateFuncs.addFindDefaultGraphics(comp, compArray[1][7]);
        CompUtils.checkLayerFunction(comp, ["Fade In", "Fade Out"], false,addFadeBlack, [comp]);//Add some fades if there are none
        }
    app.endUndoGroup();
    }
TemplateFuncs.checkForCompsWithFile = function (compCsvFile, fixExpressions){//Undoable; Returns nothing, Default fixExpressions:False, makes an array of comps from a CSV File, and calls checkForComps
    app.beginUndoGroup("checkForCompsWithFile");
    var fixExpressions = ((fixExpressions !== undefined)&&(fixExpressions !== null)) ? fixExpressions : false;
    var compCsv = SystemUtils.csvNameToArray(compCsvFile);
    var compArray = new Array;
    for (var i=1; i<=compCsv.length-1; i++){
        compArray.push(findComp(compCsv[i][0]));
        }
    this.checkForComps(compArray, fixExpressions);

    app.endUndoGroup();
    }
TemplateFuncs.checkForComps = function (compArray, fixExpressions){//Returns null in error, Default fixExpressions:False compArray:[app.project.activeItem], checks layers in comps for footage items, and tries replacing those footage layers with precomps
    var fixExpressions = ((fixExpressions !== undefined)&&(fixExpressions !== null)) ? fixExpressions : false;
    var compArray = ProjectUtils.verifyInstanceOfArray(compArray, CompItem, [app.project.activeItem]);
    if(compArray == null){return null;}
    for (var i=0; i<=compArray.length-1; i++){
        var comp = compArray[i];
        if (comp.numLayers ==0){continue;}
        var footageLayers = LyrUtils.findLayersOfType(comp, AVLayer, [CompItem, TextLayer]);
        if (footageLayers == null){continue;}
        if (footageLayers.length > 0){
            for (var j=0; j<=footageLayers.length-1; j++){
                var compSource  = null;
                compSource = ProjectUtils.findComp(footageLayers[j].name);
                if (compSource == null){compSource = ProjectUtils.findComp(footageLayers[j].name+"_preComp");}
                if (compSource != null){footageLayers[j].replaceSource(compSource, fixExpressions);}
                }
            }
        } 
    }
TemplateFuncs.buildCheck = function (compCsvFile, textCsvFile, nameCsvFile, fontCsvFile){//Undoable; a function to check functionalities with a button press
    app.beginUndoGroup("buildCheck");
    var compArray = SystemUtils.csvNameToArray(compCsvFile);
    var textArray = SystemUtils.csvNameToArray(textCsvFile);
    var nameArray = SystemUtils.csvNameToArray(nameCsvFile);
    var fontArray = SystemUtils.csvNameToArray(fontCsvFile);
    var comp = app.project.activeItem;
    
    //addFindTextFromCSVs(comp, textArray, nameArray, fontArray);
    //addFindDefaultGraphics(comp, compArray[1][7]);
    //findAddBannerArea(comp);
    //checkLayerFunction(comp, ["Fade In", "Fade Out"], false,addFadeBlack)
    LyrUtils.checkLayerForNewPSDs(null, false);
    app.endUndoGroup();
    }
TemplateFuncs.checkForNewPSDsWithFile = function (compCsvFile, fixExpressions){//Undoable; Return null in error, Default fixExpressions:False, makes an array of comps from a CSV File, and calls checkForNewPSDs
    app.beginUndoGroup("checkForNewPSDsWithFile");
    var fixExpressions = ((fixExpressions !== undefined)&&(fixExpressions !== null)) ? fixExpressions : false;
    var compCsv = csvNameToArray(compCsvFile);
    var compArray = new Array;
    for (var i=1; i<=compCsv.length-1; i++){
        compArray.push(findComp(compCsv[i][0]));
        }
    checkForNewPSDs(compArray, false);
    app.endUndoGroup();
    }
TemplateFuncs.templateAddFindTextFromCSVs = function (comp, textArray, nameArray, fontArray){//Returns null in error, Default Comp:Current; adds text layer per array item in CSV files that is not already present in name
            var comp = ((comp !== undefined)&&(comp !== null)) ? comp : app.project.activeItem; if ((comp == undefined)|(comp == null)|(!(comp instanceof CompItem))){return null;}
            var arrayLine = null;
            var arrayIteration = null;
            for (var i = 1; i<=nameArray.length-1; i++){
                if (nameArray[i][0] == comp.name){arrayIteration = i; arrayLine = nameArray[i]; break;}
                }
            if (arrayLine == null){return null;}
            //var newLayer = addFindTextLayer(comp, textArray[arrayIteration][3], nameArray[arrayIteration][3], fontArray);
            for (i = 1; i<=arrayLine.length-1; i++){
                if (LyrUtils.findLayer(comp, arrayLine[i]) != null){continue;}
                var newLayer = this.templateAddFindTextLayer(comp, textArray[arrayIteration][i], nameArray[arrayIteration][i], fontArray);
                //alertTest (newLayer.name);
                }
            }
TemplateFuncs.templateAddFindTextLayer = function(comp, layerText, layerName, fontArray){//Return null in Error / the new text layer; dafaults comp:activeItem or return null, arrays called from parsed CSVs
            var comp = ((comp !== undefined)&&(comp !== null)) ? comp : app.project.activeItem;
            if (!(comp instanceof CompItem)){return null;}
            var newTextLayer = comp.layers.addText(layerText);
            newTextLayer.name = layerName;
            var newTextLayerProp = newTextLayer.property("Source Text");
            var newTextLayerDoc = newTextLayerProp.value;
            newTextLayer.property("Source Text").setValue(newTextLayerDoc);
            //newTextLayerDoc.fontSize = 60;
            newTextLayerProp.setValue(newTextLayerDoc);
            var newLineRegex = new RegExp ("\\\\n", 'g');
            newTextLayerDoc.text = newTextLayerDoc.text.split(newLineRegex).join("\n");
            //newTextLayerDoc.text = newTextLayerDoc.text.split(/\\n/g).join("\n");
            newTextLayerDoc.font = fontArray[1][0].toString();
            
            var wordChangeArray = []
            for(j=1; j<=fontArray[2].length-1; j++){
                 var newTextValueString = newTextLayerDoc.text;
                 var searchSymbol = fontArray[2][j];
                 if (searchSymbol == "\"") {searchSymbol =new RegExp ("\“|\”|\"|\"", 'g'); }
                    //var newTextValueArray = newTextValueString.split(fontArray[2][i]);
                    var newTextValueArray = newTextValueString.split(searchSymbol);
                    if (newTextValueArray.length > 1){
                    var newTextValueString = newTextValueArray.join("");
                    newTextLayerDoc.text = newTextValueString;
                     if (newTextValueArray.length > 1){
                         for (k=1; k<newTextValueArray.length; k+=2){
                             if (newTextValueArray[k] !=""){
                            wordChangeArray.push([newTextValueArray[k], j]);
                            }
                        }
                     }
                }
                }
            newTextLayerProp.setValue(newTextLayerDoc);
            if (wordChangeArray.length > 0){
                for (j=0; j<wordChangeArray.length;j++){
                    var regex = new RegExp (wordChangeArray[j][0],"g")
                    var searchArray;
                    while ((searchArray = regex.exec(newTextLayerProp.value.text)) != null) {
                        var endPoint = regex.lastIndex;
                        var wordLength = wordChangeArray[j][0];
                        var startPoint = endPoint - wordChangeArray[j][0].length;
                        var newFont = fontArray[1][wordChangeArray[j][1]];
                        newTextLayerDoc.characterRange(startPoint, endPoint).font = newFont;
                    }
                }
            newTextLayerProp.setValue(newTextLayerDoc);
            }
        var titleSafeWidth = comp.width*.85;
        newTextLayerDoc.fontSize = 80;
        newTextLayerDoc.fillColor = [1,1,1];
        newTextLayerProp.setValue(newTextLayerDoc);
        TextLyrUtils.resizeTextLayer(newTextLayer, null,0, false);
        var dropShadow = newTextLayer.Effects.addProperty("S_DropShadow");
        dropShadow.property("Shift X").setValue(0); dropShadow.property("Shift Y").setValue(0); 
        dropShadow.property("Shadow Opacity").setValue(0.5); dropShadow.property("Shadow Blur").setValue(50);
        return newTextLayer;
        }
TemplateFuncs.addFindDefaultGraphics = function (comp, transitionTime){//Returns Null in Error, Positions Layer and QR Code, defines the Gap in between, places "Website", "Phone Number", hides "QR Code Text" after adding it to other comp, staggers and places all other text layers
        var comp = ((comp !== undefined)&&(comp !== null)) ? comp : app.project.activeItem;
        var bannerLayer = LyrUtils.findLayer(comp, "BannerMatteLayer");
        var logoFootage = ProjectUtils.findFootage("Logo");
        var logoLayer = this.findAddLogo(comp, bannerLayer);
        var qrCodeLayer = this.findAddQR(comp, bannerLayer, ["QRCode_preComp", 250, 280, 60, 24]);
        if (qrCodeLayer != null) {
            var qrTextLayer = LyrUtils.findLayer(comp, "QR Code Text");
            if (qrTextLayer != null){qrTextLayer.enabled = false;}
            }
        var logoLayerSize = LyrUtils.layerScreenSize(logoLayer);
        var qrLayerSize = LyrUtils.layerScreenSize(qrCodeLayer);
        var bannerLayerSize = LyrUtils.layerScreenSize(bannerLayer);
        var bannerSpacing = 20;
        var bannerInnerWidth = null;
        //Add exception if no QR Code present, default to title safe
        if (qrCodeLayer != null) {
            bannerInnerWidth = (qrLayerSize.positionX-qrLayerSize.halfWidth)-(logoLayerSize.positionX+logoLayerSize.halfWidth) - bannerSpacing*2;
            } else{
            bannerInnerWidth = (comp.width*(.85 + (.15*.5)))-(logoLayerSize.positionX+logoLayerSize.halfWidth) - bannerSpacing*2;
            }
        if (bannerInnerWidth == null){return null;}
        var gapSpace = {
            "width": bannerInnerWidth,
            "height": bannerLayerSize.height,
            "positionX": (logoLayerSize.positionX+logoLayerSize.halfWidth) + bannerSpacing + (bannerInnerWidth*.5),
            "positionY": bannerLayerSize.positionY,
            "halfWidth": bannerInnerWidth*.5,
            "halfHeight": bannerLayerSize.height*.5
            }
        //var gapSpaceCheck =  createRectangleShapeLayer (comp, gapSpace.width, gapSpace.height, [1,1,1]);
        //gapSpaceCheck.property("Position").setValue([gapSpace.positionX, gapSpace.positionY,0])
        var websiteTextLayer = findLayer(comp, "Website"); var phoneTextLayer = findLayer(comp, "Phone Number");
        if ((websiteTextLayer != null)&&(phoneTextLayer != null)){
            var websiteTextLayerSize = TextLyrUtils.resizeTextLayer (websiteTextLayer, gapSpace.halfWidth-bannerSpacing, 0, false);
            websiteTextLayer.property("Anchor Point").setValue([websiteTextLayerSize.halfWidth + websiteTextLayerSize.left, websiteTextLayerSize.halfHeight + websiteTextLayerSize.top,0]);
            websiteTextLayer.property("Position").setValue([gapSpace.positionX - gapSpace.halfWidth + websiteTextLayerSize.halfWidth, gapSpace.positionY + (gapSpace.height*.2)  ,0]);
            TextLyrUtils.setTextFontSize(phoneTextLayer, websiteTextLayer.property("Source Text").value.fontSize)
            var phoneTextLayerSize = LyrUtils.layerScreenSize(phoneTextLayer);
            phoneTextLayer.property("Anchor Point").setValue([phoneTextLayerSize.halfWidth + phoneTextLayerSize.left, phoneTextLayerSize.halfHeight + phoneTextLayerSize.top,0]);
            phoneTextLayer.property("Position").setValue([gapSpace.positionX + gapSpace.halfWidth - phoneTextLayerSize.halfWidth, websiteTextLayer.property("Position").value[1],0]);
        }else if (websiteTextLayer != null){
            var websiteTextLayerSize = TextLyrUtils.resizeTextLayer(websiteTextLayer, gapSpace.halfWidth, 0, false);
            websiteTextLayer.property("Anchor Point").setValue([websiteTextLayerSize.halfWidth + websiteTextLayerSize.left, websiteTextLayerSize.halfHeight + websiteTextLayerSize.top,0]);
            websiteTextLayer.property("Position").setValue([gapSpace.positionX, gapSpace.positionY + (gapSpace.height*.2),0]);
        }else if (phoneTextLayer != null){
            var phoneTextLayerSize = TextLyrUtils.resizeTextLayer(phoneTextLayer, gapSpace.halfWidth, 0, false);
            phoneTextLayer.property("Anchor Point").setValue([phoneTextLayerSize.halfWidth + phoneTextLayerSize.left, phoneTextLayerSize.halfHeight + phoneTextLayerSize.top,0]);
            phoneTextLayer.property("Position").setValue([gapSpace.positionX, gapSpace.positionY + (gapSpace.height*.2),0]);
        }
        var otherCopy = TextLyrUtils.findTextLayers(comp);
        var defaultLayerNames = ["QR Code Text", "Phone Number", "Website" /*, "Address"*/];
        for (var i = otherCopy.length-1; i>=0; i--){
            if ((otherCopy[i].name == defaultLayerNames[0])|(otherCopy[i].name == defaultLayerNames[1])|(otherCopy[i].name == defaultLayerNames[2])|(otherCopy[i].enabled == false)){
                otherCopy.splice(i,1);
            }
        }
        if(otherCopy.length > 1){
            var segmentLength = (comp.duration/otherCopy.length);
            var transitionTime = (transitionTime !="") ? Number(transitionTime) : 10;
            transitionTime = transitionTime*comp.frameDuration;
            for (var i = 0; i<=otherCopy.length-1; i++){
                //var layerText = otherCopy[i].Text;
                //var checkAnimators = otherCopy[i].Text.Animators.numProperties;
                if (otherCopy[i].Text.Animators.numProperties >0){continue;}
                otherCopy[i].outPoint = segmentLength+(transitionTime)+otherCopy[i].startTime;
                otherCopy[i].startTime = (segmentLength*i);
                if (i!=0){
                    var easeIn = addTextAnimLayer(otherCopy[i], otherCopy[i].startTime, transitionTime, "Ramp Down");
                    var easeInOpacity = easeIn.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");;
                    easeInOpacity.setValue(0);
                    }
                if (i!=otherCopy.length-1){
                    var easeOut = addTextAnimLayer(otherCopy[i], otherCopy[i].outPoint - transitionTime - (transitionTime*.5), transitionTime, "Ramp Up");
                    var easeOutOpacity = easeOut.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");;
                    easeOutOpacity.setValue(0);
                    }
                var otherCopySize = resizeTextLayer (otherCopy[i], gapSpace.width,otherCopy[i].inPoint+transitionTime , false);
                otherCopy[i].property("Anchor Point").setValue([otherCopySize.halfWidth + otherCopySize.left, otherCopySize.halfHeight + otherCopySize.top,0]);
                otherCopy[i].property("Position").setValue([gapSpace.positionX, gapSpace.positionY - (gapSpace.height*.15),0]);
            }
        }
    }
TemplateFuncs.findAddLogo = function (comp, bannerLayer){//Returns Null / Logo Layer; Looks for Footage named "Logo", if no current Logo add Logo at around 220 pixel Height/Width, dafault smaller
    var logoFootage = ProjectUtils.findFootage("Logo");
    if (logoFootage != null){
        var logoLayer = LyrUtils.findLayer(comp, logoFootage.name);
        if (logoLayer!= null){return logoLayer;}
        logoLayer = LyrUtils.findAddLayer(comp, logoFootage.name);
        if (logoLayer!=null){
            var compWidthRatio = 220/logoLayer.width;
            var compHeightRatio = 220/logoLayer.height;
            var logoLayerScale = Math.floor((compWidthRatio > compHeightRatio) ? (compWidthRatio*100) : (compHeightRatio*100));
            logoLayer.property("Scale").setValue([logoLayerScale, logoLayerScale]);
            if (bannerLayer != null){
                var logoSize = LyrUtils.resizeRectangle(logoLayer.sourceRectAtTime(0, false), logoLayerScale*.01);
                logoLayer.property("Position").setValue([(comp.width*.075)+(logoSize.width*.5), bannerLayer.property("Position").value[1], 0]);
                return logoLayer;
                }
            return logoLayer;
            }
        }
    return null;
    }
