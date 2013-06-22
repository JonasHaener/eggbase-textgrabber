// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.controller = function() {

/* =============================================================================
     Constants
   ============================================================================= */

return {
	MODEL: EGG_TGrab.model.init(),
	VIEW : EGG_TGrab.view.init(),
	
	messages: {
	   MESSAGE_Bn              : '\n- Numeric BN, min. length 6.\n',
	   MESSAGE_DesignerMissing : '\n- Your NAME.\n',
	   MESSAGE_ProdName        : '\n- PRODUCT NAME.\n',
	   MESSAGE_DEL_WARNING     : '\n- SURE to delete?\n',
	   MESSAGE_NoStorage       : '\n- Sorry, your browser CANNOT SAVE data.\n',
	   MESSAGE_CannotDelete    : '\n- Sorry, CANNOT DELETE, try again.\n'
	},
	validation_fields: [{ name  : "BN",
		               check : ['numeric', 'string', 'length'],
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
					   }],
  
/* =============================================================================
     Notifications - Custom Events
   ============================================================================= */
  //report unsaved data  
  notifyUnsavedData : function(customEvent, status) {
	  EGG_TGrab.notifications.notifyUnsavedData(customEvent, status);
  
  },
  
  // assigns custom trigger events	
  addCustomTriggerEvent: function( o ) {
	  
	  var container = $('.js-main-container');
	  
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
  },
  
  handlers: function() {
     
	  var _this = this;
     
	  /* Get text and load cleaned text into result */	
      $('.js-button-grabText').on('click',function(e) {
	      var model = EGG_TGrab.model.init(),
		      view = EGG_TGrab.view.init(),
		      resStr = model.cleanText( $('.js-paText').val() );
		   // pass cleaned text string to view for display
		   if (typeof resStr === 'string') {
			   view.writeCleanTextTemplate(resStr);
			   view.interf.openClosePaTextField($('.js-paText'));
		
		  }
      });

     /* Write final text template */
     $('.js-button-write-template').on('click',function(e) {
	  var model = EGG_TGrab.model.init(),
		  view = EGG_TGrab.view.init();
	  // returns object
      view.writeFinalTemplate( model.collectFormInput({ htmlEscape:true }) );
	  view.interf.openClosePaTextField( $('.js-inp-cleaned-text') );

     });


     /* Save form input */
     $('.js-button-save').on('click',function(e) {
	
	  var model  = EGG_TGrab.model.init(),
	      notify = EGG_TGrab.notifications.notifyUser,
		  view  = EGG_TGrab.view.init(),
		  notify_complete = EGG_TGrab.notifications.notifyProcessCompl,
          // grab value currently in BN form field
	      // because Local Storage sorts alphabetically
	      initVal = $('.js-inp-bn').val(),
		  // returns {error:true/false, message:message}
		  error = model.validateInput(VALIDATION_FIELDS);
	 
	 // if validation fails	  
	 if (error.error === true) {
		notify(error.message);    
	 
	 // if validation passed start to save  
	 } else {
	    // save and receive status
	    error = model.saveInput();
		// if saving fails
		if (error === true) {
		   notify(MESSAGE_CannotDelete);
		
		} else {
		   notify_complete();
		   view.displaySavedItems( model.getSavedItems() );		   	
		
		}
		 
	 }
		  
	   $('.js-select-saved-items').val(initVal);  
	
     });
 
  
    /* Save form input */
    $('.js-button-delete-bn').on('click',function(e) {

	  var model  = EGG_TGrab.model.init(),
	      notify = EGG_TGrab.notifications.notifyUser,
		  notify_complete = EGG_TGrab.notifications.notifyProcessCompl,
		  view  = EGG_TGrab.view.init(),
		  conf = confirm(MESSAGE_DEL_WARNING),
	      error = false;

      if (conf === true) {
	     error = model.deleteItem( $('.js-select-saved-items').val());
		 
		 if (error === true) {
			 notify(MESSAGE_CannotDelete);

		 } else {
			notify_complete();
			view.displaySavedItems( model.getSavedItems() );
			// clean all input
			view.interf.removeAllInput();
			 
		 }
	  }
	  
    });
  
    /* Display saved items BNs */
    $('.js-select-saved-items').on('change',function(e) {
	  // retrieve selected items in option select
	  var model  = EGG_TGrab.model.init(),
	      notify = EGG_TGrab.notifications.notifyUser,
		  notify_complete = EGG_TGrab.notifications.notifyProcessCompl,
		  view  = EGG_TGrab.view.init(),
		  savedItem = model.getSavedItem( $('.js-select-saved-items').val() );
		  
	  view.writeFormDetails(savedItem);
    });
  
    // radio buttons
    $('.js-radio-uppercase, .js-radio-lowercase').on('change',function(e) {
	
	 var model  = EGG_TGrab.model.init(),
	     notify = EGG_TGrab.notifications.notifyUser,
		 notify_complete = EGG_TGrab.notifications.notifyProcessCompl,
		 view  = EGG_TGrab.view.init(),
		 val = $('.js-inp-prodName').val(),
		 
		 error = model.validateInput( 
		   [{ name:"Product name",    
		      check:['string'],
		      DOM:'.js-inp-prodName', 
			  mess: MESSAGE_ProdName
		   }]);
		 
	 if (error.error === true) {
	     notify(error.message);	
			
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
  
   .on('dblclick', '.js-inp-cleaned-text', function(e) {
      $(this).prop('disabled',"");
      
   })
   
   .on('blur', '.js-inp-cleaned-text' ,function(e) {
     $(this).prop('disabled','disabled');
      
   })

  .on('click', '.js-button-open-close-all', function() {
	
     this.VIEW.interf.closeOpenAllFields();
	  
  })
  
  .on('click', '.js-button-open-close', function() {
	this.VIEW.interf.closeOpenIndiField( $(this) );	  
  
  })
  
  .on('click', '.js-button-open-close-paText', function() {
	  
	  var $ele = $(this).parent().next('textarea');
	  this.VIEW.interf.openClosePaTextField( $ele );
	  
   });
	  
	  
  },
  addCustomTriggers: function() {
	 var cutomTrigger = this.addCustomTriggerEvent;
	     notifyUnsavedData = this.notifyUnsavedData;
	  // Form input elements 
	  // Textarea
	  cutomTrigger( 
			{ eles       : ['input[type=text]', 'textarea'], 
			  onEvent    : 'focus', 
			  custEvent  : 'unsaved', 
			  status     : 'unsaved',
			  handler    : notifyUnsavedData
	  });
			
	  // Radio input elements 
	  cutomTrigger( 
			{ eles       : ['input[type=radio]'], 
			  onEvent    : 'click', 
			  custEvent  : 'unsaved', 
			  status     : 'unsaved',
			  handler    : notifyUnsavedData
	  
	  });
			
	  // Date input elements 
	  cutomTrigger( 
			{ eles       : ['input[type=date]'], 
			  onEvent    : 'focus', 
			  custEvent  : 'unsaved', 
			  status     : 'unsaved',
			  handler    : notifyUnsavedData
	  
	  });				
	
	  // Save button 
	  cutomTrigger( 
			
			{ eles       : ['.js-button-save'], 
			  onEvent    : 'click', 
			  custEvent  : 'saved', 
			  status     : 'saved',
			  handler    : notifyUnsavedData
			
	  });				
	
	  // Brand selector
	  cutomTrigger( 
			{ eles       : ['.js-select-brand'], 
			  onEvent    : 'change', 
			  custEvent  : 'unsaved', 
			  status     : 'unsaved',
			  handler    : notifyUnsavedData
	  });		
	
	
	
		  
		  
		  
  },
  
  intialize: function() {
	 this.handlers();
	 this.addCustomTriggers();
	   /* Display saved items BNs */
     this.VIEW.displaySavedItems( this.MODEL.getSavedItems() );
  
     // clean all input
     this.VIEW.interf.removeAllInput(); 
	      
  }
  
}
  
  



/* =============================================================================
     Events
   ============================================================================= */
 
  
  
 
/* =============================================================================
     Initial runs
   ============================================================================= */
  






};


// initialize controller on DOMContent loaded
document.addEventListener('DOMContentLoaded', EGG_TGrab.controller, false);