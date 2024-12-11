<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$this->load->view('plantilla/frontend/head');
$this->load->view('plantilla/frontend/header');
$this->load->view('contenido/'.$contenido);
$this->load->view('plantilla/frontend/footer');


