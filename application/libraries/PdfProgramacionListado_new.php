<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";

class PdfProgramacionListado_new extends FPDF {

    private $titulo;
    private $codlocal;
    private $institucion;
    private $sede;
    private $mes;
    private $aula;
    private $turno;
    private $curso;
    private $ciclo;
    private $profesor;
    private $tipoListado;
    private $tipoReporte;
    private $anio;
    public $modalidad;
    public $condicion_local;
    public $footer;

    public function __construct() {
        parent::__construct("P", "mm", array(225, 280), true);
        $this->titulo = "";
        $this->codlocal = "";
        $this->institucion = "";
        $this->sede = "";
        $this->mes = "";
        $this->aula = "";
        $this->turno = "";
        $this->curso = "";
        $this->ciclo = "";
        $this->profesor = "";
        $this->tipoListado = "";
        $this->tipoReporte = "";
        $this->anio = "";
        $this->condicion_local = true;
    }

    public function setAnio($anio) {
        $this->anio = $anio;
    }

    public function setTitulo($titulo) {
        $this->titulo = $titulo;
    }

    public function setCodLocal($codlocal) {
        $this->codlocal = $codlocal;
    }

    public function setInstitucion($institucion) {
        $this->institucion = $institucion;
    }

    public function setSede($sede) {
        $this->sede = $sede;
    }

    public function setMes($mes) {
        $this->mes = $mes;
    }

    public function setAula($aula) {
        $this->aula = $aula;
    }

    public function setTurno($turno) {
        $this->turno = $turno;
    }

    public function setCurso($curso) {
        if (strlen($curso) > 55) {
            $curso = trim(substr($curso, 0, 55));
        }
        $this->curso = $curso;
    }

    public function setCiclo($ciclo) {
        $this->ciclo = $ciclo;
    }

    public function setProfesor($profesor) {
        $this->profesor = $profesor;
    }

    public function setTipoListado($tipoListado) {
        $this->tipoListado = $tipoListado;
    }

    public function setTipoReporte($tipoReporte) {
        $this->tipoReporte = $tipoReporte;
    }

