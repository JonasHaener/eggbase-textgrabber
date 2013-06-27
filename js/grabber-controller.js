// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.controller = {};

EGG_TGrab.controller.validationFields = [{ name  : "BN",
		                          check : ['numeric', 'string', 'length'],
		                          DOM   : '.js-inp-bn',
								  mess  : EGG_TGrab.messages.MESSAGE_Bn
								},
								{ name  : "Designer",
		                          check : ['string'],
		                          DOM   : '.js-inp-designer',
								  mess  : EGG_TGrab.messages.MESSAGE_DesignerMissing
								},
								{ name  : "Product name",
		                          check : ['string'],
		                          DOM   : '.js-inp-prodName',
								  mess  : EGG_TGrab.messages.MESSAGE_ProdName
								}
							   ];

EGG_TGrab.controller.logic = function() {
	  
/* =============================================================================
     Notifications - Custom Events
   ============================================================================= */
  
  //report unsaved data  
  function notifyUnsavedData(customEvent, status) {
	  EGG_TGrab.notify.notifyUnsavedData(customEvent, status);
  
  }
  
  // assigns custom trigger events	
  function addCustomTriggerEvent( o ) {
	  
	  var container = $('.js-main-container');
	  
	  if (typeof o !== 'object') { 
	      throw new Error("textgrabber says: Object expected");
	  }
	  // assign custom events to eventReceiver $('.js-main-container')
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
	    var view = EGG_TGrab.view,
		model = EGG_TGrab.model,
		resStr = model.cleanText($('.js-paText').val());
		
		// pass cleaned text string to view for display
		if (typeof resStr === 'string') {
			view.writeCleanTextTemplate(resStr);
			// supply tru to close all items unconditionally
			view.interf.openClosePaTextField($('.js-paText'), true);
		
		}
        
	});

  
  /* Write final text template */
  $('.js-button-write-template').on('click',function(e) {
	  
	  var view = EGG_TGrab.view, 
	  model = EGG_TGrab.model;
	  
	  // returns object
      view.writeFinalTemplate( model.collectFormInput({ htmlEscape:true }) );
	  view.interf.openClosePaTextField( $('.js-paText,.js-inp-cleaned-text'), true );

  });


  /* Save form input */
  $('.js-button-save').on('click',function(e) {
	
	  var model = EGG_TGrab.model,
	  view = EGG_TGrab.view,
          // grab value currently in BN form field
	      // because Local Storage sorts alphabetically
	      initVal = $('.js-inp-bn').val(),
		  // returns {error:true/false, message:message}
		  error = model.validateInput(EGG_TGrab.controller.validationFields);
	 
	 // if validation fails	  
	 if (error.error === true) {
		EGG_TGrab.notify.popUp(error.message);    
	 
	 // if validation passed start to save  
	 } else {
	    // save and receive status
	    error = model.saveInput();
		// if saving fails
		if (error === true) {
		   EGG_TGrab.notify.popUp(EGG_TGrab.messages.MESSAGE_CannotDelete);
		
		} else {
		   EGG_TGrab.notify.notifyProcessCompl();
		   view.displaySavedItems( model.getSavedItems() );		   	
		
		}
		 
	 }
		  
	 $('.js-select-saved-items').val(initVal);  
	
  });
 
  
  /* Save form input */
  $('.js-button-delete-bn').on('click',function(e) {
	  
	  var conf = confirm(EGG_TGrab.messages.MESSAGE_DEL_WARNING),
	      error = false,
		  model = EGG_TGrab.model, 
		  view = EGG_TGrab.view;

      if (conf === true) {
	     error = model.deleteItem( $('.js-select-saved-items').val());
		 
		 if (error === true) {
			 EGG_TGrab.notify.popUp(EGG_TGrab.messages.MESSAGE_CannotDelete);

		 } else {
			
			EGG_TGrab.notify.notifyProcessCompl();
			
			view.displaySavedItems( model.getSavedItems() );
			// clean all input
			view.interf.removeAllInput();
			 
		 }
	  }
	  
  });
  
  /* Display saved items BNs */
  $('.js-select-saved-items').on('change',function(e) {
	  // retrieve selected items in option select
	  var view = EGG_TGrab.view,
	      savedItem = EGG_TGrab.model.getSavedItem( $(this).val() );
		  
	  view.writeFormDetails(savedItem);
	  view.interf.closeOpenAllInputFields({ forceOpenAll:true });
	  
  });
  
  // radio buttons
  $('.js-radio-uppercase, .js-radio-lowercase').on('change',function(e) {
	 
	 var val = $('.js-inp-prodName').val(),
		 
		 error = EGG_TGrab.model.validateInput( 
		   [{ name:"Product name",    
		      check:['string'],
		      DOM:'.js-inp-prodName', 
			  mess: EGG_TGrab.messages.MESSAGE_ProdName
		   }]);
		 
	 if (error.error === true) {
	     EGG_TGrab.notify.popUp(error.message);	
			
	 } else {
	     if ($(this).hasClass('js-radio-uppercase')) {
		    $('.js-inp-prodName').val(val.toUpperCase());
		   
		 } else if ($(this).hasClass('js-radio-lowercase')) {
		    $('.js-inp-prodName').val(val.toLowerCase() );
		   
		 }
	 }
  });
  
    /* Control cleaned text input field for editing */
  $('.js-main-container')
  // cleaned text field left section 
  .on('dblclick', '.js-inp-cleaned-text', function(e) {
      $(this).prop('disabled',"");
      
  })
  // cleaned text field left section 
  .on('blur', '.js-inp-cleaned-text' ,function(e) {
     $(this).prop('disabled','disabled');
      
  })
  // button in headers right section, open close all fields  
  .on('click', '.js-button-open-close-all', function() {
      EGG_TGrab.view.interf.closeOpenAllInputFields();
	  
  })
  // button in headers right section, open close single field  
  .on('click', '.js-button-open-close', function() {
      EGG_TGrab.view.interf.closeOpenTextField( $(this) );	  
  
  })
  // button in headers left section, open close input text fields   
  .on('click', '.js-button-open-close-paText', function() {
	  var $ele = $(this).parent().next('textarea');
	  EGG_TGrab.view.interf.openClosePaTextField( $ele );
	  
  });
  
  
 
/* =============================================================================
     Initial runs
   ============================================================================= */
  
  /* Display saved items BNs */
  EGG_TGrab.view.displaySavedItems( EGG_TGrab.model.getSavedItems() );
  // clean all input
  EGG_TGrab.view.interf.removeAllInput();
  // grab selected item and write form data 
  EGG_TGrab.view.writeFormDetails( EGG_TGrab.model.getSavedItem($('.js-select-saved-items').val()) );


};

// initialize controller on DOMContent loaded
document.addEventListener('DOMContentLoaded', EGG_TGrab.controller.logic, false);