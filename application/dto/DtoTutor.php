<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoTutor{

    private $idTutor;
    private $codEmpleado;
    private $nombres;
    private $idUsuarioRegistro;
    private $idUsuarioActualizacion;
    private $fechaRegistro;
    private $fechaActualizacion;
    private $idTurno;
    private $idHorario;
    private $correo;
    private $contrasenia;
    private $idEstado;
    

    public function __construct() {
        
    }

    public function setIdTutor($idTutor) {
        $this->idTutor = $idTutor;
    }

    public function setCodEmpleado($codEmpleado) {
        $this->codEmpleado = $codEmpleado;
    }

    public function setNombres($nombres) {
        $this->nombres = $nombres;
    }

    public function setIdUsuarioRegistro($idUsuarioRegistro) {
        $this->idUsuarioRegistro = $idUsuarioRegistro;
    }

    public function setIdUsuarioActualizacion($idUsuarioActualizacion) {
        $this->idUsuarioActualizacion = $idUsuarioActualizacion;
    }

    public function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

    public function setFechaActualizacion($fechaActualizacion) {
        $this->fechaActualizacion = $fechaActualizacion;
    }

    public function setIdTurno($idTurno) {
        $this->idTurno = $idTurno;
    }
    
    public function setIdHorario($idHorario) {
        $this->idHorario = $idHorario;
    }
    
    public function setCorreo($correo) {
        $this->correo = $correo;
    }
    
    public function setContrasenia($contrasenia) {
        $this->contrasenia = $contrasenia;
    }
    

    public function setIdEstado($idEstado) {
        $this->idEstado = $idEstado;
    }

    public function getIdTutor() 
    {
        return $this->idTutor;
    }

    public function getCodEmpleado() 
    {
        return $this->codEmpleado;
    }

    public function getNombres() 
    {
        return $this->nombres;
    }

    public function getIdUsuarioRegistro() 
    {
        return $this->idUsuarioRegistro;
    }

    public function getIdUsuarioActualizacion() 
    {
        return $this->idUsuarioActualizacion;
    }

    public function getFechaRegistro() 
    {
        return $this->fechaRegistro;
    }

    public function getFechaActualizacion() 
    {
        return $this->fechaActualizacion;
    }

    public function getIdTurno() 
    {
        return $this->idTurno;
    }
    public function getIdHorario() 
    {
        return $this->idHorario;
    }
    public function getCorreo() 
    {
        return $this->correo;
    }
    public function getContrasenia() 
    {
        return $this->contrasenia;
    }

    public function getIdEstado() 
    {
        return $this->idEstado;
    }
    
}

?>