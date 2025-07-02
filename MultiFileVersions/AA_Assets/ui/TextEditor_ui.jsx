
var includedFiles = ["../utils/Lyr_Utils.jsx", "../utils/TextLyr_Utils.jsx"];

var LyrUtils = $.global.AA_Scripts.LyrUtils;
var TextLyrUtils = $.global.AA_Scripts.TextLyrUtils;

if (!$.global.AA_Scripts) {$.global.AA_Scripts = {};}
$.global.AA_Scripts.TextEditorUI = {};
var TextEditorUI  = $.global.AA_Scripts.TextEditorUI ;

TextEditorUI .buildPanel = function (windowObj){
    var myTextPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Text Editor", undefined, {resizeable:true});
    myTextPanel.orientation = "column";
    myTextPanel.alignChildren = ["center","fill"];
    var editTextArea = myTextPanel.add("edittext", undefined, "", {multiline:true, wantReturn:true});
    editTextArea.alignment = ["fill","fill"];
    editTextArea.helpTip = "Two line breaks tell the script to seperate the text into 2 seperate layers";
    var editTextAreaGraphics = editTextArea.graphics;
    editTextArea.graphics.textBoxBrush = editTextArea.graphics.newBrush(0,[.13725490196078431, 0.1372549019607843, 0.1372549019607843, 1]);
    editTextArea.graphics.backgroundColor = editTextArea.graphics.textBoxBrush;
    var buttonTextArea = myTextPanel.add("group", undefined);
    buttonTextArea.orientation = "row";
    buttonTextArea.alignment = ["center","bottom"];
    var addLinesButton = buttonTextArea.add("button",undefined, "Add all lines");
    var replaceTextButton = buttonTextArea.add("button",undefined, "Replace selected text layers");
    var getSelectedTextButton = buttonTextArea.add("button",undefined, "Get selected text layers");
    var swapTextButton = buttonTextArea.add("button",undefined, "Swap selected lines");
    var addMarkersButton = buttonTextArea.add("button",undefined, "Add markers with comments per line");
    myTextPanel.onResize = function(){
            myTextPanel.layout.resize();
            myTextPanel.layout.layout();
        }
    addLinesButton.onClick = function(){
            if (editTextArea.text == ""){
                alert("No text to place")
                }
            editTextArea.text = TextLyrUtils.addLines(editTextArea.text);
        }
    replaceTextButton.onClick = function(){
            if(app.project.activeItem.selectedLayers == ""){
                alert("No Layers Selected")}
            else if (editTextArea.text == ""){
                alert("No text to replace with")
                }
            else{
                app.beginUndoGroup("replaceLines");
                editTextArea.text = TextLyrUtils.replaceLines(editTextArea.text);
                app.endUndoGroup();
            }
        }
    getSelectedTextButton.onClick = function(){
            if(app.project.activeItem.selectedLayers == ""){
                alert("No Layers Selected");}
            else{
                app.beginUndoGroup("getLines");
                editTextArea.text = TextLyrUtils.getLines();
                app.endUndoGroup();
            }

        }
    swapTextButton.onClick = function(){
        if(editTextArea.textselection == ""){
            alert("No text is selected");
            }else{
                app.beginUndoGroup("swapText");
                editTextArea.text = TextLyrUtils.swapText(editTextArea.textselection, editTextArea.text);
                app.beginUndoGroup("getLines");
            }
        }
    addMarkersButton.onClick = function(){
            if(editTextArea.text== ""){
            alert("No text to add as comments");
            }else{
                editTextArea.text = LyrUtils.addMarkers(editTextArea.text);
            }
        }
myTextPanel.layout.layout(true);
return myTextPanel;
}