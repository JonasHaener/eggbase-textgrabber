// grabberjs
"use strict";

var arr = [ ['name', 0], ['name', 1 ] ];
var c = 0;
var name = "My name is " + arr[c][1];
console.log(name);


(function(window) {

// =============================================================================
//   Contants
// =============================================================================
	
  var TEMPL_CLEAN_TEXT         = Handlebars.compile( $("#cleaned-text-template").html() ),
      TEMPL_FINAL_TEMPLATE     = Handlebars.compile( $("#final-text-template").html() ),
	  NO_LOCAL_STORAGE_MESSAGE = 'Sorry your browser cannot save items',
	  NO_BN_ENTERED_MESSAGE    = 'Please enter a BN',
	  $MAIN_CONTAINER          = $('.js-main-container');


// =============================================================================
//   Notifications - Custom Events
// =============================================================================
	  
  function handleUnsavedData (event, status) {
	  switch(status) {
          case 'saved':
		      $('.js-button-save').eq(0).removeClass('js-unsaved');
			  break;
	      case 'unsaved':
		      $('.js-button-save').eq(0).addClass('js-unsaved');
			  break;
	  }
  }
	
  function addCustomTriggerEvent( o ) {
	  if (typeof o !== 'object') { throw new Error("textgrabber says: Object expected") }
      // assign custom events to eventReceiver ('body')
      $('body').bind(o.custEvent, o.handler);
	  // loop over tags and assign custom trigger event
	  o.eles.forEach(function(item, index, array) { 
		   $MAIN_CONTAINER.on(o.onEvent, item, function() {
		       $(this).trigger(o.custEvent, [o.status]);
		 });
      });
  }
  
  // Form input elements 
  // Textarea
  addCustomTriggerEvent( 
	    { eles       : ['input[type=text]', 'textarea'], 
		  onEvent    : 'focus', 
		  custEvent  : 'unsaved', 
		  status     : 'unsaved',
		  handler    : handleUnsavedData
		});
		
  // Radio input elements 
  addCustomTriggerEvent( 
	    { eles       : ['input[type=radio]'], 
		  onEvent    : 'click', 
		  custEvent  : 'unsaved', 
		  status     : 'unsaved',
		  handler    : handleUnsavedData
		});
		
  // Date input elements 
  addCustomTriggerEvent( 
	    { eles       : ['input[type=date]'], 
		  onEvent    : 'focus', 
		  custEvent  : 'unsaved', 
		  status     : 'unsaved',
		  handler    : handleUnsavedData
		});				

  // Save button 
  addCustomTriggerEvent( 
	    { eles       : ['.js-button-save'], 
		  onEvent    : 'click', 
		  custEvent  : 'saved', 
		  status     : 'saved',
		  handler    : handleUnsavedData
		});				

  // Brand selector
  addCustomTriggerEvent( 
	    { eles       : ['.js-select-brand'], 
		  onEvent    : 'change', 
		  custEvent  : 'unsaved', 
		  status     : 'unsaved',
		  handler    : handleUnsavedData
		});		

// =============================================================================
//   Clean input text
// =============================================================================

  function grabText(txt) {
	  console.log('start');
      // if input is not string return false 
      if (typeof txt !== "string") { return false; }
      // holds text results
      var text = txt.trim(),
      // Regular expressions
      grep_cleanTags 	= /"*<\/?\w*>"*/ig,
	  grep_features    = /(Ausstattung|Technische Daten)(\s*(:)\s*)*/ig,
      grep_techData     = /([\w\s?]*)(?=(<\/techdata))/ig, // (^|\s)Blah(\s|$),
	  
      // extractor iterator function
      extract = function(txt, grep, c) {
			if (grep.length === c) {
			    return txt;	
			}
		    txt = txt.replace(grep[c][0], grep[c][1]);
            return extract(txt, grep, c+=1);
      },
      // arrange regular expressions in an array
	  // [0] = regular expression, [1] = replacement character
	  // to pass to iterator extractor function
	  grep_arr    = [];
	  grep_arr[0] = [ grep_cleanTags, "" ];
	  grep_arr[1] = [ grep_features, "\n$1$3 " ];
	  grep_arr[2] = [ grep_techData, "" ];
	  
	  // return extracted results
	  return extract(text, grep_arr, 0);
  
  }
  
 
// =============================================================================
//   Collect form field input – Return collection
// ============================================================================= 

  function getFormDetails( bool ) {
      // retrieve form details
      // collect all items for templating
	  // bool controls if HTML is escaped or not (Data saving > not escaped, Template writing > escaped)
      var c,
          collection  = {},
          inpElementTags = [ 'input', 'textarea', 'select' ];
			
      function collect( item, index, array ) {
          var c, 
		      collect = document.getElementsByTagName(item),
			  collect_len = collect.length,
			  eleItem = null;
          for (c = 0; c < collect_len; c += 1) {
			  eleItem = collect[c];
              // assign name
              if (eleItem.type === 'radio') {
                  collection[ eleItem.name ] = eleItem.checked;
		      } else {
                  collection[ eleItem.name ] = eleItem.value;
		      }		  	
		  }
          // mem clean up
          collect = null; 	
      }
      // send to collect function to collect elements values
      inpElementTags.forEach(collect);

      // return collection object
      return {
          date             : collection.date, 
		  designer         : collection.designer,
		  bn               : collection.bn,
		  lang_code        : 'GER',
		  model_number     : collection.model_number,
		  product_brand    : collection.product_brand,
		  product_name     : (collection.uppercase === true) ? 
		                         collection.product_name.toUpperCase() : collection.product_name,
								   	
		  feature_1        : collection.feature_1, 
          feature_2        : collection.feature_2, 
		  feature_3        : collection.feature_3, 
		  feature_4        : collection.feature_4, 
		  feature_5        : collection.feature_5,
		  packing_text     : (bool.htmlEscape === true) ? 
		                         EGG_StrManip.htmlEscape(EGG_StrManip.replLineBr(collection.packing_text), true, ["br"]
							 ) : collection.packing_text,
							  
		  feature_text     : collection.feature_text, 
		  tech_data        : collection.tech_data,
		  tech_data_dim    : collection.tech_data_dim, 
		  tech_data_weight : collection.tech_data_weight, 
		  contents         : (bool.htmlEscape === true) ? 
		                         EGG_StrManip.htmlEscape(EGG_StrManip.replLineBr(collection.contents), true, ["br"]
							 ) : collection.contents,
							   
		  contents_manual  : collection.contents_manual, 
		  remarks          : collection.remarks
      }
   }

// =============================================================================
//   Write saved item to form fields
// ============================================================================= 

  function writeFormDetails( bn ) {
      // expect string
      if (bn === '' && typeof bn !== 'string') { return; }
       // retrieve requested item and pass to form fields
	  var c, 
	      ele, 
		  savedItemObj = JSON.parse( window.localStorage.getItem(bn) );
	  for (c in savedItemObj) {
	      ele = document.getElementsByName(c)[0];
	      if (ele !== undefined && 'value' in ele) {
		      ele.value = savedItemObj[c];
		  }
		  ele = null;
      }
  }
 
// =============================================================================
//   Save item
// =============================================================================  
	
  // retrieve saved Items
  function saveItem() {
       if ('localStorage' in window) {
		  // collect form input 
          var coll = getFormDetails({ includeTemplate:true }),
		      bn = coll.bn;
		  if (bn !== "") {
              window
			   .localStorage
               .setItem(bn, JSON.stringify(coll));
		  } else {
              alert(NO_BN_ENTERED_MESSAGE);
			  return;	
		  }
	  } else {
          alert(NO_LOCAL_STORAGE_MESSAGE);	
      }
  }
  
 
// =============================================================================
//   Load saved item
// =============================================================================  
	
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
 
 
// =============================================================================
//   Events
// =============================================================================   
 
//--------Get text and load cleaned text into result-----------//	
  $('.js-button-grabText').on('click',function(e) {
		var a,
		    // extract text, results object returned
		    resStr = grabText( $('.js-paText').val() );
		    // extractor function returns null if value is not string
		if (typeof resStr === 'string') {
		    // join templates array and append to results tag
		    $(".js-result").html(TEMPL_CLEAN_TEXT({ cleanedTxt:resStr }));
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
	   .innerHTML = TEMPL_FINAL_TEMPLATE( getFormDetails({ htmlEscape:true }));
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
  
 
// =============================================================================
//   Initial Runs
// =============================================================================   
  
  // get saved items
  loadSavedItems();
  // write in first selected BN on load
  writeFormDetails ($('.js-select-saved-items').val());
  // clear all input data field
  //$('input, select, textarea').val("");
	
	
}(window));