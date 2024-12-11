<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoNotas{
    private $mallaCurricular;
    private $codLocal;
    private $tipoEspe;
    private $codEspe;
    private $codCiclo;
    private $codAlumno;
    private $idPeriodoAcademico;
    private $idNota;
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
    private $es;
    private $pf;
    private $obs;
    private $tipoNota;
    private $docente;
    private $fechaRegistro;
    private $usuario;
    
    public function __construct() {
        
    }
    
    public function getObs() {
        return $this->obs;
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

    public function getCodCiclo() {
        return $this->codCiclo;
    }

    public function getCodAlumno() {
        return $this->codAlumno;
    }

    public function getIdPeriodoAcademico() {
        return $this->idPeriodoAcademico;
    }

    public function getIdNota() {
        return $this->idNota;
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

    public function getEs() {
        return $this->es;
    }
    
    public function getPf() {
        return $this->pf;
    }

    public function getTipoNota() {
        return $this->tipoNota;
    }

    public function getDocente() {
        return $this->docente;
    }

    public function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    public function getUsuario() {
        return $this->usuario;
    }

    public function setObs($obs) {
        $this->obs = $obs;
    }

    public function setMallaCurricular($mallaCurricular) {
        $this->mallaCurricular = $mallaCurricular;
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

    public function setIdPeriodoAcademico($idPeriodoAcademico) {
        $this->idPeriodoAcademico = $idPeriodoAcademico;
    }

    public function setIdNota($idNota) {
        $this->idNota = $idNota;
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

    public function setEs($es) {
        $this->es = $es;
    }
    
    public function setPf($pf) {
        $this->pf = $pf;
    }

    public function setTipoNota($tipoNota) {
        $this->tipoNota = $tipoNota;
    }

    public function setDocente($docente) {
        $this->docente = $docente;
    }

    public function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

    public function setUsuario($usuario) {
        $this->usuario = $usuario;
    }
}
