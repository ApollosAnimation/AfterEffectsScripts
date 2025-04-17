//This file contains work from Parsing CSV sourced from IdGoodies on github found here: https://github.com/indiscripts/IdGoodies/blob/master/snip/FileParseCSV.jsx Thanks IdGoodies for making this possible.
{
function aT(){//quick alertTest function for debugging
    alert("Ping");
    }


function updateText(textCsvFile, nameCsvFile, fontCsvFile){// updating text based on CSV files that contain comp names, layer names, and the new Text and Text that is to be italicized
    app.beginUndoGroup("UpdateText");
    //aT();
    var textCSV = findFootage(textCsvFile).file;
    var textArray = parseCSV(textCSV);
    var nameCSV = findFootage(nameCsvFile).file;
    var nameArray = parseCSV(nameCSV);
    var fontCSV = findFootage(fontCsvFile).file;
    var fontArray = parseCSV(fontCSV);
    var textArrayLen = textArray[0].length - 1;    
    for(var i=1; i< textArray.length; i++){
         for(var j=1; j<=textArrayLen; j++){
            var compName = nameArray[i][0];//Comp name is the first column of the current row in the Legend CSV
            var layerName = nameArray[i][j];//Layer name is the coordinates i,j in the Legend CSV
            var layerText = textArray[i][j];//the new text  is the coordinates i,j in the TextCSV, in the same position of the Layer name in a second file
            //var italicizeString = textArray[i][0];//the strings to find and italicize in the new text string, found in the first column of the current row, and seperated by semicolons
            //var fontPostName = fontArray[0].toString();// Base Text Font
            //var italicizedFontPostName =  fontArray[1].toString();// Italics Text Font
            updateTextLayer(compName, layerName, layerText, fontArray)//for every item in the new text array, update the layer with the new text and italicize the given string
            }
        }
    
    app.endUndoGroup();
    }


function findComp(compName)//Looking for a Comp by its name
{
    if (compName ==""){return null;}
    var myComp = null;
    var proj = app.project;
    var itms = proj.items;
    var itmsLen = itms.length;
    for(i=1; i<itmsLen+1; i++){
        var curItem = itms[i];
        if(curItem instanceof CompItem){
            if(curItem.name == compName){  //Will grab only the first name match
                myComp = curItem;
                return myComp;
            }
        }
    }
    
    alert("Comp not found: " + compName);
    return null;    
}


function findFootage(footageName)//Looking for footage by name, in this scripts case specifically looking for a CSV file that has been named TextCSV or LegendCSV
{
    var proj = app.project;
    var itms = proj.items;
    var itmsLen = itms.length;
    for(i=1; i<itmsLen+1; i++){
        var curItem = itms[i];
        if(curItem instanceof FootageItem){
            if(curItem.name == footageName){  //Will grab only the first name match
                myFootage = curItem;
                return myFootage;
            }
        }
    }
alert("Footage Not Found: "+footageName);
return null;
}

function findLayer(comp, layerName)//looking for a specific Layer in a comp by name. Comp was usually provided by the findComp function
{
    if (layerName == ""){return null;}
    var foundLayer = null;
    if (comp.layer(layerName) instanceof TextLayer){
        foundLayer = comp.layer(layerName)
        return foundLayer;
        }
    if (foundLayer ==null){
        alert("Layer not found in " + comp.name +": " + layerName);
    }
    return foundLayer;
}


{//Parsing CSV sourced from IdGoodies on github found here: https://github.com/indiscripts/IdGoodies/blob/master/snip/FileParseCSV.jsx

/*******************************************************************************

		Name:           FileParseCSV [draft]
		Desc:           Parse a CSV file or stream.
		Path:           /snip/FileParseCSV.jsx
		Encoding:       ÛȚF8
		Compatibility:  ExtendScript (all versions) [Mac/Win]
		L10N:           ---
		Kind:           Function
		API:            ---
		DOM-access:     NO
		Todo:           ---
		Created:        230519 (YYMMDD)
		Modified:       230519 (YYMMDD)

*******************************************************************************/

	//==========================================================================
	// PURPOSE
	//==========================================================================
	
	/*
	
	A simple CSV parser. Supports comma-separated data of various forms including
	items enclosed in double quotes, e.g "xxx, yyy". Escape sequences like `""`,
	`\"`, etc, are parsed as well.
	
	Example with three columns:

	    itemA1,itemB1,itemC1
	    itemA2,,itemC2
	    "itemA3,etc","item""B3","item\"C3"
	    "item,A4","item\,B4",itemC4
	
	The function `parseCSV` takes a File (or the full CSV content as a string)
	and returns an array of rows. By default, each row is an array of strings,
	e.g `["itemA1", "itemB1", "itemC1"]`. Set the `header` argument to TRUE to
	get every row parsed as an object (based on the labels of the first row).
	
	Sample code:
	
	    var uri = "C:/Documents/test.csv";
	    var data = parseCSV( new File(uri) );
	    alert( data.join('\r') );

	[REF] community.adobe.com/t5/indesign/
	      what-s-the-least-inelegant-way-to-ingest-csv-w-js/td-p/13799042

	*/

	;function parseCSV(/*str|File*/input,/*bool=0*/header,  r,i,s,a,m,n,o,j)
	//----------------------------------
	// Pass in a string or a `File(path/to/file.csv)` argument.
	// If `header` is truthy, parses the 1st line as providing field names
	// and returns an array of objects {<name1>:<val1>, <name2>:<val2>, ...}
	// Otherwise, returns an array of arrays. If no data can be found,
	// returns an empty array.
	// => str[][]  |  obj[]
	{
		// Input.
		if( !input ) return [];
		if( input instanceof File )
		{
			if( !(input.exists && input.length) ) return [];
			input = input.open('r','UTF8') && [input.read(),input.close()][0];
		}
		if( !('string' == typeof input && input.length) ) return [];

		// Get lines.
		r = input.split(/(?:\r\n|\r|\n)/g);

		// Get fields.
		const reFld = /(,|^)(?:"((?:\\.|""|[^\\"])*)"|([^,"]*))/g;  // $1 :: `,`|undef  ;  $2 :: `<in-quotes>`|undef  ;  $3 :: `<simple>`|undef
		const reEsc = /[\\"](.)/g;                                  // $1 :: `<esc>`
		for( i=r.length ; i-- ; a.length ? (r[i]=a) : r.splice(i,1) )
		{
			s = r[i];
			if( -1 == s.indexOf('"') )
			{
				a = s.length ? s.split(',') : [];
				continue;
			}

			for
			(
				a = 0x2C==s.charCodeAt(0) ? [""] : [] ;
				m=reFld.exec(s) ;
				a[a.length] = 'undefined' != typeof m[2] ? m[2].replace(reEsc,'$1') : m[3]
			);
		}
		if( !header ) return r;

		// Header -> convert rows to objects.
		m = r.shift();
		n = m.length;
		for( i=-1 ; ++i < r.length ; r[i]=o )
		for( o={}, a=r[i], j=-1 ; ++j < n ; o[m[j]]=a[j]||'' );
		return r;
	}
}

