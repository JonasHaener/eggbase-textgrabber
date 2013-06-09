// grabberjs
"use strict";

(function(window) {

//--------Templates and lef and righ section details-----------//
	
  var templ_cleanedText        = Handlebars.compile( $("#cleaned-text-template").html() ),
      templ_finalTemplate      = Handlebars.compile( $("#final-text-template").html() ),
      $leftSection             = $('.section-left'),
      $rightSection            = $('.section-right'),
      $rightSectionInitPosLeft = $('.section-right').offset().left,
      $rightSectionInitPosTop  = $('.section-right').offset().top;



//--------Notifications-----------//	

  function notify() {
	  
	  
  }




//--------Grab and clean input text-----------//	

  function grabText(txt) {
      // if input is not string return false 
      if (typeof txt !== "string") { return false; }
      // holds text results
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
          header    :   extract (grep_header, text),
          techData  :   extract (grep_techData, text),
          features  :   extract (grep_features, text)
      }
  }
  
  
//--------Collect form field input and return collection-----------//	

  function getFormDetails( bool ) {
      // retrieve form details
      // collect all items for templating
	  // if bool true all texts will be collected
	  // if bool false only entry items will be collected
      var c,
          collection  = {},
          inpElementTags = [ 'input', 'textarea' ];
			
      function collect( item, index, array ) {
          var c, collect = document.getElementsByTagName(item);
          for (c = 0; c < collect.length; c += 1) {
              // assign name
              if (collect[c].type === 'radio') {
                  collection[ collect[c].name ] = collect[c].checked;
		      } else {
                  collection[ collect[c].name ] = collect[c].value;
		      }		  	
		  }
          // mem clean up
          collect = null; 	
      }
      // send to collect function to collect elements values
      inpElementTags.forEach( collect );
      // only used when saving contents to Local Storage
      if (bool === true && document.querySelector('js-final-template')) {
          collection['finalTemplate'] = document.querySelector('js-final-template').innerHTML;	
	  }
      // return collection object
      return {
          date             : collection.date, 
		  designer         : collection.designer,
		  bn               : collection.bn,
		  lang_code        : 'GER',
		  model_number     : collection.model_number, 
		  product_name     : (collection.uppercase === true) ? collection.product_name.toUpperCase() : collection.product_name,  	
		  feature_1        : collection.feature_1, 
          feature_2        : collection.feature_2, 
		  feature_3        : collection.feature_3, 
		  feature_4        : collection.feature_4, 
		  feature_5        : collection.feature_5, 
		  packing_text     : collection.packing_text, 
		  feature_text     : collection.feature_text, 
		  tech_data        : collection.tech_data,
		  tech_data_dim    : collection.tech_data_dim, 
		  tech_data_weight : collection.tech_data_weight, 
		  contents         : collection.contents, 
		  contents_manual  : collection.contents_manual, 
		  remarks          : collection.remarks
      }
   }

//--------Fill form fields when calling saved item-----------//	

  function writeFormDetails( bn ) {
      // expect string
      if (bn === '' && typeof bn !== 'string') { return; }
       // retrieve requested item and pass to form fields
	  var c, savedItemObj = JSON.parse( window.localStorage.getItem(bn) );
	  for (c in savedItemObj) {
	      var ele = document.getElementsByName(c)[0];
	      if (ele !== undefined && 'value' in ele) {
		      ele.value = savedItemObj[c];
		  }
		  ele = null;
      }
  }
 
//--------Save item-----------//	
	
  // retrieve saved Items
  function saveItem() {
	  console.log('saveItem() works');
       if ('localStorage' in window) {
		  // collect form input 
          var coll = getFormDetails(true);
		  if (coll.bn !== "") {
              window
			   .localStorage
               .setItem(coll.bn, JSON.stringify(coll));
		  } else {
              alert('Please enter a BN');
			  return;	
		  }
	  } else {
          alert('Sorry your browser cannot save items');	
      }
  }
  
 
    
//--------Load saved items-----------//	
	
  // retrieve saved Items
  function loadSavedItems(){
      try {
          if ('localStorage' in window) {
              var c,
			      savedItem = null,
		          options = "", 
			      storedItems = window.localStorage;
		      for (c in storedItems) {
                  savedItem = JSON.parse(localStorage.getItem(c));
			      options += "<option>" + savedItem.bn + "</option>"	
              }
              document
			   .querySelector('.js-select-saved-items')
			   .innerHTML = options;
          }
	  } catch(err) { }
  }
 
  
//--------Get text and load cleaned text into result-----------//	
	
  $('.js-button-grabText').on('click',function(e) {
		var a, 
		    resArr = [],
            // extract text, results object returned
		    resObj = grabText( $('.js-paText').val() );
		    // extractor function returns null if value is not string
		if (resObj.constructor === Object) {
		    // assign results to templates and push into results array	
		    resArr.push(templ_cleanedText( {result : resObj.header} ));
		    // join templates array and append to results tag
		    $(".js-result").html( resArr.join("") );
		}
		// prevent form submission
		e.preventDefault();
	});


//--------Control cleaned text input field for editing-----------//

  $('body')
      .on('dblclick', '.js-inp-cleaned-text', function(e) {
           $(this).prop('disabled',"");
      })
      .on('blur', '.js-inp-cleaned-text' ,function(e) {
          $(this).prop('disabled','disabled');
      });
	

  $('.js-button-write-template').on('click',function(e) {
      document
	   .querySelector('.js-final-template')
	   .innerHTML = templ_finalTemplate( getFormDetails(false) );
   });

	
//--------Save item-----------//

  $('.js-button-save').on('click',function(e) {
      // grab value currently in BN form field
	  // because Local Storage sorts alphabetically
	  var initVal = $('.js-inp-bn').val();
	  // save current input
	  saveItem();
	  // refresh saved items
	  loadSavedItems();
      // assign initial to saved items value after reloading items
      $('.js-select-saved-items').val(initVal); 
  });
  

//--------Retrieved item-----------//

  $('.js-select-saved-items').on('change',function(e) {
      // retrieve selected items in option select
	  if ('localStorage' in window) {
          // get BN of saved item
          writeFormDetails( $('.js-select-saved-items').val() );
	  }
  });
  
  
//--------Initial Runs-----------//

  // get saved items
  loadSavedItems();
  // write in first selected BN on load
  writeFormDetails ($('.js-select-saved-items').val());
	
	
}(window));