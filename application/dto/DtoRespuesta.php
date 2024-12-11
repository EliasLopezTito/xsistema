<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoRespuesta{    
    private $idEncuesta;
    private $idPregunta;
    private $idRespuesta;
    private $descripcion;
    private $valor;
    
    function getIdEncuesta() {
        return $this->idEncuesta;
    }

    function getIdPregunta() {
        return $this->idPregunta;
    }

    function getIdRespuesta() {
        return $this->idRespuesta;
    }

    function getDescripcion() {
        return $this->descripcion;
    }

    function getValor() {
        return $this->valor;
    }

    function setIdEncuesta($idEncuesta) {
        $this->idEncuesta = $idEncuesta;
    }

    function setIdPregunta($idPregunta) {
        $this->idPregunta = $idPregunta;
    }

    function setIdRespuesta($idRespuesta) {
        $this->idRespuesta = $idRespuesta;
    }

    function setDescripcion($descripcion) {
        $this->descripcion = $descripcion;
    }

    function setValor($valor) {
        $this->valor = $valor;
    }

}
