<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoCursoAplazado{

    private $idCursoAplazado;
    private $idNota;
    private $NroVezCursado;
    private $CodCiclo;
    private $idPeriodoAcademico;
    private $ap1;
    private $ed1;
    private $ep;
    private $ac1;
    private $pr1;
    private $ap2;
    private $ed2;
    private $ef;
    private $ac2;
    private $pr2;
    private $pr;
    private $es;
    private $pf;
    private $TipoNota;
    private $Docente;
    private $FechaRegistro;
    private $FechaActualizacion;
    private $UsuarioRegistro;
    private $UsuarioActualizacion;
    private $idEstado;
    
    public function __construct() {
        
    }
    
    public function getIdCursoAplazado() {
        return $this->idCursoAplazado;
    }

    public function getIdNota() {
        return $this->idNota;
    }

    public function getNroVezCursado() {
        return $this->NroVezCursado;
    }

    public function getCodCiclo() {
        return $this->CodCiclo;
    }

    public function getIdPeriodoAcademico() {
        return $this->IdPeriodoAcademico;
    }

    public function getAp1() {
        return $this->ap1;
    }

    public function getEd1() {
        return $this->ed1;
    }

    public function getEp() {
        return $this->ep;
    }

    public function getAc1() {
        return $this->ac1;
    }

    public function getPr1() {
        return $this->pr1;
    }

    public function getAp2() {
        return $this->ap2;
    }

    public function getEd2() {
        return $this->ed2;
    }

    public function getEf() {
        return $this->ef;
    }

    public function getAc2() {
        return $this->ac2;
    }

    public function getPr2() {
        return $this->pr2;
    }
    //nuevo
    public function getPr() {
        return $this->pr;
    }

    public function getEs() {
        return $this->es;
    }
    
    public function getPf() {
        return $this->pf;
    }

    public function getTipoNota() {
        return $this->TipoNota;
    }

    public function getDocente() {
        return $this->Docente;
    }

    public function getFechaRegistro() {
        return $this->FechaRegistro;
    }

    public function getFechaActualizacion() {
        return $this->FechaActualizacion;
    }

    public function getUsuarioRegistro() {
        return $this->UsuarioRegistro;
    }

    public function getUsuarioActualizacion() {
        return $this->UsuarioActualizacion;
    }

    public function getIdEstado() {
        return $this->idEstado;
    }

    public function setIdCursoAplazado($idCursoAplazado) {
        $this->idCursoAplazado = $idCursoAplazado;
    }
   
    public function setIdNota($idNota) {
        $this->idNota = $idNota;
    }

    public function setNroVezCursado($NroVezCursado) {
        $this->NroVezCursado = $NroVezCursado;
    }

    public function setCodCiclo($CodCiclo) {
        $this->CodCiclo = $CodCiclo;
    }

    public function setIdPeriodoAcademico($idPeriodoAcademico) {
        $this->idPeriodoAcademico = $idPeriodoAcademico;
    }

    public function setAp1($ap1) {
        $this->ap1 = $ap1;
    }

    public function setEd1($ed1) {
        $this->ed1 = $ed1;
    }

    public function setEp($ep) {
        $this->ep = $ep;
    }

    public function setAc1($ac1) {
        $this->ac1 = $ac1;
    }

    public function setPr1($pr1) {
        $this->pr1 = $pr1;
    }

    public function setAp2($ap2) {
        $this->ap2 = $ap2;
    }

    public function setEd2($ed2) {
        $this->ed2 = $ed2;
    }

    public function setEf($ef) {
        $this->ef = $ef;
    }

    public function setAc2($ac2) {
        $this->ac2 = $ac2;
    }

    public function setPr2($pr2) {
        $this->pr2 = $pr2;
    }
    //nuevo
    public function setPr($pr) {
        $this->pr = $pr;
    }
    
    public function setEs($es) {
        $this->es = $es;
    }
    
    public function setPf($pf) {
        $this->pf = $pf;
    }

    public function setTipoNota($TipoNota) {
        $this->TipoNota = $TipoNota;
    }

    public function setDocente($Docente) {
        $this->Docente = $Docente;
    }

    public function setFechaRegistro($FechaRegistro) {
        $this->FechaRegistro = $FechaRegistro;
    }

    public function setFechaActualizacion($FechaActualizacion) {
        $this->FechaActualizacion = $FechaActualizacion;
    }

    public function setUsuarioRegistro($UsuarioRegistro) {
        $this->UsuarioRegistro = $UsuarioRegistro;
    }

    public function setUsuarioActualizacion($UsuarioActualizacion) {
        $this->UsuarioActualizacion = $UsuarioActualizacion;
    }

    public function setIdEstado($idEstado) {
        $this->idEstado = $idEstado;
    }
}
