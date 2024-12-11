<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";
require_once APPPATH . "/libraries/funciones.php";

class PdfNomina extends RPdf {
    
       
    public function __construct() {
        parent::__construct("L", "mm", "A4", true);
        $this->load->library("RPdf");
    }
    
    public function Header() {
        
    }
    
    public function Footer() {
        
    }
}
