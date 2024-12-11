<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class DtoMensaje{

    private $idMensaje;
    private $Descripcion;
    private $idTramite;
    private $idProyectoEmisor;
    private $idUsuario;
    private $FechaRegistro;
    private $FechaActualizacion;
    private $idUsuarioRegistro;
    private $idUsuarioActualizacion;
    private $idEstado;

    public function __construct()
    {

    }

    public function setIdMensaje($idMensaje)
    {
        $this->idMensaje = $idMensaje;
    }

    public function setDescripcion($Descripcion)
    {
        $this->Descripcion = $Descripcion;
    }

    public function setIdTramite($idTramite)
    {
        $this->idTramite = $idTramite;
    }

    public function setIdProyectoEmisor($idProyectoEmisor)
    {
        $this->idProyectoEmisor = $idProyectoEmisor;
    }

    public function setFechaRegistro($FechaRegistro) {
        $this->FechaRegistro = $FechaRegistro;
    }

    public function setFechaActualizacion($FechaActualizacion) {
        $this->FechaActualizacion = $FechaActualizacion;
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

    public function getIdMensaje()
    {
        return $this->idMensaje;
    }

    public function getDescripcion()
    {
        return $this->Descripcion;
    }

    public function getIdTramite()
    {
        return $this->idTramite;
    }

    public function getIdProyectoEmisor()
    {
        return $this->idProyectoEmisor;
    }
    
    public function getFechaRegistro()
    {
        return $this->FechaRegistro;
    }

    public function getFechaActualizacion()
    {
        return $this->FechaActualizacion;
    }

    public function getIdUsuarioRegistro()
    {
        return $this->idUsuarioRegistro;
    }

    public function getIdUsuarioActualizacion()
    {
        return $this->idUsuarioActualizacion;
    }

    public function getIdEstado()
    {
        return $this->idEstado;
    }

}