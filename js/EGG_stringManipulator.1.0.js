// EGG_StringManipulators

EGG_StrManip = {
	
	// "all" escapes html tags as well, if "false" keeps them in place
	// "all" with "expected": "expected" only treats these elements as secure
	htmlEscape : function(text, all, exceptedTags) {
		console.log("IN:  " + text);
		if (typeof text !== 'string') {
		   throw new Error('EGG_StrManip says: String expected');	
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
		if (excepted instanceof Array) {
			excepted.forEach(function(item, index, array) {
				if (typeof item === 'string') {
			        regex = new RegExp("&lt;(" + item + ")&gt;", "gim"); // &lt(br)&gt
		            cleanTxt = cleanTxt.replace(regex, "<$1>");
				}
			});
        }
		console.log(cleanTxt);
		return cleanTxt;
	},
	
    // replace "/n /r" with "<br>"
	replLineBr : function(text) {
	    return text.replace(/[\r|\n]/g, "<br>");	
	}

};