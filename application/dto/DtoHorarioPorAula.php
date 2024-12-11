<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoHorarioPorAula{    
    private $codAula;
    private $primeraHora;
    private $segundaHora;
    private $anio;
    private $mes;
    
    function __construct() {
        
    }
    
    public function getCodAula() {
        return $this->codAula;
    }

    public function getPrimeraHora() {
        return $this->primeraHora;
    }

    public function getSegundaHora() {
        return $this->segundaHora;
    }

    public function getAnio() {
        return $this->anio;
    }

    public function getMes() {
        return $this->mes;
    }

    public function setCodAula($codAula) {
        $this->codAula = $codAula;
    }

    public function setPrimeraHora($primeraHora) {
        $this->primeraHora = $primeraHora;
    }

    public function setSegundaHora($segundaHora) {
        $this->segundaHora = $segundaHora;
    }

    public function setAnio($anio) {
        $this->anio = $anio;
    }

    public function setMes($mes) {
        $this->mes = $mes;
    }
}
