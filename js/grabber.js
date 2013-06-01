
// grabber.js





(function(window) {
	// templates
	var templ_cleanedText   = Handlebars.compile( $("#cleaned-text-template").html() ),
		templ_features 		= Handlebars.compile( $("#pa-order-template").html() ),
		templ_techData 		= Handlebars.compile( $("#techData-template").html() );
	
	// helper-extract text
	function grabText(txt) {
		  // if input is not string return false 
		  if (typeof txt !== "string") {
			  return false;
		  }
		  // holds results
		  var resObj = {},
		  // trim text input
		  text = txt.trim(),
		  // GREPs
		  //grep_header 	= /[^(<.>)$](\w*\d*)[^<\/.>)$]/ig,
		  grep_header 	= /([\w\s?]*)(?=(<\/header))/ig,
		  grep_features = /([\w\s?]*)(?=(<\/features))/ig,
		  grep_techData = /([\w\s?]*)(?=(<\/techdata))/ig, // (^|\s)Blah(\s|$)		
		  // extractor function
		  extract = function(grep, txt) {
			  var resArr = [];
			  if (grep.test(txt) === true) {
				  resArr = txt.match(grep);					
			  } else {
				  resArr[0] = "Error: Check text settings/missing tags";
			  }
			  return resArr.join(" ");
		  };
		  // return extracted results		
		  return {
			  header	:	extract (grep_header, text),
			  techData 	:	extract (grep_techData, text),
			  features 	:	extract (grep_features, text)
		  }
	}
	
	// retrieve saved Items
	function loadSavedItems(){
		if ('localStorage' in window) {
			var c,
				savedItem = null,
				options = "", 
				storedItems = window.localStorage;
			
			console.log('stored items', storedItems);
			for (c in storedItems) {
				savedItem = JSON.parse(localStorage.getItem(c));
				options += "<option>" + savedItem.bn + "</option>"	
			}
			$('.js-select-saved-items').append(options);
		}
	}
	// run it once onload
	loadSavedItems();
	
	// initiate text extraction
	// assign results to handlebars templates
	$('.js-button-grabText').on('click',function(e) {
		var a, resArr = [],
		// extract text, pass in textbox value
		resObj = grabText( $('.js-paText').val() );
		// extractor function returns null if value is not string
		if (resObj.constructor === Object) {
			// assign results to templates and push into results array	
			resArr.push(templ_cleanedText	({ result : resObj.header 	}) );
			//resArr.push(templ_features	({ result : resObj.features }) );
			//resArr.push(templ_techData	({ result : resObj.techData }) );
			// join templates array and append to results tag
			$(".js-result").html( resArr.join("") );
		}
		// prevent form submission
		e.preventDefault();
	});
	
	$('body')
	.on('dblclick', '.js-inp-cleaned-text' ,function(e) {
		$(this).prop('disabled',"");
	})
	.on('blur', '.js-inp-cleaned-text' ,function(e) {
		$(this).prop('disabled','disabled');
	});
	
	// initiate text extraction
	// assign results to handlebars templates
	$('.js-button-save').on('click',function(e) {
		if ('localStorage' in window) {
			console.log('storage available');
			var bn = $('.js-bn').val(),
				formText = $('.js-paText').val();
			if (bn !== ""){
				window.localStorage.setItem(bn, JSON.stringify( { bn:bn, txt:formText } ));
			} else {
				alert('Please enter a BN');
				return;	
			}
			// refresh saved items
			loadSavedItems();
		} else {
			alert('Sorry your browser cannot save items');	
		}
	});
	
	// retrieve selected items in option select
	$('.js-select-saved-items').on('change',function(e) {
		if ('localStorage' in window) {
			var bn = $('.js-select-saved-items').val(),
				savedItemObj = JSON.parse( window.localStorage.getItem(bn));
			$('.js-paText').val( savedItemObj.txt );	
		}
	});
	
}(window));