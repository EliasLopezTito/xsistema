<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'dto\DtoPagoDetalle.php';

class DtoPago{    
    private $empresa;
    private $tipoDocumentoPago;
    private $serie;
    private $numero;
    private $carrera;
    private $alumno;
    private $formaPago;
    private $fechaPago;
    private $total;
    private $observacion;
    private $estado;
    private $enviado;
    private $sedePago;
    private $ruc;
    private $razonSocial;
    private $direccion;
    private $fechaRegistro;
    private $usuarioRegistro;
    private $fechaModificacion;
    private $usuarioModificacion;
    private $pagoDetalle;
    
    function __construct() {
        
    }
    
    function getEmpresa() {
        return $this->empresa;
    }
    
    function getTipoDocumentoPago() {
        return $this->tipoDocumentoPago;
    }

    function getSerie() {
        return $this->serie;
    }

    function getNumero() {
        return $this->numero;
    }

    function getCarrera() {
        return $this->carrera;
    }

    function getAlumno() {
        return $this->alumno;
    }

    function getFormaPago() {
        return $this->formaPago;
    }

    function getFechaPago() {
        return $this->fechaPago;
    }

    function getTotal() {
        return $this->total;
    }

    function getObservacion() {
        return $this->observacion;
    }

    function getEstado() {
        return $this->estado;
    }

    function getEnviado() {
        return $this->enviado;
    }

    function getSedePago() {
        return $this->sedePago;
    }

    function getRuc() {
        return $this->ruc;
    }

    function getRazonSocial() {
        return $this->razonSocial;
    }

    function getDireccion() {
        return $this->direccion;
    }

    function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    function getUsuarioRegistro() {
        return $this->usuarioRegistro;
    }

    function getFechaModificacion() {
        return $this->fechaModificacion;
    }

    function getUsuarioModificacion() {
        return $this->usuarioModificacion;
    }

    function getPagoDetalle() {
        return $this->pagoDetalle;
    }

    function setEmpresa($empresa) {
        $this->empresa = $empresa;
    }
    
    function setTipoDocumentoPago($tipoDocumentoPago) {
        $this->tipoDocumentoPago = $tipoDocumentoPago;
    }

    function setSerie($serie) {
        $this->serie = $serie;
    }

    function setNumero($numero) {
        $this->numero = $numero;
    }

    function setCarrera($carrera) {
        $this->carrera = $carrera;
    }

    function setAlumno($alumno) {
        $this->alumno = $alumno;
    }

    function setFormaPago($formaPago) {
        $this->formaPago = $formaPago;
    }

    function setFechaPago($fechaPago) {
        $this->fechaPago = $fechaPago;
    }

    function setTotal($total) {
        $this->total = $total;
    }

    function setObservacion($observacion) {
        $this->observacion = $observacion;
    }

    function setEstado($estado) {
        $this->estado = $estado;
    }

    function setEnviado($enviado) {
        $this->enviado = $enviado;
    }

    function setSedePago($sedePago) {
        $this->sedePago = $sedePago;
    }

    function setRuc($ruc) {
        $this->ruc = $ruc;
    }

    function setRazonSocial($razonSocial) {
        $this->razonSocial = $razonSocial;
    }

    function setDireccion($direccion) {
        $this->direccion = $direccion;
    }

    function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
    }

    function setUsuarioRegistro($usuarioRegistro) {
        $this->usuarioRegistro = $usuarioRegistro;
    }

    function setFechaModificacion($fechaModificacion) {
        $this->fechaModificacion = $fechaModificacion;
    }

    function setUsuarioModificacion($usuarioModificacion) {
        $this->usuarioModificacion = $usuarioModificacion;
    }

    function setPagoDetalle(DtoPagoDetalle $pagoDetalle) {
        $this->pagoDetalle[] = $pagoDetalle;
    }
}
