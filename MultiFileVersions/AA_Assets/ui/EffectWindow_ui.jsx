var includedFiles = ["../inits/EffectsWindow_Vars.jsx", "../logic/EffectsWindow_Logic.jsx","../utils/System_Utils.jsx", "../utils/Comp_Utils.jsx", "../utils/ShapeLyr_Utils.jsx", "../utils/TextLyr_Utils.jsx"];

var EffectsVars = $.global.AA_Scripts.EffectsVars;
var EffectsFuncs = $.global.AA_Scripts.EffectsFuncs;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
var LyrUtils = $.global.AA_Scripts.LyrUtils;
var TextLyrUtils = $.global.AA_Scripts.TextLyrUtils;
var CompUtils = $.global.AA_Scripts.CompUtils;
var ShapeLyrUtils = $.global.AA_Scripts.ShapeLyrUtils;
$.global.AA_Scripts.EffectsUI = {};
var EffectsUI = $.global.AA_Scripts.EffectsUI;

EffectsUI.makeEffectsPanel = function (windowObj){//Function defining what makes a Window Effects Panel
        var scriptShower = buildPanel(windowObj);//Show panel based on the Build Panel Function
        if (scriptShower != null && scriptShower instanceof Window){//Upon Creation, put into center and show the panel
            scriptShower.center();
            scriptShower.show();
            }
        makeEffectsPanel(this)//Make instance of Window Effects Panel
        }
