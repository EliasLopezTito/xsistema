<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoCurso{    
    private $codCurso;
    private $descripcion;
    private $fechaReg;
    private $desCorta;
    private $flagAccion;
    private $xCodLocal;
    private $estado1;
    
    function __construct() {
        
    }
    
    public function getCodCurso() {
        return $this->codCurso;
    }

    public function getDescripcion() {
        return $this->descripcion;
    }

    public function getFechaReg() {
        return $this->fechaReg;
    }

    public function getDesCorta() {
        return $this->desCorta;
    }

    public function getFlagAccion() {
        return $this->flagAccion;
    }

    public function getXCodLocal() {
        return $this->xCodLocal;
    }

    public function getEstado1() {
        return $this->estado1;
    }

    public function setCodCurso($codCurso) {
        $this->codCurso = $codCurso;
    }

    public function setDescripcion($descripcion) {
        $this->descripcion = $descripcion;
    }

    public function setFechaReg($fechaReg) {
        $this->fechaReg = $fechaReg;
    }

    public function setDesCorta($desCorta) {
        $this->desCorta = $desCorta;
    }

    public function setFlagAccion($flagAccion) {
        $this->flagAccion = $flagAccion;
    }

    public function setXCodLocal($xCodLocal) {
        $this->xCodLocal = $xCodLocal;
    }

    public function setEstado1($estado1) {
        $this->estado1 = $estado1;
    }
}
