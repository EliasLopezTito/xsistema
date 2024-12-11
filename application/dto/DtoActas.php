<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoActas{    
    private $codigoAlumno;    
    private $dni;    
    private $curso1;
    private $nota1;
    private $curso2;
    private $nota2;
    private $curso3;
    private $nota3;
    private $curso4;
    private $nota4;
    private $curso5;
    private $nota5;
    private $curso6;
    private $nota6;
    private $curso7;
    private $nota7;
    private $curso8;
    private $nota8;
    private $curso9;
    private $nota9;
    private $curso10;
    private $nota10;
    private $curso11;
    private $nota11;
    private $numCursosAprobados;
    private $numCursosDesaprobados;
    
    public function __construct() {
        
    }
    
    public function setCodigoAlumno($codigoAlumno) {
        $this->codigoAlumno = $codigoAlumno;
    }

    public function setDNI($dni) {
        $this->dni = $dni;
    }

    public function setCurso1($curso1) {
        $this->curso1 = $curso1;
    }

    public function setNota1($nota1) {
        $this->nota1 = $nota1;
    }

   public function setCurso2($curso2) {
        $this->curso2 = $curso2;
    }

    public function setNota2($nota2) {
        $this->nota2 = $nota2;
    }

    public function setCurso3($curso3) {
        $this->curso3 = $curso3;
    }

    public function setNota3($nota3) {
        $this->nota3 = $nota3;
    }

    public function setCurso4($curso4) {
        $this->curso4 = $curso4;
    }

    public function setNota4($nota4) {
        $this->nota4 = $nota4;
    }

    public function setCurso5($curso5) {
        $this->curso5 = $curso5;
    }

    public function setNota5($nota5) {
        $this->nota5 = $nota5;
    }

    public function setCurso6($curso6) {
        $this->curso6 = $curso6;
    }

    public function setNota6($nota6) {
        $this->nota6 = $nota6;
    }

    public function setCurso7($curso7) {
        $this->curso7 = $curso7;
    }

    public function setNota7($nota7) {
        $this->nota7 = $nota7;
    }

    public function setCurso8($curso8) {
        $this->curso8 = $curso8;
    }

    public function setNota8($nota8) {
        $this->nota8 = $nota8;
    }

    public function setCurso9($curso9) {
        $this->curso9 = $curso9;
    }

    public function setNota9($nota9) {
        $this->nota9 = $nota9;
    }

    public function setCurso10($curso10) {
        $this->curso10 = $curso10;
    }

    public function setNota10($nota10) {
        $this->nota10 = $nota10;
    }

    public function setCurso11($curso11) {
        $this->curso11 = $curso11;
    }

    public function setNota11($nota11) {
        $this->nota11 = $nota11;
    }

    public function setNumCursosAprobados($numCursosAprobados) {
        $this->numCursosAprobados = $numCursosAprobados;
    }

    public function setNumCursosDesaprobados($numCursosDesaprobados) {
        $this->numCursosDesaprobados = $numCursosDesaprobados;
    }

    //gets

    public function getCodigoAlumno() {
        return $this->codigoAlumno;
    }

    public function getDNI() {
        return $this->dni;
    }

    public function getCurso1() {
        return $this->curso1;
    }

    public function getNota1() {
        return $this->nota1;
    }

   public function getCurso2() {
        return $this->curso2;
    }

    public function getNota2() {
        return $this->nota2;
    }

    public function getCurso3() {
        return $this->curso3;
    }

    public function getNota3() {
        return $this->nota3;
    }

    public function getCurso4() {
        return $this->curso4;
    }

    public function getNota4() {
        return $this->nota4;
    }

    public function getCurso5() {
        return $this->curso5;
    }

    public function getNota5() {
        return $this->nota5;
    }

    public function getCurso6() {
        return $this->curso6;
    }

    public function getNota6() {
        return $this->nota6;
    }

    public function getCurso7() {
        return $this->curso7;
    }

    public function getNota7() {
        return $this->nota7;
    }

    public function getCurso8() {
        return $this->curso8;
    }

    public function getNota8() {
        return $this->nota8;
    }

    public function getCurso9() {
        return $this->curso9;
    }

    public function getNota9() {
        return $this->curso9;
    }

    public function getCurso10() {
        return $this->curso10;
    }

    public function getNota10() {
        return $this->nota10;
    }

    public function getCurso11() {
        return $this->curso11;
    }

    public function getNota11() {
        return $this->nota11;
    }

    public function getNumCursosAprobados() {
        return $this->numCursosAprobados;
    }

    public function getNumCursosDesaprobados() {
        return $this->numCursosDesaprobados;
    }

    
}
