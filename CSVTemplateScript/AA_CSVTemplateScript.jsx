{
    {
function makeTemplateRevisionPanel(windowObj){
    
    function buildPanel(windowObj){
         var myButtonPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Effects Buttons", undefined, {resizeable:true});
         var myButtonTabs = myButtonPanel.add("tabbedpanel",undefined);
         var buttonTab = myButtonTabs.add("tab", undefined, "Controls", {orientation:'row',alignment:['left','top']});
         var csvTab = myButtonTabs.add("tab", undefined, "File Names", {orientation:'row',alignment:['left','top']});
         {var column01 = buttonTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
         column01.orientation = 'column';
         column01.add("Button",undefined ,"Prep Project").onClick = function(){prepProject (compCsvFile.text)};
         column01.add("Button",undefined ,"Populate Project").onClick = function(){populateProject (compCsvFile.text)};
         column01.add("Button",undefined ,"Add GFX").onClick = function(){addGFX (compCsvFile.text, textCsvFile.text, legendCsvFile.text,fontCsvFile.text)};
         column01.add("Button",undefined ,"Check For Comps").onClick = function(){checkForCompsWithFile (compCsvFile.text)};
         column01.add("Button",undefined ,"Check For New PSDs").onClick = function(){checkLayerForNewPSDs(null, false);};
         //column01.add("Button",undefined ,"BuildCheck").onClick = function(){buildCheck (compCsvFile.text, textCsvFile.text, legendCsvFile.text,fontCsvFile.text)};
         }
         {var csvColumn01 = csvTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
         csvColumn01.orientation = 'column';
         csvColumn01 .add('statictext {text: "CSV Footage Name:",  justify: "center"}');
         var textCsvFile = csvColumn01 .add('edittext{text:"TextCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
         csvColumn01 .add('statictext {text: "CSV Legend Name:",  justify: "center"}');
         var legendCsvFile = csvColumn01 .add('edittext{text:"LegendCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
         csvColumn01 .add('statictext {text: "CSV Font Name:",  justify: "center"}');
         var fontCsvFile = csvColumn01 .add('edittext{text:"FontCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
         csvColumn01 .add('statictext {text: "CSV Comps:",  justify: "center"}');
         var compCsvFile = csvColumn01 .add('edittext{text:"CompCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
         }
        myButtonPanel.layout.layout(true);
        return myButtonPanel;
        }
    var scriptShower = buildPanel(windowObj);
    if (scriptShower != null && scriptShower instanceof Window){
        scriptShower.center();
        scriptShower.show();
        }
    }
makeTemplateRevisionPanel(this)
    }

    {//Start list of needed Functions for UI
        function prepProject(compCsvFile){//Undoable; Returns nothing; creates the template folder that will contain all future imports and comps
            app.beginUndoGroup("prepFile");
            findAddFolder("04_TemplatePieces");
            //findAddFolder("TemplateStills","Still");
            //findAddFolder("TemplateFootage","Footage");
            var compArray = csvNameToArray(compCsvFile);
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
				findAddFolder(folderList[i], "04_TemplatePieces");
			}
			//var folderList = compArray[1][5].split(/\;\s?/);            
            //var footageSplitTest = compArray[1][5].split(/\;\s?/);            
            var builtComps = [];
            var buildFolder = findAddFolder("TemplateComps", "04_TemplatePieces");
            for (var i=1; i<compArray.length; i++){
                var comp = findAddComp(compArray[i]);
                builtComps.push(comp);
                comp.parentFolder = buildFolder;
                }
            
            app.endUndoGroup();
            }
        function populateProject(compCsvFile){//Undoable; Returns nothing, looks for CSV defined comps, adds layers in csv specified folders and comps, precomping and adds fades between them
            app.beginUndoGroup("prepFile");
            var templateCompFolder = findAddFolder("TemplateComps");
            if (templateCompFolder.numItems == 0){alertTest ("No Comps in Template Comps Folder"); return -1;}
            var compArray = csvNameToArray(compCsvFile);
            for (var i=1; i<=templateCompFolder.numItems; i++){
                //alertTest(i);
				var comp = findComp(compArray[i][0], templateCompFolder);
                //skip comp of found comps if there are layers present already (Maybe move this to front of for loop?)
                    if (comp.numLayers !=0){continue;}
                    if(compArray[i][5] == ""){continue;}
                    var includedItems = [];
                    var includedFolders = compArray[i][5].split(/\;\s?/);
                    for (var j=0; j<includedFolders.length; j++){
                        var contentFolder = findAddFolder(includedFolders[j]);
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
                            var psdStill = stillToPSDComp(item);
                            if (stillToPSDComp(item) != null){includedComps.push(psdStill); continue}
                            var itemCompName = item.name.split(/\.\s?/);
                            itemCompName.pop();
                            itemCompName.push("_preComp")
                            itemCompName = itemCompName.join("");
                            var itemCompDuration = (item.duration !=0) ? item.duration : 30;
                            var itemCompFrameRate = (item.frameRate !=0) ? item.frameRate : 24;
                            var itemComp = findAddComp([itemCompName, item.width, item.height, itemCompDuration, itemCompFrameRate])
                            itemComp.parentFolder = templatePreCompsFolder;
                            if (itemComp.numLayers == 0){itemComp.layers.add(item);}
                            includedComps.push(itemComp);                        
                        }
                    var additionalComps = compArray[i][6].split(/\;\s?/);
                    for (var j=0; j<additionalComps.length; j++){
                        additionalComp = findComp(additionalComps[j]);
                        if (additionalComp != null) {includedComps.push(additionalComp);}
                        }
                    //now that we have collected all the items we want to include in the comp and turned them all into comps, we can start adding the tiems to the comp
                    var segmentLength = (comp.duration/includedComps.length);
                    for (var j=0; j<includedComps.length; j++){
                        addParalaxComp(includedComps[j]);
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
        
        function addGFX(compCsvFile, textCsvFile, nameCsvFile, fontCsvFile){//Undoable; Returns nothing, makes an array of comps from a CSV Fileadd banners to those comps, add/find text to those comps. call addFindDefaultGraphics, add/find fades
            app.beginUndoGroup("addGFX");
            {//Gathering Array
            var compArray = csvNameToArray(compCsvFile);
            var textArray = csvNameToArray(textCsvFile);
            var nameArray = csvNameToArray(nameCsvFile);
            var fontArray = csvNameToArray(fontCsvFile);
            }
            for (var i=1; i<compArray.length; i++){
                //alertTest(i);
                var comp = findComp(compArray[i][0]);
                var banner = findAddBannerArea(comp);//add optional banner blur setup using mattes
                addFindTextFromCSVs(comp, textArray, nameArray, fontArray);//go through the CSV for text layers to start adding text layers (Anticipating website, adress, phone number)
                //Add Logo if present
                //look for QR image and give it a matte as well, and "Scan here"
                addFindDefaultGraphics(comp, compArray[1][7]);
                checkLayerFunction(comp, ["Fade In", "Fade Out"], false,addFadeBlack, [comp]);//Add some fades if there are none
                }
            app.endUndoGroup();
            }
        function checkForCompsWithFile(compCsvFile, fixExpressions){//Undoable; Returns nothing, Default fixExpressions:False, makes an array of comps from a CSV File, and calls checkForComps
            app.beginUndoGroup("checkForCompsWithFile");
            var fixExpressions = ((fixExpressions != undefined)|(fixExpressions != null)) ? fixExpressions : false;
            var compCsv = csvNameToArray(compCsvFile);
            var compArray = new Array;
            for (var i=1; i<=compCsv.length-1; i++){
                compArray.push(findComp(compCsv[i][0]));
                }
            checkForComps(compArray, fixExpressions);
            
            app.endUndoGroup();
            }
        function checkForComps(compArray, fixExpressions){//Returns null in error, Default fixExpressions:False compArray:[app.project.activeItem], checks layers in comps for footage items, and tries replacing those footage layers with precomps
            var fixExpressions = ((fixExpressions != undefined)|(fixExpressions != null)) ? fixExpressions : false;
            var compArray = ((compArray != undefined)|(compArray != null)) ? compArray
                : (app.project.activeItem instanceof CompItem) ? [app.project.activeItem]
                : return null;
            for (var i=0; i<=compArray.length-1; i++){
                var comp = compArray[i];
                if (comp.numLayers ==0){continue;}
                var footageLayers = findLayersOfType(comp, AVLayer, [CompItem, TextLayer]);
                if (footageLayers == null){continue;}
                if (footageLayers.length > 0){
                    for (var j=0; j<=footageLayers.length-1; j++){
                        var compSource  = null;
                        compSource = findComp(footageLayers[j].name);
                        if (compSource == null){compSource = findComp(footageLayers[j].name+"_preComp");}
                        if (compSource != null){footageLayers[j].replaceSource(compSource, fixExpressions);}
                        }
                    }
                } 
            }
        function buildCheck(compCsvFile, textCsvFile, nameCsvFile, fontCsvFile){//Undoable; a function to check functionalities with a button press
            app.beginUndoGroup("buildCheck");
            var compArray = csvNameToArray(compCsvFile);
            var textArray = csvNameToArray(textCsvFile);
            var nameArray = csvNameToArray(nameCsvFile);
            var fontArray = csvNameToArray(fontCsvFile);
            var comp = app.project.activeItem;
            
            //addFindTextFromCSVs(comp, textArray, nameArray, fontArray);
            //addFindDefaultGraphics(comp, compArray[1][7]);
            //findAddBannerArea(comp);
            //checkLayerFunction(comp, ["Fade In", "Fade Out"], false,addFadeBlack)
            checkLayerForNewPSDs(null, false);
            app.endUndoGroup();
            }
        function checkForNewPSDsWithFile(compCsvFile, fixExpressions){//Undoable; Return null in error, Default fixExpressions:False, makes an array of comps from a CSV File, and calls checkForNewPSDs
            app.beginUndoGroup("checkForNewPSDsWithFile");
            var fixExpressions = ((fixExpressions != undefined)|(fixExpressions != null)) ? fixExpressions : false;
            var compCsv = csvNameToArray(compCsvFile);
            var compArray = new Array;
            for (var i=1; i<=compCsv.length-1; i++){
                compArray.push(findComp(compCsv[i][0]));
                }
            checkForNewPSDs(compArray, false);
            app.endUndoGroup();
            }
        function checkForNewPSDs(compArray, fixExpressions){//Return null in error, Default fixExpressions:False compArray:[app.project.activeItem], takes an array of comps, finds layers of stills, trys finding replacement _precomps or PSDs
            var fixExpressions = ((fixExpressions != undefined)|(fixExpressions != null)) ? fixExpressions : false;
            var compArray = ((compArray != undefined)|(compArray != null)) ? compArray
                : (app.project.activeItem instanceof CompItem) ? [app.project.activeItem]
                : return null;
            for (var i=0; i<=compArray.length-1; i++){
                var comp = compArray[i];
                if (comp.numLayers ==0){continue;}
                var footageLayers = findLayersOfType(comp, AVLayer, [CompItem, TextLayer]);
                if (footageLayers == null){continue;}
                if (footageLayers.length > 0){
                    for (var j=0; j<=footageLayers.length-1; j++){
                        var compSource  = null; var psdStill = null;
                        compSource = findComp(footageLayers[j].name);
                        if (compSource == null){compSource = findComp(footageLayers[j].name+"_preComp");}
                        if (compSource != null){footageLayers[j].replaceSource(compSource, fixExpressions);}
                        psdStill = stillToPSDComp(footageLayers[j].source);
                        if (psdStill == null){continue;}
                        addParalaxComp(psdStill);
                        footageLayers[j].replaceSource(psdStill, fixExpressions);
                        }
                    }
                } 
            }
        function checkLayerForNewPSDs(layers, fixExpressions){//Undoable; returns null in Error / the changed layers. Default fixExpressions:False layers: app.project.activeItem.selectedLayers, takes layers(Array) and tries seeing if they have psd's to replace with of the same name
            app.beginUndoGroup("checkLayerForNewPSDs");
            var fixExpressions = ((fixExpressions != undefined)|(fixExpressions != null)) ? fixExpressions : false;
            //var layers = ((layers != undefined)|(layers != null)) ? layers : app.project.activeItem;
            var layers = (Array.isArray(layers))? layers
                    : (((fixExpressions != undefined)|(fixExpressions != null))&&(app.project.activeItem instanceof CompItem)) ? app.project.activeItem.selectedLayers
                    : null;
            if ((layers == undefined)|(layers == null)){return null;}
            var changedLayers = new Array;
            for (var i = 0; i<layers.length; i++){
                var layer = layers[i];var compSource  = null; var psdStill = null;
                if (!(layer instanceof AVLayer)|!(layer.source instanceof FootageItem)){continue;}
                compSource = findComp(layer.name);
                if (compSource == null){compSource = findComp(layer.name+"_preComp");}
                if (compSource != null){layer.replaceSource(compSource, fixExpressions); changedLayers.push(layer); continue;}
                psdStill = stillToPSDComp(layer.source);
                if (psdStill == null){continue;}
                addParalaxComp(psdStill);
                layer.replaceSource(psdStill, fixExpressions);
                changedLayers.push(layer);
                }
            if (changedLayers.length == 0){return null;}
            return changedLayers;
            app.endUndoGroup();
            }
        function findAddFolder(folderName, parentFolderName){//Returns null if no folder found, or folder in project; if no folder with that name is found, create a folder and set its parent; Default parentFolderName: null
            var items = app.project.items;
            var folder = null;
            for(i=1; i<items.length+1; i++){
                if (items[i].name == folderName){folder = items[i];}
                    }
            if (folder == null){folder = app.project.items.addFolder(folderName);}
            parentFolderName= (parentFolderName != undefined) ? parentFolderName : null;
            if (parentFolderName != null){folder.parentFolder = findAddFolder(parentFolderName);}
            return folder;
            }
        function findComp(compName, folder){//Returns null in Error / the first item that is instanceof CompItem, and has the name of compName(String), Default folder:app.project
            if (compName ==""){return null;}
            var myComp = null;
            var searchArea = app.project;
            folder = (folder != undefined) ? folder : null;
            if (folder != null){searchArea = folder;}
            var items = searchArea.items;
            var itemsLen = items.length;
            for(i=1; i<itemsLen+1; i++){
                if(items[i] instanceof CompItem && items[i].name == compName){
                    return items[i];
                }
            }
        //alert("Comp not found: " + compName);
        return null;    
        }
        function findAddComp(compDetails){//returns comp; comp details an array with [CompName, compWidth, compHeight, compDuration, compFrameRate]
            var items = app.project.items;
            var comp = null;
            for(i=1; i<items.length+1; i++){
                if (items[i].name == compDetails[0]){comp = items[i];}
                    }
            if (comp == null){comp = app.project.items.addComp(compDetails[0],Number(compDetails[1]),Number(compDetails[2]),1,Number(compDetails[3]),Number(compDetails[4]));}
            return comp;
            }
       
        function findFootage(footageName){//Returns null in Error / the first item in the project with the name footageName that is an instanceof FootageItem
                var items = app.project.items;
                for(i=1; i<items.length+1; i++){
                    var curItem = items[i];
                    if(curItem instanceof FootageItem && curItem.name == footageName){ //Will grab only the first name match
                        return curItem;
                    }
                }
            //alert("Footage Not Found: "+footageName);
            return null;
            }
        function findCompFootage(footageName){//Returns null in Error / the first item in the project with the name footageName with _precomp / the first item with the name; Looking for footage by name
                var items = app.project.items;
                for(var i=1; i<=items.length; i++){
                    var curItem = items[i];
                    if(items[i] instanceof CompItem){
                        if((items[i].name == footageName) | (items[i].name == footageName+"_preComp")){  //Will grab only the first name match
                            return items[i];
                        }
                    }
                }
            for(var i=1; i<=items.length; i++){
                    var curItem = items[i];
                    if(items[i] instanceof FootageItem){
                        if(items[i].name == footageName){  //Will grab only the first name match
                            return items[i];
                        }
                    }
                }
            //alert("Footage Not Found: "+footageName);
            return null;
            }
        function findItemWithType(itemName, itemType){//Returns null in Error or the first item in the project with the name itemName and the single itemType
                var items = app.project.items;
                for(i=1; i<items.length+1; i++){
                    if(items[i] instanceof itemType && items[i].name == itemName){
                        return items[i];
                    }
                }
            return null;
            }
        function findLayer(comp, layerName){//Returns  null in error/ the layer with the name of footageName(String), or the layer with the name of footageName with _preComp
            if (!(comp instanceof CompItem)) {return null;}
            for (var i = 1; i<= comp.numLayers; i++){
                if (comp.layers[i].name == layerName){return comp.layers[i];}
                if (comp.layers[i].name == layerName+"_preComp"){return comp.layers[i];}
                }
            return null;
            }
        function findTextLayers(comp){//Returns null in Error / an Array of layers in the comp that are an instanceof TextLayer
            if (!(comp instanceof CompItem)) {return null;}
            var textLayers = new Array;
            for (var i = 1; i<= comp.numLayers; i++){
                if (comp.layers[i] instanceof TextLayer){textLayers.push(comp.layers[i]);}
                }
            return textLayers;
            }
        function findLayersOfType(comp, itemType, exclusionTypes){//Returns null in Error / an Array of Layers, returns layers of the single item type that is not of the exclusionTypes(Array) in a comp
            if (!(comp instanceof CompItem)) {return null;}
            var layers = new Array;
            for (var i = 1; i<= comp.numLayers; i++){
                if (comp.layers[i] instanceof itemType){
                    if (exclusionTypes.length > 0){
                        var exclusionCheck = checkLayerIsNot(comp.layers[i], exclusionTypes);
                        if (exclusionCheck == true) {layers.push(comp.layers[i]);}
                        }
                    else{layers.push(comp.layers[i]);}
                    }
                }
            if (layers.length == 0) {return null;}
            return layers;
            }
        function checkLayerIsNot (layer, exclusionTypes){//Returns Bool, returns false if provided layer is one of the exclusionTypes(Array)
            for (var i = 0; i<= exclusionTypes.length; i++){
                //if (!(comp.layers[i] instanceof exclusionTypes[j]) && !(comp.layers[i].source instanceof exclusionTypes[j])){layers.push(comp.layers[i]);}
                if (layer instanceof exclusionTypes[i]){return false;}
                if (layer.source instanceof exclusionTypes[i]){return false;}
                }
            return true;
            }
        function findAddLayer(comp, footageName){//Returns  null in error/ the layer with the name of footageName(String), or adds the footage item with than name as a layer
            var footageItem = findFootage(footageName);
            if ((!(comp instanceof CompItem))|footageItem == null) {return null;}
            var footageLayer = findLayer(comp, footageName);
            if (footageLayer != null) {return footageLayer};
            footageLayer = comp.layers.add(footageItem);
            return footageLayer;
            }
        function findAddCompLayer(comp, footageName){//Returns  null in error/ the layer with the name of footageName(String) with _preComp, or just the footageName if no precomp is found
            var footageItem = findCompFootage(footageName);
            if ((!(comp instanceof CompItem))|footageItem == null) {return null;}
            var footageLayer = findLayer(comp, footageName+"_preComp");
            if (footageLayer != null) {return footageLayer};
            footageLayer = findLayer(comp, footageName);
            if (footageLayer != null) {return footageLayer};
            footageLayer = comp.layers.add(footageItem);
            return footageLayer;
            }
        function checkLayerFunction(comp, layers, layersNeeded, funct, args){//in comp, what layers are we looking for to check, do those layers need to be there or need to not be there(bool), what function and what arguments for that function(Array); Ex: checkLayerFunction(comp, ["Fade In", "Fade Out"], false,addFadeBlack, [comp]);
             if (!(comp instanceof CompItem)) {return null;}
             var layerList = new Array;
             for (var i = 0; i< layers.length; i++){
                 layerList.push(findLayer(comp,layers[i]));
                 }
            var nullCheck = false;
            for (var i = 0; i< layerList.length; i++){
                if (layerList[i] == null){nullCheck = true;}
                }
            if (nullCheck == layersNeeded){return null;}
            if (nullCheck != layersNeeded){
                if (Array.isArray(args)){return funct.apply(null,args);}
                return funct();
                }
            return null;
            }
        function stillToPSDComp(item){//Return null in error/ the imported Psd Comp
            var itemPreCompName =  String(item.name).slice(0,-4)+"_preComp";
            if (findComp(itemPreCompName) != null){return findComp(itemPreCompName);}
            var psd = checkPSDExists(item);
            if (psd == null){return null;}
            //var psdLocation = String(item.file).slice(0,-3)+"psd";
            psdIO = new ImportOptions(psd);
            if (psdIO.canImportAs(ImportAsType.COMP)){
                psdIO.importAs = ImportAsType.COMP;
                var oldFolder = findItemWithType(item.name.slice(0,-4) + " Layers", FolderItem);
                if (oldFolder != null){oldFolder.remove();}
                var psdImport = app.project.importFile(psdIO);
                psdImport.parentFolder = findAddFolder ("TemplatePreComps", "04_TemplatePieces");
                var psdImportFolder = findAddFolder (psdImport.name + " Layers");
                psdImportFolder.parentFolder = findAddFolder ("TemplateReferences", "04_TemplatePieces");
                psdImport.name = itemPreCompName;
                return psdImport;
                }
            return null;
        }
        function checkPSDExists(item){//Returns null in error / psd file; requires a footage item; looks to return a psd file of the provided footage name, in the same folder or in a subfolder "_EditedPSDs" if AE can write files/folders
            if (item.duration != 0) {return null}
            //var oldComp = findComp(item.name.slice(0,-4));
            if((item.duration != 0)|(findComp(item.name.slice(0,-4))) != null){return null;}
            //var otherFolderItem = item.file.path + "/EditedPSDs/" + item.file.name.slice(0,-3)+"psd";
            var psdLocation = String(item.file).slice(0,-3)+"psd";
            var psd = new File (psdLocation);
            if (psd.exists){return psd;}
            var writeCheck = canWriteFiles();
            if(writeCheck){
            var otherFolder = new Folder (item.file.path + "/_EditedPSDs/");
                if (!(otherFolder.exists)){otherFolder.create();}
                psdLocation = String(otherFolder)+"/"+ item.file.name.slice(0,-3)+"psd";
                psd = new File (psdLocation);
                if (psd.exists){return psd;}
                }
            return null;
        }
        function addParalaxComp(comp){//Returns null in error, reqires a comp, looks for layers "FG" and "BG", sets hard coded scaling to those 2 layers and adds a blur
            if (!(comp instanceof CompItem)) {return null;}
            var fgLayer = null, bgLayer = null;
            for (var i = 1; i<= comp.numLayers; i++){
                if (comp.layers[i].name == "FG"){fgLayer = comp.layers[i];}
                if (comp.layers[i].name == "BG"){bgLayer = comp.layers[i];}
                }
            if (fgLayer == null | bgLayer == null){return null;}
            if (fgLayer != null && bgLayer != null){
                fgLayer.property("Scale").setValueAtTime(0, [100,100]);
                fgLayer.property("Scale").setValueAtTime(5, [110,110]);
                bgLayer.property("Scale").setValueAtTime(0, [100,100]);
                bgLayer.property("Scale").setValueAtTime(5, [105,105]);
                bgLayer.Effects.addProperty("S_Blur");
                }
            //alertTest ();
            //if (!(item instanceof FootageItem)) { continue;}
        }
        function addFadeBlack(comp){//Returns null in error, Default comp:ActiveItem; creates 2 shapes comp sizes with fades and eases
            var comp = ((comp != undefined)|(comp != null)) ? comp : app.project.activeItem;  if (!(comp instanceof CompItem)){return null;}
             var fades = [];
             for (i = 0; i<2; i++){
                 //alertTest();
                 var shapeLayer = comp.layers.addShape();
                 //shapeLayer.name = "Fade";
                 var shapeBounds = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
                 shapeBounds.property("ADBE Vector Rect Size").setValue([comp.width,comp.height]);
                 var fill = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
                 fill.property("ADBE Vector Fill Color").setValue([0,0,0,1]);
                 fades.push(shapeLayer);
                 }
             //alertTest(fades)
             fades[0].name = "Fade In";
             fades[1].name = "Fade Out";
             fades[0].outPoint = 11/24;
             fades[1].inPoint = comp.duration - 11/24;
             var opacity0 = fades[0].property("Transform").property("Opacity");
             var opacity1 = fades[1].property("Transform").property("Opacity");
             opacity0.setValueAtTime(0,100);
             opacity0.setValueAtTime((10/24),0);
             opacity1.setValueAtTime(comp.duration-(1/24),100);
             opacity1.setValueAtTime(comp.duration - (11/24),0);
             var easeLow = new KeyframeEase(0, 0.1);
             var easeHigh = new KeyframeEase(0, 80);
             opacity0.setTemporalEaseAtKey(1, [easeLow], [easeHigh]);
             opacity0.setTemporalEaseAtKey(2, [easeHigh], [easeLow]);
             opacity1.setTemporalEaseAtKey(1, [easeLow], [easeHigh]);
             opacity1.setTemporalEaseAtKey(2, [easeHigh], [easeLow]);
    }
        function findAddBannerArea(comp){//Returns null in Error / new or current layer named BannerMatteLayer
            var comp = ((comp != undefined)|(comp != null)) ? comp : app.project.activeItem; if (!(comp instanceof CompItem)){return null;}
            var matteLayer = findLayer(comp, "BannerMatteLayer");
            if (matteLayer != null) {return matteLayer;}
            var bannerHeightRatio = 240/1080;
            var bannerWidth = Math.floor(comp.width);
            var bannerHeight = Math.floor(comp.height * bannerHeightRatio);
            var blurLayer = createRectangleShapeLayer(comp, comp.width, comp.height, [1,1,1,1]);
            blurLayer.name = "BannerBlurLayer";
            blurLayer.adjustmentLayer = true;
            var blurEffect = blurLayer.Effects.addProperty("S_Blur");
            //blurEffect.property("Blur Amount").setValue(30);
            var colorLayer = createRectangleShapeLayer(comp, comp.width, comp.height, [0,0,0,1]);
            colorLayer.name = "BannerColorLayer";
            colorLayer.property("Opacity").setValue(20);
            var matteLayer = createRectangleShapeLayer(comp, bannerWidth, bannerHeight, [1,1,1,1]);
            matteLayer.name = "BannerMatteLayer";
            blurLayer.setTrackMatte(matteLayer, TrackMatteType.ALPHA);
            colorLayer.setTrackMatte(matteLayer, TrackMatteType.ALPHA);
            var bannerPosHeight = Math.floor(comp.height-(bannerHeight*.5) - (comp.height*.08));
            var bannerPosWidth = Math.floor(comp.width/2);
            matteLayer.property("Position").setValue([bannerPosWidth,bannerPosHeight]);
            return matteLayer;
            }
        function createRectangleShapeLayer (comp, width, height, fillCollor) {//Returns null in Error / new Shape Layer, Default Comp:Active Item, Color:[1,1,1,1]; need Width, Height, Color Array[1,1,1,1]
            var comp = ((comp != undefined)|(comp != null)) ? comp : app.project.activeItem;if (!(comp instanceof CompItem)){return null;}
            var fillCollor = ((fillCollor != undefined)|(fillCollor != null)) ? fillCollor : [1,1,1,1];
            var shapeLayer = comp.layers.addShape();
            var shapeBounds = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
            shapeBounds.property("ADBE Vector Rect Size").setValue([width,height]);
            var fill = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
            fill.property("ADBE Vector Fill Color").setValue(fillCollor);
            return shapeLayer;
            }
        function addFindTextFromCSVs(comp, textArray, nameArray, fontArray){//Returns null in error, Default Comp:Current; adds text layer per array item in CSV files that is not already present in name
            var comp = ((comp != undefined)|(comp != null)) ? comp : app.project.activeItem; if ((comp == undefined)|(comp == null)|(!(comp instanceof CompItem))){return null;}
            var arrayLine = null;
            var arrayIteration = null;
            for (var i = 1; i<=nameArray.length-1; i++){
                if (nameArray[i][0] == comp.name){arrayIteration = i; arrayLine = nameArray[i]; break;}
                }
            if (arrayLine == null){return null;}
            //var newLayer = addFindTextLayer(comp, textArray[arrayIteration][3], nameArray[arrayIteration][3], fontArray);
            for (i = 1; i<=arrayLine.length-1; i++){
                if (findLayer(comp, arrayLine[i]) != null){continue;}
                var newLayer = addFindTextLayer(comp, textArray[arrayIteration][i], nameArray[arrayIteration][i], fontArray);
                //alertTest (newLayer.name);
                }
            }
        function addFindTextLayer(comp, layerText, layerName, fontArray){//Return null in Error / the new text layer; dafaults comp:activeItem or return null, arrays called from parsed CSVs
            var comp = ((comp != undefined)|(comp != null)) ? comp : app.project.activeItem;
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
        resizeTextLayer(newTextLayer, null,0, false);
        var dropShadow = newTextLayer.Effects.addProperty("S_DropShadow");
        dropShadow.property("Shift X").setValue(0); dropShadow.property("Shift Y").setValue(0); 
        dropShadow.property("Shadow Opacity").setValue(0.5); dropShadow.property("Shadow Blur").setValue(50);
        return newTextLayer;
        }
        function resizeTextLayer (textLayer, targetWidth, timeRef, growBool){//Returns null in error / size object of the text layer after resizing; with provided text layer, and desired width (default 85%), time Ref of size (default 0), and if you want it to grow(dafault no)
            var targetWidth = ((targetWidth != undefined)|(targetWidth != null)) ? targetWidth : textLayer.containingComp.width*.85; if ((targetWidth == undefined)|(targetWidth == null)){return null;}
            var timeRef = ((timeRef != undefined)|(timeRef != null)) ? timeRef : 0;
            var growBool = ((growBool != undefined)|(growBool != null)) ? growBool : false;
            var textLayerProp = textLayer.property("Source Text");
            var textLayerDoc = textLayerProp.value;
            if (textLayer.sourceRectAtTime(timeRef, false).width < targetWidth && growBool){
            while (textLayer.sourceRectAtTime(timeRef, false).width < targetWidth){
                textLayerDoc.fontSize = textLayerDoc.fontSize +1;
                textLayerProp.setValue(textLayerDoc);
                }
            }
            if (textLayer.sourceRectAtTime(timeRef, false).width > targetWidth){
            while (textLayer.sourceRectAtTime(timeRef, false).width > targetWidth){
                textLayerDoc.fontSize = textLayerDoc.fontSize -1;
                textLayerProp.setValue(textLayerDoc);
                }
            }
            return layerScreenSize(textLayer);
        }
        function addFindDefaultGraphics(comp, transitionTime){//Returns Null in Error, Positions Layer and QR Code, defines the Gap in between, places "Website", "Phone Number", hides "QR Code Text" after adding it to other comp, staggers and places all other text layers
            var comp = ((comp != undefined)|(comp != null)) ? comp : app.project.activeItem;
            var bannerLayer = findLayer(comp, "BannerMatteLayer");
            var logoFootage = findFootage("Logo");
            var logoLayer = findAddLogo(comp, bannerLayer);
            var qrCodeLayer = findAddQR(comp, bannerLayer, ["QRCode_preComp", 250, 280, 60, 24]);
            if (qrCodeLayer != null) {
                var qrTextLayer = findLayer(comp, "QR Code Text");
                if (qrTextLayer != null){qrTextLayer.enabled = false;}
                }
            var logoLayerSize = layerScreenSize(logoLayer);
            var qrLayerSize = layerScreenSize(qrCodeLayer);
            var bannerLayerSize = layerScreenSize(bannerLayer);
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
                var websiteTextLayerSize = resizeTextLayer (websiteTextLayer, gapSpace.halfWidth-bannerSpacing, 0, false);
                websiteTextLayer.property("Anchor Point").setValue([websiteTextLayerSize.halfWidth + websiteTextLayerSize.left, websiteTextLayerSize.halfHeight + websiteTextLayerSize.top,0]);
                websiteTextLayer.property("Position").setValue([gapSpace.positionX - gapSpace.halfWidth + websiteTextLayerSize.halfWidth, gapSpace.positionY + (gapSpace.height*.2)  ,0]);
                setTextFontSize(phoneTextLayer, websiteTextLayer.property("Source Text").value.fontSize)
                var phoneTextLayerSize = layerScreenSize(phoneTextLayer);
                phoneTextLayer.property("Anchor Point").setValue([phoneTextLayerSize.halfWidth + phoneTextLayerSize.left, phoneTextLayerSize.halfHeight + phoneTextLayerSize.top,0]);
                phoneTextLayer.property("Position").setValue([gapSpace.positionX + gapSpace.halfWidth - phoneTextLayerSize.halfWidth, websiteTextLayer.property("Position").value[1],0]);
            }else if (websiteTextLayer != null){
                var websiteTextLayerSize = resizeTextLayer (websiteTextLayer, gapSpace.halfWidth, 0, false);
                websiteTextLayer.property("Anchor Point").setValue([websiteTextLayerSize.halfWidth + websiteTextLayerSize.left, websiteTextLayerSize.halfHeight + websiteTextLayerSize.top,0]);
                websiteTextLayer.property("Position").setValue([gapSpace.positionX, gapSpace.positionY + (gapSpace.height*.2),0]);
            }else if (phoneTextLayer != null){
                var phoneTextLayerSize = resizeTextLayer (phoneTextLayer, gapSpace.halfWidth, 0, false);
                phoneTextLayer.property("Anchor Point").setValue([phoneTextLayerSize.halfWidth + phoneTextLayerSize.left, phoneTextLayerSize.halfHeight + phoneTextLayerSize.top,0]);
                phoneTextLayer.property("Position").setValue([gapSpace.positionX, gapSpace.positionY + (gapSpace.height*.2),0]);
            }
            var otherCopy = findTextLayers(comp);
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
        function findAddLogo(comp, bannerLayer){//Returns Null / Logo Layer; Looks for Footage named "Logo", if no current Logo add Logo at around 220 pixel Height/Width, dafault smaller
            var logoFootage = findFootage("Logo");
            if (logoFootage != null){
                var logoLayer = findLayer(comp, logoFootage.name);
                if (logoLayer!= null){return logoLayer;}
                logoLayer = findAddLayer(comp, logoFootage.name);
                if (logoLayer!=null){
                    var compWidthRatio = 220/logoLayer.width;
                    var compHeightRatio = 220/logoLayer.height;
                    var logoLayerScale = Math.floor((compWidthRatio > compHeightRatio) ? (compWidthRatio*100) : (compHeightRatio*100));
                    logoLayer.property("Scale").setValue([logoLayerScale, logoLayerScale]);
                    if (bannerLayer != null){
                        var logoSize = resizeRectangle(logoLayer.sourceRectAtTime(0, false), logoLayerScale*.01);
                        logoLayer.property("Position").setValue([(comp.width*.075)+(logoSize.width*.5), bannerLayer.property("Position").value[1], 0]);
                        return logoLayer;
                        }
                    return logoLayer;
                    }
                }
            return null;
            }
        function multiplyArray(array, amount){//Returns Array, takes every array item that is !Nan, and multiplies it by amount
            for (var i = 0; i<= array.length; i++){
                if (!isNaN(array[i])){array[i] = array[i] * amount}
                }
            return array;
            }
        function resizeRectangle(rectangle, amount){//Returns Rectangle Object, changes  rectangle.height, rectangle.width, rectangle.top, rectangle.left, Multiplies by Amount
            rectangle.height = rectangle.height * amount;
            rectangle.width = rectangle.width * amount;
            rectangle.top = rectangle.top * amount;
            rectangle.left = rectangle.left * amount;
            return rectangle;
            }
        function findAddQR(comp, bannerLayer, qrCodeCompArray){//Returns Null/ current QR Layer/new QR Layer that is a Comp; define what comp its being added to, the layer that positions QR, and Array [Name(String), Width(250), Height(280), Length(60), FPS(24)]
            var qrFootage = findCompFootage("QRCode");
            if (qrFootage != null){
                var qrLayer = findLayer(comp, qrFootage.name);
                if (qrLayer!= null){return qrLayer;}
                var qrComp;
                if (qrFootage instanceof CompItem){qrComp = qrFootage;}
                if (qrFootage instanceof FootageItem){
                    qrComp = findAddComp(qrCodeCompArray);
                    qrComp.parentFolder = findAddFolder("TemplatePreComps", "04_TemplatePieces");
                    var shapeLayer = qrComp.layers.addShape();
                    var shapeBounds = shapeLayer.property("Rectangle Path 1");
                    if (shapeBounds == null){
                        shapeBounds = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
                        }
                    shapeBounds.property("ADBE Vector Rect Size").setValue([qrComp.width,qrComp.height]);
                    shapeBounds.property("ADBE Vector Rect Roundness").setValue(20);
                    var fill = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
                    fill.property("ADBE Vector Fill Color").setValue([1,1,1,1]);
                    shapeLayer.name = "QR Backing";
                    
                    qrLayer = qrComp.layers.add(qrFootage);
                    resizeLayerToSize (qrLayer, 90, true, false);
                    var qrScale = qrLayer.property("Scale").value[0];
                    var qrLayerSize = resizeRectangle(qrLayer.sourceRectAtTime(0, false), qrLayer.property("Scale").value[0]*.01);
                    qrLayer.property("Position").setValue([qrComp.width*.5, ((qrLayerSize.height*.5)+(qrComp.height*.015))]);
                    
                    var compQRText = findLayer(comp, "QR Code Text");
                    if (compQRText != null){
                        var compQRTextProp = compQRText.property("Source Text");
                        var compQRTextDoc = compQRTextProp.value;
                        var qrText = qrComp.layers.addText();
                        var qrTextProp = qrText.property("Source Text");
                        var qrTextDoc = compQRText.property("Source Text").value;
                        qrTextDoc.fillColor = [0,0,0];
                        qrText.property("Source Text").setValue(qrTextDoc);
                        qrText.name = "QR Code Text";
                        resizeTextLayer (qrText, qrComp.width*.9, 0, true);
                        var qrTextSize = qrText.sourceRectAtTime(0, false);
                        qrText.property("Position").setValue([qrComp.width*.5, (qrComp.height-(qrTextSize.height*.0)-(qrComp.height*.02))]);
                        compQRText.enabled = false;
                        }
                    
                    }
                
                var qrCompLayer = findAddCompLayer(comp, qrComp.name);
                if (qrCompLayer!=null && bannerLayer != null){
                    qrCompLayer.property("Position").setValue([comp.width - (comp.width*.075)-(qrCompLayer.width*.5), bannerLayer.property("Position").value[1]-(qrCompLayer.height*.05), 0]);
                    }
                return qrCompLayer;
                }
        return null;
        }
        function resizeLayerToSize(layer, percentOfComp, widthBool, heightBool){//Returns True if completed; takes layer and percent of Comp, widthBool and heightBool are optional, determining which dimenstion has priority, defaulting to the smaller of the 2
            var widthBool = ((widthBool != undefined)|(widthBool != null)) ? widthBool : false;
            var heightBool = ((heightBool != undefined)|(heightBool != null)) ? heightBool : false;
            var comp = layer.containingComp;
            var compWidthRatio = comp.width/layer.width;
            var compHeightRatio = comp.height/layer.height;
            var newLayerScale = Math.ceil((compWidthRatio > compHeightRatio) ? (compWidthRatio*(percentOfComp)) : (compHeightRatio*(percentOfComp)));
            if (widthBool){newLayerScale = Math.ceil((compWidthRatio*(percentOfComp)))};
            if (heightBool){newLayerScale = Math.ceil(compHeightRatio*(percentOfComp))};
            layer.property("Scale").setValue([newLayerScale, newLayerScale]);
            return true;
            }
        function layerScreenSize(layer){//Returns an Object with Height, Width, Top, Left, halfHeight, halfWidth. positionX, positionY; From given Layer (AVLayer, CompItem, ShapeLayer, Text), Returns Null if not the correct layer type
            if (layer == null){return null;}
            //var instanceTest = !((layer instanceof AVLayer)|(layer instanceof CompItem));
            if (!((layer instanceof AVLayer)|(layer instanceof CompItem)|(layer instanceof ShapeLayer)|(layer instanceof TextLayer))){return null;}
            //if(!((layer instanceof FootageItem)|(layer instanceof TextLayer)|(layer instanceof CompItem)|(layer instanceof AVLayer))){return null;}
            var sizeRect;
            if((layer instanceof FootageItem)|(layer instanceof TextLayer)|(layer instanceof AVLayer)|(layer instanceof ShapeLayer)){
                sizeRect = resizeRectangle(layer.sourceRectAtTime(0, false), layer.property("Scale").value[0]*.01);
                }
            if(layer instanceof CompItem){
                sizeRect = {
                    "width": layer.width,
                    "height": layer.height,
                    "top": 0,//Not sure what to calculate for a comp
                    "left": 0
                    }
                resizeRectangle(sizeRect, layer.property("Scale").value[0]*.01)
                }
            if (sizeRect.width !=null) {sizeRect.halfWidth = sizeRect.width*.5; }
            if (sizeRect.height !=null) {sizeRect.halfHeight = sizeRect.height*.5; }
            sizeRect.positionX = layer.property("Position").value[0];
            sizeRect.positionY = layer.property("Position").value[1];
            return sizeRect;
            }
        function setTextFontSize(textLayer, fontSize){//Returns True/Null if the layer is a text layer, setting the layers font size
            if (!(textLayer instanceof TextLayer)){return null;}
            var textLayerProp = textLayer.property("Source Text");
            var textLayerDoc = textLayerProp.value;
            textLayerDoc.fontSize = fontSize;
            textLayerProp.setValue(textLayerDoc);
            return true;
            }
        function addTextAnimLayer(layer, timeStart, timeDuration, easeType){//Returns the layers text anim property; Adds text animation, to the layer at the provided time and duration, with the ease type provided by the call (String: "Ramp Up", "Ramp Down", "Smooth") 
            var newAnim = layer.Text.Animators.addProperty("ADBE Text Animator");//Add Animator
            var newAnimSelector = newAnim.property("ADBE Text Selectors").addProperty("ADBE Text Selector");//Add standard range selector
            var easeShapeIndex=2;//Make Variable and Set Default for shape index
            var easeMinVal=75;//Make Variable and Set Default for the Ease low
            var easeMaxVal=-75;//Make Variable and Set Default for the ease high
            //var keyframeTimes = new Array((currentTime-1), (currentTime+1));//Make Variable and Set Default for the offset keyframes
            var keyframeTimes= [timeStart, timeStart + timeDuration];
            var keyframeValues = new Array(-100, 100);//Make Variable and Set Default for the offset values
            if(easeType=="Ramp Up"){//Customize variable per button push
                    easeShapeIndex=3;
                    easeMinVal=75;
                    easeMaxVal=-75;
                    //keyframeTimes = [timeStart, timeDuration];
                }else if(easeType=="Ramp Down"){
                    easeShapeIndex=2;
                    easeMinVal=75;
                    easeMaxVal=-75;
                    //keyframeTimes = [(currentTime), (currentTime+1)]
                }else if(easeType=="Smooth"){
                    easeShapeIndex=6;
                    easeMinVal=0;
                    easeMaxVal=0;
                    //keyframeTimes = [(currentTime), (currentTime+1)]
                }else{
                    alert("Shape request not detected");//should never be called without one of the 3 button types
                }
            newAnimSelector.property("ADBE Text Range Advanced").property("ADBE Text Levels Min Ease").setValue(easeMinVal);//set layer ease low
            newAnimSelector.property("ADBE Text Range Advanced").property("ADBE Text Levels Max Ease").setValue(easeMaxVal);//set layer ease high
            newAnimSelector.property("ADBE Text Range Advanced").property("ADBE Text Range Shape").setValue(easeShapeIndex);//set layer ease type
            for (var i=0;i<keyframeTimes.length;i++){//set offset keys
                newAnimSelector.property("ADBE Text Percent Offset").setValueAtTime(keyframeTimes[i],keyframeValues[i]);
            }
            return newAnim;
        }
        {//Parsing CSV sourced from IdGoodies on github found here: https://github.com/indiscripts/IdGoodies/blob/master/snip/FileParseCSV.jsx

/*******************************************************************************

		Name:           FileParseCSV [draft]
		Desc:           Parse a CSV file or stream.
		Path:           /snip/FileParseCSV.jsx
		Encoding:       ÛȚF8
		Compatibility:  ExtendScript (all versions) [Mac/Win]
		L10N:           ---
		Kind:           Function
		API:            ---
		DOM-access:     NO
		Todo:           ---
		Created:        230519 (YYMMDD)
		Modified:       230519 (YYMMDD)

*******************************************************************************/

	//==========================================================================
	// PURPOSE
	//==========================================================================
	
	/*
	
	A simple CSV parser. Supports comma-separated data of various forms including
	items enclosed in double quotes, e.g "xxx, yyy". Escape sequences like `""`,
	`\"`, etc, are parsed as well.
	
	Example with three columns:

	    itemA1,itemB1,itemC1
	    itemA2,,itemC2
	    "itemA3,etc","item""B3","item\"C3"
	    "item,A4","item\,B4",itemC4
	
	The function `parseCSV` takes a File (or the full CSV content as a string)
	and returns an array of rows. By default, each row is an array of strings,
	e.g `["itemA1", "itemB1", "itemC1"]`. Set the `header` argument to TRUE to
	get every row parsed as an object (based on the labels of the first row).
	
	Sample code:
	
	    var uri = "C:/Documents/test.csv";
	    var data = parseCSV( new File(uri) );
	    alert( data.join('\r') );

	[REF] community.adobe.com/t5/indesign/
	      what-s-the-least-inelegant-way-to-ingest-csv-w-js/td-p/13799042

	*/

	;function parseCSV(/*str|File*/input,/*bool=0*/header,  r,i,s,a,m,n,o,j)
	//----------------------------------
	// Pass in a string or a `File(path/to/file.csv)` argument.
	// If `header` is truthy, parses the 1st line as providing field names
	// and returns an array of objects {<name1>:<val1>, <name2>:<val2>, ...}
	// Otherwise, returns an array of arrays. If no data can be found,
	// returns an empty array.
	// => str[][]  |  obj[]
	{
		// Input.
		if( !input ) return [];
		if( input instanceof File )
		{
			if( !(input.exists && input.length) ) return [];
			input = input.open('r','UTF8') && [input.read(),input.close()][0];
		}
		if( !('string' == typeof input && input.length) ) return [];

		// Get lines.
		r = input.split(/(?:\r\n|\r|\n)/g);

		// Get fields.
		const reFld = /(,|^)(?:"((?:\\.|""|[^\\"])*)"|([^,"]*))/g;  // $1 :: `,`|undef  ;  $2 :: `<in-quotes>`|undef  ;  $3 :: `<simple>`|undef
		const reEsc = /[\\"](.)/g;                                  // $1 :: `<esc>`
		for( i=r.length ; i-- ; a.length ? (r[i]=a) : r.splice(i,1) )
		{
			s = r[i];
			if( -1 == s.indexOf('"') )
			{
				a = s.length ? s.split(',') : [];
				continue;
			}

			for
			(
				a = 0x2C==s.charCodeAt(0) ? [""] : [] ;
				m=reFld.exec(s) ;
				a[a.length] = 'undefined' != typeof m[2] ? m[2].replace(reEsc,'$1') : m[3]
			);
		}
		if( !header ) return r;

		// Header -> convert rows to objects.
		m = r.shift();
		n = m.length;
		for( i=-1 ; ++i < r.length ; r[i]=o )
		for( o={}, a=r[i], j=-1 ; ++j < n ; o[m[j]]=a[j]||'' );
		return r;
            }
        }
        function csvNameToArray(fileName){//Returns an Array of the contents in the footage from the footage found with the fileName(String) name 
            return parseCSV(findFootage(fileName).file);
            }
        function reflectAll(reflectable){//Returns nothing; this is a debugging function that lists all information about a given element, and is a great break point to analyze in Extendscript
        alert(reflectable.reflect.name);   
        alert(reflectable.reflect.properties);
        alert(reflectable.reflect.methods);
        }
        function alertTest(message){//Returns nothing; displays alert with message(String) 
            message = (message !== undefined) ? message : "Ping";
            alert(message);
        }
        function canWriteFiles() {// Returns True or false; Script found online https://community.adobe.com/t5/after-effects-discussions/how-can-i-check-whether-if-quot-allow-scripts-to-write-files-and-access-network-quot-is-enable-using/m-p/10869640
            var appVersion, commandID, scriptName, tabName;
            appVersion = parseFloat(app.version);
            commandID = 2359;
            tabName = 'General';
            if (appVersion >= 16.1) {
                commandID = 3131;
                tabName = 'Scripting & Expressions';
            }

            if (isSecurityPrefSet()) return true;
            /*        
            scriptName = (script && script.name) ? script.name : 'Script';
            alert(message = scriptName + ' requires access to write files.\n' +
                'Go to the "' + tabName + '" panel of the application preferences and make sure ' +
                '"Allow Scripts to Write Files and Access Network" is checked.');

            app.executeCommand(commandID);
            */

            //return isSecurityPrefSet();
            return false;

            function isSecurityPrefSet() {
                return app.preferences.getPrefAsLong(
                    'Main Pref Section',
                    'Pref_SCRIPTING_FILE_NETWORK_SECURITY'
                ) === 1;
            }
        }
    }//End of Functions
}