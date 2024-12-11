<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoCurso{    
    private $mallaCurricular;
    private $codLocal;
    private $tipoEspe;
    private $codEspe;
    private $descripcion;
    private $abreviatura;
    private $usuarioRegistro;
    
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

    public function getDescripcion() {
        return $this->descripcion;
    }

    public function getAbreviatura() {
        return $this->abreviatura;
    }

    public function getUsuarioRegistro() {
        return $this->usuarioRegistro;
    }

    public function setMallaCurricular($mallaCurricular) {
        $this->mallaCurricular = $mallaCurricular;
        return $this;
    }

    public function setCodLocal($codLocal) {
        $this->codLocal = $codLocal;
        return $this;
    }

    public function setTipoEspe($tipoEspe) {
        $this->tipoEspe = $tipoEspe;
        return $this;
    }

    public function setCodEspe($codEspe) {
        $this->codEspe = $codEspe;
        return $this;
    }

    public function setDescripcion($descripcion) {
        $this->descripcion = $descripcion;
        return $this;
    }

    public function setAbreviatura($abreviatura) {
        $this->abreviatura = $abreviatura;
        return $this;
    }

    public function setUsuarioRegistro($usuarioRegistro) {
        $this->usuarioRegistro = $usuarioRegistro;
        return $this;
    }
}
