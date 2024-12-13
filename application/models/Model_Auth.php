<?php
defined('BASEPATH') OR exit('No direct script access allowed');    

class Model_Auth extends CI_Model{
    private $error;
        
    public function __construct(){
        parent::__construct();
    }

    public function selectPrueba()
    {

        $query = "SELECT * FROM menus";
        
        $result = $this->db->query($query)
        or $this->error = strftime("%d/%m/%Y  %H:%M:%S").' Model: Auth --- Metodo: selectUno --- Error: '.sqlsrv_errors()[0][2];
        
        if(!isset($this->error)){
            if(count($result->result())>0){
                return $result->result();
            }else{
                return "vacio";
            }
        }else{
            return null;
        }

    }

    public function selectMenu($usuario, $nivel) {
        $parametros = array();        
        $query = "  select me.id_menu, me.descripcion, me.icono, me.href, me.nivel, me.padre
                    from menus me
                    where me.nivel = '".$nivel."' ";
        
        // $parametros[] = $usuario;
        // $parametros[] = (int) $nivel;
        
        $result = $this->db->query($query)
            or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Menu --- Metodo: selectNivel1 --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            if (count($result->result()) > 0) {
                return $result->result();
            } else {
                return "vacio";
            }
        } else {
            return null;
        }
    }
        
    public function selectLogin($usuario,$contrasenia){
        
        // $consulta = $type == 1 ? "" : "and cast(DecryptByPassPhrasE(?, contrasenia) as varchar(200)) = ?";
        
        
        $parametros = array();
        $query = "  select * 
                    from tblusuarios 
                    where login = '".$usuario."' and password = '".$contrasenia."' and estado = 1";
        
        $parametros[] = $usuario;
        $parametros[] = $contrasenia;

        $result = $this->db->query($query)
        or $this->error = strftime("%d/%m/%Y  %H:%M:%S").' Model: Auth --- Metodo: selectUno --- Error: '.sqlsrv_errors()[0][2];
        
        if(!isset($this->error)){
            if(count($result->result())>0){
                //$this->db->query("UPDATE new_usuarios set conectado = '1', Fecharegistro = GETDATE() where id_usuario = ?", $usuario);
                return $result->row();
            }else{
                return "vacio";
            }
        }else{
            return null;
        }
    }

    public function selectUsuario(String $cod_usuario)
    {

        $query = "select id_usuario, id_area from new_usuarios where id_usuario = ?";
        
        $result = $this->db->query($query, $cod_usuario)
        or $this->error = strftime("%d/%m/%Y  %H:%M:%S").' Model: Auth --- Metodo: selectUno --- Error: '.sqlsrv_errors()[0][2];
        
        if(!isset($this->error)){
            if(count($result->result())>0){
                return $result->row();
            }else{
                return "vacio";
            }
        }else{
            return null;
        }

    }

    public function cerrarUsuario(String $cod_usuario)
    {

        $query = "UPDATE new_usuarios set conectado = '0', FechaConectado = GETDATE() where id_usuario = ?";
        
        $result = $this->db->query($query, $cod_usuario)
        or $this->error = strftime("%d/%m/%Y  %H:%M:%S").' Model: Auth --- Metodo: selectUno --- Error: '.sqlsrv_errors()[0][2];
        
        if(!isset($this->error)){
                return true;
        }else{
            return null;
        }

    }
    
    public function getError(){
        return $this->error;
    }
}

