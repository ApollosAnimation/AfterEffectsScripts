
var includedFiles = [ "../utils/Lyr_Utils.jsx", "../utils/ExtendScript_Utils.jsx", "../utils/ShapeLyr_Utils.jsx", "../utils/Project_Utils.jsx", "../utils/Comp_Utils.jsx"];
var LyrUtils = $.global.AA_Scripts.LyrUtils;
var ExtendScriptUtils = $.global.AA_Scripts.ExtendScriptUtils;
var ShapeLyrUtils = $.global.AA_Scripts.ShapeLyrUtils;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var CompUtils = $.global.AA_Scripts.CompUtils;
$.global.AA_Scripts.EffectsFuncs = {};
var EffectsFuncs = $.global.AA_Scripts.EffectsFuncs;

EffectsFuncs.continueAffectingEase = function (lastEaseUsed, speed01, speed02, seperatedEaseControlsForWindowScript){
            switch(lastEaseUsed){
                case "EI":
                //alert("EI")
                    LyrUtils.addEase(0, speed01, 0, 0.1);
                    break;
                case "EO":
                //alert("EO")
                    if (seperatedEaseControlsForWindowScript==true){
                     LyrUtils.addEase(0, 0.1, 0, speed02);
                        }else{
                    LyrUtils.addEase(0, 0.1, 0, speed01);
                    }
                    break;
                case "FIO":
                //alert("FIO")
                    break;
                case "EIO":
                //alert("EIO")
                    if (seperatedEaseControlsForWindowScript==true){
                    LyrUtils.addEase(0, speed01, 0, speed02);
                    }else{
                    LyrUtils.addEase(0, speed01, 0, speed01);
                    }
                    break;
                default:
                    break;
            }
        }
EffectsFuncs.changeSliderValue = function (newValue, easeSliderValue, easeSlider, globalSpeed){
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

EffectsFuncs.insertLayerNullParents= function (transferBool){//Function used to add keyframes to the Transform effect if the "Add Drift" Function is called
    app.beginUndoGroup("Add Nulls For Text Layers");
    var layers = app.project.activeItem.selectedLayers;
    var newLayerName = "NulledTransform";
    var currentNameCount = CompUtils.checkLastSuffixNumberedLayer(app.project.activeItem, newLayerName);
    for (i = 0; i <layers.length; i++){
        currentNameCount++;
        //var currentLayer = layers[i];
        var newLayerNumberedName = newLayerName + ExtendScriptUtils.numberToPaddedString(currentNameCount, 100);
        //Check if layer name already exists, and iterate up if needed
        if(!(CompUtils.checkLayerNameUnique(layers[i].containingComp, newLayerNumberedName))){
            return null;
            }
        this.addNullParentForLayer(layers[i], newLayerNumberedName, transferBool);
        }
    
    app.endUndoGroup();
}

EffectsFuncs.addNullParentForLayer= function (baseLayer, newLayerName, transferBool){//Function used to add keyframes to the Transform effect if the "Add Drift" Function is called
    //$.writeln ("New Text Layer Name: "+ newLayerName);
    //textLayer.name = newTextLayerName;
    var newNullLayer = ShapeLyrUtils.addNullToLayer(ProjectUtils.verifyInstanceOfCompActive(app.project.activeItem), baseLayer, transferBool);
    if (baseLayer instanceof TextLayer){
        ShapeLyrUtils.alignNullToTextLayer(baseLayer, newNullLayer, false, true);
        /**
        var layerHalftime = ((baseLayer.outPoint - baseLayer.inPoint)*.5) + baseLayer.inPoint;
        var textRectangle = baseLayer.sourceRectAtTime(layerHalftime,true);
        //Center height is Height*.5 + Top(which is usually negative)
        //Height is height
        var rectPath = newNullLayer.property("ADBE Root Vectors Group").property("ADBE Vector Shape - Rect");
        rectPath.property("ADBE Vector Rect Size").setValue([textRectangle.width,textRectangle.height]);
        rectPath.property("ADBE Vector Rect Position").setValue([(textRectangle.width*.5)+textRectangle.left,(textRectangle.height*.5)+textRectangle.top]);
        **/
        }
    //Early terminating for test purposes
    return true;
    
    //newNullLayer.name = newTextLayerName+"Null";
    /**
    if (baseLayer instanceof TextLayer){
        var referenceLayerEffect = newNullLayer.Effects.addProperty('ADBE Layer Control');
        var referenceLayer = referenceLayerEffect.property('Layer');
        referenceLayer.setValue(baseLayer.index);
        var referenceTimeEffect = newNullLayer.Effects.addProperty('ADBE Slider Control');
        referenceTimeEffect.name = 'referenceTime';
        referenceTimeEffect.property('Slider').setValue(3);
        var textSize = textLayer.sourceRectAtTime(referenceTimeEffect.property('Slider').value, false);
        }
    CompUtils.transferTransformGroupKeys(baseLayer, newNullLayer);
    **/
    
}
