$(function () {
    //TinyMCE
    tinymce.init({
        selector: "textarea#tinymce",
        theme: "modern",
        menubar: false,
        height: 300,
        resize: false,
        statusbar: false,
        toolbar1: ' '
    });
    tinymce.suffix = ".min";
    tinymce.baseURL = '../../plugins/tinymce';

    //Get info usuario
    var usuario = getUsuario();
    adm();
    //Set aprovacoes (noticias)
    getAllNoticias(true, true);

    //Notification em caso de page reload
    var not = localStorage.getItem('not');
    if (not != null && not != "") {
        showNotification(not, 'success');
        localStorage.setItem('not', "");
    }

    //Aprovação da notícia (update)
    $('.noticia-detail button').click(function () {
        $('.page-loader-wrapper').fadeIn();
        $.ajax({
            type: "POST",
            url: serverUrl + "updateAprovacao",
            data: {
                id: getDataId("aprovacao", $('input[name="manchete"]').val(), "manchete"),
                aprovacao: 1,
                token: localStorage.getItem('token')
            },
            success: function (response) {
                console.log(response);

                localStorage.setItem('not', 'NOTÍCIA aprovada com sucesso!');
                location.reload();

            },
            error: function (error) {
                console.log(error.message);
                logout('Sessão inválida. Faça o login novamente.');
            }
        });
    });
});