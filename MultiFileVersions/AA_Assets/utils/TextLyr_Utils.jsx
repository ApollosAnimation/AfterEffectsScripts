var includedFiles = [ "../utils/Project_Utils.jsx", "../utils/Lyr_Utils.jsx"];
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var LyrUtils = $.global.AA_Scripts.LyrUtils;
$.global.AA_Scripts.TextLyrUtils = {};
var TextLyrUtils = $.global.AA_Scripts.TextLyrUtils;

TextLyrUtils.addTextAnim = function (easeType, layers, timeStart, timeDuration){//Adds text animation, based on which button is calling upon this function, It will either make the tet ease in, out, or smoothly transition, and add keyframes for quick access
        app.beginUndoGroup("Add Text Anim");
            try{
            var layers = ((layers !== undefined)&&(layers !== null)) ? layers : app.project.activeItem.selectedLayers;
            var textGroup = app.project.activeItem.selectedLayers;
            for (i=0; i<=((textGroup.length)-1); i++){//For Every Layer Selected
                var newAnim = textGroup[i].Text.Animators.addProperty("ADBE Text Animator");//Add Animator
                var newAnimSelector = newAnim.property("ADBE Text Selectors").addProperty("ADBE Text Selector");//Add standard range selector
                var timeStart = ((timeStart !== undefined)&&(timeStart !== null)) ? timeStart : app.project.activeItem.time;//Get Time
                var timeDuration = ((timeDuration !== undefined)&&(timeDuration !== null)) ? timeDuration : 2;//Get Time
                var easeShapeIndex=2;//Make Variable and Set Default for shape index
                var easeMinVal=75;//Make Variable and Set Default for the Ease low
                var easeMaxVal=-75;//Make Variable and Set Default for the ease high
                var keyframeTimes = new Array( timeStart, (timeStart+timeDuration));//Make Variable and Set Default for the offset keyframes
                var keyframeValues = new Array(-100, 100);//Make Variable and Set Default for the offset values
                if(easeType=="Ramp Up"){//Customize variable per button push
                        easeShapeIndex=3;
                        easeMinVal=75;
                        easeMaxVal=-75;
                        keyframeTimes = [(timeStart-1), (timeStart+timeDuration)]
                    }else if(easeType=="Ramp Down"){
                        easeShapeIndex=2;
                        easeMinVal=75;
                        easeMaxVal=-75;
                        keyframeTimes = [(timeStart), (timeStart+timeDuration)]
                    }else if(easeType=="Smooth"){
                        easeShapeIndex=6;
                        easeMinVal=0;
                        easeMaxVal=0;
                        keyframeTimes = [(timeStart-(timeDuration*.5)), (timeStart+(timeDuration*.5))]
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
TextLyrUtils.changeFontType = function (calledFont, fontSizeIndexForWindowScript){
            switch(calledFont){
                    case "fontHelvetica":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontHelvetica", "HelveticaNeueLTStd-Lt");
                                    break;
                                case 2:
                                    this.changeFont("fontHelvetica", "HelveticaNeueLTStd-Md");
                                    break;
                                case 3:
                                    this.changeFont("fontHelvetica", "HelveticaNeueLTStd-Bd");
                                    break;
                                case 4:
                                    this.changeFont("fontHelvetica", "HelveticaNeueLTStd-Blk");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontFrutiger":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontFrutiger", "FrutigerLTStd-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontFrutiger", "FrutigerLTStd-Roman");
                                    break;
                                case 3:
                                    this.changeFont("fontFrutiger", "FrutigerLTStd-Bold");
                                    break;
                                case 4:
                                    this.changeFont("fontFrutiger", "FrutigerLTStd-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontFutura":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontFutura", "FuturaStd-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontFutura", "FuturaStd-Medium");
                                    break;
                                case 3:
                                    this.changeFont("fontFutura", "FuturaStd-Heavy");
                                    break;
                                case 4:
                                    this.changeFont("fontFutura", "FuturaStd-Bold");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontGill":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontGill", "GillSansMT");
                                    break;
                                case 2:
                                    this.changeFont("fontGill", "GillSansMT");
                                    break;
                                case 3:
                                    this.changeFont("fontGill", "GillSansMT-Bold");
                                    break;
                                case 4:
                                    this.changeFont("fontGill", "GillSansMT-Bold");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontUnivers":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontUnivers", "UniversLTStd-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontUnivers", "UniversLTStd");
                                    break;
                                case 3:
                                    this.changeFont("fontUnivers", "UniversLTStd-Bold");
                                    break;
                                case 4:
                                    this.changeFont("fontUnivers", "UniversLTStd-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontMyriad":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontMyriad", "MyriadPro-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontMyriad", "MyriadPro-Regular");
                                    break;
                                case 3:
                                    this.changeFont("fontMyriad", "MyriadPro-Bold");
                                    break;
                                case 4:
                                    this.changeFont("fontMyriad", "MyriadPro-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontAvenir":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontAvenir", "AvenirLTStd-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontAvenir", "AvenirLTStd-Medium");
                                    break;
                                case 3:
                                    this.changeFont("fontAvenir", "AvenirLTStd-Heavy");
                                    break;
                                case 4:
                                    this.changeFont("fontAvenir", "AvenirLTStd-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontTradeG":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontTradeG", "TradeGothicLTStd-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontTradeG", "TradeGothicLTStd");
                                    break;
                                case 3:
                                    this.changeFont("fontTradeG", "TradeGothicLTStd-Bold");
                                    break;
                                case 4:
                                    this.changeFont("fontTradeG", "TradeGothicLTStd-Bd2");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontRoboto":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontRoboto", "Roboto-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontRoboto", "Roboto-Regular");
                                    break;
                                case 3:
                                    this.changeFont("fontRoboto", "Roboto-Bold");
                                    break;
                                case 4:
                                    this.changeFont("fontRoboto", "Roboto-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontProx":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontProx", "ProximaNova-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontProx", "ProximaNova-Regular");
                                    break;
                                case 3:
                                    this.changeFont("fontProx", "ProximaNova-Bold");
                                    break;
                                case 4:
                                    this.changeFont("fontProx", "ProximaNova-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontLato":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontLato", "Lato-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontLato", "Lato-Regular");
                                    break;
                                case 3:
                                    this.changeFont("fontLato", "Lato-Bold");
                                    break;
                                case 4:
                                    this.changeFont("fontLato", "Lato-Black");
                                    break;
                                default:
                                    alert("undefined size")
                            }
                        break;
                    case "fontMont":
                        switch(fontSizeIndexForWindowScript){
                                case 1:
                                    this.changeFont("fontMont", "Montserrat-Light");
                                    break;
                                case 2:
                                    this.changeFont("fontMont", "Montserrat-Regular");
                                    break;
                                case 3:
                                    this.changeFont("fontMont", "Montserrat-Bold");
                                    break;
                                case 4:
                                    this.changeFont("fontMont", "Montserrat-Black");
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
TextLyrUtils.changeFont = function (undoName, newFontName){//Changes font, font size deterimned prior to this function being called
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
TextLyrUtils.addLines = function (inputText, placementLayer){//Changes font, font size deterimned prior to this function being called
    app.beginUndoGroup("addLines");
    try{
        var theComp = app.project.activeItem;
        var placementLayer = ((placementLayer !== undefined)&&(placementLayer !== null)) ? placementLayer : 
            ((theComp.selectedLayers.length > 0) ? theComp.selectedLayers[0]:null);
        var inputArray = new Array;
        inputArray = inputText.split("\n\n");
        for (i =inputArray.length-1; i>=0; --i){
            //alert(i);
            var newText =  theComp.layers.addText(inputArray[i]);
            if(placementLayer != null) {newText.moveBefore(placementLayer)}
            }
        return"";
       }catch(err){
            alert(err);
            return inputText;
           }
        app.endUndoGroup();
        }
    
TextLyrUtils.getLines = function (textLayerGroup){
    //app.beginUndoGroup("getLines");
    var textLayerGroup = ((textLayerGroup !== undefined)&&(textLayerGroup !== null)) ? textLayerGroup : app.project.activeItem.selectedLayers; 
    var textSourceArray = new Array;
    for (i = 0; i<textLayerGroup.length; ++i){
            textSourceArray.push(textLayerGroup[i].property("Source Text").value);
        }
    var returnString = new String;
    for (i = 0; i<textSourceArray.length; ++i){
            returnString = returnString.concat(textSourceArray[i].text+"\n\n");
        }
    returnString = returnString.slice(0,returnString.length-2);
    return returnString;
    //app.endUndoGroup();
    }
//TextLyrUtils.replaceLine = function (inputTextLayer, newText){
TextLyrUtils.replaceLines = function (inputText, textLayerGroup){
    try{
        var textLayerGroup = ((textLayerGroup !== undefined)&&(textLayerGroup !== null)) ? textLayerGroup : app.project.activeItem.selectedLayers; 
        inputArray = [];
        inputArray = inputText.split("\n\n");
        for (i = 0; i<textLayerGroup.length; ++i){
            if (inputArray[i]!=undefined){
                var newSourceText = inputArray[i].replace(/\\n/g, '\n');
                textLayerGroup[i].property("Source Text").setValue(newSourceText);
                }
            }
        inputArray.splice(0,textLayerGroup.length)
        var returnString = new String;
        for (i = 0; i<inputArray.length; ++i){
            returnString = returnString.concat(inputArray[i]+"\n\n");
        }
        returnString = returnString.slice(0,returnString.length-2)
        return returnString;
       }catch(err){
            alert(err);
            return inputText;
           }
    }
TextLyrUtils.swapText= function (inputText, allText){
    var textLayerGroup = app.project.activeItem.selectedLayers;
    var textSourceArray = new Array;
    for (i = 0; i<textLayerGroup.length; ++i){
            textSourceArray.push(textLayerGroup[i].property("Source Text").value);
        }
     var inputArray = new Array;
     inputArray = inputText.split("\n\n");
     var allTextArray = new Array;
     allTextArray = allText.split("\n\n");
     var returnArray = allTextArray;
     for (i = 0; i<textSourceArray.length; ++i){
         if (inputArray[i]!= undefined){
            textLayerGroup[i].property("Source Text").setValue(inputArray[i]);
            //returnArray.splice(i,1,textSourceArray[i].text)
            returnArray = this.findAndSpliceItem(textSourceArray[i].text, inputArray[i], returnArray)
        }
     }
    
    var returnString = new String;
    for (i = 0; i<returnArray.length; ++i){
            returnString = returnString.concat(returnArray[i]+"\n\n");
        }
    returnString = returnString.slice(0,returnString.length-2);
    //reflectAll (returnArray);
    //reflectAll (returnString);

    return returnString;
    }
TextLyrUtils.findAndSpliceItem = function (oldText, newText, newReturnArray){
        for (j=0; j<newReturnArray.length; j++){
                if (newReturnArray[j] == newText){
                        newReturnArray[j] = oldText;
                        return newReturnArray;
                    }
            }
        return newReturnArray;
    }
TextLyrUtils.updateTextLayer = function (compName, layerName, newTextValue, fontArray){
    var foundComp = ProjectUtils.findComp(compName);
    if((foundComp) !=null ){
        var foundLayer = LyrUtils.findLayer(foundComp, layerName);
        if (foundLayer!=null){
            var layerSourceText = foundLayer.property("Source Text");
            if(layerSourceText != null){
                layerSourceText.expressionEnabled = false;
                var newLayerTextDocument = layerSourceText.value;
                newLayerTextDocument.text = newTextValue.split(/\\n/g).join("\n");
                newLayerTextDocument.font = fontArray[1][0].toString();
                var wordChangeArray = []
                for(i=1; i<=fontArray[2].length-1; i++){
                     var newTextValueString = newLayerTextDocument.text;
                     var searchSymbol = fontArray[2][i];
                     if (searchSymbol == "\"") {searchSymbol =new RegExp ("\“|\”|\"|\"", 'g'); }
                        var newTextValueArray = newTextValueString.split(searchSymbol);
                        if (newTextValueArray.length > 1){
                        var newTextValueString = newTextValueArray.join("");
                        newLayerTextDocument.text = newTextValueString;
                         if (newTextValueArray.length > 1){
                             for (j=1; j<newTextValueArray.length; j+=2){
                                 if (newTextValueArray[j] !=""){
                                wordChangeArray.push([newTextValueArray[j], i]);
                                }
                            }
                         }
                    }
                }
                layerSourceText.setValue(newLayerTextDocument);
                if (wordChangeArray.length > 0){
                    for (i=0; i<wordChangeArray.length;i++){
                        var regex = new RegExp (wordChangeArray[i][0],"g")
                        var searchArray;
                        while ((searchArray = regex.exec(layerSourceText.value.text)) !== null) {
                            var endPoint = regex.lastIndex;
                            var wordLength = wordChangeArray[i][0];
                            var startPoint = endPoint - wordChangeArray[i][0].length;
                            var newFont = fontArray[1][wordChangeArray[i][1]];
                            newLayerTextDocument.characterRange(startPoint, endPoint).font = newFont;
                        }
                    }
                }
                layerSourceText.setValue(newLayerTextDocument);
            }
        }
    }
    }
TextLyrUtils.findTextLayers = function (comp){
    return LyrUtils.findLayersOfType (comp, TextLayer, null);
    }
TextLyrUtils.resizeTextLayer = function (textLayer, targetWidth, timeRef, growBool){//Returns null in error / size object of the text layer after resizing; with provided text layer, and desired width (default 85%), time Ref of size (default 0), and if you want it to grow(dafault no)
    var targetWidth = ((targetWidth !== undefined)&&(targetWidth !== null)) ? targetWidth : textLayer.containingComp.width*.85; if ((targetWidth == undefined)|(targetWidth == null)){return null;}
    var timeRef = ((timeRef !== undefined)&&(timeRef !== null)) ? timeRef : 0;
    var growBool = ((growBool !== undefined)&&(growBool !== null)) ? growBool : false;
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
TextLyrUtils.setTextFontSize = function (textLayer, fontSize){//Returns True/Null if the layer is a text layer, setting the layers font size
            if (!(textLayer instanceof TextLayer)){return null;}
            var textLayerProp = textLayer.property("Source Text");
            var textLayerDoc = textLayerProp.value;
            textLayerDoc.fontSize = fontSize;
            textLayerProp.setValue(textLayerDoc);
            return true;
            }
