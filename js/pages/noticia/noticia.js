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

    //Init Firebase plugin
    initFirebase();

    //Get info usuario
    var usuario = getUsuario();
    adm();
    //Set aprovacoes (noticias)
    getAllNoticias(true, false);

    //Load info de tabelas relacionadas
    getAllTags(false, false);
    getAllVideos(false, false);
    getAllCategorias(false, false);
    getAllImagens(false);


    //Botão de pesquisar
    $('.div-search-button button').click(function () {
        search($(this).val(), true);
    });



    //Form Salve
    $('#noticia').submit(function (e) {
        if ($("#noticia").valid()) {
            $('.page-loader-wrapper').fadeIn();
            $.ajax({
                type: "POST",
                url: serverUrl + "createNoticia",
                data: {
                    manchete: $('input[name="manchete"]').val(),
                    subManchete: $('input[name="subManchete"]').val(),
                    resumo: $('input[name="resumo"]').val(),
                    texto: tinymce.activeEditor.getContent(),
                    autor: $('input[name="autor"]').val(),
                    dtCadastro: $('input[name="dtCadastro"]').val(),
                    flgAtivo: 1,
                    aprovacao: usuario.isAdm,
                    idUsuario: usuario.id,
                    token: localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);
                    var insertId = response.insertId;
                    var data = [];
                    var entry;
                    if (registerMessage(response, $('#noticia'), "NOTÍCIA", false)) {
                        $('.label-info.success').each(function () {
                            entry = {}
                            entry['idNoticia'] = insertId;
                            entry['idTag'] = getDataId("tag", $(this).text(), "titulo");
                            data.push(entry);
                        });
                        console.log(data);
                        $.ajax({
                            type: "POST",
                            url: serverUrl + "createNoticiaTag",
                            data: {
                                data: data,
                                token: localStorage.getItem('token')
                            },
                            success: function (response) {
                                console.log(response);
                                var data = [];
                                var entry;
                                if (registerMessage(response, $('#noticia'), "NOTÍCIA", false)) {
                                    var arrCategorias = $('input[name="categoria"]').val().split(", ");
                                    arrCategorias = arrCategorias.filter(function (value, index, self) {
                                        return (self.indexOf(value) == index)
                                    });
                                    for (var element in arrCategorias) {
                                        entry = {}
                                        entry['idNoticia'] = insertId;
                                        entry['idCategoria'] = getDataId("categoria", arrCategorias[element], "titulo");
                                        data.push(entry);
                                    }
                                    console.log(data);
                                    $.ajax({
                                        type: "POST",
                                        url: serverUrl + "createNoticiaCategoria",
                                        data: {
                                            data: data,
                                            token: localStorage.getItem('token')
                                        },
                                        success: function (response) {
                                            console.log(response);
                                            if ($('input[name="video"]').val() != "")
                                                createNoticiaVideo(response, insertId);
                                            else
                                            if ($('input[name="imagem"]').val() != "")
                                                createNoticiaImagem(response, insertId);
                                            else
                                                registerMessage(response, $('#noticia'), "NOTÍCIA", true);
                                        },
                                        error: function (error) {
                                            console.log(error.message);
                                            logout('Sessão inválida. Faça o login novamente.');
                                        }
                                    });
                                }
                            },
                            error: function (error) {
                                console.log(error.message);
                                logout('Sessão inválida. Faça o login novamente.');
                            }
                        });
                    }
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

var createNoticiaVideo = function (response, insertId) {
    var data = [];
    var entry;
    if (registerMessage(response, $('#noticia'), "NOTÍCIA", false)) {
        var arrVideos = $('input[name="video"]').val().split(", ");
        arrVideos = arrVideos.filter(function (value, index, self) {
            return (self.indexOf(value) == index)
        });
        for (var element in arrVideos) {
            entry = {}
            entry['idNoticia'] = insertId;
            entry['idVideo'] = getDataId("video", arrVideos[element], "link");
            data.push(entry);
        }
        console.log(data);
        $.ajax({
            type: "POST",
            url: serverUrl + "createNoticiaVideo",
            data: {
                data: data,
                token: localStorage.getItem('token')
            },
            success: function (response) {
                console.log(response);
                createNoticiaImagem(response, insertId);
            },
            error: function (error) {
                console.log(error.message);
                logout('Sessão inválida. Faça o login novamente.');
            }
        });
    }
}

var createNoticiaImagem = function (response, insertId) {
    var data = [];
    var entry;
    if (registerMessage(response, $('#noticia'), "NOTÍCIA", false)) {
        var arrImagens = $('input[name="imagem"]').val().split(", ");
        arrImagens = arrImagens.filter(function (value, index, self) {
            return (self.indexOf(value) == index)
        });
        for (var element in arrImagens) {
            entry = {}
            entry['idNoticia'] = insertId;
            entry['idImagem'] = getDataId("imagem", arrImagens[element], "link");
            data.push(entry);
        }
        console.log(data);
        $.ajax({
            type: "POST",
            url: serverUrl + "createNoticiaImagem",
            data: {
                data: data,
                token: localStorage.getItem('token')
            },
            success: function (response) {
                console.log(response);
                registerMessage(response, $('#noticia'), "NOTÍCIA", true);
            },
            error: function (error) {
                console.log(error.message);
                logout('Sessão inválida. Faça o login novamente.');
            }
        });
    }
}