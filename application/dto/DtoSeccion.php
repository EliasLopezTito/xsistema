<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoSeccion{    
    private $codSeccion;
    private $observaciones;
    private $estado;
    
    function __construct() {
        
    }
    
    public function getCodSeccion() {
        return $this->codSeccion;
    }

    public function getObservaciones() {
        return $this->observaciones;
    }

    public function getEstado() {
        return $this->estado;
    }

    public function setCodSeccion($codSeccion) {
        $this->codSeccion = $codSeccion;
    }

    public function setObservaciones($observaciones) {
        $this->observaciones = $observaciones;
    }

    public function setEstado($estado) {
        $this->estado = $estado;
    }
}
