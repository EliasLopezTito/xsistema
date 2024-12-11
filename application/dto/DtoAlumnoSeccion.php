<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoAlumnoSeccion{    
    private $mallaCurricular;    
    private $codLocal;    
    private $tipoEspe;
    private $codEspe;
    private $codLocalInst;
    private $codSeccion;
    private $codCiclo;
    private $codAlumno;
    private $idPeriodoAcademico;
    private $codTurno;
    private $estado;
    private $fechaRegistro;
    private $usuario;
    
    public function __construct() {
        
    }
    
    public function getMallaCurricular() {
        return $this->mallaCurricular;
    }

    public function getCodLocal() {
        return $this->codLocal;
    }

    public function getTipoEspe() {
        return $this->tipoEspe;
    }

    public function getCodEspe() {
        return $this->codEspe;
    }

    public function getCodLocalInst() {
        return $this->codLocalInst;
    }

    public function getCodSeccion() {
        return $this->codSeccion;
    }

    public function getCodCiclo() {
        return $this->codCiclo;
    }

    public function getCodAlumno() {
        return $this->codAlumno;
    }

    public function getIdPeriodoAcademico() {
        return $this->idPeriodoAcademico;
    }

    public function getCodTurno() {
        return $this->codTurno;
    }

    public function getEstado() {
        return $this->estado;
    }

    public function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    public function getUsuario() {
        return $this->usuario;
    }

    public function setMallaCurricular($mallaCurricular) {
        $this->mallaCurricular = $mallaCurricular;
    }

    public function setCodLocal($codLocal) {
        $this->codLocal = $codLocal;
    }

    public function setTipoEspe($tipoEspe) {
        $this->tipoEspe = $tipoEspe;
    }

    public function setCodEspe($codEspe) {
        $this->codEspe = $codEspe;
    }

    public function setCodLocalInst($codLocalInst) {
        $this->codLocalInst = $codLocalInst;
    }

    public function setCodSeccion($codSeccion) {
        $this->codSeccion = $codSeccion;
    }

    public function setCodCiclo($codCiclo) {
        $this->codCiclo = $codCiclo;
    }

    public function setCodAlumno($codAlumno) {
        $this->codAlumno = $codAlumno;
    }

    public function setIdPeriodoAcademico($idPeriodoAcademico) {
        $this->idPeriodoAcademico = $idPeriodoAcademico;
    }

    public function setCodTurno($codTurno) {
        $this->codTurno = $codTurno;
    }

    public function setEstado($estado) {
        $this->estado = $estado;
    }

    public function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

    public function setUsuario($usuario) {
        $this->usuario = $usuario;
    }
}
