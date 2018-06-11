$(function () {
    //Validator
    $.validator.addMethod("confirmPassword", function (value, element, config) {
        if (value == $('input[name="novaSenha"]').val())
            return true;
        else
            return false;
    }, "Senhas não conferem.");

    //Get info usuario
    var usuario = getUsuario();
    adm();
    $('input[name="nome"]').val(usuario.nome);
    $('input[name="nome"]').focus();
    $('input[name="email"]').val(usuario.email);
    $('input[name="email"]').focus();

    //Set aprovacoes (noticias)
    getAllNoticias(true, true);

    $('#perfil').validate({
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

    $('#senha').validate({
        rules: {
            confirmarSenha: {
                confirmPassword: true
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

    //Form Salve
    $('#perfil').submit(function (e) {
        var nome = $('input[name="nome"]').val();
        var email = $('input[name="email"]').val();
        if ((nome != usuario.nome || email != usuario.email) && $("#perfil").valid()) {
            $('.page-loader-wrapper').fadeIn();
            $.ajax({
                type: "POST",
                url: serverUrl + "updateData",
                data: {
                    nome: nome == "" ? usuario.nome : nome,
                    email: email == "" ? usuario.email : email,
                    id: usuario.id,
                    token: localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);
                    if (registerMessage(response, "#perfil", "Dados do perfil", false)) {
                        localStorage.setItem('usuario', '');
                        localStorage.setItem('not', 'Dados do perfil alterados com sucesso!');
                        location.href = "../../index.html";
                    }
                },
                error: function (error) {
                    console.log(error.message);
                    logout('Sessão inválida. Faça o login novamente.');
                }
            });
        }
        e.preventDefault();
    });

    $('#senha').submit(function (e) {
        if ($("#senha").valid()) {
            $('.page-loader-wrapper').fadeIn();
            $.ajax({
                type: "POST",
                url: serverUrl + "alterPassword",
                data: {
                    id: usuario.id,
                    senha: $('input[name="senhaAtual"]').val(),
                    novaSenha: $('input[name="novaSenha"]').val(),
                    token: localStorage.getItem('token')
                },
                success: function (response) {
                    console.log(response);
                    if (registerMessage(response, '#senha', "", false)) {
                        localStorage.setItem('not', 'Senha alterada com sucesso!');
                        location.href = "../../index.html";
                    } else
                        $('.page-loader-wrapper').fadeOut();
                },
                error: function (error) {
                    console.log(error.message);
                    logout('Sessão inválida. Faça o login novamente.');
                }
            });
        }
        e.preventDefault();
    });
});