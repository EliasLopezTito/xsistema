<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Model_Menu extends CI_Model {
    
    private $error;

    public function __construct() {
        parent::__construct();
    } 
    
    public function selectMenu($usuario, $nivel) {
        $parametros = array();        
        $query = "  select me.id_menu, me.descripcion, me.icono, me.href, me.nivel, me.padre, me.orden 
                    from new_menus_permisos mp inner join new_menus me on mp.id_menu = me.id_menu
                    where id_usuario = ? and me.nivel = ? 
                    order by me.orden ";
        
        $parametros[] = $usuario;
        $parametros[] = (int) $nivel;
        
        $result = $this->db->query($query, $parametros)
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

    public function selectMenusCabeza($id_menu){

        $parametros = array();
        $query = 'EXEC JCESIGAMenu01 ?';

        $parametros[] = (int)$id_menu;

        $result = $this->db->query($query, $parametros)
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

    public function selectMenus($nivel){
        $parametros = array();
        $query = 'SELECT id_menu, descripcion, padre FROM new_menus WHERE nivel = ? ORDER BY padre, orden';

        $parametros[] = (int)$nivel;

        $result = $this->db->query($query, $parametros)
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

    public function updatePermisos($newPermisos, String $id_usuario){

        $query = 'select id_menu from new_menus';

        $allDB = $this->db->query($query)
            or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Menu --- Metodo: selectNivel1 --- Error: ' . sqlsrv_errors()[0][2];

        $query = 'select * from new_menus_permisos where id_usuario = ?';

        $oldDB = $this->db->query($query, $id_usuario)
            or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Menu --- Metodo: selectNivel1 --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error) && count($allDB->result()) > 0) {

            if ($newPermisos !== null)
            {
                $allPermisos = array_map(function($value){
                    return $value->id_menu;
                }, $allDB->result());
    
                $oldPermisos = array_map(function($value){
                    return $value->id_menu;
                }, $oldDB->result());
                
                foreach ($allPermisos as $key => $value) {
                    if (in_array($value, $newPermisos)) {
                        if (!in_array($value, $oldPermisos)) {
                            $parametros = array();
                            $query = 'insert into new_menus_permisos(id_menu, id_usuario) values(?,?)';

                            $parametros[] = $value;
                            $parametros[] = $id_usuario;
                            $this->db->query($query, $parametros)
                                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Menu --- Metodo: Insertar nuevo --- Error: ' . sqlsrv_errors()[0][2];
                            // var_dump('insertar '. $value);
                        }
                    } else{
                        if (in_array($value, $oldPermisos)) {
                            $parametros = array();
                            $query = 'delete from new_menus_permisos where id_menu = ? and id_usuario = ?';

                            $parametros[] = $value;
                            $parametros[] = $id_usuario;
                            $this->db->query($query, $parametros)
                                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Menu --- Metodo: Eliminar menu --- Error: ' . sqlsrv_errors()[0][2];
                            // var_dump('Eliminar '.$value);
                        }
                    }
                }
            } else {
                $query = 'delete from new_menus_permisos where id_usuario = ?';

                $this->db->query($query, $id_usuario)
                                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Menu --- Metodo: Eliminar todo --- Error: ' . sqlsrv_errors()[0][2];
            }

            // return !isset($this->error) ? 'success' : 'error';
            if (!isset($this->error)) {
                return 'success';
            } else {
                return 'error';
            }

        } else {
            return null;
        }
    }
    
    public function getError() {
        return $this->error;
    }
}
