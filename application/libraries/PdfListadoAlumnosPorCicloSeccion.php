<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";
require_once APPPATH . "/libraries/funciones.php";

class PdfListadoAlumnosPorCicloSeccion extends FPdf {
    private $titulo;
    private $institucion;
    private $programa;
       
    public function __construct() {
        parent::__construct("P", "mm", "A4", true);
        //$this->load->library("RPdf");
        $this->titulo = "";
        $this->institucion = "";
        $this->programa = "";
    }
    
    public function setTitulo($titulo){
        $this->titulo = $titulo;
    }
    
    public function setInstitucion($institucion){
        $this->institucion = $institucion;
    }
    
    public function setPrograma($programa){
        $this->programa = $programa;
    }
    
    public function Header() {
        $this->Image("assets/img/logo.png", 20, 11, 12);
        
        //$this->SetLineWidth(0.5);
        
        $this->Ln(5);
        $this->SetFont("Arial", "B", 10);
        $this->Cell(25);
        $this->Cell(135, 10, utf8_decode($this->titulo), "", 0, "C", 0);
        $this->SetFont("Arial", "B", 7);
        $this->Cell(30, 5, "Pagina ".$this->PageNo()." de {nb}", "", 0, "C", 0);
        $this->Ln(5);
        $this->Cell(160);
        $this->Cell(30, 5, date('d/m/Y'), "", 0, "C", 0);
        $this->Ln(12);
                
        $this->Cell(10);
        $this->Cell(25, 4, "INSTITUTO:", "", 0, "L", 0);
        $this->Cell(155, 4, utf8_decode($this->institucion), "", 0, "L", 0);        
        $this->Ln(4);
        
        $this->Cell(10);
        $this->Cell(25, 4, "PROGRAMA:", "", 0, "L", 0);
        $this->Cell(155, 4, utf8_decode($this->programa), "", 0, "L", 0);
        $this->Ln(6);
        
        $this->SetLineWidth(0.3);
        $this->Line(10, $this->GetY(), 200, $this->GetY());
        $this->SetLineWidth(0.3);
        $this->Ln(4);
    }
    
    public function Footer() {
        
    }
}
