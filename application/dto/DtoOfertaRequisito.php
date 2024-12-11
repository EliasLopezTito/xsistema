<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoOfertaRequisito{    
    private $oferta;
    private $orden;
    private $requisito;
    
    function __construct() {
        
    }
    
    function getOferta() {
        return $this->oferta;
    }

    function getOrden() {
        return $this->orden;
    }

    function getRequisito() {
        return $this->requisito;
    }

    function setOferta($oferta) {
        $this->oferta = $oferta;
    }

    function setOrden($orden) {
        $this->orden = $orden;
    }

    function setRequisito($requisito) {
        $this->requisito = $requisito;
    }
}
