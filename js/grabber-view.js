// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.view = (function(window) {

/* =============================================================================
     Constants
   ============================================================================= */
  var RESULT_TEXT_CONTAINER   = window.document.querySelector('.js-final-result-text'),
      CLEAN_TEXT_CONTAINER    = window.document.querySelector('.js-cleaned-text'),
	  SELECT_ITEM_SELECTOR    = window.document.querySelector('.js-select-saved-items'),
	  
      TEMPLATE_CLEAN_TEXT     = Handlebars.compile($("#cleaned-text-template").html()),
      TEMPLATE_FINAL_TEXT     = Handlebars.compile($("#final-text-template").html())
	  

/* =============================================================================
     Interface
   ============================================================================= */	  
  var interf = {

      closeOpenAllInputFields: function(obj) {
		  
		  var $fieldSets = $('fieldset'), 
		  allEleClosed = true;
		 
		  // conditions to force or close open all items
		  if (obj) {
			  var forceOpenAll = obj.forceOpenAll || false,
		          forceCloseAll = obj.forceOpenAll || false;
		  }
		  
		  $fieldSets.each(function() {
			  if ($(this).hasClass('js-open')) {
				  allEleClosed = false;  
			  }
	      
		  });
	  
		  if (allEleClosed === true || forceOpenAll === true) {
		      $fieldSets
			      .addClass('js-open')
				  .removeClass('js-close');
		   
		  } else if(allEleClosed !== true || forceCloseAll === true) {
			  $fieldSets
			      .addClass('js-close')
				  .removeClass('js-open');
           
		  }
      },
  
      closeOpenTextField: function($ele) {
		
		  if (!$ele) { return; }
		  
		  var $fieldSet = $ele.parent().next('fieldset');
	      
		  if ($fieldSet.hasClass('js-open')) {
			  $fieldSet.removeClass('js-open');
		  
	      } else {
			  $fieldSet.addClass('js-open');
		
	      }
      },
	  
      openClosePaTextField: function($ele, bool) {
	      
		  if (!$ele) { return; }
          
		  // if bool === true close fields unconditionally
		  if (bool === true) {
			  $ele
				  .addClass('js-close')
				  .removeClass('js-open');
			  
			  return;	  
		  }
		  // other cases		  
		  if ($ele.hasClass('js-open') || !$ele.hasClass('js-close')) {
			  $ele
			      .addClass('js-close')
				  .removeClass('js-open');
	
	      } else {
			  $ele
			      .addClass('js-open')
				  .removeClass('js-close');
		
	      }
		  
	  },
	  
	  removeAllInput: function() {
	      $('input, select, textarea').val("");  
		  
	  }
	  	  
  }
	  

/* =============================================================================
     Write form details
   ============================================================================= */
  function writeFormDetails( itemDetails ) {
      // expect string
      if (bn === '' && typeof bn !== 'string') { return false; }
       // retrieve requested item and pass to form fields
	  var c, ele = null;
	  
	  for (c in itemDetails) {
		  ele = document.getElementsByName(c)[0];
	      
		  if (ele !== undefined && 'value' in ele) {
		      ele.value = itemDetails[c];
		  
		  }
		  ele = null;
      }
	  
  }
 
 
/* =============================================================================
     Write templates
   ============================================================================= */
  
  /* write final results text template */
  function writeFinalTemplate( itemDetails ) {
      
	  RESULT_TEXT_CONTAINER.innerHTML = TEMPLATE_FINAL_TEXT(itemDetails);	
  
  }
  
  /* display cleaned STIBO text*/
  function writeCleanTextTemplate( itemDetails ) {

	  CLEAN_TEXT_CONTAINER.innerHTML = TEMPLATE_CLEAN_TEXT({ cleanedTxt:itemDetails });
  
  }
 
/* =============================================================================
     Display saved item BNs
   ============================================================================= */
  
  function displaySavedItems(savedItems){
      
	  if (typeof savedItems === 'string') {
		  SELECT_ITEM_SELECTOR.innerHTML = savedItems;
	  
	  }
	  
  }
  
/* =============================================================================
     Initializer function
   ============================================================================= */

  
		  return {
		      interf                 : interf,
			  writeFormDetails       : writeFormDetails, //function (bn)
			  writeFinalTemplate     : writeFinalTemplate, //function (object)
			  writeCleanTextTemplate : writeCleanTextTemplate, //function (object)
			  displaySavedItems      : displaySavedItems // function (string)
          };
		  
	
 
}(window));