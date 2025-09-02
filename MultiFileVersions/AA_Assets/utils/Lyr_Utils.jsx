var includedFiles = [ "../utils/Project_Utils.jsx", "../utils/System_Utils.jsx", "../utils/Comp_Utils.jsx"];
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var SystemUtils = $.global.AA_Scripts.SystemUtils;
var CompUtils = $.global.AA_Scripts.CompUtils;
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
    var fixExpressions = ((fixExpressions !== undefined)&&(fixExpressions !== null)) ? fixExpressions : false;
    var layers = (Object.prototype.toString.call(layers) === "[object Array]") ? layers
            : ((((layers == undefined)|(layers == null))&&(app.project.activeItem instanceof CompItem)) ? app.project.activeItem.selectedLayers: null);
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
        CompUtils.addParalaxComp(psdStill);
        layer.replaceSource(psdStill, fixExpressions);
        changedLayers.push(layer);
        }
    if (changedLayers.length == 0){return null;}
    return changedLayers;
    app.endUndoGroup();
}
LyrUtils.findLayersOfType= function (comp, itemType, exclusionTypes){//Returns null in Error / an Array of Layers, returns layers of the single item type that is not of the exclusionTypes(Array) in a comp
    if (!(comp instanceof CompItem)) {return null;}
    var layers = new Array;
    for (var i = 1; i<= comp.numLayers; i++){
        if (comp.layers[i] instanceof itemType){
            if (exclusionTypes != null || exclusionTypes.length > 0){
                var exclusionCheck = this.checkLayerIsNot(comp.layers[i], exclusionTypes);
                if (exclusionCheck == true) {layers.push(comp.layers[i]);}
                }
            else{layers.push(comp.layers[i]);}
            }
        }
    if (layers.length == 0) {return null;}
    return layers;
    }
LyrUtils.checkLayerIsNot = function (layer, exclusionTypes){//Returns Bool, returns false if provided layer is one of the exclusionTypes(Array)
    for (var i = 0; i<= exclusionTypes.length; i++){
        //if (!(comp.layers[i] instanceof exclusionTypes[j]) && !(comp.layers[i].source instanceof exclusionTypes[j])){layers.push(comp.layers[i]);}
        if (layer instanceof exclusionTypes[i]){return false;}
        if (layer.source instanceof exclusionTypes[i]){return false;}
        }
    return true;
    }
LyrUtils.findLayer = function (comp, layerName){//Returns  null in error/ the layer with the name of footageName(String), or the layer with the name of footageName with _preComp
    if (!(comp instanceof CompItem)) {return null;}
    if (layerName instanceof CompItem){layerName = layerName.name}
    if (layerName.hasOwnProperty("source")&&(layerName.source instanceof CompItem ||layerName.source instanceof FootageItem)){layerName = layerName.name}
    for (var i = 1; i<= comp.numLayers; i++){
        if (comp.layers[i].name == layerName){return comp.layers[i];}
        if (comp.layers[i].name == layerName+"_preComp"){return comp.layers[i];}
        }
    return null;
}
LyrUtils.findAddLayer = function (comp, layerName){
    var footageItem = ProjectUtils.findFootage(footageName);
    if ((!(comp instanceof CompItem))|footageItem == null) {return null;}
    var footageLayer = LyrUtils.findLayer(comp, footageName);
    if (footageLayer != null) {return footageLayer};
    footageLayer = comp.layers.add(footageItem);
    return footageLayer;
    }

LyrUtils.findAddCompLayer = function (comp, footageName){//Returns  null in error/ the layer with the name of footageName(String) with _preComp, or just the footageName if no precomp is found
            var footageItem = ProjectUtils.findCompFootage(footageName);
            if ((!(comp instanceof CompItem))|footageItem == null) {return null;}
            var footageLayer = this.findLayer(comp, footageName+"_preComp");
            if (footageLayer != null) {return footageLayer};
            footageLayer = this.findLayer(comp, footageName);
            if (footageLayer != null) {return footageLayer};
            footageLayer = comp.layers.add(footageItem);
            return footageLayer;
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
LyrUtils.duplicateSelectedLayers = function (duplicateValue, duplicateLayers){
    app.beginUndoGroup("duplicateSelectedLayer");
    var duplicateLayers = ((duplicateLayers !== undefined)&&(duplicateLayers !== null)) ? duplicateLayers : app.project.activeItem.selectedLayers;
    if (!duplicateLayers){return null;}
    var newLayers = [];
    for (var i = 0; i < duplicateLayers.length; i++){
        newLayers.push(this.duplicateLayer(duplicateValue, duplicateLayers[i]));
        }
    return newLayers;
    app.endUndoGroup();
    }

LyrUtils.duplicateLayer = function (duplicateValue, duplicateLayer){
    var duplicateLayer = ((duplicateLayer !== undefined)&&(duplicateLayer !== null)) ? duplicateLayer : app.project.activeItem.selectedLayers[0];
    if (!duplicateLayer){return null;}
    var newLayers = [];
    for (i=0; i<duplicateValue; i++){
            newLayers.push(duplicateLayer.duplicate());
        }
    return newLayers;
    }

LyrUtils.layerScreenSize = function (layer){//Returns an Object with Height, Width, Top, Left, halfHeight, halfWidth. positionX, positionY; From given Layer (AVLayer, CompItem, ShapeLayer, Text), Returns Null if not the correct layer type
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
LyrUtils.resizeRectangle = function (rectangle, amount){//Returns Rectangle Object, changes  rectangle.height, rectangle.width, rectangle.top, rectangle.left, Multiplies by Amount
    rectangle.height = rectangle.height * amount;
    rectangle.width = rectangle.width * amount;
    rectangle.top = rectangle.top * amount;
    rectangle.left = rectangle.left * amount;
    return rectangle;
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
