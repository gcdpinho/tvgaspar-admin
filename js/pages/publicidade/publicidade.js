$(function () {
    //Validation plugin
    $('#publicidade').validate({
        rules: {
            imagem: {
                invalidImagem: true,
                oneImagem: true
            }
        },
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

    //Init Firebase plugin
    initFirebase();

    //Get info usuario
    var usuario = getUsuario();
    adm();
    //Set aprovacoes (noticias)
    getAllNoticias(true, false);

    //Load info de tabelas relacionadas
    getAllImagens(false);

    //Botão de pesquisar
    $('.div-search-button button').click(function () {
        search("imagem", true);
    });

    //Form Salve
    $('#publicidade').submit(function (e) {
        if ($("#publicidade").valid()) {
            $('.page-loader-wrapper').fadeIn();
            $.ajax({
                type: "POST",
                url: serverUrl + "backoffice/ad",
                data: {
                    ad: $('input[name="titulo"]').val(),
                    type: $('input[name="tipo"]').val(),
                    description: $('input[name="texto"]').val(),
                    src: $('input[name="link"]').val(),
                    flgActive: 1,
                    image_id: getDataId("imagem", $('input[name="imagem"]').val(), "src"),
                },
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);
                    registerMessage(response, $('#publicidade'), "PUBLICIDADE", true);
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