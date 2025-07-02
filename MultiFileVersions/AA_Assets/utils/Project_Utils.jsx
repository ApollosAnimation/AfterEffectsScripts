$.global.AA_Scripts.ProjectUtils = {};
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;

ProjectUtils.findItemWithType =function (itemName, itemType){//Returns null in Error or the first item in the project with the name itemName and the single itemType
    var items = app.project.items;
    for(i=1; i<items.length+1; i++){
            if(items[i] instanceof itemType && items[i].name == itemName){
                return items[i];
            }
        }
        return null;
}
ProjectUtils.findAddFolder =function (folderName, parentFolderName){//Returns null if no folder found, or folder in project; if no folder with that name is found, create a folder and set its parent; Default parentFolderName: null
    var items = app.project.items;
    var folder = null;
    for(i=1; i<items.length+1; i++){
        if (items[i].name == folderName){folder = items[i];}
            }
    if (folder == null){folder = app.project.items.addFolder(folderName);}
    parentFolderName= (parentFolderName != undefined) ? parentFolderName : null;
    if (parentFolderName != null){folder.parentFolder = this.findAddFolder(parentFolderName);}
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
ProjectUtils.findFootage = function (footageName){//Returns null in Error / the first item in the project with the name footageName that is an instanceof FootageItem
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