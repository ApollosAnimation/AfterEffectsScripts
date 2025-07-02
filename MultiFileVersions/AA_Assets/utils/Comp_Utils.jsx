$.global.AA_Scripts.CompUtils = {};
var CompUtils = $.global.AA_Scripts.CompUtils;

CompUtils.staggerLayers = function (staggerType, distributeTransition){
        app.beginUndoGroup("Stagger Layer");
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
                        selLayers[i].startTime = ((layerLength*[i])+(theComp.workAreaStart));
                        selLayers[i].outPoint = ((layerLength)+selLayers[i].startTime);
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
    app.endUndoGroup();
    }
/*
CompUtils.testLayerTiming = function (){
        var theComp = app.project.activeItem;
        var selLayers = theComp.selectedLayers;

        alert("Layer outPoint of first layer: " + selLayers[0].outPoint);
        alert("Layer startTime of layer 2: " + selLayers[1].startTime);
        alert("Layer inPointof layer 2: " + selLayers[1].inPoint);
        calcTime = (selLayers[0].outPoint + (selLayers[1].startTime - selLayers[1].inPoint));
        alert("Calculated result time: " + calcTime)
    }

CompUtils.distributeLayers = function (){
        var theComp = app.project.activeItem;
        var selLayers = theComp.selectedLayers;
        app.beginUndoGroup("DistributeLayers");
        for (i=1; i<=selLayers.length; i++){
            selLayers[i].startTime = (selLayers[i-1].outPoint + (selLayers[i].startTime - selLayers[i].inPoint));;
        }
        app.endUndoGroup();
    }
    */