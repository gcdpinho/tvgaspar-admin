$(function () {
    //TinyMCE
    tinymce.init({
        selector: "textarea#tinymce",
        theme: "modern",
        menubar: false,
        height: 300,
        resize: false,
        statusbar: false,
        plugins: [
            'advlist autolink lists link charmap hr anchor',
            'searchreplace visualblocks visualchars',
            'insertdatetime nonbreaking table contextmenu directionality',
            'paste textcolor colorpicker textpattern changeTooltip'
        ],
        toolbar1: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | forecolor backcolor'
    });
    tinymce.suffix = ".min";
    tinymce.baseURL = '../../plugins/tinymce';
    tinymce.PluginManager.add('changeTooltip', function (editor, url) {
        editor.buttons.undo.tooltip = "Desfazer";
        editor.buttons.redo.tooltip = "Refazer";
        editor.buttons.bold.tooltip = "Negrito";
        editor.buttons.italic.tooltip = "Itálico";
        editor.buttons.alignleft.tooltip = "Alinhar à esquerda";
        editor.buttons.aligncenter.tooltip = "Centralizar";
        editor.buttons.alignright.tooltip = "Alinhar à direita";
        editor.buttons.alignjustify.tooltip = "Justificar";
        editor.buttons.bullist.tooltip = "Lista com marcadores";
        editor.buttons.numlist.tooltip = "Lista numerada";
        editor.buttons.outdent.tooltip = "Diminuir recuo";
        editor.buttons.indent.tooltip = "Aumentar recuo";
        editor.buttons.link.tooltip = "Inserir/editar link";
        editor.buttons.forecolor.tooltip = "Cor do texto";
        editor.buttons.backcolor.tooltip = "Cor do fundo";

        editor.on('focus', function (e) {
            $('.form-group.form-float.tinymce .form-line').addClass('focused');
        });
        editor.on('blur', function (e) {
            if (this.getContent() == "")
                $('.form-group.form-float.tinymce .form-line').removeClass('focused');
        });
    });

    //Datetimepicker plugin
    $('.datetimepicker').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm',
        lang: "pt-br",
        clearButton: true,
        weekStart: 1,
        cancelText: "Cancelar",
        clearText: "Apagar"
    });

    $('.datetimepicker').on('change', function (e) {
        if ($(this).val() == "")
            $(this).parents('.form-line').removeClass('focused');
        else
            $(this).parents('.form-line').addClass('focused');
        $(this).valid();
    });

    //Validation plugin
    $('#noticia').validate({
        rules: {
            tag: {
                invalidTag: true,
                requiredTag: true
            },
            imagem: {
                invalidImagem: true
            },
            video: {
                invalidVideo: true
            },
            categoria: {
                invalidCategoria: true
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
    var dataNoticia = JSON.parse(localStorage.getItem('noticiaEdit'));
    $('input[name="manchete"]').val(dataNoticia.manchete);
    $('input[name="manchete"]').focus();
    $('input[name="subManchete"]').val(dataNoticia.subManchete);
    $('input[name="subManchete"]').focus();
    $('input[name="autor"]').val(dataNoticia.autor);
    $('input[name="autor"]').focus();
    $('input[name="dtCadastro"]').val(dataNoticia.dtCadastro);
    $('input[name="dtCadastro"]').parents('.form-line').addClass('focused');
    $('textarea[name="texto"]').val(dataNoticia.texto);
    $('textarea[name="texto"]').focus();

    //Get info usuario
    var usuario = getUsuario();
    adm();
    //Set aprovacoes (noticias)
    getAllNoticias(true, true);


    //Form Salve
    $('#noticia').submit(function (e) {
        if ($("#noticia").valid()) {
            $('.page-loader-wrapper').fadeIn();
            $.ajax({
                type: "POST",
                url: serverUrl + "updateNoticia",
                data: {
                    manchete: $('input[name="manchete"]').val(),
                    subManchete: $('input[name="subManchete"]').val(),
                    resumo: $('input[name="resumo"]').val(),
                    texto: tinymce.activeEditor.getContent(),
                    autor: $('input[name="autor"]').val(),
                    dtCadastro: $('input[name="dtCadastro"]').val(),
                    id: dataNoticia.id,
                    token: localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);

                    localStorage.setItem('noticia', "");
                    localStorage.setItem('not', "NOTICIA editada com sucesso!");

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