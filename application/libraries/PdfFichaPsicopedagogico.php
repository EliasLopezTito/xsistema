<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";
// require_once APPPATH . "/libraries/funciones.php";

class PdfFichaPsicopedagogico extends FPdf {
       
    // public function __construct() {
    //     // parent::__construct("P", "mm", "A4", true);
    //     //$this->load->library("RPdf");
    // }

    public function Header()
    {
        $this->Image('assets/img/logo_loayza_actualizado_2021.png',5, -5, 70);
    }

    public function Footer()
    {
        $this->SetFont('Arial', '', 11);
        $this->SetY(-18);
        $this->Cell(41);
        $this->Cell(0, 5, utf8_decode('SERVICIO PSICOPEDAGÓGICO - DIRECCIÓN ACADÉMICA'), 0, 'C');
        $this->SetFont('Times','',10);
        $this->SetY(-12);
        $this->Cell(51);
        $this->Cell(0, 5, utf8_decode('Pasaje Nueva Rosita 140 - Lima Teléfono: 330 - 9090'));
    }

}
