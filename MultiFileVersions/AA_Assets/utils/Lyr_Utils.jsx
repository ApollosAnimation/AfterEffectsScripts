var includedFiles = [ "../utils/Project_Utils.jsx", "../utils/System_Utils.jsx"];
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var SystemUtils = $.global.AA_Scripts.SystemUtils;
$.global.AA_Scripts.LyrUtils = {};
var LyrUtils = $.global.AA_Scripts.LyrUtils;

LyrUtils.addEffect = function (effectAEName){//base Effect Adding Function, used for most layer effects
    app.beginUndoGroup("Add Effect");
    var addedEffectsGroup = [];
    var effectsGroup = app.project.activeItem.selectedLayers;
    for (i=0; i<=effectsGroup.length; i++){
        if(isValid(effectsGroup[i])== false){
        }else{addedEffect = effectsGroup[i].Effects.addProperty(effectAEName);
            addedEffectsGroup.push(addedEffect);
        }
    }
    app.endUndoGroup();
}
LyrUtils.addLightSweep = function (){//base Effect Adding Function, used for most layer effects
app.beginUndoGroup("Add LightSweep");
    if(app.project.activeItem == null){
            alert("Please select a comp and layer");
            return false;
        }
    //var addedEffectsGroup = [];
    var effectsGroup = app.project.activeItem.selectedLayers;
    for (var i=0; i<=effectsGroup.length; i++){
        if(isValid(effectsGroup[i])== true){
            addedEffect = effectsGroup[i].Effects.addProperty("CC Light Sweep");
            //alert(addedEffect.numProperties);
            //alert(addedEffect.property("Edge Intensity").value);
            addedEffect.property("Edge Intensity").setValue(0);
            addedEffect.property("Edge Thickness").setValue(0);
            addedEffect.property("Width").setValue(20);
            addedEffect.property("Sweep Intensity").setValue(200);
            addedEffect.property("Light Reception").setValue(2);
            addedEffect.property("Light Color").setValue([.96, .76, .38, 1]);
            position1 = effectsGroup[i].Position.value;
            addedEffect.property("Center").setValuesAtTimes([app.project.activeItem.time,app.project.activeItem.time +1],[[position1[0],position1[1]],[position1[0]+100,position1[1]]]);
            addedEffect.property("Center").expression = 'if(time<effect("CC Light Sweep")(1).key(1).time){loopIn("offset")}else{loopOut("offset")};';
            //addedEffectsGroup.push(addedEffect);
        }
    }
    app.endUndoGroup();
}
LyrUtils.addFlipTransform = function (){//base Effect Adding Function, used for most layer effects
    app.beginUndoGroup("Add Transform Flip");
    if(app.project.activeItem == null){
            alert("Please select a comp and layer");
            return false;
        }
    var effectsGroup = app.project.activeItem.selectedLayers;
    for (i=0; i<=effectsGroup.length; i++){
        if(isValid(effectsGroup[i])== true){
            addedEffect = effectsGroup[i].Effects.addProperty("ADBE Geometry2");
            addedEffect.property("Uniform Scale").setValue(false);
            addedEffect.property(5).setValue(-100);
        }
    }
    app.endUndoGroup();
}
LyrUtils.addDrift = function (properties){//Function used to add keyframes to the Transform effect if the "Add Drift" Function is called
    var currentTime = app.project.activeItem.time;//Get Time
    var keyframeTimes = new Array((currentTime), (currentTime+1));//Make Variable and Set Default for the offset keyframes
    var keyframeValues = new Array(-100, 100);
    for (i=0; i<properties.length; i++){
        if(isValid(properties[i])== false){
        }else{
        var keyFrameOrigin = properties[i].property("Position").value;
        var keyFrameOffset = new Array((properties[i].property("Position").value[0]+10), (properties[i].property("Position").value[1]+10));
        properties[i].property("Position").setValueAtTime(currentTime, keyFrameOrigin);
        properties[i].property("Position").setValueAtTime((currentTime+1), keyFrameOffset);
        }
    }
}
LyrUtils.toggleTimeRemap = function (){//Enables and disables Time Remap
    app.beginUndoGroup("Add Time Remap");
    var selLayers = app.project.activeItem.selectedLayers;
        for (i=0; i<selLayers.length; i++){
             if (selLayers[i].timeRemapEnabled == true){
                    selLayers[i].timeRemapEnabled = false;
                 }else{
                     if (selLayers[i].canSetTimeRemapEnabled == true){
                        selLayers[i].timeRemapEnabled = true;
                      }
                }
        }
    app.endUndoGroup();
}
LyrUtils.addEase = function (inSpe, inInf, outSpe, outInf){/*Initial Ease Function, when a layer ease is called this function collects all the layers and then calls PropEase for each layer.
    "InInf" determined by the setEaseSpeed Function and  easeSpeedForEffectWindowScript Global Variable*/
    app.beginUndoGroup("Add Ease In");
    try{
        //var collectedProps = new Array();
        //var collectedKeys = new Array();
        //var keyVal = new Array();
        var easeIn = new KeyframeEase(inSpe, inInf);
        var easeOut = new KeyframeEase(outSpe, outInf);
        var selLayers = app.project.activeItem.selectedLayers;
        for (var i=0; i<=(selLayers.length); i++){
            if(isValid(selLayers[i])== false){
                }else{
                this.iterateEaseOverProps(selLayers[i], easeIn, easeOut)
                //propEases(selLayers[i], easeIn, easeOut);
            }
        }
    lastKeysEased = [];
    lastKeysEased =[] ;
    }catch(err){alert("Error:" +"\r" + err.line.toString() +"\r" + err.toString())}
    app.endUndoGroup();
}
LyrUtils.iterateEaseOverProps = function (context, easeIn, easeOut){
    var selProps = context.selectedProperties;
    var valueTypeIndex = 2;
    for(var i=0;i<selProps.length;i++){
        try{
            if (selProps[i].propertyValueType == (undefined||null)){continue;}
            if (selProps[i].selectedKeys.length == 0){{continue;}}
            var keyType = selProps[i].propertyValueType;
            //alert(selProps[i].name+selProps[i].propertyValueType);
            var selKeys = selProps[i].selectedKeys;
            switch(true){
                case (keyType === PropertyValueType.TwoD):
                    //alert("2D");
                    valueTypeIndex = 2;
                    this.positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                break;
                case (keyType === PropertyValueType.TwoD_SPATIAL):
                    //alert("2DS");
                    valueTypeIndex = 1;
                    this.positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                break;
                case (keyType === PropertyValueType.ThreeD):
                    //alert("3D");
                    valueTypeIndex = 3;
                    this.positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                break;
                case (keyType === PropertyValueType.ThreeD_SPATIAL):
                    //alert("3DS");
                    valueTypeIndex = 1;
                    this.positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                break;
                case (keyType === PropertyValueType.OneD):
                    //alert("1D");
                    valueTypeIndex = 1;
                    this.positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                break;
                case (keyType === PropertyValueType.COLOR):
                    //alert("Color");
                    valueTypeIndex = 1;
                    this.positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                break;
                case (keyType === PropertyValueType.CUSTOM_VALUE):
                    //alert("Color");
                    valueTypeIndex = 1;
                    this.positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                break;
                case (keyType === PropertyValueType.SHAPE):
                    //alert("Color");
                    valueTypeIndex = 1;
                    this.positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                break;
                default:
                alert("Keyframe not 1D, 2D, or 3D");
                break;
                }
        }catch(err){alert("Error:" +"\r" + err.line.toString() +"\r" + err.toString())}
    }
}
LyrUtils.positionEase = function (selKeys, myProperty, easeIn, easeOut, valueTypeIndex){/*Third Ease Function, when called upon by PropEases, this function takes the individual keys and sets their eases based on their property Value Type.
    These functions have been Seperated into 3 Parts to help with null attributes that are collected in arrays unexpectently*/
    for (var i=0; i<(selKeys.length); i++){

        switch(valueTypeIndex){
            case (4):
                myProperty.setTemporalEaseAtKey(selKeys[i], [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            break;
            case (3):
                myProperty.setTemporalEaseAtKey(selKeys[i], [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            break;
            case (2):
                myProperty.setTemporalEaseAtKey(selKeys[i], [easeIn, easeIn], [easeOut, easeOut]);
            break;
            case (1):
                myProperty.setTemporalEaseAtKey(selKeys[i], [easeIn], [easeOut]);
            break;
            default:
                alert("unknownValueType");
            break;
            }
    }
}
LyrUtils.matchCompSize =  function (matchDirectionIndex){
    app.beginUndoGroup("Resize Direction");
    var scalePercent = 0.0;
    var curComp = app.project.activeItem;
    var curLyr = curComp.selectedLayers;
    for (i=0; i<curLyr.length; i++){
            if(matchDirectionIndex==0){
               scalePercent = (((curComp.height)/(curLyr[i].height))/1)*100;
            }else{
            scalePercent = (((curComp.width)/(curLyr[i].width))/1)*100;
            }
        var imageScale = curLyr[i].property("Transform").property("Scale").setValue([scalePercent, scalePercent, scalePercent]);//.setValue[scalePercent, scalePercent, scalePercent];
    }
    app.endUndoGroup();
}
LyrUtils.checkLayerForNewPSDs = function (layers, fixExpressions){//Undoable; returns null in Error / the changed layers. Default fixExpressions:False layers: app.project.activeItem.selectedLayers, takes layers(Array) and tries seeing if they have psd's to replace with of the same name
    app.beginUndoGroup("checkLayerForNewPSDs");
    var fixExpressions = ((fixExpressions != undefined)|(fixExpressions != null)) ? fixExpressions : false;
    var layers = (Object.prototype.toString.call(layers) === "[object Array]") ? layers
            : (((layers == undefined)|(layers == null))&&(app.project.activeItem instanceof CompItem)) ? app.project.activeItem.selectedLayers
            : null;
    if ((layers == undefined)|(layers == null)){return null;}
    var changedLayers = new Array;
    for (var i = 0; i<layers.length; i++){
        var layer = layers[i];var compSource  = null; var psdStill = null;
        if (!(layer instanceof AVLayer)|!(layer.source instanceof FootageItem)){continue;}
        compSource = ProjectUtils.findComp(layer.name);
        if (compSource == null){compSource = ProjectUtils.findComp(layer.name+"_preComp");}
        if (compSource != null){layer.replaceSource(compSource, fixExpressions); changedLayers.push(layer); continue;}
        psdStill = this.stillToPSDComp(layer.source);
        if (psdStill == null){continue;}
        this.addParalaxComp(psdStill);
        layer.replaceSource(psdStill, fixExpressions);
        changedLayers.push(layer);
        }
    if (changedLayers.length == 0){return null;}
    return changedLayers;
    app.endUndoGroup();
}
LyrUtils.findLayer = function (comp, layerName){//Returns  null in error/ the layer with the name of footageName(String), or the layer with the name of footageName with _preComp
    if (!(comp instanceof CompItem)) {return null;}
    for (var i = 1; i<= comp.numLayers; i++){
        if (comp.layers[i].name == layerName){return comp.layers[i];}
        if (comp.layers[i].name == layerName+"_preComp"){return comp.layers[i];}
        }
    return null;
}
LyrUtils.stillToPSDComp = function (item){//Return null in error/ the imported Psd Comp
    var itemPreCompName =  String(item.name).slice(0,-4)+"_preComp";
    if (ProjectUtils.findComp(itemPreCompName) != null){return ProjectUtils.findComp(itemPreCompName);}
    var psd = SystemUtils.checkPSDExists(item);
    if (psd == null){return null;}
    //var psdLocation = String(item.file).slice(0,-3)+"psd";
    psdIO = new ImportOptions(psd);
    if (psdIO.canImportAs(ImportAsType.COMP)){
        psdIO.importAs = ImportAsType.COMP;
        var oldFolder = ProjectUtils.findItemWithType(item.name.slice(0,-4) + " Layers", FolderItem);
        if (oldFolder != null){oldFolder.remove();}
        var psdImport = app.project.importFile(psdIO);
        psdImport.parentFolder = ProjectUtils.findAddFolder ("TemplatePreComps", "04_TemplatePieces");
        var psdImportFolder = ProjectUtils.findAddFolder (psdImport.name + " Layers");
        psdImportFolder.parentFolder = ProjectUtils.findAddFolder ("TemplateReferences", "04_TemplatePieces");
        psdImport.name = itemPreCompName;
        return psdImport;
        }
    return null;
}
LyrUtils.addParalaxComp = function (comp){//Returns null in error, reqires a comp, looks for layers "FG" and "BG", sets hard coded scaling to those 2 layers and adds a blur
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
}
LyrUtils.addMarkers = function (inputText){//Returns null in error, reqires a comp, looks for layers "FG" and "BG", sets hard coded scaling to those 2 layers and adds a blur
    app.beginUndoGroup("Add Markers");
    try{
        var inputArray = new Array;
        inputArray = inputText.split("\n\n");
        var theComp = app.project.activeItem;
        var markerLayer = theComp.selectedLayers[0];
        var markerLength = ((theComp.duration)/(inputArray.length));
        //reflectAll (markerLayer)
        for (var i =inputArray.length-1; i>=0; --i){
            $.writeln ("i = " + i + ". Current Array Element: " + inputArray[i]);
            var newMarker = new MarkerValue(inputArray[i]) ;
            markerLayer.property("Marker").setValueAtTime((i*markerLength)+(markerLength*.5),newMarker);
            }
        return"";
       }catch(err){
            alert(err);
            return inputText;
           }
      app.endUndoGroup(); 
}
LyrUtils.duplicateSelectedLayer = function (duplicateValue, duplicateLayer){
    app.beginUndoGroup("duplicateSelectedLayer");
    var duplicateLayer = ((textLayerGroup != undefined)|(textLayerGroup != null)) ? duplicateLayer : app.project.activeItem.selectedLayers[0];
    for (i=0; i<duplicateValue; i++){
        if(isValid(duplicateLayer)== false){
        }else{
            //alert(duplicateLayer.name);
            duplicateLayer.duplicate()
        }
    }
    app.endUndoGroup();
    }
/*LyrUtils.addEffectReturn = function (effectAEName){//base Effect Adding Function, used for most layer effects, but with no undo function so that an undo can be done without effecting the return variable
    var addedEffectsGroup = [];
    var effectsGroup = app.project.activeItem.selectedLayers;
    for (i=0; i<=effectsGroup.length; i++){
        if(isValid(effectsGroup[i])== false){
        }else{addedEffect = effectsGroup[i].Effects.addProperty(effectAEName);
            addedEffectsGroup.push(addedEffect);
        }
    }
    return addedEffectsGroup//Returning all effects that have been added in case Keys will be automatically applied to them in another function
}*/
