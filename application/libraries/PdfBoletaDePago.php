<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once APPPATH . "/libraries/fpdf/fpdf.php";

class PdfBoletaDePago extends FPDF {

    protected $B = 0;
    protected $I = 0;
    protected $U = 0;
    protected $HREF = '';
       
    public function __construct() {
        parent::__construct("L", "mm", array(225, 140), true);
    }

    function WriteHTML($html)
    {
        // Intérprete de HTML
        $html = str_replace("\n",' ',$html);
        $a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
        foreach($a as $i=>$e)
        {
            if($i%2==0)
            {
                // Text
                if($this->HREF)
                    $this->PutLink($this->HREF,$e);
                else
                    $this->Write(5,$e);
            }
            else
            {
                // Etiqueta
                if($e[0]=='/')
                    $this->CloseTag(strtoupper(substr($e,1)));
                else
                {
                    // Extraer atributos
                    $a2 = explode(' ',$e);
                    $tag = strtoupper(array_shift($a2));
                    $attr = array();
                    foreach($a2 as $v)
                    {
                        if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                            $attr[strtoupper($a3[1])] = $a3[2];
                    }
                    $this->OpenTag($tag,$attr);
                }
            }
        }
    }

    function OpenTag($tag, $attr)
{
    // Etiqueta de apertura
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,true);
    if($tag=='A')
        $this->HREF = $attr['HREF'];
    if($tag=='BR')
        $this->Ln(5);
}

function CloseTag($tag)
{
    // Etiqueta de cierre
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,false);
    if($tag=='A')
        $this->HREF = '';
}

function SetStyle($tag, $enable)
{
    // Modificar estilo y escoger la fuente correspondiente
    $this->$tag += ($enable ? 1 : -1);
    $style = '';
    foreach(array('B', 'I', 'U') as $s)
    {
        if($this->$s>0)
            $style .= $s;
    }
    $this->SetFont('',$style);
}

function PutLink($URL, $txt)
{
    // Escribir un hiper-enlace
    $this->SetTextColor(0,0,255);
    $this->SetStyle('U',true);
    $this->Write(5,$txt,$URL);
    $this->SetStyle('U',false);
    $this->SetTextColor(0);
}
function CellWithMultipleBoldText($width, $height, $textParts, $fontSize = 11)
    {
        // Posición inicial para la celda
        $x_start = $this->GetX();
        $y_start = $this->GetY();

        foreach ($textParts as $part) {
            // Aplicar estilo de fuente y color
            if ($part['bold']) {
                $this->SetFont('Arial', 'B', $fontSize);
                //$this->SetTextColor(255, 0, 0); // Rojo para texto en negrita
            } else {
                $this->SetFont('Arial', '', $fontSize);
                $this->SetTextColor(0, 0, 0); // Negro para texto normal
            }

            // Obtener el ancho del texto y ajustar el ancho de la celda si es necesario
            $text_width = $this->GetStringWidth($part['text']);
            $max_width = $width - ($this->GetX() - $x_start);

            // Si el texto no cabe en la celda, saltar a la siguiente línea
             if ($text_width > $max_width) {
            //     $this->Cell($width, $height, '', 0, 1, 'L'); // Saltar a la siguiente línea
                 $this->SetX($x_start); // Volver a la posición inicial de la celda
             }

            // Dibujar el texto
            $this->Cell($text_width, $height, $part['text'], 0, 0, 'L');
        }

        // Salto de línea después de la celda
        //$this->Ln(2);
    }
    function esMayuscula($texto) {
        return $texto === strtoupper($texto);
    }
function Justify($text, $w, $h)
{
    $tab_paragraphe = explode("\n", $text);
    $nb_paragraphe = count($tab_paragraphe);
    $j = 0;

    while ($j<$nb_paragraphe) {

        $paragraphe = $tab_paragraphe[$j];
        $tab_mot = explode(' ', $paragraphe);
        $nb_mot = count($tab_mot);

        // Handle strings longer than paragraph width
        $tab_mot2 = array();
        $k = 0;
        $l = 0;
        while ($k<$nb_mot) {

            $len_mot = strlen ($tab_mot[$k]);
            if ($len_mot<($w-5) )
            {
                $tab_mot2[$l] = $tab_mot[$k];
                $l++;    
            } else {
                $m=0;
                $chaine_lettre='';
                while ($m<$len_mot) {

                    $lettre = substr($tab_mot[$k], $m, 1);
                    $len_chaine_lettre = $this->GetStringWidth($chaine_lettre.$lettre);

                    if ($len_chaine_lettre>($w-7)) {
                        $tab_mot2[$l] = $chaine_lettre . '-';
                        $chaine_lettre = $lettre;
                        $l++;
                    } else {
                        $chaine_lettre .= $lettre;
                    }
                    $m++;
                }
                if ($chaine_lettre) {
                    $tab_mot2[$l] = $chaine_lettre;
                    $l++;
                }
                

            }
            $k++;
        }

        // Justified lines
        $nb_mot = count($tab_mot2);
        $i=0;
        $ligne = '';
        while ($i<$nb_mot) {

            $mot = $tab_mot2[$i];
            $len_ligne = $this->GetStringWidth($ligne . ' ' . $mot);
            $textParts = [];
            if ($len_ligne>($w-5)) {
                
                $len_ligne = $this->GetStringWidth($ligne);
                $nb_carac = strlen ($ligne);
                $ecart = (($w-2) - $len_ligne) / $nb_carac;
                $this->_out(sprintf('BT %.3F Tc ET',$ecart*$this->k));            
                //$this->MultiCell($w,$h,$ligne);
        
                $new_ligne = explode(' ', $ligne);
                $count_new = count($new_ligne);
                for ($a=0; $a < $count_new; $a++) { 
                    if($this->esMayuscula($new_ligne[$a])){
                        array_push($textParts, ['text' => $new_ligne[$a].' ', 'bold' => true]);
                    }else{
                        array_push($textParts, ['text' => $new_ligne[$a].' ', 'bold' => false]);
                    }
                }                

                $this->CellWithMultipleBoldText($w, $h, $textParts, 10.5);
                //$this->Cell($w,$h,$ligne,0 , 0 , "L", 0);
                
                $this->Ln();
                $ligne = $mot;

            } else {

                if ($ligne)
                {
                    $ligne .= ' ' . $mot;
                } else {
                    $ligne = $mot;
                }

            }            
            $i++;
        }

        // Last line
        $this->_out('BT 0 Tc ET');
        $this->MultiCell($w,$h,$ligne);
        $j++;
    }
}
    
    public function Header() {
        
    }

    public function Footer() {
        
    }
}
