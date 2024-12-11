<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";

class PdfHistoricoDeNotas extends FPDF {

    public function __construct() {
        //parent::__construct("L", "mm", array(225, 140), true);
        parent::__construct();
    }

    public function Header() {
        $this->Image(base_url("assets/img/logo.png"), 10, 8, 18.5, 17.5);        
        $this->SetFont("Arial", "B", 11);
        $this->Cell(72, 4, "", "", 0, "R", false);
        $this->SetLineWidth(0.5);
        $this->Cell(46, 4, utf8_decode("HISTORICO DE  NOTAS"), "B", 0, "C", false);
        $this->SetLineWidth(0.2);
        $this->SetFont("Arial", "", 7);
        $this->Cell(72, 4, date("d/m/Y"), "", 0, "R", false);
        $this->Ln(10);
    }

    public function Footer() {
        
    }

}
