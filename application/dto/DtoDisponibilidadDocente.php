<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoDisponibilidadDocente{    
    private $docente;
    private $codTurno;
    private $estado;
    private $anioDis;
    private $mesDis;
    private $sede;
    
    
    public function __construct() {
        
    }

    public function getDocente() {
        return $this->docente;
    }

    public function getCodTurno() {
        return $this->codTurno;
    }

    public function getEstado() {
        return $this->estado;
    }

    public function getAnioDis() {
        return $this->anioDis;
    }

    public function getMesDis() {
        return $this->mesDis;
    }

    public function getSede() {
        return $this->sede;
    }

    public function setDocente($docente) {
        $this->docente = $docente;
    }

    public function setCodTurno($codTurno) {
        $this->codTurno = $codTurno;
    }

    public function setEstado($estado) {
        $this->estado = $estado;
    }

    public function setAnioDis($anioDis) {
        $this->anioDis = $anioDis;
    }

    public function setMesDis($mesDis) {
        $this->mesDis = $mesDis;
    }

    public function setSede($sede) {
        $this->sede = $sede;
    }
}
