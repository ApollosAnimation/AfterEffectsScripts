var includedFiles = ["../utils/Project_Utils.jsx"]
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
$.global.AA_Scripts.CompUtils = {};
var CompUtils = $.global.AA_Scripts.CompUtils;

CompUtils.staggerLayers = function (staggerType, distributeTransition){
        app.beginUndoGroup("Stagger Layer");
        var theComp = app.project.activeItem;
        var selLayers = theComp.selectedLayers;
        for (i=0; i<=selLayers.length; i++){
                if(isValid(selLayers[i])== false){
                }else{
                    switch(staggerType){
                    case 0:
                        var layerLength = ((theComp.duration)/(selLayers.length));
                        selLayers[i].startTime = ((layerLength)*[i]);
                        selLayers[i].outPoint = ((layerLength)+selLayers[i].startTime);
                        break;
                    case 1:
                        var layerLength = ((theComp.workAreaDuration)/(selLayers.length));
                        selLayers[i].startTime = ((layerLength*[i])+(theComp.workAreaStart));
                        selLayers[i].outPoint = ((layerLength)+selLayers[i].startTime);
                        break;
                    case 2:
                        selLayers[i].startTime = ((theComp.workAreaStart));
                        selLayers[i].outPoint = ((theComp.workAreaStart)+(theComp.workAreaDuration));
                        break;
                    default:
                    alert("Unrecognized Command");
                    break

                    }
					if (distributeTransition == true){
						var outPoint = selLayers[i].outPoint ;
						var opacity = selLayers[i].property("Transform").property("Opacity");
						while (opacity.numKeys > 0){
							opacity.removeKey(1);
							}
						opacity.setValueAtTime(outPoint,100);
						opacity.setValueAtTime(outPoint+(10/24),0);
						var easeLow = new KeyframeEase(0, 0.1);
						var easeHigh = new KeyframeEase(0, 80);
						opacity.setTemporalEaseAtKey(1, [easeLow], [easeHigh]);
						opacity.setTemporalEaseAtKey(2, [easeHigh], [easeLow]);
						selLayers[i].outPoint += (10/24);
					}
                }
        }
    app.endUndoGroup();
    }
/*
CompUtils.testLayerTiming = function (){
        var theComp = app.project.activeItem;
        var selLayers = theComp.selectedLayers;

        alert("Layer outPoint of first layer: " + selLayers[0].outPoint);
        alert("Layer startTime of layer 2: " + selLayers[1].startTime);
        alert("Layer inPointof layer 2: " + selLayers[1].inPoint);
        calcTime = (selLayers[0].outPoint + (selLayers[1].startTime - selLayers[1].inPoint));
        alert("Calculated result time: " + calcTime)
    }

CompUtils.distributeLayers = function (){
        var theComp = app.project.activeItem;
        var selLayers = theComp.selectedLayers;
        app.beginUndoGroup("DistributeLayers");
        for (i=1; i<=selLayers.length; i++){
            selLayers[i].startTime = (selLayers[i-1].outPoint + (selLayers[i].startTime - selLayers[i].inPoint));;
        }
        app.endUndoGroup();
    }
    */
CompUtils.addParalaxComp = function (comp){//Returns null in error, reqires a comp, looks for layers "FG" and "BG", sets hard coded scaling to those 2 layers and adds a blur
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
        fgLayer.property("Scale").expression = 'loopOut("continue");';
        bgLayer.property("Scale").expression = 'loopOut("continue");';
        if(!(bgLayer.Effects.hasOwnProperty("S_Blur"))){
            bgLayer.Effects.addProperty("S_Blur");
            }
    }
}
CompUtils.checkForNewPSDs = function (compArray, fixExpressions){//Return null in error, Default fixExpressions:False compArray:[app.project.activeItem], takes an array of comps, finds layers of stills, trys finding replacement _precomps or PSDs
    var fixExpressions = ((fixExpressions !== undefined)&&(fixExpressions !== null)) ? fixExpressions : false;
    var compArray = ProjectUtils.verifyInstanceOfArray(compArray, CompItem, [app.project.activeItem]);
    if(compArray == null){return null;}
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
CompUtils.checkLayerFunction = function (comp, layers, layersNeeded, funct, args){//in comp, what layers are we looking for to check, do those layers need to be there or need to not be there(bool), what function and what arguments for that function(Array); Ex: checkLayerFunction(comp, ["Fade In", "Fade Out"], false,addFadeBlack, [comp]);
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
CompUtils.checkLayerNameUnique = function (comp, layerName){//Return True or False or Null, in comp, see if the string name is equal to any existing layer names
    var comp = (comp instanceof CompItem) ? comp : app.project.activeItem;
    if (!(comp instanceof CompItem)) {return null;}
    if (!(typeof layerName === 'string')){return null;}
    //$.writeln(typeof layerName === 'string');
    var layers = comp.layers;
    for (var i = 1; i<= layers.length; i++){
        if (layers[i].name == layerName){$.writeln(false); return false;}
        }
    $.writeln(true); return true;
    }