EffectsUI.buildPanel = function(windowObj){//Define Window to be built
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
         effectsColumn01.add("Button",undefined ,"Add S_Blur").onClick = function(){LyrUtils.addEffect ("S_Blur")};
         effectsColumn01.add("Button",undefined ,"Add HueSat").onClick = function(){LyrUtils.addEffect ("ADBE HUE SATURATION")};
         effectsColumn01.add("Button",undefined ,"Add Fill").onClick = function(){LyrUtils.addEffect ("ADBE Fill")};
         effectsColumn01.add("Button",undefined ,"Add DropShdw").onClick = function(){LyrUtils.addEffect ("ADBE Drop Shadow")};
         effectsColumn01.add("Button",undefined ,"Add Flip Transform").onClick = function(){LyrUtils.addFlipTransform();}

         var effectsColumn02 = basicEffectsTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
         effectsColumn02.alignment = ['left','top'];
         effectsColumn02.orientation = 'column';
         effectsColumn02.add("Button",undefined ,"Add Gradient").onClick = function(){LyrUtils.addEffect ("ADBE Ramp")};
         effectsColumn02.add("Button",undefined ,"Add LightSweep").onClick = function(){LyrUtils.addLightSweep()};
         effectsColumn02.add("Button",undefined ,"Add Simple Choker").onClick = function(){LyrUtils.addEffect ("ADBE Simple Choker")};
         effectsColumn02.add("Button",undefined ,"Add S_DropShdw").onClick = function(){LyrUtils.addEffect ("S_DropShadow")};

         var transitionColumn01 = transitionEffectsTab.add("Group",undefined);
         transitionColumn01.alignment = ['left','top'];
         transitionColumn01.orientation = 'column';
         transitionColumn01.add("Button",undefined ,"Add RadialWipe").onClick = function(){LyrUtils.addEffect ("ADBE Radial Wipe")};
         transitionColumn01.add("Button",undefined ,"Add S_Wipe Line").onClick = function(){LyrUtils.addEffect ("S_WipeLine")};
         transitionColumn01.add("Button",undefined ,"Add S_Wipe Circle").onClick = function(){LyrUtils.addEffect ("S_WipeCircle")};
         transitionColumn01.add("Button",undefined ,"Add S_Wipe Clock").onClick = function(){LyrUtils.addEffect ("S_WipeClock")};

         var transitionColumn02 = transitionEffectsTab.add("Group",undefined);
         transitionColumn02.alignment = ['left','top'];
         transitionColumn02.orientation = 'column';
         transitionColumn02.add("Button",undefined ,"Text Ramp In").onClick = function(){TextLyrUtils.addTextAnim ("Ramp Down")};
         transitionColumn02.add("Button",undefined ,"Text Ramp Out").onClick = function(){TextLyrUtils.addTextAnim ("Ramp Up")};
         transitionColumn02.add("Button",undefined ,"Text Ramp Thru").onClick = function(){TextLyrUtils.addTextAnim ("Smooth")};
         transitionColumn02.add("Button",undefined ,"Add Fade Black").onClick = function(){ShapeLyrUtils.addFadeBlack()};

         var layerColumn01 = layersTab.add("Group",undefined);
         layerColumn01.alignment = ['left','top'];
         layerColumn01.orientation = 'column';
         layerColumn01.add("Button",undefined ,"Add Solid").onClick = function(){ShapeLyrUtils.addSolid(0)};
         layerColumn01.add("Button",undefined ,"Add Null").onClick = function(){ShapeLyrUtils.addNull()};
         layerColumn01.add("Button",undefined ,"Add Adjustments").onClick = function(){ShapeLyrUtils.addSolid(1)};
         layerColumn01.add("Button",undefined ,"Check for PSDs").onClick = function(){LyrUtils.checkLayerForNewPSDs(null, false)};
         layerColumn01.add("Button",undefined ,"Create Banner").onClick = function(){ShapeLyrUtils.createActiveBannerArea()};

         var layerColumn02 = layersTab.add("Group",undefined);
         layerColumn02.alignment = ['left','top'];
         layerColumn02.orientation = 'column';
         layerColumn02.add("Button",undefined ,"Ease In").onClick = function(){
             LyrUtils.addEase (0, EffectsVars.easeSpeedForEffectWindowScript, 0, 0.1);
             EffectsVars.lastEaseUsed = "EI";
             }
         layerColumn02.add("Button",undefined ,"Ease Out").onClick = function(){
             LyrUtils.addEase (0, 0.1, 0, EffectsVars.easeSpeedForEffectWindowScript);
             EffectsVars.lastEaseUsed = "EO"
             }
         layerColumn02.add("Button",undefined ,"Fast In Out").onClick = function(){
             LyrUtils.addEase (0, 0.1, 0, 0.1);
             EffectsVars.lastEaseUsed = "FIO"
             }
         layerColumn02.add("Button",undefined ,"Ease In Out").onClick = function(){
             LyrUtils.addEase (0, EffectsVars.easeSpeedForEffectWindowScript, 0, EffectsVars.easeSpeedForEffectWindowScript);
             EffectsVars.lastEaseUsed = "EIO";
             }
         var seperatedEaseControls = layerColumn02.add("checkbox",undefined ,"Seperate Ease Controls")
         seperatedEaseControls.onClick = function(){
             layersTab.children[2].children[0].children[2].enabled = seperatedEaseControls.value;
             layersTab.children[2].children[0].children[3].enabled = seperatedEaseControls.value;
             EffectsVars.seperatedEaseControlsForWindowScript= seperatedEaseControls.value;
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
             var roundedSliderValue;
             if (easeSlider.value < .5){roundedSliderValue = Math.max(0.1, easeSlider.value);
                 }else{roundedSliderValue = Math.round(easeSlider.value)
                     }
             easeSlider.value = roundedSliderValue;
             EffectsVars.easeSpeedForEffectWindowScript = roundedSliderValue;
             easeSliderValue.text = roundedSliderValue;
                if (EffectsVars.easeAffectPreviousSelection==true){
                    EffectsFuncs.continueAffectingEase(EffectsVars.lastEaseUsed, EffectsVars.easeSpeedForEffectWindowScript, EffectsVars.easeSpeedForEffectWindowScript02, EffectsVars.seperatedEaseControlsForWindowScript);
                }
             }
         easeSliderValue.onChanging = function(){
             easeSlider.value =Number(easeSliderValue.text);

         }
         easeSliderValue.onChange= function(){
             //alert("On Change")

             if (Number(easeSliderValue.text)!=NaN){
                EffectsFuncs.changeSliderValue(Number(easeSliderValue.text),easeSliderValue, easeSlider, EffectsVars.easeSpeedForEffectWindowScript);
                EffectsVars.easeSpeedForEffectWindowScript = Number(easeSliderValue.text);
                }
            //alert("Contunue 01")
            if (EffectsVars.easeAffectPreviousSelection==true){
                //alert("Command Recieved 01")

                    EffectsFuncs.continueAffectingEase(EffectsVars.lastEaseUsed, EffectsVars.easeSpeedForEffectWindowScript, EffectsVars.easeSpeedForEffectWindowScript02, EffectsVars.seperatedEaseControlsForWindowScript);
                    //alert("Command 01 Proccessed");
                }
             }
         easeSlider02.onChanging= function(){
             var roundedSliderValue02;
             if (easeSlider02.value < .5){roundedSliderValue02 = Math.max(0.1, easeSlider02.value);
                 }else{roundedSliderValue02 = Math.round(easeSlider02.value)
                     }
             EffectsVars.easeSpeedForEffectWindowScript02 = roundedSliderValue02;
             easeSliderValue02.text = roundedSliderValue02;
                if (EffectsVars.easeAffectPreviousSelection==true){
                    EffectsFuncs.continueAffectingEase(EffectsVars.lastEaseUsed, EffectsVars.easeSpeedForEffectWindowScript, EffectsVars.easeSpeedForEffectWindowScript02, EffectsVars.seperatedEaseControlsForWindowScript);
                }
             }
         easeSliderValue02.onChanging = function(){
             easeSlider02.value =Number(easeSliderValue02.text);

         }
         easeSliderValue02.onChange= function(){
             //alert("On Change")
             if (Number(easeSliderValue02.text)!=NaN){
                EffectsFuncs.changeSliderValue(Number(easeSliderValue02.text),easeSliderValue02, easeSlider02, EffectsVars.easeSpeedForEffectWindowScript02);
                EffectsVars.easeSpeedForEffectWindowScript02 = Number(easeSliderValue02.text);
                }
            //alert("Continue 02");
            if (EffectsVars.easeAffectPreviousSelection==true){
                //alert("Command Recieved 02")
                    EffectsFuncs.continueAffectingEase(EffectsVars.lastEaseUsed, EffectsVars.easeSpeedForEffectWindowScript, EffectsVars.easeSpeedForEffectWindowScript02, EffectsVars.seperatedEaseControlsForWindowScript);
                    //alert("Command 02 Proccessed");
                }
             }
        var Ease100Button = layerColumn03.add("button",undefined ,"100 Ease");
         Ease100Button.onClick = function(){
             EffectsVars.easeSpeedForEffectWindowScript = 100;
             easeSlider.value=100;
            easeSliderValue.text = 100;
            easeSlider02.value=100;
            easeSliderValue02.text = 100;
            if (EffectsVars.easeAffectPreviousSelection==true){
                    EffectsFuncs.continueAffectingEase(EffectsVars.lastEaseUsed, EffectsVars.easeSpeedForEffectWindowScript, EffectsVars.easeSpeedForEffectWindowScript02);
                }
             }

         var Ease80Button = layerColumn03.add("button",undefined ,"80 Ease");
         Ease80Button.onClick = function(){
             EffectsVars.easeSpeedForEffectWindowScript = 80;
             easeSlider.value=80;
            easeSliderValue.text = 80;
            easeSlider02.value=80;
            easeSliderValue02.text = 80;
            if (EffectsVars.easeAffectPreviousSelection==true){
                    EffectsFuncs.continueAffectingEase(EffectsVars.lastEaseUsed, EffectsVars.easeSpeedForEffectWindowScript, EffectsVars.easeSpeedForEffectWindowScript02);
                }
             }

         var Ease60Button = layerColumn03.add("button",undefined ,"60 Ease");
         Ease60Button.onClick = function(){
            EffectsVars.easeSpeedForEffectWindowScript = 60;
            easeSlider.value=60;
            easeSliderValue.text = 60;
            easeSlider02.value=60;
            easeSliderValue02.text = 60;
            if (EffectsVars.easeAffectPreviousSelection==true){
                    EffectsFuncs.continueAffectingEase(EffectsVars.lastEaseUsed, EffectsVars.easeSpeedForEffectWindowScript, EffectsVars.easeSpeedForEffectWindowScript02);
                }
            }
         var easeCheckbox = layerColumn03.add("checkbox",undefined ,"Continue Affect Keys");
         easeCheckbox.onClick = function(){EffectsVars.easeAffectPreviousSelection=easeCheckbox.value};


         var layerColumn04 = layersTab.add("Group",undefined);
         layerColumn04.alignment = ['left','top'];
         layerColumn04.orientation = 'column';
         //layerColumn04.add("Button",undefined ,"Transform Drift").onClick = function(){addDrift(addEffectReturn("ADBE Geometry2"))};
         layerColumn04.add("Button",undefined ,"Stagger Layers").onClick = function(){CompUtils.staggerLayers(0, EffectsVars.distributeTransition)};
         layerColumn04.add("Button",undefined ,"Stagger Working").onClick = function(){CompUtils.staggerLayers(1, EffectsVars.distributeTransition)};
         layerColumn04.add("Button",undefined ,"Fill Working").onClick = function(){CompUtils.staggerLayers(2, EffectsVars.distributeTransition)};
         //layerColumn04.add("Button",undefined ,"Distribue Sel. Layers").onClick = function(){distributeLayers()};
		 var transitionCheckbox = layerColumn04.add("checkbox",undefined ,"Add Transitions");
         transitionCheckbox.value = EffectsVars.distributeTransition;
         transitionCheckbox.onClick = function(){EffectsVars.distributeTransition=transitionCheckbox.value};
         //layerColumn04.add("Button",undefined ,"Test Distribue").onClick = function(){testDistributeLayers()};

         var fontColumn01 = fontsTab.add("Group",undefined);
         fontColumn01.alignment = ['left','top'];
         fontColumn01.orientation = 'column';
         fontColumn01.add("Button",undefined ,"Helvetica").onClick = function(){TextLyrUtils.changeFontType("fontHelvetica", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn01.add("Button",undefined ,"Frutiger").onClick = function(){TextLyrUtils.changeFontType("fontFrutiger", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn01.add("Button",undefined ,"Futura").onClick = function(){TextLyrUtils.changeFontType("fontFutura", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn01.add("Button",undefined ,"Gill").onClick = function(){TextLyrUtils.changeFontType("fontGill", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn01.add("Button",undefined ,"Univers").onClick = function(){TextLyrUtils.changeFontType("fontUnivers", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn01.add("Button",undefined ,"Lato").onClick = function(){TextLyrUtils.changeFontType("fontLato", EffectsVars.fontSizeIndexForWindowScript)};
         //fontColumn01.add("Button",undefined ,"Mont").onClick = function(){changeFontType("fontMont")};

         var fontColumn02 = fontsTab.add("Group",undefined);
         fontColumn02.alignment = ['left','top'];
         fontColumn02.orientation = 'column';
         fontColumn02.add("Button",undefined ,"Myriad").onClick = function(){TextLyrUtils.changeFontType("fontMyriad", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn02.add("Button",undefined ,"Avenir").onClick = function(){TextLyrUtils.changeFontType("fontAvenir", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn02.add("Button",undefined ,"TradeG").onClick = function(){TextLyrUtils.changeFontType("fontTradeG", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn02.add("Button",undefined ,"Roboto").onClick = function(){TextLyrUtils.changeFontType("fontRoboto", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn02.add("Button",undefined ,"Prox").onClick = function(){TextLyrUtils.changeFontType("fontProx", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn02.add("Button",undefined ,"Mont").onClick = function(){TextLyrUtils.changeFontType("fontMont", EffectsVars.fontSizeIndexForWindowScript)};
         fontColumn02.add("Button",undefined ,"Alert Font Name").onClick = function(){var selLayer = app.project.activeItem.selectedLayers[0].sourceText.value.fontObject;
             alert(selLayer.postScriptName);
             //reflectAll(selLayer)
             };
         //fontColumn02.add("Button",undefined ,"Prox").onClick = function(){alert(app.documents[0].fonts.everyItem().name)};

         var fontColumn03 = fontsTab.add("Group",undefined);
         fontColumn03.alignment = ['left','top'];
         fontColumn03.orientation = 'column';
         fontColumn03.add("Button",undefined ,"Light").onClick = function(){EffectsVars.fontSizeIndexForWindowScript = 1};
         fontColumn03.add("Button",undefined ,"Med").onClick = function(){EffectsVars.fontSizeIndexForWindowScript = 2};
         fontColumn03.add("Button",undefined ,"Obli").onClick = function(){EffectsVars.fontSizeIndexForWindowScript = 3};
         fontColumn03.add("Button",undefined ,"Black").onClick = function(){EffectsVars.fontSizeIndexForWindowScript = 4};


        myEffectsPanel.layout.layout(true);

        return myEffectsPanel;
    }