function updateTextLayer(compName, layerName, newTextValue, fontArray)//find the text layer to update 
{
    var foundComp = findComp(compName);
    if((foundComp) !=null ){
        var foundLayer = findLayer(foundComp, layerName);
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
                        //var newTextValueArray = newTextValueString.split(fontArray[2][i]);
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
                /***
                for(i=1; i<=fontArray[2].length-1; i++){
                        var newTextValueString = newLayerTextDocument.text;
                        var newTextValueArray = newTextValueString.split(fontArray[2][i]);
                        if (newTextValueArray.length > 2){
                            var newTextValueString = newTextValueArray.join("");
                            newLayerTextDocument.text = newTextValueString;
                            var startPoint = newTextValueArray[0].length;
                            var endPoint = startPoint + newTextValueArray[1].length;
                            var fontCharacterRange = newLayerTextDocument.characterRange(startPoint, endPoint);
                            fontCharacterRange.font = fontArray[1][i];
                            }
                            ***/
                    }
                //alert(wordChangeArray);
                layerSourceText.setValue(newLayerTextDocument);
                if (wordChangeArray.length > 0){
                    for (i=0; i<wordChangeArray.length;i++){
                        //alert(wordChangeArray[i]);
                        var regex = new RegExp (wordChangeArray[i][0],"g")
                        var searchArray;
                        while ((searchArray = regex.exec(layerSourceText.value.text)) !== null) {
                            var endPoint = regex.lastIndex;
                            var wordLength = wordChangeArray[i][0];
                            var startPoint = endPoint - wordChangeArray[i][0].length;
                            //var fontCharacterRange = layerSourceText.value.characterRange(startPoint, endPoint);
                            var newFont = fontArray[1][wordChangeArray[i][1]];
                            //fontCharacterRange.font = newFont;
                            newLayerTextDocument.characterRange(startPoint, endPoint).font = newFont;
                        }
                    }
                }
                //italicizeText(italicizeString, layerSourceText, fontPostName, italicizedFontPostName)
                layerSourceText.setValue(newLayerTextDocument);
            }
        }
    }
}

