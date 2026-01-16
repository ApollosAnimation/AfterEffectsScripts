var includedFiles = ["../utils/Project_Utils.jsx", "../utils/ExtendScript_Utils.jsx"]
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var ExtendScriptUtils = $.global.AA_Scripts.ExtendScriptUtils;
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
CompUtils.checkLastSuffixNumberedLayer = function (comp, prefix){
    var comp = (comp instanceof CompItem) ? comp : app.project.activeItem;
    if (!(comp instanceof CompItem)) {return null;}
    if (!(typeof prefix === 'string')){return null;}
    var numberedNameRegex = new RegExp ("^"+prefix+"(\\d*)$");
    var lastNumber = 0;
    for (var i=1; i<=comp.numLayers; i++){
        //$.writeln (comp.layer(i).name + " regex test :"+numberedNameRegex.test(comp.layer(i).name));
        var currentLayer = comp.layer(i);
        if(numberedNameRegex.test(comp.layer(i).name)){
            //$.writeln (comp.layer(i).name + " regex test :"+numberedNameRegex.test(comp.layer(i).name));
            //$.writeln ("regex test true");
            var currentLayerNumber = numberedNameRegex.exec(comp.layer(i).name);
            currentLayerNumber = parseInt (currentLayerNumber[1]);
            if (currentLayerNumber >lastNumber){lastNumber = currentLayerNumber;}
            }
        }
    return lastNumber;
    }
CompUtils.transferTransformGroupKeys = function (baseLayer, newLayer){
    //$.writeln("Checking if provided are layers");
    //$.writeln("base layer instanceof Layer check:" + ProjectUtils.verifyLayer(baseLayer));
    //if ((baseLayer instanceof Layer)&&())
    newLayer.inPoint = baseLayer.inPoint;
    newLayer.outPoint = baseLayer.outPoint;
    var properties = ["anchorPoint", "position", "scale", "rotation", "opacity"];
    if (baseLayer.threeDLayer){properties = ["anchorPoint", "position", "scale", "rotation", "opacity", "Orientation", "X Rotation", "Y Rotation"];}
    for (var i=0; i<properties.length; i++){
        this.transferProperty(baseLayer(properties[i]), newLayer(properties[i]));
        }
    }
CompUtils.transferProperty = function (baseProperty, newProperty){
    //$.writeln(baseProperty.name + " number of Keys: "+ baseProperty.numKeys);
    if(baseProperty.numKeys == 0){newProperty.setValue(baseProperty.value); return true;}
    var baseExpressionState = baseProperty.expressionEnabled;
    baseProperty.expressionEnabled = false;
    for (var i=1; i<= baseProperty.numKeys; i++){
        var newKeyframeIndex = newProperty.addKey(baseProperty.keyTime(i))
        newProperty.setValueAtKey(newKeyframeIndex, baseProperty.keyValue(i));
        if(baseProperty.keyTemporalAutoBezier(i)){newProperty.setTemporalAutoBezierAtKey(newKeyframeIndex, baseProperty.keyTemporalAutoBezier(i));}
        if(baseProperty.keyTemporalContinuous(i)){newProperty.setTemporalContinuousAtKey(newKeyframeIndex, baseProperty.keyTemporalContinuous(i));}
        if((baseProperty.propertyValueType ===PropertyValueType.TwoD_SPATIAL)||(baseProperty.propertyValueType ===PropertyValueType.ThreeD_SPATIAL)){
            if (baseProperty.keySpatialAutoBezier(i)){newProperty.setSpatialAutoBezierAtKey(newKeyframeIndex, baseProperty.keySpatialAutoBezier(i));}
            if(baseProperty.keySpatialContinuous(i)){newProperty.setSpatialContinuousAtKey(newKeyframeIndex, baseProperty.keySpatialContinuous(i));}
            newProperty.setSpatialTangentsAtKey(newKeyframeIndex, baseProperty.keyInSpatialTangent(i), baseProperty.keyOutSpatialTangent(i));
            }
        if (newProperty.isInterpolationTypeValid(baseProperty.keyInInterpolationType(i))){newProperty.setInterpolationTypeAtKey(newKeyframeIndex, baseProperty.keyInInterpolationType(i), baseProperty.keyOutInterpolationType(i));}
        var oldTempEaseIn = baseProperty.keyInTemporalEase(i)[0];
        var oldTempEaseOut = baseProperty.keyOutTemporalEase(i)[0];
        var newTempEaseIn = newProperty.keyInTemporalEase(newKeyframeIndex)[0];
        var newTempEaseOut = newProperty.keyOutTemporalEase(newKeyframeIndex)[0];
        if((baseProperty.keyInInterpolationType(i)!=KeyframeInterpolationType.LINEAR)||(baseProperty.keyOutInterpolationType(i)!=KeyframeInterpolationType.LINEAR))
        if(baseProperty.keyInInterpolationType(i)==KeyframeInterpolationType.BEZIER){
            newProperty.setTemporalEaseAtKey(newKeyframeIndex, baseProperty.keyInTemporalEase(i), newProperty.keyOutTemporalEase(newKeyframeIndex));
            }
        if(baseProperty.keyOutInterpolationType(i)==KeyframeInterpolationType.BEZIER){
            newProperty.setTemporalEaseAtKey(newKeyframeIndex, newProperty.keyInTemporalEase(newKeyframeIndex), baseProperty.keyOutTemporalEase(i));
            }
        newProperty.setInterpolationTypeAtKey(newKeyframeIndex, baseProperty.keyInInterpolationType(i), baseProperty.keyOutInterpolationType(i));
        }
    if (baseExpressionState && newProperty.canSetExpression){
        newProperty.expression = baseProperty.expression
        }
    baseProperty.expressionEnabled = baseExpressionState;
    }
CompUtils.alignLayerToParent = function (childLayer, parentLayer){
    childLayer.inPoint = parentLayer.inPoint;
    childLayer.outPoint = parentLayer.outPoint;
    var properties = ["anchorPoint", "position", "scale", "rotation", "opacity"];
    if (childLayer.threeDLayer){properties = ["anchorPoint", "position", "scale", "rotation", "opacity", "Orientation", "X Rotation", "Y Rotation"];}
    for (var i=0; i<properties.length; i++){
        if (childLayer(properties[i]).canSetExpression){childLayer(properties[i]).expressionEnabled = false}
        var keysToRemove = childLayer(properties[i]).numKeys
        //$.writeln("Number of Keys at the Begining for " + childLayer(properties[i]).name + ": " + childLayer(properties[i]).numKeys);
        for (var j=keysToRemove; j>=1; j--){
            //$.writeln("Removing Key Index: " + j + "of " + childLayer(properties[i]).numKeys);
            childLayer(properties[i]).removeKey(j);
            }
        }
    childLayer("anchorPoint").setValue([0,0]);
    childLayer("position").setValue([0,0]);
    childLayer("scale").setValue([100,100]);
    childLayer("rotation").setValue(0);
    if (childLayer.threeDLayer){
        childLayer("Orientation").setValue([0,0]);
        childLayer("X Rotation").setValue(0);
        childLayer("Y Rotation").setValue(0);
        }
    childLayer("opacity").setValue(100);
    if (childLayer("opacity").canSetExpression){
        var opacityLinkExpression = 'thisComp.layer("' + parentLayer.name + '").transform.opacity';
        childLayer("opacity").expression = opacityLinkExpression;
        }
    
    }