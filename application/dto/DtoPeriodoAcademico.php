<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoPeriodoAcademico{    
    private $idPeriodoAcademico;
    private $inicioPeriodo;
    private $finPeriodo;
    private $fechaNomina;
    private $fechaActa;
    
    function __construct() {
        
    }
    
    public function getIdPeriodoAcademico() {
        return $this->idPeriodoAcademico;
    }

    public function getInicioPeriodo() {
        return $this->inicioPeriodo;
    }

    public function getFinPeriodo() {
        return $this->finPeriodo;
    }

    public function getFechaNomina() {
        return $this->fechaNomina;
    }

    public function getFechaActa() {
        return $this->fechaActa;
    }

    public function setIdPeriodoAcademico($idPeriodoAcademico) {
        $this->idPeriodoAcademico = $idPeriodoAcademico;
        return $this;
    }

    public function setInicioPeriodo($inicioPeriodo) {
        $this->inicioPeriodo = $inicioPeriodo;
        return $this;
    }

    public function setFinPeriodo($finPeriodo) {
        $this->finPeriodo = $finPeriodo;
        return $this;
    }

    public function setFechaNomina($fechaNomina) {
        $this->fechaNomina = $fechaNomina;
        return $this;
    }

    public function setFechaActa($fechaActa) {
        $this->fechaActa = $fechaActa;
        return $this;
    }
}
