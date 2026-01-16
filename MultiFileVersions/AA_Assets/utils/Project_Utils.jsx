$.global.AA_Scripts.ProjectUtils = {};
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;

ProjectUtils.findItemWithType =function (itemName, itemType){//Returns null in Error or the first item in the project with the name itemName and the single itemType
    var items = app.project.items;
    for(i=1; i<items.length+1; i++){
        var item = items[i];
        var itemSearchedName = items[i].name;
            if(item instanceof itemType && itemSearchedName == itemName){
                return items[i];
            }
        }
        return null;
}
ProjectUtils.findFolder = function (folderName){
    var items = app.project.items;
    var folder = null;
    for(i=1; i<items.length+1; i++){
        if (items[i].name == folderName){folder = items[i];}
        }
    return folder;
    }

ProjectUtils.findAddFolder = function (folderName, parentFolder){//Returns null if no folder found, or folder in project; if no folder with that name is found, create a folder and set its parent; Default parentFolderName: null
    var folder = this.findFolder(folderName);
    if (folder == null){folder = app.project.items.addFolder(folderName);}
    parentFolder= (parentFolder != undefined) ? parentFolder : null;
    if (parentFolder != null){
        //$.writeln(parentFolder === "string");
        if (typeof parentFolder === "string") {
            //$.writeln(parentFolder);
            var parentFolder = this.findAddFolder(parentFolder, null);
            }
        if (parentFolder instanceof FolderItem) folder.parentFolder = parentFolder;
        }
    return folder;
    }
ProjectUtils.findComp = function (compName, folder){//Returns null in Error / the first item that is instanceof CompItem, and has the name of compName(String), Default folder:app.project
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
    return null;    
}
ProjectUtils.findAddComp = function (compDetails){//returns comp; comp details an array with [CompName, compWidth, compHeight, compDuration, compFrameRate]
        var comp = this.findComp(compDetails[0], null);
        if (comp == null){comp = app.project.items.addComp(compDetails[0],Number(compDetails[1]),Number(compDetails[2]),1,Number(compDetails[3]),Number(compDetails[4]));}
        return comp;
        } 
ProjectUtils.findComps = function (compNames, folder){
    if (!compNames) return null;
    var allComps = [];
    for (var i = 0; i <compNames.length;i++){
        var singleComp = this.findComp(compNames[i], folder)
        if (singleComp == null) return null;
        allComps.push(singleComp);
        }
    return allComps;
    }
ProjectUtils.isCompInArray = function (comp, compArray){
    if (typeof comp === "string") {
        //$.writeln(parentFolder);
        comp = this.findComp(comp, null);
        }
    //$.writeln("!comp : "+ !comp);
    //$.writeln("!compArray : " + !compArray);
    var compArrayInstance = this.verifyInstanceOf(comp, CompItem, null);
    var compArrayInstanceBool = (compArrayInstance instanceof CompItem);
    //$.writeln("this.verifyInstanceOf(comp, CompItem, null): " + !compArrayInstanceBool);
    if (!comp || !compArray || !compArrayInstanceBool) {return null;}
    var isCompInArrayBool = false;
    for (var i = 0; i <compArray.length;i++){
        if (comp == compArray[i]) {isCompInArrayBool = true};
        }
    return isCompInArrayBool;
    }
/*
ProjectUtils.findItemWithType = function (itemName, itemType){//Returns null in Error or the first item in the project with the name itemName and the single itemType
    var items = app.project.items;
    for (var i=1; i<items.length+1; i++){
        if(itemName && typeof itemName === "object" && itemName.constructor === Array){
                for (var j=0; j<itemName.length; j++){
                    if(items[i] instanceof itemType && items[i].name == itemName[j]){
                        return items[i];
                        }
                    }else{if(items[i] instanceof itemType && items[i].name == itemName){
                        return items[i];
                        }
                    }
        }
    return null;
    }
}
*/
ProjectUtils.findFootage = function (footageName){//Returns null in Error / the first item in the project with the name footageName that is an instanceof FootageItem
    return this.findItemWithType(footageName, FootageItem);
    }



ProjectUtils.findCompFootage = function (footageName){//Returns null in Error / the first item in the project with the name footageName with _precomp / the first item with the name; Looking for footage by name
    var searchItem = this.findItemWithType([footageName, footageName+"_preComp"], CompItem);
    if (searchItem == null){searchItem = this.findItemWithType(footageName, FootageItem);}
    return searchItem;
    }
ProjectUtils.verifyLayer = function (item){
    return this.verifyInstanceOfList(item, [AVLayer, ShapeLayer, TextLayer, CameraLayer, LightLayer]);
    }
ProjectUtils.verifyInstanceOfList = function (item, typeItems){
    var verifiedBool = false;
    for (i=0; i<typeItems.length; i++){
        if (item instanceof typeItems[i]){verifiedBool = true;}
        }
    return verifiedBool;
    }
ProjectUtils.verifyInstanceOf = function (item, typeItem, defaultReturn){
    if (item instanceof typeItem) return item;
    if (defaultReturn instanceof typeItem) return defaultReturn;
    return null;
    }
ProjectUtils.verifyInstanceOfCompActive = function(comp){
    return this.verifyInstanceOf(comp, CompItem, app.project.activeItem)
    }
ProjectUtils.verifyInstanceOfArray = function (items, typeItem, defaultReturn){
    if (defaultReturn == undefined) defaultReturn == null;
    if ((items == undefined)| (items == null)) return defaultReturn;
    if (!(this.arrayCheck(items))) return defaultReturn;
    if (items.length == 0) return defaultReturn;
    var consistentType = true;
    for (var i = 0; i<items.length; i++){
        if (!(items[i] instanceof typeItem)){consistentType = false}
        }
    if (consistentType) return items;
    if (defaultReturn == null) return null;
    if (this.verifyInstanceOfArray(defaultReturn, typeItem, null) != null) return defaultReturn;
    return null;
    }

ProjectUtils.arrayCheck = function(item){
    return item && item.constructor === Array;
    }
ProjectUtils.importCSV = function(file, csvFolder, csvItemName){
    csvIO = new ImportOptions(file);
    if (!(csvIO.canImportAs(ImportAsType.FOOTAGE))) return null;
    csvIO.importAs = ImportAsType.FOOTAGE;
    var csvImport = app.project.importFile(csvIO);
    csvImport.parentFolder = csvFolder;
    csvImport.name = csvItemName;
    }
ProjectUtils.duplicateSelectedItems= function(duplicateValue, duplicateItems){
    app.beginUndoGroup("Duplicate Items");
    var duplicateItems = ((duplicateItems !== undefined)&&(duplicateItems !== null)) ? duplicateItems : app.project.selection;
    if (!duplicateItems){return null;}
    var newItems = [];
    for (var i = 0; i < duplicateItems.length; i++){
        newItems.push(this.duplicateItem(duplicateValue, duplicateItems[i]));
        }
    return newItems;
    app.endUndoGroup();
    }

ProjectUtils.duplicateItem= function(duplicateValue, duplicateItem){
    var duplicateItem = ((duplicateItem !== undefined)&&(duplicateItem !== null)) ? duplicateItem : app.project.activeItem;
    if (!duplicateItem){return null;}
    var newItems = [];
    for (i=0; i<duplicateValue; i++){
            newItems.push(duplicateItem.duplicate());
        }
    return newItems;
    }