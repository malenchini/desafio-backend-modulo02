function validarDados(novaConta) {
    for (i = 0; i < novaConta.usuario.cpf.length; i++) {
        if (novaConta.usuario.cpf.includes('.') || novaConta.usuario.cpf.includes('-')) {
            novaConta.usuario.cpf = novaConta.usuario.cpf.replace('.', '')
            novaConta.usuario.cpf = novaConta.usuario.cpf.replace('-', '')
        }
    }
    for (i = 0; i < novaConta.usuario.email.length; i++) {
        if (novaConta.usuario.email.includes(' ')) {
            novaConta.usuario.email = novaConta.usuario.email.replace(' ', '')

        }
    }

}

function validarCpf(body) {
    if (body.usuario.cpf) {
        for (i = 0; i < body.usuario.cpf.length; i++) {
            if (body.usuario.cpf.includes('.') || body.usuario.cpf.includes('-')) {
                body.usuario.cpf = body.usuario.cpf.replace('.', '')
                body.usuario.cpf = body.usuario.cpf.replace('-', '')
            }
        }
    }
}


function validarEmail(body) {
    if (body.usuario.email !== undefined) {
        for (i = 0; i < body.usuario.email.length; i++) {
            if (body.usuario.email.includes(' ')) {
                body.usuario.email = body.usuario.email.replace(' ', '')

            }
        }
    }

}



module.exports = { validarDados, validarCpf, validarEmail }