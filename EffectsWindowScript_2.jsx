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
        var theComp = app.project.activeItem;
        var newSolid = theComp.layers.addSolid( [.95, .95, .95], "Solid", theComp.width, theComp.height, 1.0, theComp.duration);
        newSolid.name = "Solid";
        if(adjustBool == 1){
            newSolid.adjustmentLayer = true;
            newSolid.name = "Adjustment Layer";
            }
        app.endUndoGroup();
        }

    function addNull(){//Make a Null Layer
        app.beginUndoGroup("Add Null");
        var theComp = app.project.activeItem
        var newNull = theComp.layers.addNull()
        newNull.name = "Null"
        newNull.name = "Null"
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
                        selLayers[i].inPoint = ((layerLength)*[i]);
                        selLayers[i].outPoint = ((layerLength)*[i+1]);
                        break;
                    case 1:
                        var layerLength = ((theComp.workAreaDuration)/(selLayers.length));
                        selLayers[i].inPoint = ((layerLength)*[i]+(theComp.workAreaStart));
                        selLayers[i].outPoint = ((layerLength)*[i+1]+(theComp.workAreaStart));
                        break;
                    case 2:
                        selLayers[i].inPoint = ((theComp.workAreaStart));
                        selLayers[i].outPoint = ((theComp.workAreaStart)+(theComp.workAreaDuration));
                        break;
                    default:
                    alert("Unrecognized Command");
                    break
                        
                    }
                }
        }
    }

    function reflectAll(reflectable){//this is a debugging function that lists all information about a given element, and is a great break point to analyze in Extendscript
        alert(reflectable.reflect.name);   
        alert(reflectable.reflect.properties);
        alert(reflectable.reflect.methods);
        }
    
    function alertTest(){
    alert("Ping");
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
         effectsColumn01.alignment = ['left','top']; 
         effectsColumn01.orientation = 'column';
         effectsColumn01.add("Button",undefined ,"Add Gaus").onClick = function(){addEffect ("ADBE Gaussian Blur 2")};
         effectsColumn01.add("Button",undefined ,"Add HueSat").onClick = function(){addEffect ("ADBE HUE SATURATION")};
         effectsColumn01.add("Button",undefined ,"Add Fill").onClick = function(){addEffect ("ADBE Fill")};
         effectsColumn01.add("Button",undefined ,"Add DropShdw").onClick = function(){addEffect ("ADBE Drop Shadow")};
         effectsColumn01.add("Button",undefined ,"Add Linear Wipe").onClick = function(){addEffect ("ADBE Linear Wipe")};
         effectsColumn01.add("Button",undefined ,"Add Transform").onClick = function(){addEffect ("ADBE Geometry2")};
         
         var effectsColumn02 = basicEffectsTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
         effectsColumn02.alignment = ['left','top'];         
         effectsColumn02.orientation = 'column';
         effectsColumn02.add("Button",undefined ,"Add Gradient").onClick = function(){addEffect ("ADBE Ramp")};
         effectsColumn02.add("Button",undefined ,"Add LightSweep").onClick = function(){addEffect ("CC Light Sweep")};
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
         
         var layerColumn01 = layersTab.add("Group",undefined);
         layerColumn01.alignment = ['left','top'];
         layerColumn01.orientation = 'column';
         layerColumn01.add("Button",undefined ,"Add Solid").onClick = function(){addSolid(0)};
         layerColumn01.add("Button",undefined ,"Add Null").onClick = function(){addNull()};
         layerColumn01.add("Button",undefined ,"Add Adjustments").onClick = function(){addSolid(1)};
         layerColumn01.add("Button",undefined ,"Add Time Remap").onClick = function(){toggleTimeRemap()};
         layerColumn01.add("Button",undefined ,"Match Height").onClick = function(){matchCompSize(0)};
         layerColumn01.add("Button",undefined ,"Match Width").onClick = function(){matchCompSize(1)};
         
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
         var easeCheckbox = layerColumn02.add("checkbox",undefined ,"Continue Affect Keys");
         easeCheckbox.onClick = function(){easeAffectPreviousSelection=easeCheckbox.value};
         /*
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
         */
         
         var layerColumn04 = layersTab.add("Group",undefined);
         layerColumn04.alignment = ['left','top'];
         layerColumn04.orientation = 'column';
         layerColumn04.add("Button",undefined ,"Transform Drift").onClick = function(){addDrift(addEffectReturn("ADBE Geometry2"))};
         layerColumn04.add("Button",undefined ,"Stagger Layers").onClick = function(){staggerLayers(0)};
         layerColumn04.add("Button",undefined ,"Stagger Working").onClick = function(){staggerLayers(1)};
         layerColumn04.add("Button",undefined ,"Fill Working").onClick = function(){staggerLayers(2)};
         
         var fontColumn01 = fontsTab.add("Group",undefined);
         fontColumn01.alignment = ['left','top'];
         fontColumn01.orientation = 'column';
         fontColumn01.add("Button",undefined ,"Helvetica").onClick = function(){changeFontType("fontHelvetica")};
         fontColumn01.add("Button",undefined ,"Frutiger").onClick = function(){changeFontType("fontFrutiger")};
         fontColumn01.add("Button",undefined ,"Futura").onClick = function(){changeFontType("fontFutura")};
         fontColumn01.add("Button",undefined ,"Gill").onClick = function(){changeFontType("fontGill")};
         fontColumn01.add("Button",undefined ,"Univers").onClick = function(){changeFontType("fontUnivers")};
         
         var fontColumn02 = fontsTab.add("Group",undefined);
         fontColumn02.alignment = ['left','top'];
         fontColumn02.orientation = 'column';
         fontColumn02.add("Button",undefined ,"Myriad").onClick = function(){changeFontType("fontMyriad")};
         fontColumn02.add("Button",undefined ,"Avenir").onClick = function(){changeFontType("fontAvenir")};
         fontColumn02.add("Button",undefined ,"TradeG").onClick = function(){changeFontType("fontTradeG")};
         fontColumn02.add("Button",undefined ,"Roboto").onClick = function(){changeFontType("fontRoboto")};
         
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
