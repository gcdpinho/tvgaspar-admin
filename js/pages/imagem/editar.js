$(function () {
    //Validation plugin
    $.validator.addMethod("requiredImage", function (value, element, config) {
        return $('.dropify-wrapper').hasClass('has-preview');
    }, "Preencha esse campo.");

    $('#imagem').validate({
        rules: {
            tag: {
                invalidTag: true,
                requiredTag: true
            },
            link: {
                requiredImage: true
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
    var dataImagem = JSON.parse(localStorage.getItem('imagemEdit'));
    $('input[name="titulo"]').val(dataImagem.titulo);
    $('input[name="titulo"]').focus();

    //Get info usuario
    var usuario = getUsuario();
    adm();
    //Set aprovacoes (noticias)
    getAllNoticias(true, true);

    //Form Salve
    $('#imagem').submit(function (e) {
        if ($("#imagem").valid()) {
            $('.page-loader-wrapper').fadeIn();
            $.ajax({
                type: "POST",
                url: serverUrl + "updateImagem",
                data: {
                    titulo: $('input[name="titulo"]').val(),
                    id: dataImagem.id,
                    token: localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);
                    localStorage.setItem('imagem', "");
                    localStorage.setItem('not', "IMAGEM editada com sucesso!");

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