<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Funciones {

    function colorNota($nota) {
        if (trim($nota) == "") {
            return "";
        } else {
            $nota = (int) $nota;
            if ($nota >= 0 && $nota < 13) {
                return "texto-rojo";
            } else {
                return "texto-azul";
            }
        }
    }

    function ultimoDiaDelMes($mes = null, $anio = null) {
        if ($mes == null) {
            $mes = date("m");
        }
        if ($anio == null) {
            $anio = date("Y");
        }
        $dia = date("d", mktime(0, 0, 0, $mes + 1, 0, $anio));
        return date('Y-m-d', mktime(0, 0, 0, $mes, $dia, $anio));
    }

    function primerDiaDelMes() {
        $mes = date("m");
        $anio = date("Y");
        return date('Y-m-d', mktime(0, 0, 0, $mes, 1, $anio));
    }

    public function generarMeses() {
        $meses = null;
        for ($i = 1; $i <= 12; $i++) {
            if ($i < 10) {
                $meses["0" . $i] = $this->mesEnLetras($i);
            } else {
                $meses[$i] = $this->mesEnLetras($i);
            }
        }
        return $meses;
    }

    public function generarAnios() {
        $aniosBase = date('Y') - 4;
        $anio = (int) strftime("%Y");

        for ($i = $aniosBase; $i <= $anio + 2; $i++) {
            $anios[] = $i;
        }
        return $anios;
    }

    public function generarPeriodos() {
        $periodos = null;
        $aniosBase = 2000;
        $anio = (int) strftime("%Y");

        for ($i = $anio + 1; $i >= $aniosBase; $i--) {
            $periodos[$i . "-II"] = $i . "-II";
            $periodos[$i . "-I"] = $i . "-I";
        }
        return $periodos;
    }

    public function mesEnLetras($mes) {
        switch ($mes) {
            case 1:
                return "ENERO";
                break;
            case 2:
                return "FEBRERO";
                break;
            case 3:
                return "MARZO";
                break;
            case 4:
                return "ABRIL";
                break;
            case 5:
                return "MAYO";
                break;
            case 6:
                return "JUNIO";
                break;
            case 7:
                return "JULIO";
                break;
            case 8:
                return "AGOSTO";
                break;
            case 9:
                return "SEPTIEMBRE";
                break;
            case 10:
                return "OCTUBRE";
                break;
            case 11:
                return "NOVIEMBRE";
                break;
            case 12:
                return "DICIEMBRE";
                break;
            default :
                return "";
                break;
        }
    }

    public function turnoEnLetras($turno) {
        switch ($turno) {
            case "A":
                return "MAÑANA - A";
                break;
            case "B":
                return "MAÑANA - B";
                break;
            case "M":
                return "MAÑANA";
                break;
            case "T":
                return "TARDE";
                break;
            case "U":
                return "TARDE - U";
                break;
            case "N":
                return "NOCHE";
                break;
            case "V":
                return "VIRTUAL";
                break;
            case "1":
                return "MAÑANA";
                break;
            case "3":
                return "TARDE";
                break;
            case "5":
                return "NOCHE";
                break;
            case "SP":
                return "SEMI PRESENCIAL";
                break;
            default:
                return "";
                break;
        }
    }

    public function esFecha($fecha) {
        $valores = explode('-', $fecha);
        if (count($valores) == 3 && checkdate($valores[1], $valores[2], $valores[0])) {
            return true;
        }
        return false;
    }

    public function separarString($str, $largo) {
        $str = trim($str);
        if (strlen($str) <= $largo) {
            return $str;
        } else {
            $letra = substr($str, $largo, 1);
            if ($letra !== " ") {
                $indice = strrpos(substr($str, 0, $largo), " ");
                return trim(substr($str, 0, $indice)) . "|" . $this->separarString(trim(substr($str, $indice)), $largo);
            } else {
                return trim(substr($str, 0, $largo)) . "|" . $this->separarString(trim(substr($str, $largo)), $largo);
            }
        }
    }
	
	/*
	Author: Huancollo Chambi Jessica
	Fecha: 27-02-2021
	Comentarios: Agregando método para importación  de programación de matriculados (ingresantes)
	*/
	public function obtenerSemestre($mes,$ano)
    {


      if ($mes == "01" || $mes == "02" || $mes == "03" || $mes == "04" || $mes == "05" || $mes == "06")
      {

          return $ano."-I";

      }else if ($mes == "07" || $mes == "08" || $mes == "09" || $mes == "10" || $mes == "11" || $mes == "12")
      {

          return $ano."-II";

      }
          
    }

    /*
      public function generarMesesAnios($anio=null,$mes=null){
      if($anio==null && $mes==null){
      $anio = (int)strftime("%Y");
      $mes = (int)strftime("%m");
      }
      switch($mes){
      case 1:
      $meses[] = $this->mesEnLetras(12)."-".($anio-1);
      for($i=1;$i<5;$i++){
      $meses[] = $this->mesEnLetras($mes-1+$i)."-".$anio;
      }
      break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      for($i=0;$i<5;$i++){
      $meses[] = $this->mesEnLetras($mes-1+$i)."-".$anio;
      }
      break;
      case 10:
      case 11:
      case 12:
      for($i=0;$i<14-$mes;$i++){
      $meses[] = $this->mesEnLetras($mes-1+$i)."-".$anio;
      }
      for($i=0;$i<$mes-9;$i++){
      $meses[] = $this->mesEnLetras($i+1)."-".($anio+1);
      }
      break;
      }
      return $meses;
      }

      public function mesEnNumero($mes){
      switch($mes){
      case "ENERO":
      return '01';
      break;
      case "FEBRERO":
      return '02';
      break;
      case "MARZO":
      return '03';
      break;
      case "ABRIL":
      return '04';
      break;
      case "MAYO":
      return '05';
      break;
      case "JUNIO":
      return '06';
      break;
      case "JULIO":
      return '07';
      break;
      case "AGOSTO":
      return '08';
      break;
      case "SEPTIEMBRE":
      return '09';
      break;
      case "OCTUBRE":
      return '10';
      break;
      case "NOVIEMBRE":
      return '11';
      break;
      case "DICIEMBRE":
      return '12';
      break;
      }
      }

      public function generarSemestres(){
      $aniosBase = 2000;
      $anio = (int)strftime("%Y");

      while($aniosBase <= $anio + 1){
      $semestres[] = ($aniosBase)."1";
      $semestres[] = ($aniosBase)."2";
      $aniosBase++;
      }
      return $semestres;
      }

      function validarFecha($fecha){
      $valores = explode('-', $fecha);
      if(count($valores) == 3 && checkdate($valores[1], $valores[2], $valores[0])){
      return true;
      }
      return false;
      } 

      public function letras(){
      $miletra = "A";
      for ($i =0; $i < 26; $i++){
      $letras[]=$miletra;
      $miletra++;
      }
      return $letras;
      }

      public function notaEnLetras($nota){
      if($nota == "" || $nota == null){
      $nota = 0;
      }else{
      $nota = (int) $nota;
      }
      switch($nota){
      case 1:
      return "UNO";
      break;
      case 2:
      return "DOS";
      break;
      case 3:
      return "TRES";
      break;
      case 4:
      return "CUATRO";
      break;
      case 5:
      return "CINCO";
      break;
      case 6:
      return "SEIS";
      break;
      case 7:
      return "SIETE";
      break;
      case 8:
      return "OCHO";
      break;
      case 9:
      return "NUEVE";
      break;
      case 10:
      return "DIEZ";
      break;
      case 11:
      return "ONCE";
      break;
      case 12:
      return "DOCE";
      break;
      case 13:
      return "TRECE";
      break;
      case 14:
      return "CATORCE";
      break;
      case 15:
      return "QUINCE";
      break;
      case 16:
      return "DIECISEIS";
      break;
      case 17:
      return "DIECISIETE";
      break;
      case 18:
      return "DIECIOCHO";
      break;
      case 19:
      return "DIECINUEVE";
      break;
      case 20:
      return "VEINTE";
      break;
      default :
      return "";
      }
      }
     */

    /**
     * Author: Jessica Huancollo Chambi
     * Date: 28/12/2021
     * Updated: 16/02/2022 12:38pm
     * Commentaries: Creando líneas de texto.
     * Si se cortara una palabra por la cantidad limite, procede al salto de línea.
    */

    public function ajustarCadena($cadenaOriginal,$cantidadLimiteCaracteres)
    {
        $cadenaRetorno = "";
        $filaTexto = "";

        // Ordenamos las comas,
        // Editado por Deyvi Pajuelo 30/05/2022 
        $cadenaOriginal = explode(',', $cadenaOriginal);
        $cadenaOriginal = array_map(function($element){
            return  trim($element);
        },$cadenaOriginal);
        $cadenaOriginal = implode(', ',$cadenaOriginal);

        if(strlen($cadenaOriginal) <= $cantidadLimiteCaracteres)
        {//si la cadena es menor o igual a la  cantidad límite x fila de texto

            $cadenaRetorno = $cadenaOriginal;

        }else
        {//si la cadena es mayor a la  cantidad límite x fila de texto
            
            $restoTexto = $cadenaOriginal;

            while(strlen($restoTexto) > $cantidadLimiteCaracteres)
            {

                //echo "cant. de cadena restante: ".strlen($restoTexto);
                //echo "=====";

                $letraPosteriorLimite = substr($restoTexto, $cantidadLimiteCaracteres, 1);//letra posterior del límite

                if ($letraPosteriorLimite != " ")
                {//Si la letra posterior es un caracter, es decir se intenta cortar una palabra

                    //posición de ultimo espacio de la fila de texto extraída, teniendo en cuenta el límite
                    $indiceUltimoEspacioCadena = strrpos(substr($restoTexto, 0, $cantidadLimiteCaracteres), " ");

                    //se extrae la fila de texto teniendo como limite: la posición del último espacio
                    $filaTexto = substr($restoTexto, 0, $indiceUltimoEspacioCadena);

                }else
                {//Si la letra posterior es un espacio, es decir no se intenta cortar una palabra

                    //se extrae la fila de texto teniendo como limite: $cantidadLimiteCaracteres
                    $filaTexto = substr($restoTexto, 0, $cantidadLimiteCaracteres);
                }

                //concantenando la fila de texto extraída
                $cadenaRetorno = $cadenaRetorno.$filaTexto."|";

                //Extrayendo el resto del texto
                $restoTexto = substr($restoTexto, strlen($filaTexto));

                //echo "restoTexto: ".$restoTexto;
                //echo "=====";

            }

            $cadenaRetorno = $cadenaRetorno.$restoTexto;

        }

        return $cadenaRetorno;
    }

    function encrypt($string, $key)
    {

        $result = '';

        for($i=0; $i<strlen($string); $i++)
        {

            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % strlen($key))-1, 1);
            $char = chr(ord($char)+ord($keychar));
            $result.=$char;
        }

        return base64_encode($result);
    }

    function decrypt($string, $key)
    {

        $result = '';

        $string = base64_decode($string);

        for($i=0; $i<strlen($string); $i++)
        {

            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % strlen($key))-1, 1);
            $char = chr(ord($char)-ord($keychar));
            $result.=$char;

        }

        return $result;

    }
    
}

