$(function () {
    //Get info usuario
    var usuario = getUsuario();
    adm();
    //Set aprovacoes (noticias)
    getAllNoticias(true, false);

    //Escolhe o serviço baseado no parâmetro da tabela
    var table = ('.js-basic-example');
    var page = "";
    if ($(table).hasClass("noticia")) {
        page = "noticia";
        getAllNoticias(false, true);
    } else if ($(table).hasClass("publicidade")) {
        page = "publicidade";
        getAllPublicidades();
    } else if ($(table).hasClass("imagem")) {
        page = "imagem";
        //Init Firebase plugin
        initFirebase();
        getAllImagens(true);
    } else if ($(table).hasClass("video")) {
        page = "video";
        getAllVideos(true, true);
    } else if ($(table).hasClass("tag")) {
        page = "tag";
        getAllTags(true, true);
    } else if ($(table).hasClass("categoria")) {
        page = "categoria";
        getAllCategorias(true, true);
    }

    //Notification em caso de page reload
    var not = localStorage.getItem('not');
    if (not != null && not != "") {
        showNotification(not, 'success');
        localStorage.setItem('not', "");
    }

    //Delete
    $('.dataTableDelete').click(function () {
        //URL do delete
        $(".page-loader-wrapper").fadeIn();
        var url = serverUrl;
        switch (page) {
            case "noticia":
                url += "deleteNoticiaById";
                break;
            case "publicidade":
                url += "deletePublicidadeById";
                break;
            case "imagem":
                url += "deleteImagemById";
                break;
            case "video":
                url += "deleteVideoById";
                break;
            case "tag":
                url += "deleteTagById";
                break;
            case "categoria":
                url += "deleteCategoriaById";
                break;
        }
        //Delete function
        $.ajax({
            type: "POST",
            url: url,
            data: {
                id: $("#modalId").html(),
                token: localStorage.getItem('token')
            },
            success: function (response) {
                console.log(response);
                if (response.sqlMessage) {
                    $('#defaultModal').modal('hide');
                    registerMessage(response, "", page.toUpperCase(), false);
                } else {
                    localStorage.setItem(page, "");
                    localStorage.setItem('not', acentuacaoTable(page).toUpperCase() + " excluído com sucesso!");

                    location.reload();
                }
            },
            error: function (error) {
                console.log(error.message);
                logout('Sessão inválida. Faça o login novamente.');
            }
        });
    });
});