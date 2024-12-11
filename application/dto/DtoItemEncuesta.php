<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoItemEncuesta{

    private $idItemEncuesta;
    private $idEncuesta;
    private $Descripcion;
    private $Orden;
    private $fechaRegistro;
    private $fechaActualizacion;
    private $idUsuarioRegistro;
    private $idUsuarioActualizacion;
    private $idEstado;

    public function __construct() {
        
    }

    public function getIdItemEncuesta() {
        return $this->idItemEncuesta;
    }

    public function getIdEncuesta() {
        return $this->idEncuesta;
    }

    public function getDescripcion() {
        return $this->Descripcion;
    }

    public function getOrden() {
        return $this->Orden;
    }

    public function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    public function getFechaActualizacion() {
        return $this->fechaActualizacion;
    }

    public function getIdUsuarioRegistro() {
        return $this->idUsuarioRegistro;
    }

    public function getIdUsuarioActualizacion() {
        return $this->idUsuarioActualizacion;
    }

    public function getIdEstado() {
        return $this->idEstado;
    }


    public function setIdItemEncuesta($idItemEncuesta) {
        $this->idItemEncuesta = $idItemEncuesta;
    }

    public function setIdEncuesta($idEncuesta) {
        $this->idEncuesta = $idEncuesta;
    }

    public function setDescripcion($Descripcion) {
        $this->Descripcion = $Descripcion;
    }

    public function setOrden($Orden) {
        $this->Orden = $Orden;
    }

    public function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

    public function setFechaActualizacion($fechaActualizacion) {
        $this->fechaActualizacion = $fechaActualizacion;
    }

    public function setIdUsuarioRegistro($idUsuarioRegistro) {
        $this->idUsuarioRegistro = $idUsuarioRegistro;
    }

    public function setIdUsuarioActualizacion($idUsuarioActualizacion) {
        $this->idUsuarioActualizacion = $idUsuarioActualizacion;
    }

    public function setIdEstado($idEstado) {
        $this->idEstado = $idEstado;
    }
}
?>