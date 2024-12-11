<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";
require_once APPPATH . "/libraries/Funciones.php";

class PdfDisponibilidadDocentes extends FPDF {
    private $especialidad;
    private $anio;
    private $mes;

    // public function __construct()
    // {
    //     $this->load->library("funciones");
    // }

    public function setEspecialidad(String $especialidad){
        $this->especialidad = $especialidad;
    }

    public function setAnio(String $anio){
        $this->anio = $anio;
    }

    public function setMes(String $mes){
        $this->mes = $mes;
    }

    public function getEspecialidad(){
        return $this->especialidad;
    }

    public function getAnio(){
        return $this->anio;
    }

    public function getMes(){
        return $this->mes;
    }

    public function Header() {
        $funciones = new Funciones();
        $this->Image("assets/img/logo.png", 24, 10, 11);

        $this->Ln(5);
        $this->SetFont("Arial", "BU", 11);
        $this->Cell(0, 5, "Reporte Disponibilidad Docentes", 0, 0, "C", 0);
        $this->Ln(4);

        $this->Ln(10);

        $this->Cell(10);
        $this->SetFont("Arial", "B", 9);
        $this->Cell(25, 5, "INSTITUTO:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 9);
        $this->Cell(150, 5, utf8_decode('I.E.S.T.P. "ARZOBISPO LOAYZA"'), "", 0, "L", 0);

        $this->Cell(10);
        $this->SetFont("Arial", "B", 9);
        $this->Cell(25, 5, utf8_decode("AÑO:"), "", 0, "L", 0);
        $this->SetFont("Arial", "", 9);
        $this->Cell(55, 5, $this->getAnio(), "", 0, "L", 0);

        $this->Ln(6);
        $this->Cell(10);
        $this->SetFont("Arial", "B", 9);
        $this->Cell(30, 5, "ESPECIALIDAD:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 9);
        $this->Cell(150, 5, utf8_decode($this->getEspecialidad()), "", 0, "L", 0);

        /**$this->Ln(7);
        $this->Cell(10);
        $this->SetFont("Arial", "B", 10);
        $this->Cell(25, 5, utf8_decode("AÑO:"), "", 0, "L", 0);
        $this->SetFont("Arial", "", 10);
        $this->Cell(55, 5, $this->getAnio(), "", 0, "L", 0);**/
        $this->Cell(5);
        $this->SetFont("Arial", "B", 9);
        $this->Cell(25, 5, "MES:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 9);
        $this->Cell(40, 5, utf8_decode($funciones->mesEnLetras($this->getMes())), "", 0, "L", 0);

        $this->Ln(9);
        $this->SetFont("Arial", "B", 9);
        $this->Cell(20, 5, utf8_decode("Código"), 0, 0, "C", 0);
        $this->Cell(82, 5, utf8_decode("Nombres"), 0, 0, "C", 0);
        $this->Cell(82, 5, utf8_decode("Profesión"), 0, 0, "C", 0);
        $this->Cell(30, 5, utf8_decode("Fecha"), 0, 0, "C", 0);
        $this->Cell(15, 5, utf8_decode("Mañana"), 0, 0, "C", 0);
        $this->Cell(15, 5, utf8_decode("Tarde"), 0, 0, "C", 0);
        $this->Cell(15, 5, utf8_decode("Noche"), 0, 0, "C", 0);
        $this->Cell(15, 5, utf8_decode("Disp."), 0, 0, "C", 0);

        $this->Ln(7);
        $this->Line(10, $this->GetY(), 285, $this->GetY());
        $this->Ln(10);
    }

    /**public function Footer() {
        $this->SetLineWidth(0.1);
        $this->SetY(-15);
        $this->Line(10, $this->GetY(), 285, $this->GetY());
        $this->MultiCell(0, 5, "Instituto Arzobispo Loayza", "", "C", 0);
    }**/

}