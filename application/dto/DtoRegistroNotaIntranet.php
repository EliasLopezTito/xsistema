<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoRegistroNotaIntranet{    
    private $anioProg;
    private $mesProg;
    private $codAlumno;
    private $codLocal;
    private $tipoEspe;
    private $codEspe;
    private $codCursoI;
    private $codCursoM;
    private $docente;
    private $curriculaI;
    private $codCiclo;
    private $ap1I;
    private $ed1I;
    private $epI;
    private $ac1I;
    private $pr1I;
    private $ap2I;
    private $ed2I;
    private $efI;
    private $ac2I;
    private $pr2I;
    private $pfI;    
    private $ap1M;
    private $ed1M;
    private $epM;
    private $ac1M;
    private $pr1M;
    private $ap2M;
    private $ed2M;
    private $efM;
    private $ac2M;
    private $pr2M;
    private $pfM;
    private $usuarioRegistro;
    private $fechaRegistro;
    private $estado;
    
    public function __construct() {
        
    }

    public function getAnioProg() {
        return $this->anioProg;
    }

    public function getMesProg() {
        return $this->mesProg;
    }

    public function getCodAlumno() {
        return $this->codAlumno;
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

    public function getCodCursoI() {
        return $this->codCursoI;
    }

    public function getCodCursoM() {
        return $this->codCursoM;
    }

    public function getDocente() {
        return $this->docente;
    }

    public function getCurriculaI() {
        return $this->curriculaI;
    }

    public function getCodCiclo() {
        return $this->codCiclo;
    }

    public function getAp1I() {
        return $this->ap1I;
    }

    public function getEd1I() {
        return $this->ed1I;
    }

    public function getEpI() {
        return $this->epI;
    }

    public function getAc1I() {
        return $this->ac1I;
    }

    public function getPr1I() {
        return $this->pr1I;
    }

    public function getAp2I() {
        return $this->ap2I;
    }

    public function getEd2I() {
        return $this->ed2I;
    }

    public function getEfI() {
        return $this->efI;
    }

    public function getAc2I() {
        return $this->ac2I;
    }

    public function getPr2I() {
        return $this->pr2I;
    }

    public function getPfI() {
        return $this->pfI;
    }

    public function getAp1M() {
        return $this->ap1M;
    }

    public function getEd1M() {
        return $this->ed1M;
    }

    public function getEpM() {
        return $this->epM;
    }

    public function getAc1M() {
        return $this->ac1M;
    }

    public function getPr1M() {
        return $this->pr1M;
    }

    public function getAp2M() {
        return $this->ap2M;
    }

    public function getEd2M() {
        return $this->ed2M;
    }

    public function getEfM() {
        return $this->efM;
    }

    public function getAc2M() {
        return $this->ac2M;
    }

    public function getPr2M() {
        return $this->pr2M;
    }

    public function getPfM() {
        return $this->pfM;
    }

    public function getUsuarioRegistro() {
        return $this->usuarioRegistro;
    }

    public function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    public function getEstado() {
        return $this->estado;
    }

    public function setAnioProg($anioProg) {
        $this->anioProg = $anioProg;
    }

    public function setMesProg($mesProg) {
        $this->mesProg = $mesProg;
    }

    public function setCodAlumno($codAlumno) {
        $this->codAlumno = $codAlumno;
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

    public function setCodCursoI($codCursoI) {
        $this->codCursoI = $codCursoI;
    }

    public function setCodCursoM($codCursoM) {
        $this->codCursoM = $codCursoM;
    }

    public function setDocente($docente) {
        $this->docente = $docente;
    }

    public function setCurriculaI($curriculaI) {
        $this->curriculaI = $curriculaI;
    }

    public function setCodCiclo($codCiclo) {
        $this->codCiclo = $codCiclo;
    }

    public function setAp1I($ap1I) {
        $this->ap1I = $ap1I;
    }

    public function setEd1I($ed1I) {
        $this->ed1I = $ed1I;
    }

    public function setEpI($epI) {
        $this->epI = $epI;
    }

    public function setAc1I($ac1I) {
        $this->ac1I = $ac1I;
    }

    public function setPr1I($pr1I) {
        $this->pr1I = $pr1I;
    }

    public function setAp2I($ap2I) {
        $this->ap2I = $ap2I;
    }

    public function setEd2I($ed2I) {
        $this->ed2I = $ed2I;
    }

    public function setEfI($efI) {
        $this->efI = $efI;
    }

    public function setAc2I($ac2I) {
        $this->ac2I = $ac2I;
    }

    public function setPr2I($pr2I) {
        $this->pr2I = $pr2I;
    }

    public function setPfI($pfI) {
        $this->pfI = $pfI;
    }

    public function setAp1M($ap1M) {
        $this->ap1M = $ap1M;
    }

    public function setEd1M($ed1M) {
        $this->ed1M = $ed1M;
    }

    public function setEpM($epM) {
        $this->epM = $epM;
    }

    public function setAc1M($ac1M) {
        $this->ac1M = $ac1M;
    }

    public function setPr1M($pr1M) {
        $this->pr1M = $pr1M;
    }

    public function setAp2M($ap2M) {
        $this->ap2M = $ap2M;
    }

    public function setEd2M($ed2M) {
        $this->ed2M = $ed2M;
    }

    public function setEfM($efM) {
        $this->efM = $efM;
    }

    public function setAc2M($ac2M) {
        $this->ac2M = $ac2M;
    }

    public function setPr2M($pr2M) {
        $this->pr2M = $pr2M;
    }

    public function setPfM($pfM) {
        $this->pfM = $pfM;
    }

    public function setUsuarioRegistro($usuarioRegistro) {
        $this->usuarioRegistro = $usuarioRegistro;
    }

    public function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

    public function setEstado($estado) {
        $this->estado = $estado;
    }
}
