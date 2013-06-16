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
      TEMPLATE_FINAL_TEXT     = Handlebars.compile($("#final-text-template").html()),
	  
	  MESSAGE_NoStorage       = 'Sorry mate, your browser cannot save!',
	  MESSAGE_CannotDelete    = 'Sorry, cannot delete, try again!';

/* =============================================================================
     User notifications
   ============================================================================= */
  
  /* report unsaved data to user */
  function notifyUnsavedData(customEvent, status) {
	  
	  switch(status) {
          
		  case 'saved':
		      $('.js-button-save').eq(0).removeClass('js-unsaved');
			  break;
	      
		  case 'unsaved':
		      $('.js-button-save').eq(0).addClass('js-unsaved');
			  break;
	  }
	  
  }


  /* report process completed */
  function notifyProcessCompl() {
	  
	  var ele = $('.js-button-process-complete').eq(0);
        
		 ele.removeClass('js-process-idle').addClass('js-process-complete');
	         
		 setTimeout(function() {
		      ele.removeClass('js-process-complete').addClass('js-process-idle');
	      }, 1500);
			  
	  }
  
  function notifyUser(mess) {
	  
	  if (typeof mess !== "object") { throw new Error('String expected'); }
      
	  var message = "",
	      messType = mess.type,
	      status = mess.value,
		  
	      /* alert messages to user */
          alertUser = function(message) {
              
			  alert(message);  
          
		  };
		  
		  
	  if (messType === "save") {
		  
		  if (status === true) {
		     notifyProcessCompl();
		  
		  } else if (status === false) {
		     alertUser(MESSAGE_NoStorage);
		  
		  }
	  }
	  
	  
	  if (messType === "delete") {
		  
		  if (status === true) {
		     notifyProcessCompl();
		  
		  } else if (status === false) {
		     alertUser(MESSAGE_NoStorage);
		  
		  }
      }
	  
	  // received bn (false), designer (false)
	  if (messType === "validator" && typeof status === 'string') {
  
		  alertUser(status); 
      
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
	  
	  init:function() {
		  
		  return {
		      notifyUnsavedData      : notifyUnsavedData, //function (event, status)
			  notifyUser             : notifyUser, //function (object)
			  writeFormDetails       : writeFormDetails, //function (bn)
			  writeFinalTemplate     : writeFinalTemplate, //function (object)
			  writeCleanTextTemplate : writeCleanTextTemplate, //function (object)
			  displaySavedItems      : displaySavedItems // function (string)
          };
		  
	  }
  }
 
}(window));