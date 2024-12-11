<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoParametrosEncuesta{
    private $idParametrosEncuesta;
    private $idEncuesta;
    private $fechaActivacion;
    private $fechaBloqueo;
    private $fechaRegistro;
    private $fechaActualizacion;
    private $idEstado;
    
    function getIdParametrosEncuesta() {
        return $this->idParametrosEncuesta;
    }

    function getIdEncuesta() {
        return $this->idEncuesta;
    }

    function getFechaActivacion() {
        return $this->fechaActivacion;
    }

    function getFechaBloqueo() {
        return $this->fechaBloqueo;
    }

    function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    function getFechaActualizacion() {
        return $this->fechaActualizacion;
    }

    function getIdEstado() {
        return $this->idEstado;
    }

    function setIdParametrosEncuesta($idParametrosEncuesta) {
        $this->idParametrosEncuesta = $idParametrosEncuesta;
    }

    function setIdEncuesta($idEncuesta) {
        $this->idEncuesta = $idEncuesta;
    }

    function setFechaActivacion($fechaActivacion) {
        $this->fechaActivacion = $fechaActivacion;
    }

    function setFechaBloqueo($fechaBloqueo) {
        $this->fechaBloqueo = $fechaBloqueo;
    }

    function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

    function setFechaActualizacion($fechaActualizacion) {
        $this->fechaActualizacion = $fechaActualizacion;
    }
    
    function setIdEstado($idEstado) {
        $this->idEstado = $idEstado;
    }
}
