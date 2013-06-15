// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.view = (function() {

/* =============================================================================
     Constants
   ============================================================================= */
  var RESULT_TEXT_CONTAINER = document.querySelector('.js-final-result-text'),
      CLEAN_TEXT_CONTAINER  = document.querySelector('.js-cleaned-text'),
	  SELECT_ITEM_SELECTOR  = document.querySelector('.js-select-saved-items'),
	  
      TEMPLATE_CLEAN_TEXT   = Handlebars.compile($("#cleaned-text-template").html()),
      TEMPLATE_FINAL_TEXT   = Handlebars.compile($("#final-text-template").html());

/* =============================================================================
     User notifications
   ============================================================================= */
  
  /* report unsaved data to user */
  function reportUnsavedData (event, status) {
	  switch(status) {
          case 'saved':
		      $('.js-button-save').eq(0).removeClass('js-unsaved');
			  break;
	      case 'unsaved':
		      $('.js-button-save').eq(0).addClass('js-unsaved');
			  break;
	  }
  }
  
  /* alert messages to user */
  function alertUser(message) {
      alert(message);  
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
	  init:function() {
		  return {
		      reportUnsavedData      : reportUnsavedData, //function (event, status)
			  writeFormDetails       : writeFormDetails, //function (bn)
			  alertUser              : alertUser,  //function (string)
			  writeFinalTemplate     : writeFinalTemplate, //function (object)
			  writeCleanTextTemplate : writeCleanTextTemplate, //function (object)
			  displaySavedItems      : displaySavedItems // function (string)
          };
	  }
  }
 
}());