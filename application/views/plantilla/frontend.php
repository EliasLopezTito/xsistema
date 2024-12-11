<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/*
if($blanco == false){    
    $this->load->view('plantilla/frontend/head');
    $this->load->view('plantilla/frontend/header');
}else{
    $this->load->view('plantilla/frontend/head_blanco');
}
$this->load->view('contenido/'.$contenido);
$this->load->view('plantilla/frontend/footer');
*/

$this->load->view('plantilla/frontend/head');
if($blanco == false){    
    $this->load->view('plantilla/frontend/header');
    $this->load->view('plantilla/frontend/menu');
}
$this->load->view('contenido/'.$contenido);
$this->load->view('plantilla/frontend/footer');
