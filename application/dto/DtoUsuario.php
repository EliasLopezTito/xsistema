<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoUsuario{
    private $idUsuario;
    private $contrasenia;
    private $apellidos;
    private $nombres;
    private $idArea;
    private $estado;
    
    function __construct(){
        $this->idusuario = "";
        $this->contrasenia = "";
        $this->apellidos = "";
        $this->nombres = "";
        $this->idArea = "";
        $this->estado = "";
    }
    
    public function getIdUsuario() {
        return $this->idUsuario;
    }

    public function getContrasenia() {
        return $this->contrasenia;
    }

    public function getApellidos() {
        return $this->apellidos;
    }

    public function getNombres() {
        return $this->nombres;
    }

    public function getIdArea() {
        return $this->idArea;
    }

    public function getEstado() {
        return $this->estado;
    }

    public function setIdUsuario($idUsuario) {
        $this->idUsuario = $idUsuario;
    }

    public function setContrasenia($contrasenia) {
        $this->contrasenia = $contrasenia;
    }

    public function setApellidos($apellidos) {
        $this->apellidos = $apellidos;
    }

    public function setNombres($nombres) {
        $this->nombres = $nombres;
    }

    public function setIdArea($idArea) {
        $this->idArea = $idArea;
    }

    public function setEstado($estado) {
        $this->estado = $estado;
    }
}
?>