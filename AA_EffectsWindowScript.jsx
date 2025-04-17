/********************************************************************************
To Install:

Place the EffectWindowScript.Jsx into your Script UI Panel Directory located in:
 C:\Program Files\Adobe\Adobe After Effects CC 2017\Support Files\Scripts\ScriptUI Panels
 Or wherever you have installed After effects.

 The Script Should then be accessible through the menu:
 Window->EffectWindowScript.jsx

or through:
File->Scripts->Run Script File...
and then browsing to the Script UI Panel Directory

This should make a Floating Dockable UI
************************************************************************************/
{
    { //collapse to hide individual functions
    easeSpeedForEffectWindowScript = 100;//Defines Default Global Variable of the base speed of easeing to be used on layers
    easeSpeedForEffectWindowScript02 = 100;
    fontSizeIndexForWindowScript = 2;//Defines Default Global Variable of the base font size to be used
    seperatedEaseControlsForWindowScript = new Boolean;
    easeAffectPreviousSelection = new Boolean;
	distributeTransition = new Boolean;
    distributeTransition = true;
    lastEaseUsed = new String;

    function addEffect(effectAEName){//base Effect Adding Function, used for most layer effects
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

    function addLightSweep(){//base Effect Adding Function, used for most layer effects
        app.beginUndoGroup("Add LightSweep");
        if(app.project.activeItem == null){
                alert("Please select a comp and layer");
                return false;
            }
        var addedEffectsGroup = [];
        var effectsGroup = app.project.activeItem.selectedLayers;
        for (i=0; i<=effectsGroup.length; i++){
            if(isValid(effectsGroup[i])== true){
                addedEffect = effectsGroup[i].Effects.addProperty("CC Light Sweep");
                //alert(addedEffect.numProperties);
                //alert(addedEffect.property("Edge Intensity").value);
                addedEffect.property("Edge Intensity").setValue(0);
                addedEffect.property("Edge Thickness").setValue(0);
                addedEffect.property("Width").setValue(20);
                addedEffect.property("Sweep Intensity").setValue(400);
                addedEffect.property("Light Reception").setValue(3);
                //alert(effectsGroup[i].Position.value);
                position1 = effectsGroup[i].Position.value;
                addedEffect.property("Center").setValuesAtTimes([1,2],[[position1[0],position1[1]],[position1[0]+100,position1[1]]]);
                 addedEffect.property("Center").expression = 'if(time<effect("CC Light Sweep")(1).key(1).time){loopIn("offset")}else{loopOut("offset")};';
                //alert(addedEffect.property("Center").canSetExpression);
                for (j=1; j<=addedEffect.numProperties;j++){
                        //alert(addedEffect.property(j).name);
                    }
                //reflectAll (addedEffect);
                addedEffectsGroup.push(addedEffect);
            }
        }
        app.endUndoGroup();
    }

    function addEffectReturn(effectAEName){//base Effect Adding Function, used for most layer effects, but with no undo function so that an undo can be done without effecting the return variable
        var addedEffectsGroup = [];
        var effectsGroup = app.project.activeItem.selectedLayers;
        for (i=0; i<=effectsGroup.length; i++){
            if(isValid(effectsGroup[i])== false){
            }else{addedEffect = effectsGroup[i].Effects.addProperty(effectAEName);
                addedEffectsGroup.push(addedEffect);
            }
        }
        return addedEffectsGroup//Returning all effects that have been added in case Keys will be automatically applied to them in another function
    }

    function addDrift(properties){//Function used to add keyframes to the Transform effect if the "Add Drift" Function is called
            var currentTime = app.project.activeItem.time;//Get Time
            var keyframeTimes = new Array((currentTime), (currentTime+1));//Make Variable and Set Default for the offset keyframes
            var keyframeValues = new Array(-100, 100);
            for (i=0; i<=properties.length; i++){
                if(isValid(properties[i])== false){
                }else{
                var keyFrameOrigin = properties[i].property("Position").value;
                var keyFrameOffset = new Array((properties[i].property("Position").value[0]+10), (properties[i].property("Position").value[1]+10));
                properties[i].property("Position").setValueAtTime(currentTime, keyFrameOrigin);
                properties[i].property("Position").setValueAtTime((currentTime+1), keyFrameOffset);
                }
            }
        }

    function addSolid(adjustBool){//Makes a Solid layer at 95% white briteness at 1920 x 10810 for 15 Seconds
        app.beginUndoGroup("Add Solid");
        var movementLayer = app.project.activeItem.selectedLayers;
        var theComp = app.project.activeItem;
        var newSolid = theComp.layers.addSolid( [.95, .95, .95], "Solid", theComp.width, theComp.height, 1.0, theComp.duration);
        newSolid.name = "Solid";
        if(adjustBool == 1){
            newSolid.adjustmentLayer = true;
            newSolid.name = "Adjustment Layer";
            }
        if(isValid(movementLayer[0])== true){
            newSolid.moveBefore(movementLayer[0]);
            }
        app.endUndoGroup();
        }

    function addNull(){//Make a Null Layer
        app.beginUndoGroup("Add Null");
        var movementLayer = app.project.activeItem.selectedLayers;
        var theComp = app.project.activeItem
        var newNull = theComp.layers.addNull()
        newNull.name = "Null"
        //newNull.name = "Null"
        if(isValid(movementLayer[0])== true){
            newNull.moveBefore(movementLayer[0]);
            }
        app.endUndoGroup();
        }

    function toggleTimeRemap(){//Enables and disables Time Remap
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

    function addEase(inSpe, inInf, outSpe, outInf){/*Initial Ease Function, when a layer ease is called this function collects all the layers and then calls PropEase for each layer.
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
                    iterateEaseOverProps(selLayers[i], easeIn, easeOut)
                    //propEases(selLayers[i], easeIn, easeOut);
                }
            }
        lastKeysEased = [];
        lastKeysEased =[] ;
        }catch(err){alert("Error:" +"\r" + err.line.toString() +"\r" + err.toString())}
    app.endUndoGroup();
    }

    function iterateEaseOverProps(context, easeIn, easeOut){
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
                        positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                    break;
                    case (keyType === PropertyValueType.TwoD_SPATIAL):
                        //alert("2DS");
                        valueTypeIndex = 1;
                        positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                    break;
                    case (keyType === PropertyValueType.ThreeD):
                        //alert("3D");
                        valueTypeIndex = 3;
                        positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                    break;
                    case (keyType === PropertyValueType.ThreeD_SPATIAL):
                        //alert("3DS");
                        valueTypeIndex = 1;
                        positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                    break;
                    case (keyType === PropertyValueType.OneD):
                        //alert("1D");
                        valueTypeIndex = 1;
                        positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                    break;
                    case (keyType === PropertyValueType.COLOR):
                        //alert("Color");
                        valueTypeIndex = 1;
                        positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                    break;
                    case (keyType === PropertyValueType.CUSTOM_VALUE):
                        //alert("Color");
                        valueTypeIndex = 1;
                        positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                    break;
                    case (keyType === PropertyValueType.SHAPE):
                        //alert("Color");
                        valueTypeIndex = 1;
                        positionEase(selKeys, selProps[i], easeIn, easeOut,valueTypeIndex);
                    break;
                    default:
                    alert("Keyframe not 1D, 2D, or 3D");
                    break;
                    }
            }catch(err){alert("Error:" +"\r" + err.line.toString() +"\r" + err.toString())}
         }
    }

    function positionEase(selKeys, myProperty, easeIn, easeOut, valueTypeIndex){/*Third Ease Function, when called upon by PropEases, this function takes the individual keys and sets their eases based on their property Value Type.
            These functions have been Seperated into 3 Parts to help with null attributes that are collected in arrays unexpectently*/
         for (var y=0; y<=(selKeys.length)-1; y++){

            switch(valueTypeIndex){
                case (4):
                    myProperty.setTemporalEaseAtKey(selKeys[y], [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
                break;
                case (3):
                    myProperty.setTemporalEaseAtKey(selKeys[y], [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
                break;
                case (2):
                    myProperty.setTemporalEaseAtKey(selKeys[y], [easeIn, easeIn], [easeOut, easeOut]);
                break;
                case (1):
                    myProperty.setTemporalEaseAtKey(selKeys[y], [easeIn], [easeOut]);
                break;
                default:
                    alert("unknownValueType");
                break;
                }
         }
    }

    function continueAffectingEase(lastEaseUsed, speed01, speed02){
            switch(lastEaseUsed){
                case "EI":
                //alert("EI")
                    addEase(0, speed01, 0, 0.1);
                    break;
                case "EO":
                //alert("EO")
                    if (seperatedEaseControlsForWindowScript==true){
                    addEase(0, 0.1, 0, speed02);
                        }else{
                    addEase(0, 0.1, 0, speed01);
                    }
                    break;
                case "FIO":
                //alert("FIO")
                    break;
                case "EIO":
                //alert("EIO")
                    if (seperatedEaseControlsForWindowScript==true){
                    addEase(0, speed01, 0, speed02);
                    }else{
                    addEase(0, speed01, 0, speed01);
                    }
                    break;
                default:
                    break;
            }
        }
    function matchCompSize(matchDirectionIndex){
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

    function changeSliderValue(newValue, easeSliderValue, easeSlider, globalSpeed){
        //alert(newValue);
        switch(true){
            case (newValue < .1):
                globalSpeed = Number(.1);
                easeSlider.value=Number(.1);
                easeSliderValue.text = .1;
                break;
            case (newValue > 100):
                globalSpeed = Number(100);
                easeSlider.value=100;
                easeSliderValue.text = 100;
                break;
            case (newValue > 100):
                globalSpeed = Number(100);
                easeSlider.value=100;
                easeSliderValue.text = 100;
                break;
            default:
                globalSpeed = newValue;
                easeSlider.value=newValue;
                easeSliderValue.text = newValue;
                break;
        }
    }

    function changeFont(undoName, newFontName){//Changes font, font size deterimned prior to this function being called
    app.beginUndoGroup(undoName);
        try{
            var textGroup = app.project.activeItem.selectedLayers;
            for (i=0; i<((textGroup.length)); i++){//For Every Layer Selected
                var textDocument = textGroup[i].property("ADBE Text Properties").property("ADBE Text Document");
                var textSetting = textDocument.value;
                textSetting.font= newFontName;
                textDocument.setValue(textSetting);
            }
        }catch(err){}
        app.endUndoGroup();
        }

    function addTextAnim(easeType){//Adds text animation, based on which button is calling upon this function, It will either make the tet ease in, out, or smoothly transition, and add keyframes for quick access
        app.beginUndoGroup("Add Text Anim");
            try{
            var textGroup = app.project.activeItem.selectedLayers;
            for (i=0; i<=((textGroup.length)-1); i++){//For Every Layer Selected
                var newAnim = textGroup[i].Text.Animators.addProperty("ADBE Text Animator");//Add Animator
                var newAnimSelector = newAnim.property("ADBE Text Selectors").addProperty("ADBE Text Selector");//Add standard range selector
                var currentTime = app.project.activeItem.time;//Get Time
                var easeShapeIndex=2;//Make Variable and Set Default for shape index
                var easeMinVal=75;//Make Variable and Set Default for the Ease low
                var easeMaxVal=-75;//Make Variable and Set Default for the ease high
                var keyframeTimes = new Array((currentTime-1), (currentTime+1));//Make Variable and Set Default for the offset keyframes
                var keyframeValues = new Array(-100, 100);//Make Variable and Set Default for the offset values
                if(easeType=="Ramp Up"){//Customize variable per button push
                        easeShapeIndex=3;
                        easeMinVal=75;
                        easeMaxVal=-75;
                        keyframeTimes = [(currentTime-1), (currentTime)]
                    }else if(easeType=="Ramp Down"){
                        easeShapeIndex=2;
                        easeMinVal=75;
                        easeMaxVal=-75;
                        keyframeTimes = [(currentTime), (currentTime+1)]
                    }else if(easeType=="Smooth"){
                        easeShapeIndex=6;
                        easeMinVal=0;
                        easeMaxVal=0;
                        keyframeTimes = [(currentTime), (currentTime+1)]
                    }else{
                        alert("Shape request not detected");//should never be called without one of the 3 button types
                    }
                newAnimSelector.property("ADBE Text Range Advanced").property("ADBE Text Levels Min Ease").setValue(easeMinVal);//set layer ease low
                newAnimSelector.property("ADBE Text Range Advanced").property("ADBE Text Levels Max Ease").setValue(easeMaxVal);//set layer ease high
                newAnimSelector.property("ADBE Text Range Advanced").property("ADBE Text Range Shape").setValue(easeShapeIndex);//set layer ease type
                for (k=0;k<keyframeTimes.length;k++){//set offset keys
                newAnimSelector.property("ADBE Text Percent Offset").setValueAtTime(keyframeTimes[k],keyframeValues[k])
                }
            }
        }catch(err){alert("Error:" +"\r" + err.line.toString() +"\r" + err.toString())}
        app.endUndoGroup();
    }

    function staggerLayers(staggerType){
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
                        selLayers[i].startTime = ((layerLength)*[i]+(theComp.workAreaStart));
                        selLayers[i].outPoint = ((layerLength)+selLayers[i].startTime+(theComp.workAreaStart));
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
    }
    function testDistributeLayers(){
        var theComp = app.project.activeItem;
        var selLayers = theComp.selectedLayers;

        alert("Layer outPoint of first layer: " + selLayers[0].outPoint);
        alert("Layer startTime of layer 2: " + selLayers[1].startTime);
        alert("Layer inPointof layer 2: " + selLayers[1].inPoint);
        calcTime = (selLayers[0].outPoint + (selLayers[1].startTime - selLayers[1].inPoint));
        alert("Calculated result time: " + calcTime)
    }
    function distributeLayers(){
        var theComp = app.project.activeItem;
        var selLayers = theComp.selectedLayers;
        app.beginUndoGroup("DistributeLayers");
        for (i=1; i<=selLayers.length; i++){
            selLayers[i].startTime = (selLayers[i-1].outPoint + (selLayers[i].startTime - selLayers[i].inPoint));;
        }
        app.endUndoGroup();
    }

    function addFadeBlack(){
    app.beginUndoGroup("AddFades");
     var theComp = app.project.activeItem;
     var fades = [];
     for (i = 0; i<2; i++){
         //alertTest();
         var shapeLayer = theComp.layers.addShape();
         //shapeLayer.name = "Fade";
         var shapeBounds = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
         shapeBounds.property("ADBE Vector Rect Size").setValue([theComp.width,theComp.height]);
         var fill = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
         fill.property("ADBE Vector Fill Color").setValue([0,0,0,1]);
         fades.push(shapeLayer);
         }
     //alertTest(fades)
     fades[0].name = "Fade in";
     fades[1].name = "Fade Out";
     fades[0].outPoint = 11/24;
     fades[1].inPoint = theComp.duration - 11/24;
     var opacity0 = fades[0].property("Transform").property("Opacity");
     var opacity1 = fades[1].property("Transform").property("Opacity");
     opacity0.setValueAtTime(0,100);
     opacity0.setValueAtTime((10/24),0);
     opacity1.setValueAtTime(theComp.duration-(1/24),100);
     opacity1.setValueAtTime(theComp.duration - (11/24),0);
     var easeLow = new KeyframeEase(0, 0.1);
     var easeHigh = new KeyframeEase(0, 80);
     opacity0.setTemporalEaseAtKey(1, [easeLow], [easeHigh]);
     opacity0.setTemporalEaseAtKey(2, [easeHigh], [easeLow]);
     opacity1.setTemporalEaseAtKey(1, [easeLow], [easeHigh]);
     opacity1.setTemporalEaseAtKey(2, [easeHigh], [easeLow]);

    app.endUndoGroup();
    }

    function checkLayerForNewPSDs(layers, fixExpressions){//Undoable; returns null in Error / the changed layers. Default fixExpressions:False layers: app.project.activeItem.selectedLayers, takes layers(Array) and tries seeing if they have psd's to replace with of the same name
        app.beginUndoGroup("checkLayerForNewPSDs");
        var fixExpressions = ((fixExpressions != undefined)|(fixExpressions != null)) ? fixExpressions : false;
        var layers = (Array.isArray(layers))? layers
                : (((layers == undefined)|(layers == null))&&(app.project.activeItem instanceof CompItem)) ? app.project.activeItem.selectedLayers
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
    function reflectAll(reflectable){//this is a debugging function that lists all information about a given element, and is a great break point to analyze in Extendscript
        alert(reflectable.reflect.name);
        alert(reflectable.reflect.properties);
        alert(reflectable.reflect.methods);
        }

    function alertTest(message){
            message = (message !== undefined) ? message : "Ping";
            alert(message);
        }

    function changeFontType(calledFont){
            switch(calledFont){
                    case "fontHelvetica":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontHelvetica", "HelveticaNeueLTStd-Lt");
                                    break;
                                case 2:
                                    changeFont("fontHelvetica", "HelveticaNeueLTStd-Md");
                                    break;
                                case 3:
                                    changeFont("fontHelvetica", "HelveticaNeueLTStd-Bd");
                                    break;
                                case 4:
                                    changeFont("fontHelvetica", "HelveticaNeueLTStd-Blk");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontFrutiger":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontFrutiger", "FrutigerLTStd-Light");
                                    break;
                                case 2:
                                    changeFont("fontFrutiger", "FrutigerLTStd-Roman");
                                    break;
                                case 3:
                                    changeFont("fontFrutiger", "FrutigerLTStd-Bold");
                                    break;
                                case 4:
                                    changeFont("fontFrutiger", "FrutigerLTStd-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontFutura":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontFutura", "FuturaStd-Light");
                                    break;
                                case 2:
                                    changeFont("fontFutura", "FuturaStd-Medium");
                                    break;
                                case 3:
                                    changeFont("fontFutura", "FuturaStd-Heavy");
                                    break;
                                case 4:
                                    changeFont("fontFutura", "FuturaStd-Bold");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontGill":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontGill", "GillSansMT");
                                    break;
                                case 2:
                                    changeFont("fontGill", "GillSansMT");
                                    break;
                                case 3:
                                    changeFont("fontGill", "GillSansMT-Bold");
                                    break;
                                case 4:
                                    changeFont("fontGill", "GillSansMT-Bold");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontUnivers":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontUnivers", "UniversLTStd-Light");
                                    break;
                                case 2:
                                    changeFont("fontUnivers", "UniversLTStd");
                                    break;
                                case 3:
                                    changeFont("fontUnivers", "UniversLTStd-Bold");
                                    break;
                                case 4:
                                    changeFont("fontUnivers", "UniversLTStd-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontMyriad":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontMyriad", "MyriadPro-Light");
                                    break;
                                case 2:
                                    changeFont("fontMyriad", "MyriadPro-Regular");
                                    break;
                                case 3:
                                    changeFont("fontMyriad", "MyriadPro-Bold");
                                    break;
                                case 4:
                                    changeFont("fontMyriad", "MyriadPro-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontAvenir":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontAvenir", "AvenirLTStd-Light");
                                    break;
                                case 2:
                                    changeFont("fontAvenir", "AvenirLTStd-Medium");
                                    break;
                                case 3:
                                    changeFont("fontAvenir", "AvenirLTStd-Heavy");
                                    break;
                                case 4:
                                    changeFont("fontAvenir", "AvenirLTStd-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontTradeG":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontTradeG", "TradeGothicLTStd-Light");
                                    break;
                                case 2:
                                    changeFont("fontTradeG", "TradeGothicLTStd");
                                    break;
                                case 3:
                                    changeFont("fontTradeG", "TradeGothicLTStd-Bold");
                                    break;
                                case 4:
                                    changeFont("fontTradeG", "TradeGothicLTStd-Bd2");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontRoboto":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontRoboto", "Roboto-Light");
                                    break;
                                case 2:
                                    changeFont("fontRoboto", "Roboto-Regular");
                                    break;
                                case 3:
                                    changeFont("fontRoboto", "Roboto-Bold");
                                    break;
                                case 4:
                                    changeFont("fontRoboto", "Roboto-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontProx":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontProx", "ProximaNova-Light");
                                    break;
                                case 2:
                                    changeFont("fontProx", "ProximaNova-Regular");
                                    break;
                                case 3:
                                    changeFont("fontProx", "ProximaNova-Bold");
                                    break;
                                case 4:
                                    changeFont("fontProx", "ProximaNova-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontLato":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontLato", "Lato-Light");
                                    break;
                                case 2:
                                    changeFont("fontLato", "Lato-Regular");
                                    break;
                                case 3:
                                    changeFont("fontLato", "Lato-Bold");
                                    break;
                                case 4:
                                    changeFont("fontLato", "Lato-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontMont":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    changeFont("fontMont", "Montserrat-Light");
                                    break;
                                case 2:
                                    changeFont("fontMont", "Montserrat-Regular");
                                    break;
                                case 3:
                                    changeFont("fontMont", "Montserrat-Bold");
                                    break;
                                case 4:
                                    changeFont("fontMont", "Montserrat-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    default:
                        alert("Font Unrecognized");
                        break;
                }
    }

    }

    function makeEffectsPanel(windowObj){//Function defining what makes a Window Effects Panel

    function buildPanel(windowObj){//Define Window to be built
         var fontSize = "med";
         var myEffectsPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Effects Buttons", undefined, {resizeable:true});
         var myEffectsTabs = myEffectsPanel.add("tabbedpanel",undefined);
         var basicEffectsTab = myEffectsTabs.add("tab", undefined, "Basic Effects", {orientation:'row',alignment:['left','top']});
         basicEffectsTab.orientation = 'row';
         var transitionEffectsTab = myEffectsTabs.add("tab", undefined, "Transition Effects", {orientation:'row',alignment:['left','top']});
         transitionEffectsTab.orientation = 'row';
         var layersTab = myEffectsTabs.add("tab", undefined, "Layers and Time", {orientation:'row'});
         layersTab.orientation = 'row';
         var fontsTab = myEffectsTabs.add("tab", undefined, "Fonts", {orientation:'row'});
         fontsTab.orientation = 'row';

         var effectsColumn01 = basicEffectsTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
         effectsColumn01.orientation = 'column';
         effectsColumn01.add("Button",undefined ,"Add Gaus").onClick = function(){addEffect ("ADBE Gaussian Blur 2")};
         effectsColumn01.add("Button",undefined ,"Add HueSat").onClick = function(){addEffect ("ADBE HUE SATURATION")};
         effectsColumn01.add("Button",undefined ,"Add Fill").onClick = function(){addEffect ("ADBE Fill")};
         effectsColumn01.add("Button",undefined ,"Add DropShdw").onClick = function(){addEffect ("ADBE Drop Shadow")};
         effectsColumn01.add("Button",undefined ,"Add S_Linear Wipe").onClick = function(){addEffect ("S_WipeLine")};
         effectsColumn01.add("Button",undefined ,"Add Transform").onClick = function(){addEffect ("ADBE Geometry2")};

         var effectsColumn02 = basicEffectsTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
         effectsColumn02.orientation = 'column';
         effectsColumn02.add("Button",undefined ,"Add Gradient").onClick = function(){addEffect ("ADBE Ramp")};
         effectsColumn02.add("Button",undefined ,"Add LightSweep").onClick = function(){addLightSweep()};
         effectsColumn02.add("Button",undefined ,"Add Glow").onClick = function(){addEffect ("ADBE Glo2")};
         effectsColumn02.add("Button",undefined ,"Add Simple Choker").onClick = function(){addEffect ("ADBE Simple Choker")};
         effectsColumn02.add("Button",undefined ,"Add Luma Dissolve").onClick = function(){addEffect ("S_DissolveLuma")};
         effectsColumn02.add("Button",undefined ,"Add S_DropShdw").onClick = function(){addEffect ("S_DropShadow")};

         var transitionColumn01 = transitionEffectsTab.add("Group",undefined);
         transitionColumn01.alignment = ['left','top'];
         transitionColumn01.orientation = 'column';
         transitionColumn01.add("Button",undefined ,"Add PageTurn").onClick = function(){addEffect ("CC Page Turn")};
         transitionColumn01.add("Button",undefined ,"Add CardWipe").onClick = function(){addEffect ("APC CardWipeCam")};
         transitionColumn01.add("Button",undefined ,"Add RadialWipe").onClick = function(){addEffect ("ADBE Radial Wipe")};
         transitionColumn01.add("Button",undefined ,"Add Luma Dissolve").onClick = function(){addEffect ("S_DissolveLuma")};
         transitionColumn01.add("Button",undefined ,"Add Force Motion Blur").onClick = function(){addEffect ("CC Force Motion Blur")};

         var transitionColumn02 = transitionEffectsTab.add("Group",undefined);
         transitionColumn02.alignment = ['left','top'];
         transitionColumn02.orientation = 'column';
         transitionColumn02.add("Button",undefined ,"Text Ramp In").onClick = function(){addTextAnim ("Ramp Down")};
         transitionColumn02.add("Button",undefined ,"Text Ramp Out").onClick = function(){addTextAnim ("Ramp Up")};
         transitionColumn02.add("Button",undefined ,"Text Ramp Thru").onClick = function(){addTextAnim ("Smooth")};
         transitionColumn02.add("Button",undefined ,"Add Fade Black").onClick = function(){addFadeBlack ()};

         var layerColumn01 = layersTab.add("Group",undefined);
         layerColumn01.alignment = ['left','top'];
         layerColumn01.orientation = 'column';
         layerColumn01.add("Button",undefined ,"Add Solid").onClick = function(){addSolid(0)};
         layerColumn01.add("Button",undefined ,"Add Null").onClick = function(){addNull()};
         layerColumn01.add("Button",undefined ,"Add Adjustments").onClick = function(){addSolid(1)};
         layerColumn01.add("Button",undefined ,"Add Time Remap").onClick = function(){toggleTimeRemap()};
         layerColumn01.add("Button",undefined ,"Match Width").onClick = function(){matchCompSize(0)};
         layerColumn01.add("Button",undefined ,"Match Length").onClick = function(){matchCompSize(1)};
         layerColumn01.add("Button",undefined ,"Check for PSDs").onClick = function(){checkLayerForNewPSDs(null, false)};

         var layerColumn02 = layersTab.add("Group",undefined);
         layerColumn02.alignment = ['left','top'];
         layerColumn02.orientation = 'column';
         layerColumn02.add("Button",undefined ,"Ease In").onClick = function(){
             addEase(0, easeSpeedForEffectWindowScript, 0, 0.1);
             lastEaseUsed = "EI";
             }
         layerColumn02.add("Button",undefined ,"Ease Out").onClick = function(){
             addEase(0, 0.1, 0, easeSpeedForEffectWindowScript);
             lastEaseUsed = "EO"
             }
         layerColumn02.add("Button",undefined ,"Fast In Out").onClick = function(){
             addEase(0, 0.1, 0, 0.1);
             lastEaseUsed = "FIO"
             }
         layerColumn02.add("Button",undefined ,"Ease In Out").onClick = function(){
             addEase(0, easeSpeedForEffectWindowScript, 0, easeSpeedForEffectWindowScript);
             lastEaseUsed = "EIO";
             }
         var seperatedEaseControls = layerColumn02.add("checkbox",undefined ,"Seperate Ease Controls")
         seperatedEaseControls.onClick = function(){
             layersTab.children[2].children[0].children[2].enabled = seperatedEaseControls.value;
             layersTab.children[2].children[0].children[3].enabled = seperatedEaseControls.value;
             seperatedEaseControlsForWindowScript= seperatedEaseControls.value;
             }

         var layerColumn03 = layersTab.add("Group",undefined);
         layerColumn03.alignment = ['left','top'];
         layerColumn03.orientation = 'column';
         var easeSliderArea = layerColumn03.add('group')
         easeSliderArea.orientation = 'column';
         var easeSlider = easeSliderArea.add('slider{minvalue:.1, maxvalue:100, value:100}')
         var easeSliderValue = easeSliderArea.add('edittext{text:100, characters:4, justify:"center", active:true, enterKeySignalsOnChange:flase}');

         //secondEaseSliderArea.hide();
         var easeSlider02 = easeSliderArea.add('slider{minvalue:.1, maxvalue:100, value:100}');
         var easeSliderValue02 = easeSliderArea.add('edittext{text:100, characters:4, justify:"center", active:true, enterKeySignalsOnChange:flase}');
         easeSlider02.enabled = false;
         easeSliderValue02.enabled = false;
         easeSlider.onChanging= function(){
             easeSpeedForEffectWindowScript = easeSlider.value;
             easeSliderValue.text = easeSlider.value;
                if (easeAffectPreviousSelection==true){
                    continueAffectingEase(lastEaseUsed, easeSpeedForEffectWindowScript, easeSpeedForEffectWindowScript02);
                }
             }
         easeSliderValue.onChanging = function(){
             easeSlider.value =Number(easeSliderValue.text);

         }
         easeSliderValue.onChange= function(){
             //alert("On Change")

             if (Number(easeSliderValue.text)!=NaN){
                changeSliderValue(Number(easeSliderValue.text),easeSliderValue, easeSlider, easeSpeedForEffectWindowScript);
                easeSpeedForEffectWindowScript = Number(easeSliderValue.text);
                }
            //alert("Contunue 01")
            if (easeAffectPreviousSelection==true){
                //alert("Command Recieved 01")

                    continueAffectingEase(lastEaseUsed, easeSpeedForEffectWindowScript, easeSpeedForEffectWindowScript02);
                    //alert("Command 01 Proccessed");
                }
             }
         easeSlider02.onChanging= function(){
             easeSpeedForEffectWindowScript02 = easeSlider02.value;
             easeSliderValue02.text = easeSlider02.value;
                if (easeAffectPreviousSelection==true){
                    continueAffectingEase(lastEaseUsed, easeSpeedForEffectWindowScript, easeSpeedForEffectWindowScript02);
                }
             }
         easeSliderValue02.onChanging = function(){
             easeSlider02.value =Number(easeSliderValue02.text);

         }
         easeSliderValue02.onChange= function(){
             //alert("On Change")
             if (Number(easeSliderValue02.text)!=NaN){
                changeSliderValue(Number(easeSliderValue02.text),easeSliderValue02, easeSlider02, easeSpeedForEffectWindowScript02);
                easeSpeedForEffectWindowScript02 = Number(easeSliderValue02.text);
                }
            //alert("Continue 02");
            if (easeAffectPreviousSelection==true){
                //alert("Command Recieved 02")
                    continueAffectingEase(lastEaseUsed, easeSpeedForEffectWindowScript, easeSpeedForEffectWindowScript02);
                    //alert("Command 02 Proccessed");
                }
             }
        var Ease100Button = layerColumn03.add("button",undefined ,"100 Ease");
         Ease100Button.onClick = function(){
             easeSpeedForEffectWindowScript = 100;
             easeSlider.value=100;
            easeSliderValue.text = 100;
            easeSlider02.value=100;
            easeSliderValue02.text = 100;
            if (easeAffectPreviousSelection==true){
                    continueAffectingEase(lastEaseUsed, easeSpeedForEffectWindowScript, easeSpeedForEffectWindowScript02);
                }
             }

         var Ease80Button = layerColumn03.add("button",undefined ,"80 Ease");
         Ease80Button.onClick = function(){
             easeSpeedForEffectWindowScript = 80;
             easeSlider.value=80;
            easeSliderValue.text = 80;
            easeSlider02.value=80;
            easeSliderValue02.text = 80;
            if (easeAffectPreviousSelection==true){
                    continueAffectingEase(lastEaseUsed, easeSpeedForEffectWindowScript, easeSpeedForEffectWindowScript02);
                }
             }

         var Ease60Button = layerColumn03.add("button",undefined ,"60 Ease");
         Ease60Button.onClick = function(){
            easeSpeedForEffectWindowScript = 60;
            easeSlider.value=60;
            easeSliderValue.text = 60;
            easeSlider02.value=60;
            easeSliderValue02.text = 60;
            if (easeAffectPreviousSelection==true){
                    continueAffectingEase(lastEaseUsed, easeSpeedForEffectWindowScript, easeSpeedForEffectWindowScript02);
                }
            }
         var easeCheckbox = layerColumn03.add("checkbox",undefined ,"Continue Affect Keys");
         easeCheckbox.onClick = function(){easeAffectPreviousSelection=easeCheckbox.value};
         var TestCheck = layerColumn03.add("button",undefined ,"testCheck");
         TestCheck.onClick = function(){
             easeSliderArea.maximumSize=[20,20];
             //alert(easeSliderArea.children[2].type);
             //easeSliderArea.remove(3);
             //easeSliderArea.remove(2);
             easeSliderArea.layout.layout(true);
             easeSliderArea.layout.resize(true);

             //layerColumn03.easeSliderArea.remove(3);

             }


         var layerColumn04 = layersTab.add("Group",undefined);
         layerColumn04.alignment = ['left','top'];
         layerColumn04.orientation = 'column';
         layerColumn04.add("Button",undefined ,"Transform Drift").onClick = function(){addDrift(addEffectReturn("ADBE Geometry2"))};
         layerColumn04.add("Button",undefined ,"Stagger Layers").onClick = function(){staggerLayers(0)};
         layerColumn04.add("Button",undefined ,"Stagger Working").onClick = function(){staggerLayers(1)};
         layerColumn04.add("Button",undefined ,"Fill Working").onClick = function(){staggerLayers(2)};
         layerColumn04.add("Button",undefined ,"Distribue Sel. Layers").onClick = function(){distributeLayers()};
		 var transitionCheckbox = layerColumn04.add("checkbox",undefined ,"Add Transitions");
         transitionCheckbox.value = distributeTransition;
         transitionCheckbox.onClick = function(){distributeTransition=transitionCheckbox.value};
         //layerColumn04.add("Button",undefined ,"Test Distribue").onClick = function(){testDistributeLayers()};

         var fontColumn01 = fontsTab.add("Group",undefined);
         fontColumn01.alignment = ['left','top'];
         fontColumn01.orientation = 'column';
         fontColumn01.add("Button",undefined ,"Helvetica").onClick = function(){changeFontType("fontHelvetica")};
         fontColumn01.add("Button",undefined ,"Frutiger").onClick = function(){changeFontType("fontFrutiger")};
         fontColumn01.add("Button",undefined ,"Futura").onClick = function(){changeFontType("fontFutura")};
         fontColumn01.add("Button",undefined ,"Gill").onClick = function(){changeFontType("fontGill")};
         fontColumn01.add("Button",undefined ,"Univers").onClick = function(){changeFontType("fontUnivers")};
         fontColumn01.add("Button",undefined ,"Lato").onClick = function(){changeFontType("fontLato")};
         //fontColumn01.add("Button",undefined ,"Mont").onClick = function(){changeFontType("fontMont")};

         var fontColumn02 = fontsTab.add("Group",undefined);
         fontColumn02.alignment = ['left','top'];
         fontColumn02.orientation = 'column';
         fontColumn02.add("Button",undefined ,"Myriad").onClick = function(){changeFontType("fontMyriad")};
         fontColumn02.add("Button",undefined ,"Avenir").onClick = function(){changeFontType("fontAvenir")};
         fontColumn02.add("Button",undefined ,"TradeG").onClick = function(){changeFontType("fontTradeG")};
         fontColumn02.add("Button",undefined ,"Roboto").onClick = function(){changeFontType("fontRoboto")};
         fontColumn02.add("Button",undefined ,"Prox").onClick = function(){changeFontType("fontProx")};
         fontColumn02.add("Button",undefined ,"Mont").onClick = function(){changeFontType("fontMont")};
         fontColumn02.add("Button",undefined ,"Test").onClick = function(){var selLayer = app.project.activeItem.selectedLayers[0].sourceText.value.fontObject;
             alert(selLayer.postScriptName);
             //reflectAll(selLayer)
             };
         //fontColumn02.add("Button",undefined ,"Prox").onClick = function(){alert(app.documents[0].fonts.everyItem().name)};

         var fontColumn03 = fontsTab.add("Group",undefined);
         fontColumn03.alignment = ['left','top'];
         fontColumn03.orientation = 'column';
         fontColumn03.add("Button",undefined ,"Light").onClick = function(){fontSizeIndexForWindowScript = 1};
         fontColumn03.add("Button",undefined ,"Med").onClick = function(){fontSizeIndexForWindowScript = 2};
         fontColumn03.add("Button",undefined ,"Obli").onClick = function(){fontSizeIndexForWindowScript = 3};
         fontColumn03.add("Button",undefined ,"Black").onClick = function(){fontSizeIndexForWindowScript = 4};


        myEffectsPanel.layout.layout(true);

        return myEffectsPanel;
    }
    var scriptShower = buildPanel(windowObj);//Show panel based on the Build Panel Function

    if (scriptShower != null && scriptShower instanceof Window){//Upon Creation, put into center and show the panel
        scriptShower.center();
        scriptShower.show();
        }
    }
makeEffectsPanel(this)//Make instance of Window Effects Panel

}