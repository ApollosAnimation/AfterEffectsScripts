{
    function alertTest(){
    alert("Ping");
    }

function duplicateSelectedLayer(duplicateValue){
    //alert(duplicateValue);
    app.beginUndoGroup("Add Effect");
    var duplicateLayer = app.project.activeItem.selectedLayers[0];        
    for (i=0; i<duplicateValue; i++){
        if(isValid(duplicateLayer)== false){
        }else{
            //alert(duplicateLayer.name);
            duplicateLayer.duplicate()
        }
    }
    app.endUndoGroup();
    }
function duplicateActiveItem(duplicateValue){
    //alert(duplicateValue);
    app.beginUndoGroup("Add Effect");
    var duplicateItem = app.project.activeItem;        
    for (i=0; i<duplicateValue; i++){
        if(isValid(duplicateItem)== false){
        }else{
            //alert(duplicateLayer.name);
            duplicateItem.duplicate()
        }
    }
    app.endUndoGroup();
    }
    
function makeEffectsPanel(windowObj){
    
    function buildPanel(windowObj){
         var myEffectsPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Duplicate Tool", undefined, {resizeable:true});
          
         var myEffectsTabs = myEffectsPanel.add("tabbedpanel",undefined);
         var duplicateTab = myEffectsTabs.add("tab", undefined, "Duplicate Tool", {orientation:'row',alignment:['left','top']});
         duplicateTab.orientation = 'row';
         
         var duplicateColumn01 = duplicateTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
         duplicateColumn01.orientation = 'column';
         var duplicateValue = duplicateColumn01.add('edittext{text:2, characters:4, justify:"center", active:true, enterKeySignalsOnChange:flase}');
         duplicateColumn01.add("Button",undefined ,"Duplicate Sel Layer").onClick = function(){duplicateSelectedLayer (Number(duplicateValue.text))};
         duplicateColumn01.add("Button",undefined ,"Duplicate Active Item").onClick = function(){duplicateActiveItem (Number(duplicateValue.text))};
        
        myEffectsPanel.layout.layout(true);
        
            
        return myEffectsPanel;
        }
    var scriptShower = buildPanel(windowObj);
    
    if (scriptShower != null && scriptShower instanceof Window){
        scriptShower.center();
        scriptShower.show();
        }
    }
makeEffectsPanel(this)
    
}