<?php
defined('BASEPATH') OR exit('No direct script access allowed');

//require_once APPPATH.'dto\DtoPagoDetalle.php';

class DtoPagoDetalle{    
    private $empresa;
    private $tipoDocumentoPago;
    private $serie;
    private $numero;
    private $carrera;
    private $item;
    private $conceptoPago;
    private $cantidad;
    private $valorUnidad;
    private $ciclo;
    private $mesPago;
    private $anioPago;
    private $tipoDocumentoPagoNC;
    private $serieNC;
    private $numeroNC;
    private $fechaRegistro;
    private $usuarioRegistro;
    private $fechaModificacion;
    private $usuarioModificacion;
    
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

    function getItem() {
        return $this->item;
    }

    function getConceptoPago() {
        return $this->conceptoPago;
    }

    function getCantidad() {
        return $this->cantidad;
    }

    function getValorUnidad() {
        return $this->valorUnidad;
    }

    function getCiclo() {
        return $this->ciclo;
    }

    function getMesPago() {
        return $this->mesPago;
    }

    function getAnioPago() {
        return $this->anioPago;
    }

    function getTipoDocumentoPagoNC() {
        return $this->tipoDocumentoPagoNC;
    }

    function getSerieNC() {
        return $this->serieNC;
    }

    function getNumeroNC() {
        return $this->numeroNC;
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

    function setItem($item) {
        $this->item = $item;
    }

    function setConceptoPago($conceptoPago) {
        $this->conceptoPago = $conceptoPago;
    }

    function setCantidad($cantidad) {
        $this->cantidad = $cantidad;
    }

    function setValorUnidad($valorUnidad) {
        $this->valorUnidad = $valorUnidad;
    }

    function setCiclo($ciclo) {
        $this->ciclo = $ciclo;
    }

    function setMesPago($mesPago) {
        $this->mesPago = $mesPago;
    }

    function setAnioPago($anioPago) {
        $this->anioPago = $anioPago;
    }

    function setTipoDocumentoPagoNC($tipoDocumentoPagoNC) {
        $this->tipoDocumentoPagoNC = $tipoDocumentoPagoNC;
    }

    function setSerieNC($serieNC) {
        $this->serieNC = $serieNC;
    }

    function setNumeroNC($numeroNC) {
        $this->numeroNC = $numeroNC;
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

}
