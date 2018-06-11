$(function () {
    //Validation plugin
    $('#video').validate({
        rules: {
            tag: {
                invalidTag: true,
                requiredTag: true
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

    //Preenchimento da categoria (edit)
    var dataVideo = JSON.parse(localStorage.getItem('videoEdit'));
    $('input[name="titulo"]').val(dataVideo.titulo);
    $('input[name="titulo"]').focus();
    $('input[name="texto"]').val(dataVideo.texto);
    $('input[name="texto"]').focus();
    $('input[name="link"]').val(dataVideo.link);
    $('input[name="link"]').focus();

    //Get info usuario
    var usuario = getUsuario();
    adm();
    //Set aprovacoes (noticias)
    getAllNoticias(true, true);

    //Form Salve
    $('#video').submit(function (e) {
        if ($("#video").valid()) {
            $('.page-loader-wrapper').fadeIn();
            $.ajax({
                type: "POST",
                url: serverUrl + "updateVideo",
                data: {
                    titulo: $('input[name="titulo"]').val(),
                    texto: $('input[name="texto"]').val(),
                    link: $('input[name="link"]').val(),
                    id: dataVideo.id,
                    token: localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);

                    localStorage.setItem('video', "");
                    localStorage.setItem('not', "Vídeo editado com sucesso!");

                    location.href = "listar.html";

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