// grabberjs
"use strict";

window.EGG_TGrab || (window.EGG_TGrab = {});

EGG_TGrab.notifications = {

	/* report unsaved data to user */
    notifyUnsavedData : function(customEvent, status) {
	  
	  switch(status) {
          
		  case 'saved':
		      $('.js-button-save').eq(0).removeClass('js-unsaved');
			  break;
	      
		  case 'unsaved':
		      $('.js-button-save').eq(0).addClass('js-unsaved');
			  break;
	  }
	  
  },
  
  /* report process completed */
  notifyProcessCompl : function() {
	  
	  var ele = $('.js-button-process-complete').eq(0);
        
		 ele.removeClass('js-process-idle').addClass('js-process-complete');
	         
		 setTimeout(function() {
		      ele.removeClass('js-process-complete').addClass('js-process-idle');
	      }, 1500);
			  
  },
  
  notifyUser : function(mess) {
      
	  if (typeof mess !== "string") { 
	      throw new Error('String expected'); 
	  }
	  
	  alert( "Please enter/correct/note: \n" + mess);  
  },
  
  customSet: function(handlersArr) {
	   
	   var o = {}, c;
	   
	   o.handlers = {};
	   
	   // accepts kind + additional function if not default
	   o.notify = function(kind, fn) {
	       if (kind in o.handlers) {
			   if (typeof fn === 'undefined') {
			       EGG_TGrab.notifications.notifyUser(o.handlers[kind]);
			   } else {
				   fn();   
			   }
			}
		}
		
		//[ { kind:'click', handler:func }]
		for (c = 0; c < handlersArr.length; c++) {
     		var a = handlersArr[c];
			console.log(a.kind +":" + a.handler);
		   	o.handlers[a.kind] = a.handler;
    	}
	
       return o.notify;
	}
  
};