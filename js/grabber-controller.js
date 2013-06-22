// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.controller = function() {

/* =============================================================================
     Constants
   ============================================================================= */

var control =  {
	
	MODEL: EGG_TGrab.model.init(),
	VIEW : EGG_TGrab.view.init(),
	NOTIFY : EGG_TGrab.notifications,
	
	
	messages: {
	   MESSAGE_Bn              : '\n- Numeric BN, min. length 6.\n',
	   MESSAGE_DesignerMissing : '\n- Your NAME.\n',
	   MESSAGE_ProdName        : '\n- PRODUCT NAME.\n',
	   MESSAGE_DEL_WARNING     : '\n- SURE to delete?\n',
	   MESSAGE_NoStorage       : '\n- Sorry, your browser CANNOT SAVE data.\n',
	   MESSAGE_CannotDelete    : '\n- Sorry, CANNOT DELETE, try again.\n'
	},
/*	validationFields: [{ name  : "BN",
		               check : ['numeric', 'string', 'length'],
		               DOM   : '.js-inp-bn',
					   mess  : control.messages.MESSAGE_Bn
					   },
					   { name  : "Designer",
		               check : ['string'],
		               DOM   : '.js-inp-designer',
					   mess  :  control.messages.MESSAGE_DesignerMissing
					   },
					   { name  : "Product name",
		               check : ['string'],
		               DOM   : '.js-inp-prodName',
					   mess  : control.messages.MESSAGE_ProdName
					   }],
  */
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
     
	  var MODEL = this.MODEL,
	      VIEW = this.VIEW,
		  NOTIFY = this.NOTIFY,
		  _this = this;
	  
     
	  /* Get text and load cleaned text into result */	
      $('.js-button-grabText').on('click',function(e) {
	       var resStr = model.cleanText( $('.js-paText').val() );
		   // pass cleaned text string to view for display
		   if (typeof resStr === 'string') {
			   VIEW.writeCleanTextTemplate(resStr);
			   VIEW.interf.openClosePaTextField($('.js-paText'));
		
		  }
      });

     /* Write final text template */
     $('.js-button-write-template').on('click',function(e) {
	  // returns object
      VIEW.writeFinalTemplate( model.collectFormInput({ htmlEscape:true }) );
	  VIEW.interf.openClosePaTextField( $('.js-inp-cleaned-text') );

     });


     /* Save form input */
     $('.js-button-save').on('click',function(e) {
          // grab value currently in BN form field
	      // because Local Storage sorts alphabetically
	      var initVal = $('.js-inp-bn').val(),
		      // returns {error:true/false, message:message}
		      error = MODEL.validateInput(this.validationFields);
	 
	 // if validation fails	  
	 if (error.error === true) {
		NOTIFY.notifyUser(error.message);    
	 
	 // if validation passed start to save  
	 } else {
	    // save and receive status
	    error = model.saveInput();
		// if saving fails
		if (error === true) {
		   NOTIFY.notifyUser(_this.messages.MESSAGE_NoStorage);
		
		} else {
		   NOTIFY.notifyProcessCompl();
		   VIEW.displaySavedItems( model.getSavedItems() );		   	
		
		}
		 
	 }
		  
	   $('.js-select-saved-items').val(initVal);  
	
     });
 
  
    /* Save form input */
    $('.js-button-delete-bn').on('click',function(e) {

	  var conf = confirm(MESSAGE_DEL_WARNING),
	      error = false;

      if (conf === true) {
	     error = MODEL.deleteItem( $('.js-select-saved-items').val());
		 
		 if (error === true) {
			 notify(_this.messages.MESSAGE_CannotDelete);

		 } else {
			notify_complete();
			VIEW.displaySavedItems( MODEL.getSavedItems() );
			// clean all input
			VIEW.interf.removeAllInput();
			 
		 }
	  }
	  
    });
  
    /* Display saved items BNs */
    $('.js-select-saved-items').on('change',function(e) {
	  // retrieve selected items in option select
	  var savedItem = MODEL.getSavedItem( $('.js-select-saved-items').val() );
	  VIEW.writeFormDetails(savedItem);
	  
    });
  
    // radio buttons
    $('.js-radio-uppercase, .js-radio-lowercase').on('change',function(e) {
	
	 var val = $('.js-inp-prodName').val(),
		 
		 error = MODEL.validateInput( 
		   [{ name:"Product name",    
		      check:['string'],
		      DOM:'.js-inp-prodName', 
			  mess: _this.messages.MESSAGE_ProdName
		   }]);
		 
	 if (error.error === true) {
	     NOTIFY.notifyUser(error.message);	
			
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
	
     VIEW.interf.closeOpenAllFields();
	  
  })
  
  .on('click', '.js-button-open-close', function() {
	VIEW.interf.closeOpenIndiField( $(this) );	  
  
  })
  
  .on('click', '.js-button-open-close-paText', function() {
	  
	  var $ele = $(this).parent().next('textarea');
	  VIEW.interf.openClosePaTextField( $ele );
	  
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
  



  control.intialize();


};


// initialize controller on DOMContent loaded
document.addEventListener('DOMContentLoaded', EGG_TGrab.controller, false);