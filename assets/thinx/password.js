var PasswordReset = function() {

    var handleForgetPassword = function() {
        $('.forget-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                pwd1: {
                    required: true
                },
                pwd2: {
                    required: true
                },
                pwd1: {
                    equalTo: "#pwd2"
                }
            },

            messages: {
                pwd1: {
                    required: "Password is required."
                },
                pwd2: {
                    required: "Re-tyep your password."
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

            submitHandler: function(form) {
            
                var url = 'http://thinx.cloud:7442/api/user/password/set';
                $.ajax({
                    url: url,
                    data: { 
                        password: $('.forget-form input[name=pwd1]').val(), 
                        rpassword: $('.forget-form input[name=pwd2]').val(),
                        owner: owner, 
                        activation: activationKey
                    },
                    type: 'POST',
                    datatype: 'json',
                    success: function(data) {
                        console.log('--password set request success--');
                        console.log(data);

                        var response = JSON.parse(data);
                        console.log(response);

                        if (typeof(response) !== 'undefined') {
                            console.log('--show info what now--');

                            $('.msg-success', $('.forget-form')).show();
                            $('.hide-on-success', $('.forget-form')).hide();
                        }

                    },
                    error: function(response) {
                        console.log('--password reset request failure--');
                         console.log(response);

                         $('.msg-success', $('.forget-form')).show();
                            $('.hide-on-success', $('.forget-form')).hide();
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
            handleForgetPassword();
            jQuery('.forget-form').show();
             $('.show-on-success', $('.forget-form')).hide();


            console.log('PASSWORD DATA');

            $.urlParam = function(name){
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                return results[1] || 0;
            }

            try {
                var activation = decodeURIComponent($.urlParam('activation'));
                var owner = decodeURIComponent($.urlParam('owner'));
            }
            catch(err) {
                var activation = null;
                var owner = null;
            }

            // try {
                // var reset_key = decodeURIComponent($.urlParam('reset_key'));
            // }
            // catch(err) {
                // var reset_key = null;
            // } 

            console.log('activation - ' + activation);
            $('#activation').val(activation);
            console.log('owner - ' + owner);
            $('#owner').val(owner);
            // console.log('reset_key - ' + reset_key);
            // $('#resetKey').val(resetKey);


        }

    };

}();

jQuery(document).ready(function() {
    PasswordReset.init();                    
});