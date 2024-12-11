<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoAlumnoRespuestas{    
    private $idEncuesta;
    private $idPregunta;
    private $idRespuesta;
    private $codAlumno;
    private $codProf;
    private $codSede;
    private $codTurno;
    private $codAula;
    private $sugerencias;
    private $fechaRegistro;
    
    public function __construct() {
        $this->idEncuesta = "";
        $this->idPregunta = "";
        $this->idRespuesta = "";
        $this->codAlumno = "";
        $this->codProf = "";
        $this->codSede = "";
        $this->codTurno = "";
        $this->codAula = "";
        $this->sugerencias = "";
        $this->fechaRegistro = "";
    }

    public function getIdEncuesta() {
        return $this->idEncuesta;
    }

    public function getIdPregunta() {
        return $this->idPregunta;
    }

    public function getIdRespuesta() {
        return $this->idRespuesta;
    }

    public function getCodAlumno() {
        return $this->codAlumno;
    }

    public function getCodProf() {
        return $this->codProf;
    }

    public function getCodSede() {
        return $this->codSede;
    }

    public function getCodTurno() {
        return $this->codTurno;
    }

    public function getCodAula() {
        return $this->codAula;
    }

    public function getSugerencias() {
        return $this->sugerencias;
    }

    public function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    public function setIdEncuesta($idEncuesta) {
        $this->idEncuesta = $idEncuesta;
    }

    public function setIdPregunta($idPregunta) {
        $this->idPregunta = $idPregunta;
    }

    public function setIdRespuesta($idRespuesta) {
        $this->idRespuesta = $idRespuesta;
    }

    public function setCodAlumno($codAlumno) {
        $this->codAlumno = $codAlumno;
    }

    public function setCodProf($codProf) {
        $this->codProf = $codProf;
    }

    public function setCodSede($codSede) {
        $this->codSede = $codSede;
    }

    public function setCodTurno($codTurno) {
        $this->codTurno = $codTurno;
    }

    public function setCodAula($codAula) {
        $this->codAula = $codAula;
    }

    public function setSugerencias($sugerencias) {
        $this->sugerencias = $sugerencias;
    }

    public function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

}
