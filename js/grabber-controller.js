// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.controller = function() {

/* =============================================================================
     Constants
   ============================================================================= */

  var MESSAGE_Bn              = '\n- Numeric BN.\n',
	  MESSAGE_DesignerMissing = '\n- Your NAME.\n',
	  MESSAGE_ProdName        = '\n- PRODUCT NAME.\n',
	  MESSAGE_DEL_WARNING     = '\n- SURE to delete?\n',
	  MESSAGE_NoStorage       = '\n- Sorry, your browser CANNOT SAVE data.\n',
	  MESSAGE_CannotDelete    = '\n- Sorry, CANNOT DELETE, try again.\n',

      $MAIN_CONTAINER        = $('.js-main-container'),
	  $SELECT_ITEM_SELECTOR  = $('.js-select-saved-items'),
	  VALIDATION_FIELDS      = [{ name  : "BN",
		                          check : ['numeric', 'string'],
		                          DOM   : '.js-inp-bn',
								  mess  : MESSAGE_Bn
								},
								{ name  : "Designer",
		                          check : ['string'],
		                          DOM   : '.js-inp-designer',
								  mess  :  MESSAGE_DesignerMissing
								},
								{ name  : "Product name",
		                          check : ['string'],
		                          DOM   : '.js-inp-prodName',
								  mess  : MESSAGE_ProdName
								}
							   ],
	  
	  MODEL                  = EGG_TGrab.model.init(),
	  VIEW                   = EGG_TGrab.view.init(),
	  
	  NOTIFY    			 = EGG_TGrab.notifications.notifyUser,
	  NOTIFY_COMPLETE        = EGG_TGrab.notifications.notifyProcessCompl;
	  
/* =============================================================================
     Notifications - Custom Events
   ============================================================================= */
  
  //report unsaved data  
  function notifyUnsavedData(customEvent, status) {
	 
	  EGG_TGrab.notifications.notifyUnsavedData(customEvent, status);
  
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
	      initVal = $('.js-inp-bn').val(),

		  // returns {error:true/false, message:message}
		  error = MOD.validateInput(VALIDATION_FIELDS);
	 
	 // if validation fails	  
	 if (error.error === true) {
		 
		NOTIFY(error.message);    
	 
	 // if validation passed start to save  
	 } else {
	    // save and receive status
	    error = MOD.saveInput();
		// if saving fails
		if (error === true) {
		   
		   NOTIFY(MESSAGE_CannotDelete);
		
		} else {
		   
		   NOTIFY_COMPLETE();
		   VIEW.displaySavedItems( MOD.getSavedItems() );		   	
		}
		 
	 }
		  
	 $SELECT_ITEM_SELECTOR.val(initVal);  
	
  });
 
  
  /* Save form input */
  $('.js-button-delete-bn').on('click',function(e) {
	  
	  var conf = confirm(MESSAGE_DEL_WARNING),
	      error = false;

      if (conf === true) {
		  
	     error = MODEL.deleteItem( $SELECT_ITEM_SELECTOR.val());
         
		 if (error === true) {
			 
			 NOTIFY(MESSAGE_CannotDelete);

		 } else {
			
			NOTIFY_COMPLETE();
			VIEW.displaySavedItems( MODEL.getSavedItems() );
			 
		 }
		 
	  }
	  
  });
  
  /* Display saved items BNs */
  $SELECT_ITEM_SELECTOR.on('change',function(e) {
      
	  // retrieve selected items in option select
	  var savedItem = MODEL.getSavedItem( $SELECT_ITEM_SELECTOR.val() );
      
	  VIEW.writeFormDetails(savedItem);
  });
  
  // radio buttons
  $('.js-radio-uppercase, .js-radio-lowercase').on('change',function(e) {
	 
	 var val = $('.js-inp-prodName').val(),
	    
		 error = MODEL.validateInput( 
		   [{ name:"Product name",    
		      check:['string'],
		      DOM:'.js-inp-prodName', 
			  mess:MESSAGE_ProdName
		   }]);
		 
		if (error.error === true) {
		   
		    NOTIFY(error.message);	
			
		} else {
		    
			if ($(this).hasClass('js-radio-uppercase')) {
		        
				$('.js-inp-prodName').val(val.toUpperCase());
		   
		    } else if ($(this).hasClass('js-radio-lowercase')) {
		        
				$('.js-inp-prodName').val(val.toLowerCase() );
		   
		    }
	   }
	 
  });
  
  $('.js-button-open-close-all').click(function() {
	  
	  var $fieldSets = $('fieldset'), allEleClosed = true;
	  
	  $fieldSets.each(function() {
		  
		  if ($(this).hasClass('js-open')) {
			allEleClosed = false;  
			  
		  }
		  
	  });
	  
	  if (allEleClosed === true) {
		  $fieldSets.addClass('js-open');

	  } else {
          $fieldSets.removeClass('js-open');

      }
	  
  });
  
  $('.js-button-open-close').click(function() {
	  
	  var $fieldSet = $(this).parent().next('fieldset');
	  
	  if ($fieldSet.hasClass('js-open')) {
		  $fieldSet.removeClass('js-open');
		  
	  
	  } else {
		  $fieldSet.addClass('js-open');
		
	  }
	  
  });
  
  
 
  
  
/* =============================================================================
     Initial runs
   ============================================================================= */
  
  /* Display saved items BNs */
  VIEW.displaySavedItems( MODEL.getSavedItems() );
  
  /* Display saved items BNs */
  $('input, select, textarea').val("");


};


// initialize controller on DOMContent loaded
document.addEventListener('DOMContentLoaded', EGG_TGrab.controller, false);