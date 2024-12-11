<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'dto\DtoUsuario.php';

class Model_Usuario extends CI_Model {

    private $error;

    public function __construct() {
        parent::__construct();
    }

    public function selectUno($idUsuario) {
        $parametros = array();
        $query = "  select u.id_usuario, u.contrasenia, u.apellidos, u.nombres, u.id_area, u.estado, a.descripcion area_descripcion
                    from new_usuarios u left join new_areas a on u.id_area = a.id_area 
                    where u.id_usuario = ?";

        $parametros[] = $idUsuario;

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: selectUnoPorUsuario --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            if (count($result->result()) > 0) {
                return $result->row();
            } else {
                return "vacio";
            }
        } else {
            return null;
        }
    }

    public function selectUsuarios2($usuario,$area,$estado){
        
        $parametros = array();
        $query = "EXEC GEMECESeguridadUsuariosBuscar2 ? , ? , ?";
        $parametros[] = $usuario;
        $parametros[] = $area;
        $parametros[] = $estado;
        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: selectUsuarios2 --- Error: ' . sqlsrv_errors()[0][2];

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

    public function selectUsuarios($usuario,$area,$estado){
        
        $parametros = array();
        $query = "EXEC GEMECESeguridadUsuariosBuscar ? , ? , ?";
        $parametros[] = $usuario;
        $parametros[] = $area;
        $parametros[] = $estado;

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: selectAll --- Error: ' . sqlsrv_errors()[0][2];

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

    public function selectAll() {
        $parametros = array();

        $query = "  select u.id_usuario, u.apellidos, u.nombres, u.id_area, u.estado, a.descripcion area_descripcion
                    from new_usuarios u left join new_areas a on u.id_area = a.id_area
                    order by u.id_usuario ";

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: selectAll --- Error: ' . sqlsrv_errors()[0][2];

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

    public function insert(DtoUsuario $dto) {
        $parametros = array();
        $query = "EXEC JCEUsuariosSIGA ?,?,?,?,?,?,?,?";

        $parametros[] = null;
        $parametros[] = $dto->getIdUsuario();
        $parametros[] = $dto->getContrasenia();
        $parametros[] = $dto->getApellidos();
        $parametros[] = $dto->getNombres();
        $parametros[] = (int) $dto->getIdArea();
        $parametros[] = (int) $dto->getEstado();
        $parametros[] = $this->session->userdata("usuario");

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: insert --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            // if ($this->db->affected_rows() == 0) {
            //     //$this->error = "No se pudo Registrar el usuario";
            //     return null;
            // }
            return true;
        } else {
            return null;
        }
    }

    public function update(DtoUsuario $dto) {
        $parametros = array();
        $query = "UPDATE new_usuarios
                    SET apellidos = ?,
                    nombres       = ?,
                    id_area       = ?,
                    estado        = ?  
                    WHERE id_usuario = ?";

        $parametros[] = $dto->getApellidos();
        $parametros[] = $dto->getNombres();
        $parametros[] = (int) $dto->getIdArea();
        $parametros[] = (int) $dto->getEstado();
        $parametros[] = $dto->getIdUsuario();

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: update --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            if ($this->db->affected_rows() == 0) {
                $this->error = "No se pudo Actualizar los datos del usuario";
                return null;
            }
            return true;
        } else {
            return null;
        }
    }

    public function updateContrasenia($idUsuario, $contrasenia) {
        $parametros = array();
        $query = "  update new_usuarios 
                    set contrasenia = EncryptByPassPhrasE(?,?)  
                    where id_usuario = ? ";

        $parametros[] = $contrasenia;
        $parametros[] = $contrasenia;
        $parametros[] = $idUsuario;

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: updateContrasenia --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            if ($this->db->affected_rows() == 0) {
                $this->error = "No se pudo Actualizar la contraseña";
                return null;
            }
            return true;
        } else {
            return null;
        }
    }

    public function updateEstado($idUsuario, $estado) {
        $parametros = array();
        $query = "  update new_usuarios 
                    set estado = ? 
                    where id_usuario = ? ";

        $parametros[] = $estado;
        $parametros[] = $idUsuario;

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: updateEstado --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            if ($this->db->affected_rows() == 0) {
                $this->error = "No se pudo Actualizar el estado";
                return null;
            }
            return true;
        } else {
            return null;
        }
    }

    public function generarUsuariosIntranet($anioProg, $mesProg, $tipoUsuario) {
        $parametros = array();
        $query = "";

        if ($tipoUsuario == 2) {
            $query = " EXEC new_int_usp_importar_docentes ?, ? ";
        }
        if ($tipoUsuario == 3) {
            $query = " EXEC new_int_usp_importar_alumnos ?, ? ";
        }
        
        if($query == ""){
            $this->error = "El Tipo de Usuario no es valido";
            return null;
        }
        
        $parametros[] = $anioProg;
        $parametros[] = $mesProg;

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: generarUsuariosIntranet --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            return true;
        } else {
            return null;
        }
    }

    /**
     * Author: Deyvi Pajuelo
     * Fecha: 23/10/2021
     */
    public function getPermisosUsuario(String $idUsuario)
    {
        $parametros = array();
        $query = "select id_menu from new_menus_permisos where id_usuario = ? order by id_menu";
        
        $parametros[] = $idUsuario;

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: generarUsuariosIntranet --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            return $result->result();
        } else {
            return null;
        }

    }

    public function searchUsers(String $search)
    {
        $query = "exec DPESearch_usuarios ?";

        $result = $this->db->query($query, $search)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Usuario --- Metodo: generarUsuariosIntranet --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            return $result->result();
        } else {
            return null;
        }

    }

    public function obtenerIdAreaByIdNewUsuario($idNewUsuario) {
        $parametros = array();
        $query = "  SELECT id_area FROM new_usuarios
                    where id_NewUsuario = ?";

        $parametros[] = $idNewUsuario;

        $result = $this->db->query($query, $parametros)
                or $this->error = strftime("%d/%m/%Y  %H:%M:%S") . ' Model: Model_Usuario --- Metodo: obtenerIdAreaByIdNewUsuario --- Error: ' . sqlsrv_errors()[0][2];

        if (!isset($this->error)) {
            if (count($result->result()) > 0) {
                return $result->row();
            } else {
                return "vacio";
            }
        } else {
            return null;
        }
    }

    public function getError() {
        return $this->error;
    }

}
