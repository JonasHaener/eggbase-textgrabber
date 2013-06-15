// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.controller = (function() {

/* =============================================================================
     Constants
   ============================================================================= */

  var MESSAGE_NoStorage  = 'Sorry your browser cannot save items',
	  MESSAGE_NoBn       = 'Please enter a BN',
	  $MAIN_CONTAINER    = $('.js-main-container'),
	  MODEL = EGG_TGrab.model.init(),
	  VIEW = EGG_TGrab.view.init();

/* =============================================================================
     Notifications - Custom Events
   ============================================================================= */
  
  //report unsaved data  
  function handleUnsavedData (event, status) {
	  VIEW.reportUnsavedData(event, status);
  }

  // assigns custom trigger events	
  function addCustomTriggerEvent( o ) {
	  if (typeof o !== 'object') { 
	      throw new Error("textgrabber says: Object expected");
	  }
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

/* =============================================================================
     Events
   ============================================================================= */
 
  /* Get text and load cleaned text into result */	
  $('.js-button-grabText').on('click',function(e) {
		var resStr = MODEL.cleanText( $('.js-paText').val() );
		// pass cleaned text string to view for display
		if (typeof resStr === 'string') {
			VIEW.writeCleanTextTemplate(resStr);
		}
		// prevent form submission
		e.preventDefault();
	});

  /* Control cleaned text input field for editing */
  $('body')
      .on('dblclick', '.js-inp-cleaned-text', function(e) {
           $(this).prop('disabled',"");
      })
      .on('blur', '.js-inp-cleaned-text' ,function(e) {
          $(this).prop('disabled','disabled');
      });
	
  /* Write final text template */
  $('.js-button-write-template').on('click',function(e) {
	  // returns object
      VIEW.writeFinalTemplate( MODEL.collectFormInput({ htmlEscape:true }) );
  });

  /* Save form input */
  $('.js-button-save').on('click',function(e) {
      // grab value currently in BN form field
	  // because Local Storage sorts alphabetically
	  var initVal = $('.js-inp-bn').val(),
	      saved = MODEL.saveInput();
	  // "saved" is custom message
	  switch (saved) {
		case "saved":
		    break;
		case "bn_missing":
		   VIEW.alertUser(MESSAGE_NoBn); 
		   break;
		case "no_storage":
		   VIEW.alertUser(MESSAGE_NoStorage);    
	  }
	  // refresh saved items
	  VIEW.displaySavedItems( MODEL.getSavedItems() );
      // assign initial to saved items value after reloading items
      $('.js-select-saved-items').val(initVal);
  });
  
  /* Display saved items BNs */
  $('.js-select-saved-items').on('change',function(e) {
      // retrieve selected items in option select
	  var savedItem = MODEL.getSavedItem( $('.js-select-saved-items').val() );
      VIEW.writeFormDetails(savedItem);
  });
  
/* =============================================================================
     Initial runs
   ============================================================================= */
  
  /* Display saved items BNs */
  VIEW.displaySavedItems( MODEL.getSavedItems() );
  /* Display saved items BNs */
  $('input, select, textarea').val("");

}());