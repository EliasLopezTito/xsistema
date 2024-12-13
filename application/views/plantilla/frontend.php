<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$this->load->view('plantilla/frontend/head');
if($blanco == false){    
    $this->load->view('plantilla/frontend/header');
    $this->load->view('plantilla/frontend/menu');
}
$this->load->view('contenido/'.$contenido);
$this->load->view('plantilla/frontend/footer');
