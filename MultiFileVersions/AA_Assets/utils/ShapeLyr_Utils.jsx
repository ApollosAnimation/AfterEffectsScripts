var includedFiles = ["../utils/Lyr_Utils.jsx", "../utils/Project_Utils.jsx",];
var LyrUtils = $.global.AA_Scripts.LyrUtils;
$.global.AA_Scripts.ShapeLyrUtils = {};
var ShapeLyrUtils = $.global.AA_Scripts.ShapeLyrUtils;
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;

ShapeLyrUtils.addSolid=function addSolid (adjustBool, comp){//Makes a Solid layer at 95% white briteness at 1920 x 10810 for 15 Seconds
    app.beginUndoGroup("Add Solid");
    //alert("AddSolid");
    if (comp == undefined) comp = null;
    var theComp = ProjectUtils.verifyInstanceOfCompActive(comp);
    if (!(theComp instanceof CompItem) || theComp == null){return null;}
    var selectedLayer = app.project.activeItem.selectedLayers;
    //var newSolid = theComp.layers.addSolid( [.95, .95, .95], "Solid", theComp.width, theComp.height, 1.0, theComp.duration);
    var solidLayer = theComp.layers.addShape();
    solidLayer.label = 1;
    var shapeBounds = solidLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
    shapeBounds.property("ADBE Vector Rect Size").setValue([theComp.width,theComp.height]);
    var fill = solidLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([.95, .95, .95,1]);
    //solidLayer.name = "Solid";
    if(adjustBool == 1){
        solidLayer.adjustmentLayer = true;
        //newSolid.name = "Adjustment Layer";
        }
    if(isValid(selectedLayer[0])== true){
        solidLayer.moveBefore(selectedLayer[0]);
        }
    app.endUndoGroup();
    }
ShapeLyrUtils.addNull=function addNull(comp){//Make a Null Layer
    app.beginUndoGroup("Add Null");
    var theComp = ProjectUtils.verifyInstanceOfCompActive(comp);
    if (!(theComp instanceof CompItem) || theComp == null){return null;}
    var selLayers = theComp.selectedLayers;
    var nullLayers = []
    //var nullFootage = findFootage("Null 1");
    for (var i = 0; i < selLayers.length; i++){
        //var nullLayer = null;
        //if (nullFootage == null){var tempNullLayer = comp.layers.addNull(); nullFootage = findFootage("Null 1"); tempNullLayer.remove();}
        //nullLayer = comp.layers.add(nullFootage);
        var nullLayer = theComp.layers.addShape();
        nullLayer.label = 1;
        var shapeBounds = nullLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
        shapeBounds.property("ADBE Vector Rect Size").setValue([100,100]);
        nullLayer.moveBefore(selLayers[i]);
        nullLayer.guideLayer = true;
         var nullLayerStroke = nullLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
         nullLayerStroke.property("ADBE Vector Stroke Color").setValue([1, 0, 0,1]);
         nullLayers.push(nullLayer)
        //nullLayer.adjustmentLayer = true;
        //nullLayer.property("Transform").property("Opacity").setValue(0);
        }
    if (selLayers.length == 0) {
        var nullLayer = theComp.layers.addShape();
        nullLayer.label = 1;
        var shapeBounds = nullLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
        shapeBounds.property("ADBE Vector Rect Size").setValue([100,100]);
         nullLayer.guideLayer = true;
         var nullLayerStroke = nullLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
         nullLayerStroke.property("ADBE Vector Stroke Color").setValue([1, 0, 0,1]);
         nullLayers.push(nullLayer)
        //nullLayer.moveBefore(selLayers[i]);
        //nullLayer.adjustmentLayer = true;
        //nullLayer.property("Transform").property("Opacity").setValue(0);
        }
    app.endUndoGroup();
    return nullLayers;
    }
ShapeLyrUtils.addFadeBlack=function addFadeBlack(){
    app.beginUndoGroup("AddFades");
    //alert("AddFades");
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
ShapeLyrUtils.createActiveBannerArea=function createActiveBannerArea(){
    app.beginUndoGroup("BannerArea");
    //alert("BannerArea");
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)){return null;}
    this.findAddBannerArea(comp);
    app.endUndoGroup();
    }
ShapeLyrUtils.findAddBannerArea=function findAddBannerArea(comp){//Returns null in Error / new or current layer named BannerMatteLayer
            //alert("findAddBannerArea");
            var comp = ((comp !== undefined)&&(comp !== null)) ? comp : app.project.activeItem; if (!(comp instanceof CompItem)){return null;}
            var matteLayer = LyrUtils.findLayer(comp, "BannerMatteLayer");
            if (matteLayer != null) {return matteLayer;}
            var bannerHeightRatio = 240/1080;
            var bannerWidth = Math.floor(comp.width);
            var bannerHeight = Math.floor(comp.height * bannerHeightRatio);
            var blurLayer = this.createRectangleShapeLayer(comp, comp.width, comp.height, [1,1,1,1]);
            blurLayer.name = "BannerBlurLayer";
            blurLayer.adjustmentLayer = true;
            var blurEffect = blurLayer.Effects.addProperty("S_Blur");
            //blurEffect.property("Blur Amount").setValue(30);
            var colorLayer = this.createRectangleShapeLayer(comp, comp.width, comp.height, [0,0,0,1]);
            colorLayer.name = "BannerColorLayer";
            colorLayer.property("Opacity").setValue(20);
            var matteLayer = this.createRectangleShapeLayer(comp, bannerWidth, bannerHeight, [1,1,1,1]);
            matteLayer.name = "BannerMatteLayer";
            blurLayer.setTrackMatte(matteLayer, TrackMatteType.ALPHA);
            colorLayer.setTrackMatte(matteLayer, TrackMatteType.ALPHA);
            var bannerPosHeight = Math.floor(comp.height-(bannerHeight*.5) - (comp.height*.08));
            var bannerPosWidth = Math.floor(comp.width/2);
            matteLayer.property("Position").setValue([bannerPosWidth,bannerPosHeight]);
            return matteLayer;
            },
ShapeLyrUtils.createRectangleShapeLayer= function createRectangleShapeLayer (comp, width, height, fillCollor) {//Returns null in Error / new Shape Layer, Default Comp:Active Item, Color:[1,1,1,1]; need Width, Height, Color Array[1,1,1,1]
    //alert("createRectangleShapeLayer");
    var comp = ((comp !== undefined)&&(comp !== null)) ? comp : app.project.activeItem;if (!(comp instanceof CompItem)){return null;}
    var fillCollor = ((fillCollor !== undefined)&&(fillCollor !== null)) ? fillCollor : [1,1,1,1];
    var shapeLayer = comp.layers.addShape();
    var shapeBounds = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
    shapeBounds.property("ADBE Vector Rect Size").setValue([width,height]);
    var fill = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue(fillCollor);
    return shapeLayer;
    }