// EGG_StringManipulators


EGG_StrManip = {
	
	// "all" escapes html tags as well, if "false" keeps them in place
	// "all" with "expected": "expected" only treats these elements as secure
	htmlEscape : function(text, all, exceptedTags) {
		if (typeof text !== 'string') {
		   throw new Error('textgrabber says: String expected');	
		}
		
		var excepted = exceptedTags,
		    regex = null,
		    cleanTxt = text.replace(/[<>"&]/g, function (match, pos, orginalTxt) {
			    switch (match) {
			        case "<" :
				        return (all === true) ? "&lt;" : "<";	
			        case ">" :
				        return (all === true) ? "&gt;" : ">";					
     		        case "&" :
				        return "&amp;";					
                    case "\"" :
				        return "&quot;";	
                 }
              });
		
		console.log("cleaned BEFORE restore: " + cleanTxt);
		
		excepted.forEach(function(item, index, array) {
			regex = new RegExp("&lt;(" + item + ")&gt;", "gim"); // &lt(br)&gt
		    cleanTxt = cleanTxt.replace(regex, "<$1>");
			
			console.log("cleaned AFTER restore: " + cleanTxt);
        
		});
		
		return cleanTxt;
		
	},
	
/*	
	htmlEscape : function(text, all) {
		return text.replace(/[<>"&]/g, function (match, pos, orginalTxt) {
			console.log(match);
			
			switch (match) {
			    case "<" :
				    return (all === true) ? "&lt;" : "<";	
			    case ">" :
				    return (all === true) ? "&gt;" : ">";					
     		    case "&" :
				    return "&amp;";					
                case "\"" :
				    return "&quot;";	
            }
        });
		
	},
*/	
	
	// replace "/n /r" with "<br>"
	replLineBr : function(text) {
	    return text.replace(/[\r\n]/g, "<br>");	
	}

};