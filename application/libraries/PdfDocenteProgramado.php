<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";

class PdfDocenteProgramado extends FPDF {
    private $mes;
    private $anio;
    private $codEmpleado;
    private $apellidosNombres;
    private $fechaEntrega;
            
    public function __construct() {
        parent::__construct("L", "mm", array(225, 140), true);
        $this->mes = "";
        $this->anio = "";
        $this->codEmpleado = "";
        $this->apellidosNombres = "";
        $this->fechaEntrega = "";
    }
    
    public function setCodEmpleado($codEmpleado){
        $this->codEmpleado = $codEmpleado;
    }
    
    public function setApellidosNombres($apellidosNombres){
        $this->apellidosNombres = $apellidosNombres;
    }
    
    public function setMes($mes){
        $this->mes = $mes;
    }
    
    public function setAnio($anio){
        $this->anio = $anio;
    }
    
    /*public function Header() {
        $this->SetFont("Arial", "B",8.5);
        $this->Cell(210, 4, "PROGRAMACIÓN DE DOCENTE", "", 0, "C", 0);
        $this->ln(8);        
        $this->Cell(40, 4, "", "", 0, "L", 0);
        $this->Cell(20, 4, "MES: ", "", 0, "L", 0);
        $this->Cell(75, 4, utf8_decode($this->mes), "", 0, "L", 0);
        $this->Cell(20, 4, utf8_decode("AÑO: "), "", 0, "L", 0);
        $this->Cell(55, 4, utf8_decode($this->anio), "", 0, "L", 0);
        $this->ln(8);
        $this->Cell(35, 4, utf8_decode("DOCENTE: "), "", 0, "L", 0);
        $this->Cell(20, 4, utf8_decode($this->codEmpleado), "", 0, "L", 0);
        $this->Cell(155, 4, utf8_decode($this->apellidosNombres), "", 0, "L", 0);
        $this->ln(4);
        $this->Line(5, $this->GetY(), 215, $this->GetY());
        $this->ln(0.5);
        $this->Cell(35, 4, utf8_decode("HORA"), "", 0, "L", 0);
        $this->Cell(55, 4, utf8_decode("CURSO"), "", 0, "L", 0);
        $this->Cell(30, 4, utf8_decode("ESPECIALIDAD"), "", 0, "L", 0);
        $this->Cell(17, 4, utf8_decode("CICLO"), "", 0, "L", 0);
        $this->Cell(25, 4, utf8_decode("AULA"), "", 0, "L", 0);
        $this->Cell(24, 4, utf8_decode("INICIO"), "", 0, "L", 0);
        $this->Cell(24, 4, utf8_decode("TÉRMINO"), "", 0, "L", 0);        
        $this->ln(8);
    }

    public function Footer() {
        $this->SetY(-38);
        $this->SetFont("Arial", "B",8);
        $this->Cell(30, 8, utf8_decode(""), "", 0, "L", false);
        $this->Cell(50, 8, utf8_decode("DPTO. DE PROGRAMACIÓN"), "T", 0, "C", false);
        $this->Cell(50, 8, utf8_decode(""), "", 0, "L", false);
        $this->Cell(50, 8, utf8_decode("DOCENTE"), "T", 0, "C", false);
        $this->ln(10);
        
        $this->SetFont("Arial", "B",7.5);
        $this->MultiCell(210, 4, "Importante:", "", "L", 0);
        $this->SetFont("Arial", "", 7);
        $this->MultiCell(210, 3, utf8_decode("1. Elprofesor que no viene al Inicio de Clases será desprogramado (Dirección Académica)"), "", "L", 0);
        $this->MultiCell(210, 3, utf8_decode("2. La asistencia y la puntualidad en el mes será factor determinante para futuras programaciones (Dirección Académica)"), "", "L", 0);
        $this->MultiCell(210, 3, utf8_decode("3. Regularizar Contrato con el Dpto. Legal."), "", "L", 0);
        $this->MultiCell(210, 3, utf8_decode("4. Recibió Calendario Academico   SI( )   NO( )"), "", "L", 0);
        $this->SetFont("Arial", "B", 7.5);
        $this->MultiCell(210, 4, utf8_decode("(**)Curso que se enseñará al Alumno"), "", "L", 0);
        $this->MultiCell(210, 4, utf8_decode("(*)Curso que Figurará en el registro"), "", "L", 0);
    }*/
}
