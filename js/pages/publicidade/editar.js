$(function () {
    //Validation plugin
    $('#publicidade').validate({
        rules: {
            imagem: {
                invalidImagem: true
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
    var dataPublicidade = JSON.parse(localStorage.getItem('publicidadeEdit'));
    $('input[name="titulo"]').val(dataPublicidade.titulo);
    $('input[name="titulo"]').focus();
    $('input[name="tipo"]').val(dataPublicidade.tipo);
    $('input[name="tipo"]').focus();
    $('input[name="texto"]').val(dataPublicidade.texto);
    $('input[name="texto"]').focus();
    $('input[name="link"]').val(dataPublicidade.link);
    $('input[name="link"]').focus();

    //Get info usuario
    var usuario = getUsuario();
    adm();
    //Set aprovacoes (noticias)
    getAllNoticias(true, true);

    //Form Salve
    $('#publicidade').submit(function (e) {
        if ($("#publicidade").valid()) {
            $('.page-loader-wrapper').fadeIn();
            $.ajax({
                type: "POST",
                url: serverUrl + "updatePublicidade",
                data: {
                    titulo: $('input[name="titulo"]').val(),
                    tipo: $('input[name="tipo"]').val(),
                    texto: $('input[name="texto"]').val(),
                    link: $('input[name="link"]').val(),
                    id: dataPublicidade.id,
                    token: localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);

                    localStorage.setItem('publicidade', "");
                    localStorage.setItem('not', "PUBLICIDADE editada com sucesso!");

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