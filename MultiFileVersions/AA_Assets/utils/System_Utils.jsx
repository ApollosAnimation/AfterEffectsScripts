var includedFiles = ["../utils/Project_Utils.jsx"];
var ProjectUtils = $.global.AA_Scripts.ProjectUtils;
$.global.AA_Scripts.SystemUtils = {};
var SystemUtils = $.global.AA_Scripts.SystemUtils;

SystemUtils.canWriteFiles = function () {// Returns True or false; Script found online https://community.adobe.com/t5/after-effects-discussions/how-can-i-check-whether-if-quot-allow-scripts-to-write-files-and-access-network-quot-is-enable-using/m-p/10869640
    var appVersion, commandID, scriptName, tabName;
    appVersion = parseFloat(app.version);
    commandID = 2359;
    tabName = 'General';
    if (appVersion >= 16.1) {
        commandID = 3131;
        tabName = 'Scripting & Expressions';
    }

    if (isSecurityPrefSet()) return true;
    return false;

    function isSecurityPrefSet() {
        return app.preferences.getPrefAsLong(
            'Main Pref Section',
            'Pref_SCRIPTING_FILE_NETWORK_SECURITY'
        ) === 1;
    }
}
SystemUtils.checkPSDExists = function (item){//Returns null in error / psd file; requires a footage item; looks to return a psd file of the provided footage name, in the same folder or in a subfolder "_EditedPSDs" if AE can write files/folders
    if (item.duration != 0) {return null}
    //var oldComp = findComp(item.name.slice(0,-4));
    //if((item.duration != 0)|(findComp(item.name.slice(0,-4))) != null){return null;}
    var nameCheck = item.name.replace(/\.[^\.]+$/, "");
    var foundComp = ProjectUtils.findComp(item.name.replace(/\.[^\.]+$/, ""));
    if((item.duration != 0)|(ProjectUtils.findComp(item.name.replace(/\.[^\.]+$/, ""))) != null){return null;}
    //var otherFolderItem = item.file.path + "/EditedPSDs/" + item.file.name.slice(0,-3)+"psd";
    var psdLocation = String(item.file).replace(/\.[^\.]+$/, "")+".psd";
    var psd = new File (psdLocation);
    if (psd.exists){return psd;}
    var writeCheck = this.canWriteFiles();
    if(writeCheck){
    var otherFolder = new Folder (item.file.path + "/_EditedPSDs/");
        if (!(otherFolder.exists)){otherFolder.create();}
        psdLocation = String(otherFolder)+"/"+ item.file.name.replace(/\.[^\.]+$/, "")+".psd";
        psd = new File (psdLocation);
        if (psd.exists){return psd;}
        }
    return null;
}

SystemUtils.parseCSV = function (/*str|File*/input,/*bool=0*/header,  r,i,s,a,m,n,o,j){//Parsing CSV sourced from IdGoodies on github found here: https://github.com/indiscripts/IdGoodies/blob/master/snip/FileParseCSV.jsx

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

	//;function parseCSV(/*str|File*/input,/*bool=0*/header,  r,i,s,a,m,n,o,j)
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

SystemUtils.altParseCSV = function (file, keepQuotesBool, escapeBool){
    if (!(file instanceof File) || !file.exists){throw new Error("Input is not a file or does not Exist");}
    file.open("r");
    var content = file.read();
    file.close();
    if (keepQuotesBool != true) keepQuotesBool = false;
    if (escapeBool != true) escapeBool = false;
    
    content = this.standardizeQuotes(content, escapeBool);
    var rows = [];
    var row = [];
    var cell = "";
    var insideQuotes = false;
    var i = 0;
    while (i < content.length){
        var character = content.charAt(i);
        if (insideQuotes){
            if (character === '"'){
                if (content.charAt(i+1) === '"'){
                    cell += '"';
                    i++;
                }else{
                    insideQuotes = false;
                    if (keepQuotesBool == true) cell += '"';
                }
            }else{
                cell+= character;
                }
            }else{
                if (character === '"'){
                    insideQuotes = true;
                    if (keepQuotesBool == true) cell += '"';
                } else if (character === ','){
                    row.push(this.cleanCSVCellQuotes(cell, keepQuotesBool));
                    cell = "";
                }else if (character === '\r' && content.charAt (i+1) === '\n'){
                    row.push(this.cleanCSVCellQuotes(cell, keepQuotesBool));
                    rows.push(row);
                    row = [];
                    cell = "";
                    i++
                }else if (character === '\n' || character === '\r'){
                    row.push(this.cleanCSVCellQuotes(cell, keepQuotesBool));
                    rows.push(row);
                    row = [];
                    cell = "";
                }else{
                    cell += character
                    }
                }
            i++;
            }
        
        if (cell !== "" || row.length>0){
            row.push(this.cleanCSVCellQuotes(cell, keepQuotesBool));
            rows.push(row)
            }
        return rows;
    }

SystemUtils.standardizeQuotes = function (str, escapeBool){
    if (escapeBool != true) escapeBool = false;
    if (escapeBool){
        return str
        .replace(/\u201C/g, '""')
        .replace(/\u201D/g, '""') 
        .replace(/\u2018/g, "''") 
        .replace(/\u2019/g, "''");
        }
    return str
        .replace(/\u201C/g, '"')
        .replace(/\u201D/g, '"') 
        .replace(/\u2018/g, "'") 
        .replace(/\u2019/g, "'");
    }
SystemUtils.csvNameToArray = function (fileName){//Returns an Array of the contents in the footage from the footage found with the fileName(String) name 
    return this.altParseCSV(ProjectUtils.findFootage(fileName).file);
    }
SystemUtils.cleanCSVCellQuotes = function (cell, keepQuotesBool){
    if (cell.charAt(0) === '"'&& cell.charAt(cell.length-1) === '"'){
        cell = cell.substring(1, cell.length - 1);
        }
    cell=cell.replace(/""/g, '"');
    return cell;
    }
SystemUtils.findSystemFolder = function (folderNameString, baseLocationString, searchParentFolderBool,nestedFolderName){
    
    }
SystemUtils.findAddSystemFolder = function (folderNameString){
    
    }