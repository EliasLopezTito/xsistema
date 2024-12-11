<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoHorario{
    private $id;
    private $idTurno;
    private $dia1;
    private $dia2;
    private $horario1;
    private $horario2;
    private $estado;
    //Para Siga.Horario
    private $idHorario;
    private $descripcion;
    private $primeraHora;
    private $segundaHora;
    private $codEspecialidad;
    private $ciclo;
    private $idOpcionHorario;
    private $secuencia;
    private $fechaRegistro;
    private $fechaActualizacion;
    private $idUsuarioRegistro;
    private $idUsuarioActualizacion;
    private $idEstado;

    function __construct(){
     
    }
    
    public function getId() {
        return $this->id;
    }
    public function getIdTurno() {
        return $this->idTurno;
    }
    public function getHorario1() {
        return $this->horario1;
    }
    public function getHorario2() {
        return $this->horario2;
    }
    public function getDia1() {
        return $this->dia1;
    }
    public function getDia2() {
        return $this->dia2;
    }
    public function getEstado() {
        return $this->estado;
    }

    //Para Siga.Horario
    public function getIdHorario() {
        return $this->idHorario;
    }
    public function getDescripcion() {
        return $this->descripcion;
    }
    public function getPrimeraHora() {
        return $this->primeraHora;
    }
    public function getSegundaHora() {
        return $this->segundaHora;
    }
    public function getCodEspecialidad() {
        return $this->codEspecialidad;
    }
    public function getCiclo() {
        return $this->ciclo;
    }
    public function getIdOpcionHorario() {
        return $this->idOpcionHorario;
    }
    public function getSecuencia() {
        return $this->secuencia;
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


    public function setId($id) {
        $this->id = $id;
    }
    public function setIdTurno($idTurno) {
        $this->idTurno = $idTurno;
    }
    public function setHorario1($horario1) {
        $this->horario1 = $horario1;
    }
    public function setHorario2($horario2) {
        $this->horario2 = $horario2;
    }
    public function setDia1($dia1) {
        $this->dia1 = $dia1;
    }
    public function setDia2($dia2) {
        $this->dia2 = $dia2;
    }
    public function setEstado($estado) {
        $this->estado = $estado;
    }
    
    //Para Siga.Horario
    public function setIdHorario($idHorario) {
        $this->idHorario = $idHorario;
    }
    public function setDescripcion($descripcion) {
        $this->descripcion = $descripcion;
    }
    public function setPrimeraHora($primeraHora) {
        $this->primeraHora = $primeraHora;
    }
    public function setSegundaHora($segundaHora) {
        $this->segundaHora = $segundaHora;
    }
    public function setCodEspecialidad($codEspecialidad) {
        $this->codEspecialidad = $codEspecialidad;
    }
    public function setCiclo($ciclo) {
        $this->ciclo = $ciclo;
    }
    public function setIdOpcionHorario($idOpcionHorario) {
        $this->idOpcionHorario = $idOpcionHorario;
    }
    public function setSecuencia($secuencia) {
        $this->secuencia = $secuencia;
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
