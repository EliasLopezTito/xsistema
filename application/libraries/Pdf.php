<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";

class Pdf extends FPDF {

    public function __construct() {
        parent::__construct();
        // $pdf = new FPDF('P','mm',array(90,100));
    }

    public function Header() {
        /*$this->Image("assets/img/logo.png", 25, 11, 12);
        
        $this->SetFont("Times", "B", 8);
        $this->Cell(160);
        $this->Cell(30, 4, "Pagina ".$this->PageNo()." de {nb}", "", 0, "C", 0);
        $this->Ln(4);
        $this->Cell(160);
        $this->Cell(30, 4, date('d/m/Y'), "", 0, "C", 0);
        $this->Ln(2);
        
        $this->SetFont("Times", "BU", 11);
        $this->Cell(30);
        $this->Cell(130, 10, "REPORTE DE ALUMNOS MATRICULADOS POR AULA", "", 0, "C", 0);
        
        $this->Ln(20);
                
        $this->Cell(10);
        $this->SetFont("Times", "B", 8);
        $this->Cell(25, 5, "INSTITUTO:", "", 0, "L", 0);
        $this->SetFont("Times", "", 9);
        $this->Cell(150, 5, "I.E.S.T.P. \"ARZOBISPO LOAYZA\"", "", 0, "L", 0);
        
        $this->Ln(6);
        $this->Cell(10);
        $this->SetFont("Times", "B", 8);
        $this->Cell(25, 5, "LOCAL:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 9);
        $this->Cell(150, 5, "PASAJE NUEVA ROSITA 140", "", 0, "L", 0);
        
        $this->Ln(6);
        $this->Cell(10);
        $this->SetFont("Times", "B", 8);
        $this->Cell(25, 5, "MES:", "", 0, "L", 0);
        $this->SetFont("Times", "", 9);
        $this->Cell(50, 5, "SEPTIEMBRE", "", 0, "L", 0);
        $this->SetFont("Times", "B", 8);
        $this->Cell(15, 5, "AULA:", "", 0, "L", 0);
        $this->SetFont("Times", "", 9);
        $this->Cell(35, 5, "BELMOD-FIS", "", 0, "L", 0);
        $this->SetFont("Times", "B", 8);
        $this->Cell(20, 5, "TURNO:", "", 0, "L", 0);
        $this->SetFont("Times", "", 9);
        $this->Cell(30, 5, utf8_decode("MAÑANA"), "", 0, "L", 0);
        
        $this->Ln(6);
        $this->Cell(10);
        $this->SetFont("Times", "B", 8);
        $this->Cell(25, 5, "CURSO:", "", 0, "L", 0);
        $this->SetFont("Times", "", 9);
        $this->Cell(100, 5, "ANATOMIA FUNCIONAL", "", 0, "L", 0);
        $this->SetFont("Times", "B", 8);
        $this->Cell(20, 5, "CICLO:", "", 0, "L", 0);
        $this->SetFont("Times", "", 9);
        $this->Cell(30, 5, "01", "", 0, "L", 0);
        
        $this->Ln(6);
        $this->Cell(10);
        $this->SetFont("Times", "B", 8);
        $this->Cell(25, 5, "PROFESOR:", "", 0, "L", 0);
        $this->SetFont("Times", "", 9);
        $this->Cell(150, 5, "TELLO PARAVECINO, CESAR MIGUEL", "", 0, "L", 0);
        
        
        $this->Ln(6);
        $this->Cell(10);
        $this->SetFont("Times", "B", 8);
        $this->Cell(25, 5, "CODIGO", "", 0, "L", 0);        
        $this->Cell(95, 5, "ALUMNO", "", 0, "C", 0);
        $this->Cell(35, 5, "DOCUMENTO", "", 0, "L", 0);
        $this->Cell(25, 5, "Observacion", "", 0, "L", 0);
        $this->Ln(6);
        $this->Cell(190, 3, "", "B", 0, "C", 0);
        
        $this->Ln(5);*/
    }

    public function Footer() {
        /*$this->SetY(-8);
        $this->SetFont("Times", "B", 8);
        $this->Cell(10, 5, " NOTA: ", "T", "L", 0);
        $this->SetFont("Times", "", 8);
        $this->MultiCell(180, 5, "Esta terminantemente prohibido agregar manualmente alumnos al listado, pues este no tendra validez para el registro de notas", "T", "L", 0);
        */
    }

}

?>