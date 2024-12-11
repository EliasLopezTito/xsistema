<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'dto\DtoPregunta.php';

class DtoEncuesta{
    private $idEncuesta;
    private $nombre;
    private $descripcion;
    private $nroItem;
    private $mesProgramado;
    private $anoProgramado;
    private $idClasificacionEncuesta;
    private $fechaPublicacion;
    private $fechaFinalizacion;
    private $estado;
    private $preguntas;
    private $fechaRegistro;
    private $fechaActualizacion;
    private $idUsuarioRegistro;
    private $idUsuarioActualizacion;
    
    function getIdEncuesta() {
        return $this->idEncuesta;
    }

    function getNombre() {
        return $this->nombre;
    }

    function getDescripcion() {
        return $this->descripcion;
    }

    function getNroItem() {
        return $this->nroItem;
    }

    function getMesProgramado() {
        return $this->mesProgramado;
    }

    function getAnoProgramado() {
        return $this->anoProgramado;
    }

    function getIdClasificacionEncuesta() {
        return $this->idClasificacionEncuesta;
    }

    function getFechaPublicacion() {
        return $this->fechaPublicacion;
    }

    function getFechaFinalizacion() {
        return $this->fechaFinalizacion;
    }

    function getEstado() {
        return $this->estado;
    }

    function getPreguntas() {
        return $this->preguntas;
    }

    function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    function getFechaActualizacion() {
        return $this->fechaActualizacion;
    }

    function getIdUsuarioRegistro() {
        return $this->idUsuarioRegistro;
    }

    function getIdUsuarioActualizacion() {
        return $this->idUsuarioActualizacion;
    }

    function setIdEncuesta($idEncuesta) {
        $this->idEncuesta = $idEncuesta;
    }

    function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    function setDescripcion($descripcion) {
        $this->descripcion = $descripcion;
    }

    function setNroItem($nroItem) {
        $this->nroItem = $nroItem;
    }

    function setMesProgramado($mesProgramado) {
        $this->mesProgramado = $mesProgramado;
    }

    function setAnoProgramado($anoProgramado) {
        $this->anoProgramado = $anoProgramado;
    }

    function setIdClasificacionEncuesta($idClasificacionEncuesta) {
        $this->idClasificacionEncuesta = $idClasificacionEncuesta;
    }
    
    function setFechaPublicacion($fechaPublicacion) {
        $this->fechaPublicacion = $fechaPublicacion;
    }

    function setFechaFinalizacion($fechaFinalizacion) {
        $this->fechaFinalizacion = $fechaFinalizacion;
    }

    function setEstado($estado) {
        $this->estado = $estado;
    }

    function setPreguntas(DtoPregunta $pregunta) {
        $this->preguntas[] = $pregunta;
    }

    function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

    function setFechaActualizacion($fechaActualizacion) {
        $this->fechaActualizacion = $fechaActualizacion;
    }

    function setIdUsuarioRegistro($idUsuarioRegistro) {
        $this->idUsuarioRegistro = $idUsuarioRegistro;
    }

    function setIdUsuarioActualizacion($idUsuarioActualizacion) {
        $this->idUsuarioActualizacion = $idUsuarioActualizacion;
    }
}
