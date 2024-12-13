<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {
    private $errores;

    public function __construct() {
        parent::__construct();
        $this->load->model("Model_Auth");
        $this->load->model("Model_Menu");
        //$this->load->model("Model_Programacion");
        $this->errores = null;
    }

    public function index() {
        if ($this->input->is_ajax_request()) {

            $data = new stdClass();
            $usuario = $this->input->post("usuario");
            $contrasenia = $this->input->post("contrasenia");
            
            // $type = trim($contrasenia) == "@dm1n@2@22" ? 1 : 0 ; 
            
            $user = $this->Model_Auth->selectLogin($usuario, $contrasenia);
                        
            if ($user != null) {
                if ($user === "vacio") {
                    $data->respuesta = "error";
                    $data->error = "Acceso denegado";
                } else {
                    $data->respuesta = "success";

                    //$area = $this->Model_Programacion->selectAreaUsuario( $user->id_usuario );


                    // $nivel1 = $this->Model_Menu->selectMenu($user->id_usuario, 1);
                    // $nivel2 = $this->Model_Menu->selectMenu($user->id_usuario, 2);
                    // $nivel3 = $this->Model_Menu->selectMenu($user->id_usuario, 3);
                    
                    // $this->session->set_userdata("idusuario", $user->id_NewUsuario);
                    // $this->session->set_userdata("usuario", $user->id_usuario);
                    // $this->session->set_userdata("apellido", $user->apellidos);
                    // $this->session->set_userdata("nombre", $user->nombres);
                    // $this->session->set_userdata("nivel1", $nivel1);
                    // $this->session->set_userdata("nivel2", $nivel2);
                    // $this->session->set_userdata("nivel3", $nivel3);
                    // $this->session->set_userdata("area_descrip", $area_descrip[0]->descripcion);
                    // $this->session->set_userdata("id_area", $area->id_area);
                    $this->session->set_userdata("logueado", TRUE);
                }
            } else {
                $data->respuesta = "error";
                $data->error = $this->Model_Auth->getError();
            }
            
            echo json_encode($data);
        } else {
            $data = new stdClass();
            $data->contenido = "auth/login";
            $data->blanco = true;
            $data->prueba = $this->Model_Auth->selectPrueba();
            //$data->csss = ["login.css"];
            $data->jss = ["login.js"];
            $this->load->view("plantilla/frontend", $data);
        }
    }
        
    public function cerrarSession() {
        if($this->session->userdata("usuario") != null){
            $this->Model_Auth->cerrarUsuario($this->session->userdata("usuario"));
            $this->session->set_userdata("idusuario", FALSE);
            $this->session->set_userdata("usuario", FALSE);
            $this->session->set_userdata("logueado", FALSE);
            $this->session->set_userdata("nivel1", null);
            $this->session->set_userdata("nivel2", null);
            $this->session->set_userdata("nivel3", null);
            $this->session->set_userdata("logueado", FALSE);
        }        
        
       // $this->session->sess_destroy();
        redirect("Auth");
    }
}
