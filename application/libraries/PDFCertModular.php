<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";
require_once APPPATH . "/libraries/funciones.php";

class PDFCertModular extends FPdf {
    
       
    public function __construct() {
        parent::__construct("P", "mm", array(210, 307), true);
        //$this->load->library("RPdf");
    }
    
    public function Header() {
        
    }
    
    public function Footer() {
        
    }
}
