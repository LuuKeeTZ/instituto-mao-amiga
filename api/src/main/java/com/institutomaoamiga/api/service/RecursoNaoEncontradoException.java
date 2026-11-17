package com.institutomaoamiga.api.service;

/** Lançada quando o id pedido não existe no banco. Vira HTTP 404. */
public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
