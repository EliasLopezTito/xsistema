<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoHorarioVirtual{
    private $anio;
    private $mes;
    private $codEspe;
    private $horario;
    private $primeraHora;
    private $segundaHora;
    
    function __construct() {
        $this->anio = "";
        $this->mes = "";
        $this->codEspe = "";
        $this->horario = "";
        $this->primeraHora = "";
        $this->segundaHora = "";
    }
    
    public function getAnio() {
        return $this->anio;
    }

    public function getMes() {
        return $this->mes;
    }

    public function getCodEspe() {
        return $this->codEspe;
    }

    public function getHorario() {
        return $this->horario;
    }

    public function getPrimeraHora() {
        return $this->primeraHora;
    }

    public function getSegundaHora() {
        return $this->segundaHora;
    }

    public function setAnio($anio) {
        $this->anio = $anio;
    }

    public function setMes($mes) {
        $this->mes = $mes;
    }

    public function setCodEspe($codEspe) {
        $this->codEspe = $codEspe;
    }

    public function setHorario($horario) {
        $this->horario = $horario;
    }

    public function setPrimeraHora($primeraHora) {
        $this->primeraHora = $primeraHora;
    }

    public function setSegundaHora($segundaHora) {
        $this->segundaHora = $segundaHora;
    }
}
