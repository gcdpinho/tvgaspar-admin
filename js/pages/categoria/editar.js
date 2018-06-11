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

    //Preenchimento da categoria (edit)
    var dataCategoria = JSON.parse(localStorage.getItem('categoriaEdit'));
    $('input[name="titulo"]').val(dataCategoria.titulo);
    $('input[name="titulo"]').focus();
    $('input[name="texto"]').val(dataCategoria.texto);
    $('input[name="texto"]').focus();
    $('input[name="cor"]').val(dataCategoria.cor);
    $('input[name="cor"]').change();

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
                url: serverUrl + "updateCategoria",
                data: {
                    titulo: $('input[name="titulo"]').val(),
                    texto: $('input[name="texto"]').val(),
                    cor: $('input[name="cor"]').val(),
                    id: dataCategoria.id,
                    token: localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);

                    localStorage.setItem('categoria', "");
                    localStorage.setItem('not', "CATEGORIA editada com sucesso!");

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