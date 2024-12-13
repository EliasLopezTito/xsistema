<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

    private $errores;

    public function __construct() {
        parent::__construct();
        if ($this->session->userdata("logueado") !== TRUE) {
            redirect("Auth");
        }
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
                                    
                                    $preguntas = $this->Model_Seguridad->selectEncuestasPreguntasAlternativasAlumnos($encuestas[0]->Op);
                                    
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
        $data->nivel1 = $this->Model_Auth->selectMenu('user', '1');
        $data->nivel2 = $this->Model_Auth->selectMenu('user', '2');
        $data->nivel3 = $this->Model_Auth->selectMenu('user', '3');
        //$data->csss = ["index.css"];
        /* $data->jss = ["index.js"]; */
        $this->load->view("plantilla/frontend", $data);
    }
}
