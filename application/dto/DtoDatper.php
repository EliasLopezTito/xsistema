<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DtoDatper{
    private $email;
    private $cod_emp;
    
    public function __construct() {
        
    }
    
    public function setCodEmp($cod_emp) {
        $this->cod_emp = $cod_emp;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    //gets

    public function getCodEmp() {
        return $this->cod_emp;
    }

    public function getEmail() {
        return $this->email;
    }
    
}