function italicizeText(italicizeString, textDocument, fontPostName, italicizedFontPostName)//Given the string we want to italicize and the text document using Character Range, while also setting the default font
{
    var updatedTextDoc = textDocument;
    var italicizeArray = italicizeString.split(/\;\s?/);
    var layerString = updatedTextDoc.value;
    layerString.font = fontPostName
    for (var i = 0; i<italicizeArray.length; i++){
        //var startPoint = layerString.text.search(italicizeArray[i]);
        var regex = new RegExp (italicizeArray[i],"g")
        //var searchArray = layerString.text.match(regex);
        var searchArray;
        while ((searchArray = regex.exec(layerString)) !== null) {
            var endPoint = regex.lastIndex;
            var startPoint = endPoint - italicizeArray[i].length;
            var titleCharacterRange = layerString.characterRange(startPoint, endPoint);
            titleCharacterRange.font = italicizedFontPostName;
            var titleCharacterRange = layerString.characterRange(startPoint, endPoint);
            titleCharacterRange.font = italicizedFontPostName;
            }
        //alert(searchArray[1]);
        //if(startPoint == -1){continue};
        //var endPoint = startPoint + italicizeArray[i].length;
        
        //reflectAll (titleCharacterRange);
        //reflectAll (updatedTextDoc);
        //updatedTextDoc.setValue(layerString);
    }
    updatedTextDoc.setValue(layerString);
}

function parseText()//this is a function to edit strings to include returns
{
        var layerGroup = app.project.activeItem.selectedLayers;
        //reflectAll(layerGroup[0].sourceText.value.fontObject.postScriptName);
        for (i=0; i<layerGroup.length; i++){
            //alert(layerGroup[i].sourceText.value.fontObject.postScriptName);
            reflectAll(layerGroup[i].sourceText);
            }
        }

function getFontName()//this is a function to identify font names to be put in a CSV
{
        var layerGroup = app.project.activeItem.selectedLayers;
        //reflectAll(layerGroup[0].sourceText.value.fontObject.postScriptName);
        for (i=0; i<layerGroup.length; i++){
            alert(layerGroup[i].sourceText.value.fontObject.postScriptName);
            //var inspect = layerGroup[i].sourceText.value;
            //alert(inspect.text);
            }
        }

function reflectAll(reflectable)//this is a debugging function that lists all information about a given element, and is a great break point to analyze in Extendscript
{
        alert(reflectable.reflect.name);   
        alert(reflectable.reflect.properties);
        alert(reflectable.reflect.methods);
        }

    

function makeEffectsPanel(windowObj){//creating a window for the buttons and text fields
    
    function buildPanel(windowObj){
         var myEffectsPanel = (windowObj instanceof Panel) ? windowObj : new Window ("palette", "Text CSV Update Tool", undefined, {resizeable:true});
          
         var myEffectsTabs = myEffectsPanel.add("tabbedpanel",undefined);
         var duplicateTab = myEffectsTabs.add("tab", undefined, "Text CSV Update Tool", {orientation:'row',alignment:['left','top']});
         duplicateTab.orientation = 'row';
         
         var textReplaceColumn01 = duplicateTab.add("Group",undefined,{orientation: 'column', alignment:['left','top']});
         textReplaceColumn01.orientation = 'column';
         textReplaceColumn01 .add('statictext {text: "CSV Footage Name:",  justify: "center"}');
         var textCsvFile = textReplaceColumn01 .add('edittext{text:"TextCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
         textReplaceColumn01 .add('statictext {text: "CSV Legend Name:",  justify: "center"}');
         var legendCsvFile = textReplaceColumn01 .add('edittext{text:"LegendCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
         textReplaceColumn01 .add('statictext {text: "CSV Font Name:",  justify: "center"}');
         var fontCsvFile = textReplaceColumn01 .add('edittext{text:"FontCSV", justify:"center", active:true, enterKeySignalsOnChange:flase}');
         textReplaceColumn01 .add("Button",undefined ,"Update Text").onClick = function(){updateText(textCsvFile.text, legendCsvFile.text,fontCsvFile.text)};
         textReplaceColumn01 .add("Button",undefined ,"Get Font Name").onClick = function(){getFontName()};
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