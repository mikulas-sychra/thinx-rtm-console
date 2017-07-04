var PasswordReset = function() {

  var urlBase = 'https://rtm.thinx.cloud:7443/api';

  var handleForgetPassword = function() {
    $('.forget-form').validate({
      errorElement: 'span', //default input error message container
      errorClass: 'help-block', // default input error message class
      focusInvalid: false, // do not focus the last invalid input
      ignore: "",
      rules: {
        password: {
          required: true,
          equalTo: "#rpassword"
        },
        rpassword: {
          required: true
        }
      },
      messages: {
        password: {
          required: "Password is required.",
          equalTo: "Passwords must match."
        },
        rpassword: {
          required: "Passwords must match."
        }
      },

      invalidHandler: function(event, validator) { //display error alert on form submit

      },

      highlight: function(element) { // hightlight error inputs
        $(element)
        .closest('.form-group').addClass('has-error'); // set error class to the control group
      },

      success: function(label) {
        label.closest('.form-group').removeClass('has-error');
        label.remove();
      },

      errorPlacement: function(error, element) {
        error.insertAfter(element.closest('.input-icon'));
      },

      submitHandler: function(form, event) {

        event.preventDefault();

        var activation = $.getQuery('activation');
        var owner = $.getQuery('owner');
        var reset_key = $.getQuery('reset_key');

        var data = {
          password: $('.forget-form input[name=password]').val(),
          rpassword: $('.forget-form input[name=rpassword]').val(),
          owner: owner
        };

        if (activation !== false) {
          data.activation = activation;
        }

        if (reset_key !== false) {
          data.reset_key = reset_key;
        }

        $.ajax({
          url: urlBase + '/user/password/set',
          data: data,
          type: 'POST',
          datatype: 'json',
          success: function(data) {
            console.log('--password set request success--');

            try {
              var response = JSON.parse(data);
              console.log(data);
            }
            catch(e) {
              console.log(e);
            }

            if (typeof(response) !== 'undefined') {
              if (response.success) {
                if (typeof response.redirect !== 'undefined') {
                  $('.msg-error', $('.forget-form')).hide();
                  $('.forget-form').hide();
                  $('.msg-success').show();

                  console.log('--Redirecting to "' + response.redirect + '"--' );
                  $('.login-button').attr('href', response.redirect);
                  // window.location = response.redirect;
                }
              } else {
                console.log(response.status)
                if (response.status == 'user_not_found') {
                  $('.msg-error', $('.forget-form')).text('User not found.');
                  $('.msg-error', $('.forget-form')).show();
                }
                if (response.status == 'activated_user_not_found') {
                  $('.msg-error', $('.forget-form')).text('Activated User not found.');
                  $('.msg-error', $('.forget-form')).show();
                }
              }
            }

          },
          error: function(data) {
            console.log('--password reset request failure--');

            $('.msg-error', $('.forget-form')).text('Server error, try again later.');
            $('.msg-error', $('.forget-form')).show();

            console.log(data);
          }
        });

      }
    });

    $('.forget-form input').keypress(function(e) {
      if (e.which == 13) {
        if ($('.forget-form').validate().form()) {
          $('.forget-form').submit();
        }
        return false;
      }
    });

  }

  return {
    //main function to initiate the module
    init: function() {
      // retrieve GET parameters
      $('.forget-form').show();
      $('.show-on-success', $('.forget-form')).hide();
      handleForgetPassword();
    }

  };

}();

jQuery(document).ready(function() {
  PasswordReset.init();
  (function($){
    $.getQuery = function( query ) {
      query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var expr = "[\\?&]"+query+"=([^&#]*)";
      var regex = new RegExp( expr );
      var results = regex.exec( window.location.href );
      if( results !== null ) {
        return results[1];
        // return decodeURIComponent(results[1].replace(/\+/g, " "));
      } else {
        return false;
      }
    };
  })(jQuery);
});
