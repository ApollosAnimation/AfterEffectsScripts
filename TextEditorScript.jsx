{
   function addLines(inputText){
       try{
            var inputArray = new Array;
            inputArray = inputText.split("\n\n");
            var theComp = app.project.activeItem;
            alert
            for (i =inputArray.length-1; i>=0; --i){
                //alert(i);
                var newText =  theComp.layers.addText(inputArray[i]);
                }
            return"";
           }catch(err){
                alert(err);
                return inputText;
               }

       }
   
function getLines(){
    var textLayerGroup = app.project.activeItem.selectedLayers;
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
    }    
    
function replaceLines(inputText){
           try{
            inputArray = new Array;
            inputArray = inputText.split("\n\n");
            var textLayerGroup = app.project.activeItem.selectedLayers;
            for (i = 0; i<textLayerGroup.length; ++i){
                if (inputArray[i]!=undefined){
                    textLayerGroup[i].property("Source Text").setValue(inputArray[i]);
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

function swapText(inputText, allText){
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
            returnArray = findAndSpliceItem(textSourceArray[i].text, inputArray[i], returnArray)
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

function findAndSpliceItem(oldText, newText, newReturnArray){
        for (j=0; j<newReturnArray.length; j++){
                if (newReturnArray[j] == newText){
                        newReturnArray[j] = oldText;
                        return newReturnArray;
                    }
            }
        return newReturnArray;
    } 


function reflectAll(reflectable){//this is a debugging function that lists all information about a given element, and is a great break point to analyze in Extendscript
        alert(reflectable.reflect.name);   
        alert(reflectable.reflect.properties);
        alert(reflectable.reflect.methods);
        }
   
function makeTextPanel(windowObj){
    
    function buildPanel(windowObj){
         var myTextPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Text Editor", undefined, {resizeable:true});
          
            myTextPanel.orientation = "column";
            myTextPanel.alignChildren = ["center","fill"];
            var editTextArea = myTextPanel.add("edittext", undefined, "", {multiline:true, wantReturn:true});
            editTextArea.alignment = ["fill","fill"];
            editTextArea.helpTip = "Two line breaks tell the script to seperate the text into 2 seperate layers";
            var editTextAreaGraphics = editTextArea.graphics;
            //alert(editTextArea.graphics.foregroundColor);
            
            editTextArea.graphics.textBoxBrush = editTextArea.graphics.newBrush(0,[.13725490196078431, 0.1372549019607843, 0.1372549019607843, 1]);
            editTextArea.graphics.backgroundColor = editTextArea.graphics.textBoxBrush;
            var buttonTextArea = myTextPanel.add("group", undefined);
            buttonTextArea.orientation = "row";
            buttonTextArea.alignment = ["center","bottom"];
            var addLinesButton = buttonTextArea.add("button",undefined, "Add all lines");
            var replaceTextButton = buttonTextArea.add("button",undefined, "Replace selected text layers");
            var getSelectedTextButton = buttonTextArea.add("button",undefined, "Get selected text layers");
            var swapTextButton = buttonTextArea.add("button",undefined, "Swap selected lines");
            myTextPanel.onResize = function(){
                    myTextPanel.layout.resize();
                    myTextPanel.layout.layout();
                }
            addLinesButton.onClick = function(){
                    if (editTextArea.text == ""){
                        alert("No text to place")
                        }
                    editTextArea.text = addLines(editTextArea.text);
                }
            replaceTextButton.onClick = function(){
                    if(app.project.activeItem.selectedLayers == ""){
                        alert("No Layers Selected")}
                    else if (editTextArea.text == ""){
                        alert("No text to replace with")
                        }
                    else{
                        editTextArea.text = replaceLines(editTextArea.text);                            
                    }
                }
            getSelectedTextButton.onClick = function(){
                    if(app.project.activeItem.selectedLayers == ""){
                        alert("No Layers Selected");}
                    else{
                        editTextArea.text = getLines();                            
                    }

                }
            swapTextButton.onClick = function(){
                if(editTextArea.textselection == ""){
                    alert("No text is selected");
                    }else{
                        editTextArea.text = swapText(editTextArea.textselection, editTextArea.text);
                    }
                }
        myTextPanel.layout.layout(true);
        return myTextPanel;
        }
    var scriptShower = buildPanel(windowObj);
    
    if (scriptShower != null && scriptShower instanceof Window){
        scriptShower.center();
        scriptShower.show();
        }
    }
makeTextPanel(this)
    
}