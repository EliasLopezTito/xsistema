<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'dto\DtoRespuesta.php';

class DtoPregunta{
    private $idEncuesta;
    private $idPregunta;
    private $idTipoPregunta;
    private $descripcion;
    private $nroPregunta;
    private $valor;
    private $respuestas;
    
    function getIdEncuesta() {
        return $this->idEncuesta;
    }

    function getIdPregunta() {
        return $this->idPregunta;
    }

    function getIdTipoPregunta() {
        return $this->idTipoPregunta;
    }

    function getDescripcion() {
        return $this->descripcion;
    }

    function getNroPregunta() {
        return $this->nroPregunta;
    }

    function getValor() {
        return $this->valor;
    }

    function getRespuestas() {
        return $this->respuestas;
    }

    function setIdEncuesta($idEncuesta) {
        $this->idEncuesta = $idEncuesta;
    }

    function setIdPregunta($idPregunta) {
        $this->idPregunta = $idPregunta;
    }

    function setIdTipoPregunta($idTipoPregunta) {
        $this->idTipoPregunta = $idTipoPregunta;
    }

    function setDescripcion($descripcion) {
        $this->descripcion = $descripcion;
    }

    function setNroPregunta($nroPregunta) {
        $this->nroPregunta = $nroPregunta;
    }

    function setValor($valor) {
        $this->valor = $valor;
    }

    function setRespuestas(DtoRespuesta $respuesta) {
        $this->respuestas[] = $respuesta;
    }
}
