<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class DtoIntConfiguracionRegistroNotas {

    private $codLocal;
    private $unidadDidactica;
    private $anioProg;
    private $mesProg;
    private $fechaActivacion;
    private $fechaBloqueo;

    public function __construct() {
        
    }
    
    public function getCodLocal() {
        return $this->codLocal;
    }

    public function getUnidadDidactica() {
        return $this->unidadDidactica;
    }

    public function getAnioProg() {
        return $this->anioProg;
    }

    public function getMesProg() {
        return $this->mesProg;
    }

    public function getFechaActivacion() {
        return $this->fechaActivacion;
    }

    public function getFechaBloqueo() {
        return $this->fechaBloqueo;
    }

    public function setCodLocal($codLocal) {
        $this->codLocal = $codLocal;
    }

    public function setUnidadDidactica($unidadDidactica) {
        $this->unidadDidactica = $unidadDidactica;
    }

    public function setAnioProg($anioProg) {
        $this->anioProg = $anioProg;
    }

    public function setMesProg($mesProg) {
        $this->mesProg = $mesProg;
    }

    public function setFechaActivacion($fechaActivacion) {
        $this->fechaActivacion = $fechaActivacion;
    }

    public function setFechaBloqueo($fechaBloqueo) {
        $this->fechaBloqueo = $fechaBloqueo;
    }
}

?>