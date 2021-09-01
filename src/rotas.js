const express = require('express')

const { listarContas, criarContas, atualizarContas, deletarConta } = require('./controladores/contas')
const { depositar, sacar, transferir, saldo, extrato } = require('./controladores/servicos')
const rotas = express()

rotas.get('/contas', listarContas)
rotas.post('/contas', criarContas)
rotas.put('/contas/:numeroConta/usuario', atualizarContas)
rotas.delete('/contas/:numeroConta', deletarConta)
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)
rotas.get('/transacoes/saldo', saldo)
rotas.get('/transacoes/extrato', extrato)

module.exports = rotas