var Login = function() {

    var handleLogin = function() {
        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },
            messages: {
                username: {
                    required: "Username is required."
                },
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
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
                var url = 'http://thinx.cloud:7442/api/login';

                $.ajax({
                    url: url,
                    withCredentials: true,
                    data: { 
                        username: $('input[name=username]').val(), 
                        password: $('input[name=password]').val()
                    }, 
                    type: 'POST',
                    datatype: 'json',
                    success: function(data, status, xhr) {
                        console.log('--login success--');
                        var response = JSON.parse(data);
                        console.log(response);
                        if (typeof(response) !== 'undefined') {
                            console.log('--Redirecting to "' + response.redirectURL + '"--' );
                            window.location = response.redirectURL;
                        }
                    },
                    error: function(data) {
                        console.log('--login failure--');
                        $('.msg-error', $('.login-form')).text('Server error, try again later.');
                        $('.msg-error', $('.login-form')).show();
                        console.log(data);
                    }
                });

            }
        });

        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleForgetPassword = function() {
        $('.forget-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                email: {
                    required: "Email is required."
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
                var url = 'http://thinx.cloud:7442/api/user/password/reset';
                $.ajax({
                    url: url,
                    data: { email: $('.forget-form input[name=email]').val() }, //parameters go here in object literal form
                    type: 'POST',
                    datatype: 'json',
                    success: function(data) {
                        console.log('--password reset request success--');

                        try {
                           var response = JSON.parse(data);    
                        }
                        catch(e) {
                           console.log(e);
                        }

                        if (typeof(response) !== 'undefined') {
                            if (response.success) {
                                console.log(response.status)
                                if (response.status == 'email_sent') {
                                    $('.msg-error', $('.forget-form')).hide();
                                    $('.forget-form').hide();
                                    $('.msg-success .form-subtitle').text('Check your email for reset link.');
                                    $('.msg-success').show();
                                }
                            } else {
                                console.log(response.status)
                                if (response.status == 'email_not_found') {
                                    $('.msg-error', $('.forget-form')).text('Email not found.');
                                    $('.msg-error', $('.forget-form')).show();
                                } 
                            }
                        }

                    },
                    error: function(data) {
                        console.log('--password reset request failure--');

                        console.log(data);                        

                        $('.msg-error').text('Server error, try again later.');
                        $('.msg-error').show();

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

        jQuery('#forget-password').click(function() {
            jQuery('.login-form').hide();
            jQuery('.forget-form').show();
        });

        jQuery('#back-btn').click(function() {
            jQuery('.login-form').show();
            jQuery('.forget-form').hide();
        });

    }

    var handleRegister = function() {

        function format(state) {
            if (!state.id) { return state.text; }
            var $state = $(
             '<span><img src="../assets/global/img/flags/' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
            );
            
            return $state;
        }

        if (jQuery().select2 && $('#country_list').size() > 0) {
            $("#country_list").select2({
	            placeholder: '<i class="fa fa-map-marker"></i>&nbsp;Select a Country',
	            templateResult: format,
                templateSelection: format,
                width: 'auto', 
	            escapeMarkup: function(m) {
	                return m;
	            }
	        });


	        $('#country_list').change(function() {
	            $('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
	        });
    	}

        $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {

                first_name: {
                    required: true
                },
                last_name: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                owner: {
                    required: true
                },
                tnc: {
                    required: true
                }
            },

            messages: { // custom messages for radio buttons and checkboxes
                tnc: {
                    required: "Please accept TNC first."
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
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
                    error.insertAfter($('#register_tnc_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form, event) {
                event.preventDefault();
                var url = 'http://thinx.cloud:7442/api/user/create';
                $.ajax({
                    url: url,
                    data: {
                        first_name: $('.register-form input[name=first_name]').val(),
                        last_name: $('.register-form input[name=last_name]').val(),
                        email: $('.register-form input[name=email]').val(),
                        owner: $('.register-form input[name=owner]').val()
                    }, //parameters go here in object literal form

                    type: 'POST',
                    datatype: 'json',
                    success: function(data) {
                        console.log('--user create request success--');

                        try {
                           var response = JSON.parse(data);    
                        }
                        catch(e) {
                           console.log(e);
                        }

                        if (typeof(response) !== 'undefined') {
                            if (response.success) {
                                console.log(response.status)
                                if (response.status == 'email_sent') {
                                    $('.msg-error', $('.register-form')).hide();
                                    $('.register-form').hide();

                                    $('.msg-success .form-subtitle').text('Check your email for activation link.');
                                    $('.msg-success').show();
                                }
                            } else {
                                console.log(response.status)
                                if (response.status == 'activation_failed') {
                                    $('.msg-error', $('.register-form')).text('Registration failed.');
                                    $('.msg-error', $('.register-form')).show();
                                }
                                if (response.status == 'email_already_exists') {
                                    $('.msg-error', $('.register-form')).text('Email already exists.');
                                    $('.msg-error', $('.register-form')).show();
                                }
                            }
                        }

                    },
                    error: function(response) {
                        console.log('--user create request failure--');
                        console.log(response);
                        $('.msg-error', $('.register-form')).text(response);
                        $('.msg-error', $('.register-form')).show();
                    }
                });
            }
        });

        $('.register-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.register-form').validate().form()) {
                    $('.register-form').submit();
                }
                return false;
            }
        });

        jQuery('#register-btn').click(function() {
            jQuery('.login-form').hide();
            jQuery('.register-form').show();
        });

        jQuery('#register-back-btn').click(function() {
            jQuery('.login-form').show();
            jQuery('.register-form').hide();
        });
    }

    return {
        //main function to initiate the module
        init: function() {
            handleLogin();
            handleForgetPassword();
            handleRegister();
        }

    };

}();

jQuery(document).ready(function() {
    Login.init();
});