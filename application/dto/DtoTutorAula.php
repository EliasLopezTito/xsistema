<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoTutorAula{
    private $id;
    private $idTutor;
    private $idAula;
    private $mes;
    private $anio;
    private $usuarioRegistro;
    private $usuarioActualizo;
    private $estado;

    function __construct(){
    }
    
    public function getId() {
        return $this->id;
    }
    public function getIdTutor() {
        return $this->idTutor;
    }
    public function getIdAula() {
        return $this->idAula;
    }
    public function getIdMes() {
        return $this->mes;
    }
    public function getIdAnio() {
        return $this->anio;
    }
    public function getUsuarioRegistro() {
        return $this->usuarioRegistro;
    }
    public function getUsuarioActualizo() {
        return $this->usuarioActualizo;
    }
    public function getEstado() {
        return $this->estado;
    }

    
    public function setId($id) {
        $this->id = $id;
    }
    public function setIdTutor($idTutor) {
        $this->idTutor = $idTutor;
    }
    public function setIdAula($idAula) {
        $this->idAula = $idAula;
    }
    public function setIdMes($mes) {
        $this->mes = $mes;
    }
    public function setIdAnio($anio) {
        $this->anio = $anio;
    }
    public function setUsuarioRegistro($usuarioRegistro) {
        $this->usuarioRegistro = $usuarioRegistro;
    }
    public function setUsuarioActualizo($usuarioActualizo) {
        $this->usuarioActualizo = $usuarioActualizo;
    }
    public function setEstado($estado) {
        $this->estado = $estado;
    }
  
}
