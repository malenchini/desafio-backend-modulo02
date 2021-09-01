const bancoDeDados = require('../bancodedados')
const { validarDados, validarCpf, validarEmail } = require('./validadores')


function listarContas(req, res) {
    const senhaInformada = req.query.senha_banco

    if (!senhaInformada || senhaInformada !== bancoDeDados.banco.senha) {
        return res.json({ erro: 'Acesso não autorizado!' })
    }
    res.json(bancoDeDados.contas)
}

function criarContas(req, res) {
    const id = !bancoDeDados.contas ? 1 : bancoDeDados.contas.length + 1
    const novaConta = {
        numero: id.toString(),
        saldo: 0,
        usuario: {
            nome: req.body.usuario.nome,
            cpf: req.body.usuario.cpf,
            data_nascimento: req.body.usuario.data_nascimento,
            telefone: req.body.usuario.telefone,
            email: req.body.usuario.email,
            senha: req.body.usuario.senha,
        }
    };

    if (!novaConta.usuario.nome || !novaConta.usuario.cpf || !novaConta.usuario.data_nascimento || !novaConta.usuario.telefone || !novaConta.usuario.email || !novaConta.usuario.senha) {
        res.status(400).json({ erro: 'Informe todos os campos' })
    };

    //tratamento das entradas

    validarDados(novaConta)

    if (novaConta.usuario.cpf.length !== 11) {
        res.status(400).json({ erro: 'O campo do CPF deve conter 11 dígitos' })
    }

    bancoDeDados.contas.push(novaConta)
    res.status(201).json(novaConta)
    console.log(bancoDeDados.contas)


};


function atualizarContas(req, res) {
    const contas = bancoDeDados.contas
    const body = req.body
    const numeroConta = req.params.numeroConta
    const conta = contas.find(x => x.numero === numeroConta)


    if (body.usuario.cpf) {

        validarCpf(body)

        const cpfEncontrado = contas.find(x => x.usuario.cpf === body.usuario.cpf)

        if (cpfEncontrado) {

            return res.status(400).json({ erro: 'Ja existe uma conta cadastrada com esse número de CPF' })
        }
    }

    if (body.usuario.email) {

        validarEmail(body)

        const emailEncontrado = contas.find(x => x.usuario.email === body.usuario.email)

        if (emailEncontrado) {

            return res.status(400).json({ erro: 'Ja existe uma conta cadastrada com esse e-mail!' })
        }
    }

    if (!conta) {
        return res.status(400).json({ erro: 'Não existe conta para o numero informado!' })
    }

    if (body.usuario.nome || body.usuario.cpf || body.usuario.data_nascimento || body.usuario.telefone || body.usuario.email || body.usuario.senha) {

        conta.usuario.nome = !body.usuario.nome ? conta.usuario.nome : body.usuario.nome
        conta.usuario.cpf = !body.usuario.cpf ? conta.usuario.cpf : body.usuario.cpf
        conta.usuario.data_nascimento = !body.usuario.data_nascimento ? conta.usuario.data_nascimento : body.usuario.data_nascimento
        conta.usuario.telefone = !body.usuario.telefone ? conta.usuario.telefone : body.usuario.telefone
        conta.usuario.email = !body.usuario.email ? conta.usuario.email : body.usuario.email
        conta.usuario.senha = !body.usuario.senha ? conta.usuario.senha : body.usuario.senha


        return res.status(200).json({ msg: 'Conta atualizada com sucesso!' })
    } else {
        return res.status(400).json({ erro: 'Informe ao menos 1 item para ser modificado!' })
    }

}


function deletarConta(req, res) {
    const numeroConta = req.params.numeroConta
    const contas = bancoDeDados.contas
    const conta = contas.find(x => x.numero === numeroConta)

    if (!conta) {
        return res.status(400).json({ erro: 'Conta não encontrada!' })
    }

    if (conta.saldo !== 0) {
        return res.status(400).json({ erro: 'Para excluir a conta é necessário que o saldo seja igual a 0' })
    }

    const indexConta = contas.findIndex(x => x.numero === numeroConta)

    contas.splice(indexConta, 1)

    res.json({ msg: 'Conta excluída com sucesso!' })
}

module.exports = { listarContas, criarContas, atualizarContas, deletarConta }