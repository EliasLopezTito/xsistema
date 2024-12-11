<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoNotaDocenteIdiomas{
    private $idNotaDocente;
    private $codMallaCurricular;
    private $codLocal;
    private $tipoEspe;
    private $codEspe;
    private $codCiclo;
    private $codAlumno;
    private $codDocente;
    private $idPeriodoAcademico;
    private $codCurso;
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
    private $er;
    private $mesProgramado;
    private $anioProgramado;
    private $fechaRegistro;
    private $fechaActualizacion;
    private $usuarioRegistro;
    private $usuarioActualizacion;
    private $idEstado;
    private $pfinal;
    
    public function __construct() {
        
    }
    
    public function getIdNotaDocente() {
        return $this->idNotaDocente;
    }

    public function getPromedioFinal() {
        return $this->pfinal;
    }

    public function getCodMallaCurricular() {
        return $this->codMallaCurricular;
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

    public function getCodCiclo() {
        return $this->codCiclo;
    }

    public function getCodAlumno() {
        return $this->codAlumno;
    }

    public function getCodDocente() {
        return $this->codDocente;
    }

    public function getIdPeriodoAcademico() {
        return $this->idPeriodoAcademico;
    }

    public function getCodCurso() {
        return $this->codCurso;
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

    public function getPr() {
        return $this->pr;
    }

    public function getEr() {
        return $this->er;
    }

    public function getMesProgramado() {
        return $this->mesProgramado;
    }

    public function getAnioProgramado() {
        return $this->anioProgramado;
    }

    public function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    public function getFechaActualizacion() {
        return $this->fechaActualizacion;
    }

    public function getUsuarioRegistro() {
        return $this->usuarioRegistro;
    }

    public function getUsuarioActualizacion() {
        return $this->usuarioActualizacion;
    }

    public function getIdEstado() {
        return $this->idEstado;
    }

    public function setIdNotaDocente($idNotaDocente) {
        $this->idNotaDocente = $idNotaDocente;
    }

    public function setMallaCurricular($codMallaCurricular) {
        $this->codMallaCurricular = $codMallaCurricular;
    }

    public function setCodLocal($codLocal) {
        $this->codLocal = $codLocal;
    }

    public function setTipoEspe($tipoEspe) {
        $this->tipoEspe = $tipoEspe;
    }

    public function setCodEspe($codEspe) {
        $this->codEspe = $codEspe;
    }

    public function setCodCiclo($codCiclo) {
        $this->codCiclo = $codCiclo;
    }

    public function setCodAlumno($codAlumno) {
        $this->codAlumno = $codAlumno;
    }

    public function setPromedioFinal($pfinal) {
        $this->pfinal = $pfinal;
    }

    public function setCodDocente($codDocente) {
        $this->codDocente = $codDocente;
    }

    public function setIdPeriodoAcademico($idPeriodoAcademico) {
        $this->idPeriodoAcademico = $idPeriodoAcademico;
    }

    public function setCodCurso($codCurso) {
        $this->codCurso = $codCurso;
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

    public function setPr($pr) {
        $this->pr = $pr;
    }

    public function setEr($er) {
        $this->er = $er;
    }

    public function setMesProgramado($mesProgramado) {
        $this->mesProgramado = $mesProgramado;
    }

    public function setAnioProgramado($anioProgramado) {
        $this->anioProgramado = $anioProgramado;
    }
    
    public function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

    public function setFechaActualizacion($fechaActualizacion) {
        $this->fechaActualizacion = $fechaActualizacion;
    }

    public function setUsuarioRegistro($usuarioRegistro) {
        $this->usuarioRegistro = $usuarioRegistro;
    }

    public function setUsuarioActualizacion($usuarioActualizacion) {
        $this->usuarioActualizacion = $usuarioActualizacion;
    }

    public function setIdEstado($idEstado) {
        $this->idEstado = $idEstado;
    }

}