    public function Header() {
        $this->Image("assets/img/logo.png", 25, 11, 12);

        $this->SetLineWidth(0.5);
        $this->SetFont("Arial", "B", 8.5);
        $this->Cell(180);
        $this->Cell(30, 4, "Pagina " . $this->PageNo() . " de {nb}", "", 0, "L", 0);
        $this->Ln(4);
        $this->Cell(180);
        $this->Cell(30, 4, date('d/m/Y'), "", 0, "L", 0);
        $this->Ln(2);

        $this->SetFont("Arial", "BU", 12);
        $this->Cell(30);
        $this->Cell(150, 10, utf8_decode($this->titulo), "", 0, "C", 0);

        $this->Ln(20);

        $this->Cell(10);
        $this->SetFont("Arial", "B", 10);
        $this->Cell(25, 5, "INSTITUTO:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 10);
        $this->Cell(150, 5, utf8_decode($this->institucion), "", 0, "L", 0);

        if( $this->condicion_local ){
            $this->Ln(7);
            $this->Cell(10);
            $this->SetFont("Arial", "B", 10);
            $this->Cell(25, 5, "LOCAL:", "", 0, "L", 0);
            $this->SetFont("Arial", "", 10);
            $this->Cell(150, 5, utf8_decode($this->sede), "", 0, "L", 0);
        }

        $this->Ln(7);
        $this->Cell(10);
        $this->SetFont("Arial", "B", 10);
        $this->Cell(25, 5, "MODALIDAD:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 10);
        $this->Cell(150, 5, $this->modalidad , "", 0, "L", 0);

        // $this->Ln(7);
        // $this->Cell(10);
        // $this->SetFont("Arial", "B", 10);
        // $this->Cell(25, 5, utf8_decode("AÑO:"), "", 0, "L", 0);
        // $this->SetFont("Arial", "", 10);
        // $this->Cell(55, 5, $this->anio, "", 0, "L", 0);

        $this->Ln(7);
        $this->Cell(10);
        $this->SetFont("Arial", "B", 10);
        $this->Cell(25, 5, "SEMESTRE:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 10);
        $this->Cell(55, 5, $this->anio, "", 0, "L", 0);
        $this->SetFont("Arial", "B", 10);
        $this->Cell(15, 5, "AULA:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 10);
        $this->Cell(40, 5, utf8_decode($this->aula), "", 0, "L", 0);
        $this->SetFont("Arial", "B", 10);
        $this->Cell(20, 5, "TURNO:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 10);
        $this->Cell(30, 5, utf8_decode($this->turno), "", 0, "L", 0);

        $this->Ln(7);
        $this->Cell(10);
        $this->SetFont("Arial", "B", 10);
        
        if($this->codlocal != 17)
        {//menos Local 17

            $this->Cell(25, 5, "CURSO:", "", 0, "L", 0);

        }else
        {

            $this->Cell(25, 5, "TEMA:", "", 0, "L", 0);

        }

        $this->SetFont("Arial", "", 10);
        $this->Cell(110, 5, utf8_decode($this->curso), "", 0, "L", 0);
       

        if($this->codlocal != 17)
        {//menos Local 17

            $this->SetFont("Arial", "B", 10);
            $this->Cell(20, 5, "CICLO:", "", 0, "L", 0);
            $this->SetFont("Arial", "", 10);
            $this->Cell(30, 5, $this->ciclo, "", 0, "L", 0);

        }

        $this->Ln(7);
        $this->Cell(10);
        $this->SetFont("Arial", "B", 10);
        $this->Cell(25, 5, "PROFESOR:", "", 0, "L", 0);
        $this->SetFont("Arial", "", 10);
        $this->Cell(150, 5, utf8_decode($this->profesor), "", 0, "L", 0);

        if ($this->tipoListado == 1) {
            if ($this->tipoReporte == "N") {
                $this->Ln(7);
                $this->Cell(10);
                $this->SetFont("Arial", "B", 8.5);
                $this->Cell(25, 5, "CODIGO", "", 0, "L", 0);
                $this->Cell(115, 5, "ALUMNO", "", 0, "C", 0);
                $this->Cell(25, 5, "DOCUMENTO", "", 0, "L", 0);
            }
            if ($this->tipoReporte == "V") {
                $this->Ln(7);
                $this->Cell(2); //20
                $this->SetFont("Arial", "B", 8.5);
                $this->Cell(20, 5, "CODIGO", "", 0, "C", 0);
                $this->Cell(88, 5, "ALUMNO", "", 0, "C", 0);
                $this->Cell(17, 5, "CELULAR", "", 0, "C", 0);
                $this->Cell(48, 5, "EMAIL", "", 0, "C", 0);
                $this->Cell(25, 5, "DOCUMENTO", "", 0, "L", 0);
            }
        } else if($this->tipoListado == 2) {
            $this->Ln(7);
            $this->Cell(10);
            $this->SetFont("Arial", "B", 8.5);
            $this->Cell(30, 5, "CODIGO", "", 0, "L", 0);
            $this->Cell(110, 5, "ALUMNO", "", 0, "C", 0);
            $this->Cell(30, 5, "DOCUMENTO", "", 0, "L", 0);
        } else{
            $this->Ln(7);
            $this->Cell(10);
            $this->SetFont("Arial", "B", 8.5);
            $this->Cell(21, 5, "CODIGO", "", 0, "L", 0);
            $this->Cell(89, 5, "ALUMNO", "", 0, "L", 0);
            $this->Cell(30, 5, "CELULAR", "", 0, "L", 0);
            $this->Cell(30, 5, "EMAIL", "", 0, "L", 0);
        }

        $this->Ln(6);
        $this->Line(10, $this->GetY(), 210, $this->GetY());
        $this->Ln(3);
    }

    public function Footer() {
        $this->SetLineWidth(0.1);
        $this->SetY(-8);
        $this->Line(10, $this->GetY(), 210, $this->GetY());
        $this->SetFont("Arial", "B", 8.5);
        $this->Cell(5);
        $this->Cell(10, 5, ($this->footer ? "  NOTA: " : "" ) , "", "L", 0);
        $this->SetFont("Arial", "", 8.5);
        $this->MultiCell(195, 5, ($this->footer ? "Esta terminantemente prohibido agregar manualmente alumnos al listado, pues este no tendra validez para el registro de notas" : "") , "", "L", 0);
    }

}
