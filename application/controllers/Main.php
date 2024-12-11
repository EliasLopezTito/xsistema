<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

    private $errores;

    public function __construct() {
        parent::__construct();
        // if ($this->session->userdata("logueado") !== TRUE) {
        //     redirect("Auth");
        // }
        $this->load->model("Model_Auth");
        $this->load->model("Model_Usuario");
        //$this->load->model("Model_Seguridad");
        $this->errores = null;
    }

    public function index() {

        if ($this->input->is_ajax_request()) {
            $data = new stdClass();
            $opcion = isset($_POST['opcion']) ? $this->input->post('opcion') : $this->input->get('opcion');
            $search = $this->input->get('term');
            
            switch ($opcion) {
                case 'cumpleDiaHoy':                   
                    $datax = $this->Model_Seguridad->cargarPersonaCumple();

                    if ($datax != null) {
                        $data->respuesta = "success";
                        if($datax == "vacio"){
                            $data->data = "vacio";
                        }else{
                            $data->data = "lleno";
                        }
                    } else {
                        $data->respuesta = "error";
                        $data->errores[] = $this->Model_Seguridad->getError();
                    }

                    break;
                case 'cargarEncuestasAlumnos':

                    date_default_timezone_set('America/Lima');    
                    $hoy = date('Y-m-d');
                    $usuario = trim($this->session->userdata("usuario"));

                    $idNewUsuario = $this->session->userdata("idusuario");
                    $resultadoUsuario = $this->Model_Usuario->obtenerIdAreaByIdNewUsuario($idNewUsuario);
                    // print_r($resultadoUsuario->id_area);
                    // return;
                    $encuestas = $this->Model_Seguridad->selectEncuestasActivasAlumnos($usuario, '9', $resultadoUsuario->id_area);
                    
                    if ($encuestas != null) {
                        if($encuestas != "vacio"){
                            if($encuestas[0]->Estado == "1"){
                            
                                $err = false;
                                //foreach ($encuestas as $key => $encuesta) {
                                    
                                    $preguntas = $this->Model_Seguridad->selectEncuestasPreguntasAlternativasAlumnos($encuestas[0]->Op);
                                    
                                    // print_r($preguntas);
                                    // return;
                                    // if ($preguntas != null) {

                                    //     if($preguntas != "vacio"){
                                            
                                    //         $encuesta->Alumno = "asdasd";

                                    //     }else{

                                    //         $data->respuesta = "vacio";                                     
                                    //         $err = true;
                                    //         break;

                                    //     }
                                    
                                    // }

                                //}

                                if($err == true){
                                    break;
                                }

                                $data->respuesta = "success";
                                $data->data = $preguntas;
                                $data->numeroEncuentas = $encuestas;

                            }else{
                                $data->respuesta = "success";     
                                $data->data= [];                                                                                        
                            }
                        }else{
                            $data->respuesta = "success";     
                            $data->data= [];                                                                                        
                        }
                    } 

                    break;

                case "registrar" :

                    $idEncuesta = $this->input->post("idEncuesta");
                    $idPreguntas = $this->input->post("idPreguntas");
                    $usuario = $this->session->userdata("usuario");
                    $sede = $this->input->post("sede");

                    $guardarRespuesta = array();
                    
                    $error = false;
                    foreach ($idPreguntas as $key => $idPregunta) {
                        
                        $respuesta = trim($this->input->post("respuesta".($key+1)));
                        $respuestaOpcional = trim($this->input->post("respuestaOpcional".($key+1)));
                        /**if($respuesta == ""){
                            $error = true;
                            break;
                        }**/

                        $guardarRespuesta[] = array($idEncuesta,$idPregunta,$usuario,$respuesta, $respuestaOpcional);

                    }

                    /**if($error == true){

                        $data->respuesta = "warning";
                        $data->error = "Por favor responda todas las preguntas";
                        break;

                    }**/

                    $registro = $this->Model_Seguridad->registrarRespuestasEncuestasAlumnos($guardarRespuesta, $sede);

                    if ($registro != null) {
                        
                        // date_default_timezone_set('America/Lima');    
                        // $hoy = date('Y-m-d');                    
                        // $cantidadEncuestas = $this->Model_Seguridad->selectEncuestasActivas($hoy,$codigoAlumno);                    
                        // if ($cantidadEncuestas != null) {

                        //     $cantidadRestante =  0;
                        //     if($cantidadEncuestas != "vacio"){
                        //         $cantidadRestante = count($cantidadEncuestas);
                        //     }

                            $data->respuesta = "success";
                            //$data->cantidadRestante = $cantidadRestante;

                        // }else{

                        //     $data->respuesta = "error";
                        //     $data->error = $this->Model_Seguridad->getError();

                        // }

                    }else{

                        $data->respuesta = "error";
                        $data->error = $this->Model_Seguridad->getError();

                    }

                    break;

                default:
                    # code...
                    break;
            }

            echo json_encode($data);

            exit();
        }
        $data = new stdClass();
        // Fin redirección
        
        //$data->titulo = "Sistema Académico | Instituto Arzobispo Loayza";
        
        // $data->personas = $this->Model_Seguridad->cargarPersonaCumple();
        // $data->cumple =  $this->Model_Seguridad->cargarCumple();   
        // $data->sedes = $this->Model_Seguridad->selectSedes();
        $data->contenido = "main/index";
        $data->blanco = false;
        //$data->csss = ["index.css"];
        /* $data->jss = ["index.js"]; */
        $this->load->view("plantilla/frontend", $data);
    }
}
