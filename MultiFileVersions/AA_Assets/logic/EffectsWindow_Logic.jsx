var includedFiles = [ "../utils/Lyr_Utils.jsx"];
var LyrUtils = $.global.AA_Scripts.LyrUtils;
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