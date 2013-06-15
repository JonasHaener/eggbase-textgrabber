// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.model = (function() {

/* =============================================================================
     Constants
   ============================================================================= */

  //var $MAIN_CONTAINER = $('.js-main-container');
    var LOCAL_STORAGE = ("localStorage" in window) ? window.localStorage : false;
	
/* =============================================================================
     Input validation
   ============================================================================= */
      
  function validateInput(fn_notify) {
	   
	   var bool = true,
	       bn_input = document.querySelector('.js-inp-bn').value,
		   designer = document.querySelector('.js-inp-designer').value,
		   prodName = document.querySelector('.js-inp-prodName').value,
		   messObj = {};
	   
	   if (designer === "") {
		   
		   messObj.designer = false;
		   bool = false;
       
	   }
	   
       if (bn_input === "" || isNaN(bn_input)) {
		  
		  messObj.bn = false;
		  bool = false;
	   
	   }
	   
	   if (prodName === "") {
		  
		  messObj.prodName = false;
		  bool = false;
	   
	   }
	   
	   
	   if (bool === false) {
		   // send message to view for user display
	       fn_notify({ type:"validator", value:messObj });
	   }
	   
 
	   // return value is used for saving items
	   return bool;
   } 	
	
	
/* =============================================================================
     Clean STIBO text
   ============================================================================= */

  function cleanText(txt) {
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
  
 /* =============================================================================
     Collect form field input – Return collection
   ============================================================================= */
  
  function collectFormInput( bool ) {
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



 /* =============================================================================
     Save user input
   ============================================================================= */
	
  /* retrieve saved Items */
  function saveInput(fn_notify) {
	   
	   var storage = LOCAL_STORAGE;
       
	   if (storage) {

		  // collect form input 
          var coll = collectFormInput({ includeTemplate:true }),
		      bn = coll.bn,
			  error_arr = [];
		
		  storage.setItem(bn, JSON.stringify(coll));
			  // send user feedback
			  fn_notify({ type:"save", value:true });
	   
	   } else {
		   
	     fn_notify({ type:"save", value:false });	
       
	   }
  }
  
 /* =============================================================================
     Retrieve saved items
   ============================================================================= */
	
  /* get ONE saved item with BN */
  function getSavedItem (bn) {
      
	  return JSON.parse(LOCAL_STORAGE.getItem(bn));
  
  }
  
  /* get ALL saved items */
  function getSavedItems() {
	  
	  var storage = LOCAL_STORAGE;
      
	  try {
          
		  if (storage !== false) {
              
			  var c,
			      savedItem = null,
		          options = "";
		      
			  for (c in storage) {
                  savedItem = JSON.parse(storage.getItem(c));
			      options += "<option>" + savedItem.bn + "</option>"	
              }
              
			  return options; //string
          
		  } else {
			
			  return ""; // string
		  }
		  
	  } catch(err) { }
  }

  /* get ONE saved item with BN */
  function deleteItem (bn, fn_notify) {
      
	  var storage = LOCAL_STORAGE
	  
	  if (storage !== false) {
		  
		  LOCAL_STORAGE.removeItem(bn);
		  
		  fn_notify({ type:"delete", value:true });
	 
	  } else {
		  
		  fn_notify({ type:"delete", value:false });
	  }
  }

  
  
 /* =============================================================================
     Return model object
   ============================================================================= */
  
  /* get ALL saved items */
  function Constructor() {
	  
	  this.validateInput    = validateInput;
      this.cleanText        = cleanText;
	  this.collectFormInput = collectFormInput;
	  this.saveInput        = saveInput;
	  this.getSavedItems    = getSavedItems;
	  this.getSavedItem     = getSavedItem;
	  this.deleteItem       = deleteItem;
  
  }
  
  
  /* assign init function to MODEL namespace */
  return { 
      
	  init: function() { 
	      return new Constructor();
	  }
  
  };
    
}());