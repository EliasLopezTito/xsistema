<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class DtoAlumno {
    private $codAlumno;
    private $apellidos;
    private $nombres;
    private $edad;
    private $sexo;

    private $tipoDoc;
    private $dni;
    private $carnetExtranjeria;

    private $domicilio;
    private $telefono;
    private $fechaNaci;
    private $fechaMatricula;
    private $distrito;
    private $idioma;
    private $codInterno;
    private $email;
    private $codPais;
    private $padreV;
    private $madreV;
    private $idioma2;
    private $sitLab;
    private $horasSem;
    private $codInst;
    private $flag;
    private $usuario;
    private $firmo;
    private $varInfFirma;
    private $idAlumBanco;
    private $idCond;
    private $codEmp;
    private $idTipoDocumento;
    private $numeroDocumento;
    
    public function __construct() {
        
    }
    
    public function getCodAlumno() {
        return $this->codAlumno;
    }

    public function getApellidos() {
        return $this->apellidos;
    }

    public function getNombres() {
        return $this->nombres;
    }

    public function getEdad() {
        return $this->edad;
    }

    public function getSexo() {
        return $this->sexo;
    }

    public function getTipoDoc() {
        return $this->tipoDoc;
    }

    public function getDni() {
        return $this->dni;
    }

    public function getCarnetExtranjeria() {
        return $this->carnetExtranjeria;
    }

    public function getDomicilio() {
        return $this->domicilio;
    }

    public function getTelefono() {
        return $this->telefono;
    }

    public function getFechaNaci() {
        return $this->fechaNaci;
    }

    public function getFechaMatricula() {
        return $this->fechaMatricula;
    }

    public function getDistrito() {
        return $this->distrito;
    }

    public function getIdioma() {
        return $this->idioma;
    }

    public function getCodInterno() {
        return $this->codInterno;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getCodPais() {
        return $this->codPais;
    }

    public function getPadreV() {
        return $this->padreV;
    }

    public function getMadreV() {
        return $this->madreV;
    }

    public function getIdioma2() {
        return $this->idioma2;
    }

    public function getSitLab() {
        return $this->sitLab;
    }

    public function getHorasSem() {
        return $this->horasSem;
    }

    public function getCodInst() {
        return $this->codInst;
    }

    public function getFlag() {
        return $this->flag;
    }

    public function getUsuario() {
        return $this->usuario;
    }

    public function getFirmo() {
        return $this->firmo;
    }

    public function getVarInfFirma() {
        return $this->varInfFirma;
    }

    public function getIdAlumBanco() {
        return $this->idAlumBanco;
    }

    public function getIdCond() {
        return $this->idCond;
    }

    public function getCodEmp() {
        return $this->codEmp;
    }

    public function getIdTipoDocumento() {
        return $this->idTipoDocumento;
    }

    public function getNumeroDocumento() {
        return $this->numeroDocumento;
    }

    public function setCodAlumno($codAlumno) {
        $this->codAlumno = $codAlumno;
    }

    public function setApellidos($apellidos) {
        $this->apellidos = $apellidos;
    }

    public function setNombres($nombres) {
        $this->nombres = $nombres;
    }

    public function setEdad($edad) {
        $this->edad = $edad;
    }

    public function setSexo($sexo) {
        $this->sexo = $sexo;
    }

    public function setTipoDoc($tipoDoc) {
        $this->tipoDoc = $tipoDoc;
    }

    public function setDni($dni) {
        $this->dni = $dni;
    }

    public function setCarnetExtranjeria($carnetExtranjeria) {
        $this->carnetExtranjeria = $carnetExtranjeria;
    }

    public function setDomicilio($domicilio) {
        $this->domicilio = $domicilio;
    }

    public function setTelefono($telefono) {
        $this->telefono = $telefono;
    }

    public function setFechaNaci($fechaNaci) {
        $this->fechaNaci = $fechaNaci;
    }

    public function setFechaMatricula($fechaMatricula) {
        $this->fechaMatricula = $fechaMatricula;
    }

    public function setDistrito($distrito) {
        $this->distrito = $distrito;
    }

    public function setIdioma($idioma) {
        $this->idioma = $idioma;
    }

    public function setCodInterno($codInterno) {
        $this->codInterno = $codInterno;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setCodPais($codPais) {
        $this->codPais = $codPais;
    }

    public function setPadreV($padreV) {
        $this->padreV = $padreV;
    }

    public function setMadreV($madreV) {
        $this->madreV = $madreV;
    }

    public function setIdioma2($idioma2) {
        $this->idioma2 = $idioma2;
    }

    public function setSitLab($sitLab) {
        $this->sitLab = $sitLab;
    }

    public function setHorasSem($horasSem) {
        $this->horasSem = $horasSem;
    }

    public function setCodInst($codInst) {
        $this->codInst = $codInst;
    }

    public function setFlag($flag) {
        $this->flag = $flag;
    }

    public function setUsuario($usuario) {
        $this->usuario = $usuario;
    }

    public function setFirmo($firmo) {
        $this->firmo = $firmo;
    }

    public function setVarInfFirma($varInfFirma) {
        $this->varInfFirma = $varInfFirma;
    }

    public function setIdAlumBanco($idAlumBanco) {
        $this->idAlumBanco = $idAlumBanco;
    }

    public function setIdCond($idCond) {
        $this->idCond = $idCond;
    }

    public function setCodEmp($codEmp) {
        $this->codEmp = $codEmp;
    }

    public function setIdTipoDocumento($idTipoDocumento) {
        $this->idTipoDocumento = $idTipoDocumento;
    }

    public function setNumeroDocumento($numeroDocumento) {
        $this->numeroDocumento = $numeroDocumento;
    }
}
