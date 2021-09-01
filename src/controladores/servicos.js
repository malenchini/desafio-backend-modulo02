const bancoDeDados = require('../bancodedados')
const rotas = require('../rotas')
const { format } = require('date-fns');
const { validarDados, validarCpf, validarEmail } = require('./validadores')

function depositar(req, res) {
    const body = req.body
    const contas = bancoDeDados.contas
    const conta = contas.find(x => x.numero === body.numero_conta)

    if (!body.valor || !body.numero_conta) {
        return res.json({ erro: "Preencha todos os campos!" })
    }

    if (!conta) {
        return res.status(400).json({ erro: 'Conta informada não existe!' })
    }

    if (body.valor <= 0) {
        return res.status(400).json({ erro: 'Informe um valor maior que 0' })
    }

    conta.saldo += Number(body.valor)
    bancoDeDados.depositos.push({
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta: body.numero_conta,
        valor: Number(body.valor)
    })
    return res.status(200).json({ msg: "Depósito realizado com sucesso!" })

}

function sacar(req, res) {
    const body = req.body
    const contas = bancoDeDados.contas
    const conta = contas.find(x => x.numero === body.numero_conta)

    if (!body.numero_conta || !body.valor || !body.senha) {
        return res.status(400).json({ erro: 'Preencha todos os campos!' })
    }

    if (!conta) {
        return res.status(400).json({ erro: 'Conta não encontrada!' })
    }

    if (conta.usuario.senha !== Number(body.senha)) {
        return res.status(400).json({ erro: 'Senha incorreta!' })
    }

    if (conta.saldo < Number(body.valor)) {
        return res.status(400).json({ erro: 'Saldo insuficiente!' })
    }


    conta.saldo -= Number(body.valor)
    bancoDeDados.saques.push({
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta: body.numero_conta,
        valor: Number(body.valor)
    })
    return res.status(200).json({ mensagem: "Saque realizado com sucesso!" })

}


function transferir(req, res) {
    const body = req.body
    const contas = bancoDeDados.contas
    const contaOrigem = contas.find(x => x.numero === body.numero_conta_origem)
    const contaDestino = contas.find(x => x.numero === body.numero_conta_destino)

    if (!body.numero_conta_origem || !body.numero_conta_destino || !body.valor || !body.senha) {
        return res.status(400).json({ erro: 'Preencha todos os campos!' })
    }

    if (!contaOrigem) {
        return res.status(400).json({ erro: 'Conta de origem não encontrada' })
    }

    if (!contaDestino) {
        return res.status(400).json({ erro: 'Conta de destino não encontrada' })
    }

    if (contaOrigem.usuario.senha !== Number(body.senha)) {
        return res.status(400).json({ erro: 'Senha incorreta!' })
    }

    if (contaOrigem.saldo < Number(body.valor)) {
        return res.status(400).json({ erro: 'Saldo insuficiente' })
    }

    contaOrigem.saldo -= Number(body.valor)
    contaDestino.saldo += Number(body.valor)

    bancoDeDados.transferencias.push({
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem: body.numero_conta_origem,
        numero_conta_destino: body.numero_conta_destino,
        valor: Number(body.valor)
    })
    return res.status(200).json({ mensagem: "Transferência realizada com sucesso!" })

}

function saldo(req, res) {
    const contas = bancoDeDados.contas
    const numeroConta = req.query.numero_conta
    const conta = contas.find(x => x.numero === numeroConta)

    if (!req.query.numero_conta || !req.query.senha) {
        return res.status(400).json({ erro: 'Preencha todos os campos!' })
    }

    if (!conta) {
        return res.status(400).json({ erro: 'Conta não encontrada!' })
    }

    if (conta.usuario.senha !== Number(req.query.senha)) {
        return res.status(400).json({ erro: 'Senha incorreta!' })
    }

    return res.status(200).json({ saldo: conta.saldo })
}

function extrato(req, res) {
    const contas = bancoDeDados.contas
    const { depositos, saques, transferencias } = bancoDeDados
    const numeroConta = req.query.numero_conta
    const conta = contas.find(x => x.numero === numeroConta)
    const extrato = {
        depositos: [],
        saques: [],
        transferenciasEnviadas: [],
        transferenciasRecebidas: []
    }
    if (!req.query.numero_conta || !req.query.senha) {
        return res.status(400).json({ erro: 'Preencha todos os campos!' })
    }

    if (!conta) {
        return res.status(400).json({ erro: 'Conta não encontrada!' })
    }

    if (conta.usuario.senha !== Number(req.query.senha)) {
        return res.status(400).json({ erro: 'Senha incorreta!' })
    }

    extrato.depositos = bancoDeDados.depositos.filter(x => x.numero_conta === numeroConta)
    extrato.saques = bancoDeDados.saques.filter(x => x.numero_conta === numeroConta)
    extrato.transferenciasEnviadas = bancoDeDados.transferencias.filter(x => x.numero_conta_origem === numeroConta)
    extrato.transferenciasRecebidas = bancoDeDados.transferencias.filter(x => x.numero_conta_destino === numeroConta)

    return res.status(200).json(extrato)
}

module.exports = { depositar, sacar, transferir, saldo, extrato }