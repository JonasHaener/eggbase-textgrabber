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
      
  function validateInput(fields) {
	  
	   //[{ name  : "BN", check : ['numeric', 'string', 'length'], DOM   : '.js-inp-bn'}]
       var c, 
	       len = fields.length, 
		   message = "", 
		   val = "", 
		   error = false, 
		   status = [],
		   messageApplied,
		   
		   checker = function(val, criteria) {
                
		       if (criteria === 'numeric') {
			       // if val isNan return false
			       return isNaN(val) || false;
		       }
		   
		       if (criteria === 'string') {
			       // if val is blank return false
			       return val === "" || false;
		       
			   }
			   
		       if (criteria === 'length') {
			       // if val is blank return false
			       return val.length !== 6 || false;
		       
			   }			   
    	   };
		   
	   for (c = 0; c < len; c++) {
		   // grab DOM ele
		   val = document.querySelector(fields[c].DOM).value;
		   // messageApplied for each loop cycle to avoid double assignment
           messageApplied = false;
		   // loop set criterias
		   fields[c].check.forEach(function(item,index,array) {
			   
			   var err = checker(val, item);
		       //status.push(error);
			   
			   if (err === true && messageApplied === false) {
				   // set boolean flag
				   error = true;
				   messageApplied = true;
				   message += fields[c].mess;
				   
			   }
			   
     	   });
		   
	   }

	   return { 
	       error: error,
		   message: message
	   }

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
      grep_spaces 	   = /"*/ig,
	  grep_subjects    = /(Ausstattung|Technische Daten|Lieferumfang)\s*:\s*/ig,
      grep_segregation = /\s*·\s*/ig,
	  
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
	  
	  grep_arr[0] = [ grep_spaces, "" ];
	  grep_arr[1] = [ grep_subjects, "@$1:\n" ];
	  grep_arr[2] = [ grep_segregation, "<br>\n"];
	  
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
							  
		  feature_text     : (bool.htmlEscape === true) ? 
		                         EGG_StrManip.htmlEscape(EGG_StrManip.replLineBr(collection.feature_text), true, ["br"]
							 ) : collection.feature_text,
		  
		  tech_data        : (bool.htmlEscape === true) ? 
		                         EGG_StrManip.htmlEscape(EGG_StrManip.replLineBr(collection.tech_data), true, ["br"]
							 ) : collection.tech_data,
		  
		  tech_data_dim    : collection.tech_data_dim, 
		  tech_data_weight : collection.tech_data_weight, 
		  contents         : (bool.htmlEscape === true) ? 
		                         EGG_StrManip.htmlEscape(EGG_StrManip.replLineBr(collection.contents), true, ["br"]
							 ) : collection.contents,
							   
		  contents_manual  : collection.contents_manual, 
		  remarks          : (bool.htmlEscape === true) ? 
		                         EGG_StrManip.htmlEscape(EGG_StrManip.replLineBr(collection.remarks), true, ["br"]
							 ) : collection.remarks
		  
      }
   }



 /* =============================================================================
     Save user input
   ============================================================================= */
	
  /* retrieve saved Items */
  function saveInput() {
	   
	   var storage = LOCAL_STORAGE;
	   if (storage) {
		  // collect form input 
          var coll = collectFormInput({ includeTemplate:true }),
		      bn = coll.bn,
			  error_arr = [];
		
		  storage.setItem(bn, JSON.stringify(coll));
		  return false;
	   
	   } else {
		 // if saving fails return true
	     return true;	
       
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
		  
	  } catch(err) { /* no handling */ }
  }

  /* get ONE saved item with BN */
  function deleteItem (bn) {
      // notifications [callback, "message"]
	  var storage = LOCAL_STORAGE;
	  if (storage !== false) {
		  LOCAL_STORAGE.removeItem(bn);
		  return false;
	 
	  } else {
		 return true;
		 
	  }
  }

  
 /* =============================================================================
     Return model object
   ============================================================================= */
  
  /* get ALL saved items */
  return {

	  validateInput    : validateInput,
      cleanText        : cleanText,
	  collectFormInput : collectFormInput,
	  saveInput        : saveInput,
	  getSavedItems    : getSavedItems,
	  getSavedItem     : getSavedItem,
	  deleteItem       : deleteItem
  
  }
    
}());