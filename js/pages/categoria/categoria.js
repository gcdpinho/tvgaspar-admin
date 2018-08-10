$(function () {
    //Colorpick plugin
    var colorpicker = $('.colorpicker').colorpicker();
    colorpicker.on('changeColor', function () {
        $('.colorpicker input').focus();
    });

    //Validation plugin
    $('#categoria').validate({
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        }
    });

    //Get info usuario
    var usuario = getUsuario();
    adm();
    //Set aprovacoes (noticias)
    getAllNoticias(true, true);

    //Form Salve
    $('#categoria').submit(function (e) {
        if ($("#categoria").valid()) {
            $('.page-loader-wrapper').fadeIn();
            $.ajax({
                type: "POST",
                url: serverUrl + "backoffice/category",
                data: {
                    category: $('input[name="titulo"]').val(),
                    description: $('input[name="texto"]').val(),
                    color: $('input[name="cor"]').val()
                },
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);
                    registerMessage(response, $('#categoria'), "CATEGORIA", true);
                },
                error: function (error) {
                    console.log(error.message);
                    logout('Sessão inválida. Faça o login novamente.');
                }
            });
            e.preventDefault();
        }
    });
});