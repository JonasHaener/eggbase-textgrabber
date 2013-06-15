// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.controller = (function() {

/* =============================================================================
     Constants
   ============================================================================= */

  var $MAIN_CONTAINER        = $('.js-main-container'),
	  $SELECT_ITEM_SELECTOR  = $('.js-select-saved-items'),
	  
	  MODEL                  = EGG_TGrab.model.init(),
	  VIEW                   = EGG_TGrab.view.init();


/* =============================================================================
     Notifications - Custom Events
   ============================================================================= */
  
  //report unsaved data  
  function notifyUnsavedData(customEvent, status) {
	 
	  VIEW.notifyUnsavedData(customEvent, status);
  
  }
  
  // assigns custom trigger events	
  function addCustomTriggerEvent( o ) {
	  
	  var container = $MAIN_CONTAINER;
	  
	  if (typeof o !== 'object') { 
	      throw new Error("textgrabber says: Object expected");
	  }
      
	  // assign custom events to eventReceiver ('body')
	  container.bind(o.custEvent, o.handler);
	  
	  // loop over tags and assign custom trigger event
	  o.eles.forEach(function(item, index, array) { 
		   container.on(o.onEvent, item, function() {
		       $(this).trigger(o.custEvent, [o.status]);
		 });
      });
	  
	  container = null;
  }
  
  // Form input elements 
  // Textarea
  addCustomTriggerEvent( 
	    { eles       : ['input[type=text]', 'textarea'], 
		  onEvent    : 'focus', 
		  custEvent  : 'unsaved', 
		  status     : 'unsaved',
		  handler    : notifyUnsavedData
  });
		
  // Radio input elements 
  addCustomTriggerEvent( 
	    { eles       : ['input[type=radio]'], 
		  onEvent    : 'click', 
		  custEvent  : 'unsaved', 
		  status     : 'unsaved',
		  handler    : notifyUnsavedData
  
  });
		
  // Date input elements 
  addCustomTriggerEvent( 
	    { eles       : ['input[type=date]'], 
		  onEvent    : 'focus', 
		  custEvent  : 'unsaved', 
		  status     : 'unsaved',
		  handler    : notifyUnsavedData
  
  });				

  // Save button 
  addCustomTriggerEvent( 
	    
		{ eles       : ['.js-button-save'], 
		  onEvent    : 'click', 
		  custEvent  : 'saved', 
		  status     : 'saved',
		  handler    : notifyUnsavedData
		
  });				

  // Brand selector
  addCustomTriggerEvent( 
	    { eles       : ['.js-select-brand'], 
		  onEvent    : 'change', 
		  custEvent  : 'unsaved', 
		  status     : 'unsaved',
		  handler    : notifyUnsavedData
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
	
	  var MOD = MODEL,
	  
	      // grab value currently in BN form field
	      // because Local Storage sorts alphabetically
	      initVal = $('.js-inp-bn').val();
	
	  if (MOD.validateInput(VIEW.notifyUser) === true) {
    	  // model will verify saving status
	      MOD.saveInput( VIEW.notifyUser );
	      
		  VIEW.displaySavedItems( MOD.getSavedItems() );
		  
		  $SELECT_ITEM_SELECTOR.val(initVal);  
	  }
  });
 
  
  /* Save form input */
  $('.js-button-delete-bn').on('click',function(e) {
	  
	  var bool = confirm("@ Are you sure you want to delete this item?");

      if (bool === true) {
		  
	     MODEL.deleteItem( $SELECT_ITEM_SELECTOR.val(), VIEW.notifyUser );
      
	     VIEW.displaySavedItems( MODEL.getSavedItems() );
		 
	  }
	  
  });
  
  /* Display saved items BNs */
  $SELECT_ITEM_SELECTOR.on('change',function(e) {
      
	  // retrieve selected items in option select
	  var savedItem = MODEL.getSavedItem( $SELECT_ITEM_SELECTOR.val() );
      
	  VIEW.writeFormDetails(savedItem);
  });
  
  
  $('.js-radio-uppercase').on('change',function(e) {
	 
	 var val = $('.js-inp-prodName').val();
	 
	 MODEL.validateInput(fn_notify, ['.js-inp-prodName'])
	 
	 
	 
  });
  
  
  
/* =============================================================================
     Initial runs
   ============================================================================= */
  
  /* Display saved items BNs */
  VIEW.displaySavedItems( MODEL.getSavedItems() );
  
  /* Display saved items BNs */
  $('input, select, textarea').val("");


}());