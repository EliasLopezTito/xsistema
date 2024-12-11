<?php

class Reporte extends CI_Controller
{
    public function __construct() {
        parent::__construct();
        $this->load->model('Model_Reporte');
        $this->load->model('Model_Documento');
        $this->load->library('Pdf');                
        $this->load->helper('Exportar');
    }
    
    public function historicoDelLector(){
        $lector = $this->session->userdata('usu_username');
        $prestamos = $this->Model_Reporte->historicoPorLector($lector,'01/01/1900','31/12/9000');
        $data = new stdClass();
        $data->titulo = 'Biblioteca - UAL';
        $data->opcion='reporte';
        $data->subOpcion='';
        $data->contenido = 'reporte/historicodellector';
        $data->prestamos = $prestamos;
        $this->load->view('frontend',$data);
    }
    public function historicoPorLector(){
        if(isset($_SESSION)){
            if($this->input->is_ajax_request()){
        $lector = $this->input->post('lector');
                $fechaInicio = $this->input->post('fechainicio');
                $fechaFin = $this->input->post('fechafin');
                $prestamos = $this->Model_Reporte->historicoPorLector($lector,$fechaInicio,$fechaFin);
                
                $div='';
                if(count($prestamos)>0){
                    foreach($prestamos as $prestamo){
                        break;
                    }
                    $div .= '<div class="form-group col-sm-12 col-md-12 col-lg-12 table-responsive">';
                    $div .= '<table class="table table-sm table-condensed table-striped table-hover">';
                    $div .= '    <tr>';
                    $div .= '        <td style="width:100px;"><b>LECTOR: </b></td>';
                    $div .= '        <td colspan="3">'.$prestamo->NOMBRE_LECTOR.'</td>';
                    $div .= '    </tr>';                    
                    $div .= '    <tr>';
                    $div .= '        <td><b>TIPO USUARIO: </b></td>';
                    $div .= '        <td style="width: 220px;">'.$prestamo->TIPO_USUARIO_DES.'</td>';
                    $div .= '        <td style="width: 75px;"><b>';
                    if($prestamo->CARRERA){
                        $div .= 'CARRERA: ';
                    }                    
                    $div .= '</b></td>';
                    $div .= '        <td>'.$prestamo->CARRERA.'</td>';                    
                    $div .= '</td>';
                    $div .= '    </tr>';
                    $div .= '</table>';
                    $div .= '</div>';
                }
                $div .= '<table class="table table-sm table-condensed table-striped table-hover">';
                $div .= '<thead><tr>';
                $div .= '<th style="width: 10%">Material</th>';
                $div .= '<th style="width: 15%">Clasificación</th>';
                $div .= '<th style="width: 50%">Título</th>';
                $div .= '<th style="width: 8%; text-align: center;">Fecha Prestamo</th>';
                $div .= '<th style="width: 8%; text-align: center;">Fecha Devolución</th>';
                $div .= '<th style="width: 8%; text-align: center;">Días Retraso</th>';
                $div .= '</tr></thead>';
                $div .= '<tbody>';
                reset($prestamos);
                foreach($prestamos as $prestamo){
                    if($prestamo->DIAS_RETRASO==0){$prestamo->DIAS_RETRASO='';}
                    $div .= '<tr>';
                    $div .= '<td>'.$prestamo->MATERIAL.'</td>';
                    $div .= '<td>'.$prestamo->CLASIFICACION.'</td>';
                    $div .= '<td>'.$prestamo->TITULO.'</td>';
                    $div .= '<td style="text-align: center;">'.$prestamo->FECHA_PRESTAMO.'</td>';
                    $div .= '<td style="text-align: center;">'.$prestamo->FECHA_REAL_DEVOLUCION.'</td>';
                    $div .= '<td style="text-align: center;">'.$prestamo->DIAS_RETRASO.'</td>';
                    $div .= '</tr>';
                }
                $div .= '</tbody>';
                $div .= '</table>';
                $data = array(
                    'respuesta'=>'success',
                    'div' => $div
                );
                echo json_encode($data);
            }else{
                $data = new stdClass();
                $data->titulo = 'Biblioteca - UAL';
                $data->opcion='Mantenimiento';
                $data->subOpcion='Edicion';
                $data->contenido = 'reporte/historicoporlector';
                $data->prestamos = '';
                $this->load->view('frontend',$data);
                }
        }else{
            redirect(base_url());
        }
    }
    public function historicoPorClasificacion(){
        if(isset($_SESSION)){
            if($this->input->is_ajax_request()){
        $clasificacion = $this->input->post('clasificacion');
                $fechaInicio = $this->input->post('fechainicio');
                $fechaFin = $this->input->post('fechafin');
                $prestamos = $this->Model_Reporte->historicoPorClasificacion($clasificacion,$fechaInicio,$fechaFin);
                $div='';
                if(count($prestamos)>0){
                    foreach($prestamos as $prestamo){
                        break;
                    }
                    $div .= '<div style="padding-left: 5px; padding-top: 7px; padding-bottom: 7px; font-family:calibri; font-size=13px; background-color: #D0D0D0;">';
                    $div .= '<table width=100%>';
                    $div .= '    <tr>';
                    $div .= '        <td style="width:80px; vertical-align: top;"><b>TITULO: </b></td>';
                    $div .= '        <td colspan="3">'.$prestamo->TITULO.'</td>';
                    $div .= '    </tr>';                    
                    $div .= '    <tr>';
                    $div .= '        <td><b>MATERIAL: </b></td>';
                    $div .= '        <td>'.$prestamo->MATERIAL.'</td>';
                    /*$div .= '        <td style="width: 75px;"><b>';
                    if($prestamo->CARRERA){
                        $div .= 'CARRERA: ';
                    }                    
                    $div .= '</b></td>';
                    $div .= '        <td>'.$prestamo->CARRERA.'</td>';                    
                    $div .= '</td>';*/
                    $div .= '    </tr>';
                    $div .= '</table>';
                    $div .= '</div>';
                }
                $div .= '<table class="table table-sm table-bordered table-condensed" style="width: 100%; font-family: calibri; font-size: 12px;">';
                $div .= '<thead><tr>';
                $div .= '<th style="width: 10%">TIPO</th>';
                $div .= '<th style="width: 10%">LECTOR</th>';
                $div .= '<th style="width: 40%">NOMBRE LECTOR</th>';
                $div .= '<th style="width: 15%">CARRERA</th>';
                $div .= '<th style="width: 8%; text-align:center;">FECHA PRESTAMO</th>';
                $div .= '<th style="width: 8%; text-align:center;">FECHA DEVOLUCION</th>';
                $div .= '<th style="width: 8%; text-align:center;">DIAS RETRASO</th>';
                $div .= '</tr></thead>';
                $div .= '<tbody>';
                reset($prestamos);
                foreach($prestamos as $prestamo){
                    if($prestamo->DIAS_RETRASO==0){$prestamo->DIAS_RETRASO='';}
                    $div .= '<tr>';
                    $div .= '<td>'.$prestamo->TIPO_USUARIO_DES.'</td>';
                    $div .= '<td>'.$prestamo->LECTOR.'</td>';
                    $div .= '<td>'.$prestamo->NOMBRE_LECTOR.'</td>';
                    $div .= '<td>'.$prestamo->CARRERA.'</td>';
                    $div .= '<td style="text-align:center;">'.$prestamo->FECHA_PRESTAMO.'</td>';
                    $div .= '<td style="text-align:center;">'.$prestamo->FECHA_REAL_DEVOLUCION.'</td>';
                    $div .= '<td style="text-align:center;">'.$prestamo->DIAS_RETRASO.'</td>';
                    $div .= '</tr>';
                }
                $div .= '</tbody>';
                $div .= '</table>';
                $data = array(
                    'respuesta'=>'success',
                    'div' => $div
                );
                echo json_encode($data);
            }else{
                $data = new stdClass();
                $data->titulo = 'Biblioteca - UAL';
                $data->opcion='Mantenimiento';
                $data->subOpcion='Edicion';
                $data->contenido = 'reporte/historicoporclasificacion';
                $data->prestamos = '';
                $this->load->view('frontend',$data);
                }
        }else{
            redirect(base_url());
        }
    }
    
    public function prestamosVencidos(){
        if(isset($_SESSION)){
            if($this->input->is_ajax_request()){
        $fechaInicio = $this->input->post('fechainicio');
                $fechaFin = $this->input->post('fechafin');                
                $prestamos = $this->Model_Reporte->prestamosVencidos($fechaInicio,$fechaFin);                
                $div='';                
                
                $div .= '<table class="table table-sm table-bordered table-condensed" style="width: 100%; font-family: calibri; font-size: 12px;">';
                $div .= '<thead><tr>';
                $div .= '<th style="width: 4%; text-align: center;">N°</th>';
                $div .= '<th style="width: 80%">DATOS DEL LECTOR Y MATERIAL PRESTAMO</th>';
                $div .= '<th style="width: 9%; text-align:center;">PRESTADO</th>';
                $div .= '<th style="width: 7%; text-align:center;">RETRASO</th>';
                $div .= '</tr></thead>';
                $div .= '<tbody>';
                $i=1;
                foreach($prestamos as $prestamo){
                    $div .= '<tr>';
                    $div .= '<td style="text-align:center;">'.$i++.'</td>';
                    $div .= '<td>';
                    $div .= '<table>';
                    $div .= '<tr><td style="width:95px;">LECTOR</td><td style="width:20px;">:</td><td>'.$prestamo->NOMBRE_LECTOR.'</td></tr>';
                    $div .= '<tr><td>USUARIO</td><td>:</td><td>'.$prestamo->LECTOR.' / '.$prestamo->TIPO_USUARIO_DES.'</td></tr>';
                    if($prestamo->CARRERA){
                        $div .= '<tr><td>CARRERA</td><td>:</td><td>'.$prestamo->CARRERA.'</td></tr>';
                    }
                    if($prestamo->TELEFONO){
                        $div .= '<tr><td>TELEFONO</td><td>:</td><td>'.$prestamo->TELEFONO.'</td></tr>';
                    }
                    $div .= '<tr><td style="vertical-align: top;">TITULO</td><td>:</td><td>'.$prestamo->TITULO.'</td></tr>';
                    $div .= '<tr><td>CLASIFICACION</td><td>:</td><td>'.$prestamo->CLASIFICACION.'</td></tr>';
                    $div .= '<tr><td>MATERIAL</td><td>:</td><td>'.$prestamo->MATERIAL.'</td></tr>';
                    $div .= '</table>';
                    $div .= '</td>';                                       
                    
                    $div .= '<td style="text-align:center;">'.$prestamo->FECHA_PRESTAMO.'</td>';                    
                    $div .= '<td style="text-align:center;">'.$prestamo->DIAS_RETRASO.'</td>';
                    $div .= '</tr>';                    
                }
                $div .= '</tbody>';
                $div .= '</table>';
                $data = array(
                    'respuesta'=>'success',
                    'div' => $div
                );
                echo json_encode($data);
            }else{
                $data = new stdClass();
                $data->titulo = 'Biblioteca - UAL';
                $data->opcion='Mantenimiento';
                $data->subOpcion='Edicion';
                $data->contenido = 'reporte/prestamosvencidos';
                $data->prestamos = '';
                $this->load->view('frontend',$data);
                }
        }else{
            redirect(base_url());
        }
    }
    public function prestamosPorClasificacion(){
        if(isset($_SESSION)){
            if($this->input->is_ajax_request()){
                $carrera = $this->input->post('carrera');
                $fechaInicio = $this->input->post('fechainicio');
                $fechaFin = $this->input->post('fechafin');                                
                $prestamos = $this->Model_Reporte->prestamosPorClasificacion($carrera,$fechaInicio,$fechaFin);                
                $bandera = '';
                
                $div='';                                
                $div .= '<table class="table table-sm table-bordered table-condensed" style="width: 100%; font-family: calibri; font-size: 12px;">';
                $div .= '<thead><tr>';                
                $div .= '<th style="width: 5%; text-align: center">N°</th>';
                $div .= '<th style="width: 85%">DATOS DEL MATERIAL</th>';                                
                $div .= '<th style="width: 10%; text-align: center;">PRESTAMOS</th>';
                $div .= '</tr></thead>';
                $div .= '<tbody>';         
                $nro = 1;
                foreach($prestamos as $prestamo){
                    $div .= '<tr>';                    
                    $div .= '<td style="text-align: center;">'.$nro.'</td>';
                    $div .= '<td><table>';
                    $div .= '<tr><td style="width:95px; vertical-align: top;">TITULO</td><td style="width:15px; vertical-align: top;">:</td><td>'.$prestamo->TITULO.'</td><tr>';
                    $div .= '<tr><td>EDITORIAL</td><td>:</td><td>'.$prestamo->EDITORIAL.'</td><tr>';
                    $div .= '<tr><td>CLASIFICACION</td><td>:</td><td>'.$prestamo->CLASIFICACION.'</td><tr>';
                    $div .= '<tr><td>MATERIAL</td><td>:</td><td>'.$prestamo->MATERIAL.'</td><tr>';
                    $div .= '</table></td>';
                    $div .= '<td style="text-align: center;">'.$prestamo->NRO_PRESTAMOS.'</td>';
                    $div .= '</tr>';
                    $nro +=1;
                }
                $div .= '</tbody>';
                $div .= '</table>';
                $data = array(
                    'respuesta'=>'success',
                    'div' => $div
                );
                echo json_encode($data);
            }else{
                $carreras = $this->Model_Reporte->devolverCarreras();
                $data = new stdClass();
                $data->titulo = 'Biblioteca - UAL';
                $data->opcion='Mantenimiento';
                $data->subOpcion='Edicion';
                $data->contenido = 'reporte/prestamosporclasificacion';
                $data->carreras = $carreras;
                $this->load->view('frontend',$data);
                }
        }else{
            redirect(base_url());
        }
    }
    public function prestamosPorTipoUsuario(){
        if(isset($_SESSION)){
            if($this->input->is_ajax_request()){
        $fechaInicio = $this->input->post('fechainicio');
                $fechaFin = $this->input->post('fechafin');                
                $prestamos = $this->Model_Reporte->prestamosPorTipoUsuario($fechaInicio,$fechaFin);                
                $div='';                
                
                $div .= '<table class="table table-sm table-bordered table-condensed" style="width: 40%; font-family: calibri; font-size: 12px;">';
                $div .= '<thead><tr>';
                $div .= '<th style="width: 80%">TIPO DE USUARIO</th>';                
                $div .= '<th style="width: 20%">PRESTAMOS</th>';                                
                $div .= '</tr></thead>';
                $div .= '<tbody>';                
                foreach($prestamos as $prestamo){
                    $div .= '<tr>';
                    $div .= '<td>'.$prestamo->TIPO_USUARIO.'</td>';
                    $div .= '<td align="center">'.$prestamo->PRESTAMOS.'</td>';                    
                    $div .= '</tr>';
                }
                $div .= '</tbody>';
                $div .= '</table>';
                $data = array(
                    'respuesta'=>'success',
                    'div' => $div
                );
                echo json_encode($data);
            }else{
                $data = new stdClass();
                $data->titulo = 'Biblioteca - UAL';
                $data->opcion='Mantenimiento';
                $data->subOpcion='Edicion';
                $data->contenido = 'reporte/prestamosportipousuario';
                $data->prestamos = '';
                $this->load->view('frontend',$data);
                }
        }else{
            redirect(base_url());
        }
    }
    public function prestamosPorCarrera(){
        if(isset($_SESSION)){
            if($this->input->is_ajax_request()){
        $fechaInicio = $this->input->post('fechainicio');
                $fechaFin = $this->input->post('fechafin');                
                $prestamos = $this->Model_Reporte->prestamosPorCarrera($fechaInicio,$fechaFin);                
                $div='';                
                
                $div .= '<table class="table table-sm table-bordered table-condensed" style="width: 40%; font-family: calibri; font-size: 12px;">';
                $div .= '<thead><tr>';
                $div .= '<th style="width: 80%">CARRERA</th>';                
                $div .= '<th style="width: 20%" align="center">PRESTAMOS</th>';                                
                $div .= '</tr></thead>';
                $div .= '<tbody>';                
                foreach($prestamos as $prestamo){
                    $div .= '<tr>';
                    $div .= '<td>'.$prestamo->CARRERA.'</td>';
                    $div .= '<td align="center">'.$prestamo->PRESTAMOS.'</td>';                    
                    $div .= '</tr>';
                }
                $div .= '</tbody>';
                $div .= '</table>';
                $data = array(
                    'respuesta'=>'success',
                    'div' => $div
                );
                echo json_encode($data);
            }else{
                $data = new stdClass();
                $data->titulo = 'Biblioteca - UAL';
                $data->opcion='Mantenimiento';
                $data->subOpcion='Edicion';
                $data->contenido = 'reporte/prestamosporcarrera';
                $data->prestamos = '';
                $this->load->view('frontend',$data);
            }
        }else{
            redirect(base_url());
        }
    }        
    public function prestamosDevueltosEnMalEstado(){
        if(isset($_SESSION)){
            if($this->input->is_ajax_request()){        
                $fechaInicio = $this->input->post('fechainicio');
                $fechaFin = $this->input->post('fechafin');                
                if($this->validarFecha($fechaInicio) && $this->validarFecha($fechaFin)){
                    $prestamos = $this->Model_Reporte->prestamosDevueltosEnMalEstado($fechaInicio,$fechaFin);                
                    $div='';                

                    $div .= '<table class="table table-sm table-bordered table-condensed" style="width: 100%; font-family: calibri; font-size: 12px;">';
                    $div .= '<thead><tr class="cabecera-tabla">';
                    $div .= '<th style="width: 4%; vertical-align: middle; text-align:center;">N°</th>';                
                    $div .= '<th style="width: 80%; vertical-align: middle;">DATOS DEL LECTOR Y DEL MATERIAL PRESTADO</th>';                
                    $div .= '<th style="width: 8%">PRESTADO</th>';                
                    $div .= '<th style="width: 8%">DEVUELTO</th>';
                    $div .= '</tr></thead>';
                    $div .= '<tbody>';      
                    $i=1;                    
                    foreach($prestamos as $prestamo){                                                
                        $div .= '<tr>';
                        $div .= '<td style="text-align: center;">'.$i++.'</td>';
                        $div .= '<td>';
                        $div .= '<table>';
                        $div .= '<tr><td style="width:75px; vertical-align: top;">LECTOR</td><td style="width: 10px;">:</td><td>'.$prestamo->NOMBRE_LECTOR.'</td></tr>';
                        $div .= '<tr><td>USUARIO</td><td style="width: 10px;">:</td><td>'.$prestamo->LECTOR.' / '.$prestamo->TIPO_USUARIO_DES.'</td></tr>';                        
                        if($prestamo->CARRERA){
                            $div .= '<tr><td style="vertical-align: top;">CARRERA</td><td style="width: 10px;">:</td><td>'.$prestamo->CARRERA.'</td></tr>';
                        }
                        if($prestamo->TELEFONO){
                            $div .= '<tr><td style="vertical-align: top;">TELEFONO</td><td style="width: 10px;">:</td><td>'.$prestamo->TELEFONO.'</td></tr>';
                        }                  
                                                
                        $div .= '<tr><td style="vertical-align: top;">TITULO</td><td style="width: 10px; vertical-align: top;">:</td><td>'.$prestamo->TITULO.'</td></tr>';
                        $div .= '<tr><td style="vertical-align: top;">CLASIFICACION</td><td style="width: 10px;">:</td><td>'.$prestamo->CLASIFICACION.'</td></tr>';
                        $div .= '<tr><td style="width:95px;">MATERIAL</td><td style="width: 10px;">:</td><td>'.$prestamo->MATERIAL.'</td></tr>';
                        
                        $div .= '<tr style="color:red;"><td style="width:95px; ">EST. DEVUELTO</td><td style="width: 10px;">:</td><td><b>'.$prestamo->ESTADO_DEVOLUCION_DES.'</b></td></tr>';
                        $div .= '<tr style="color:red;"><td style="width:95px; ">OBSERVACION</td><td style="width: 10px; vertical-align: top;">:</td><td style="color:red;"><b>'.strtoupper($prestamo->OBSERVACION).'</b></td></tr>';
                        
                        $div .= '</table>';
                        $div .= '</td>';                        

                        $div .= '<td>'.$prestamo->FECHA_PRESTAMO.'</td>';                    
                        $div .= '<td>'.$prestamo->FECHA_DEVOLUCION.'</td>';
                        $div .= '</tr>';                        
                    }
                    $div .= '</tbody>';
                    $div .= '</table>';
                    $data = array(
                        'respuesta'=>'success',
                        'div' => $div
                    );
                }else{
                    $data = array(
                        'respuesta'=>'error',
                        'error' => 'Debe ingresar o seleccionar un rango de fechas valido'
                    );
                }                
                echo json_encode($data);
            }else{
                $data = new stdClass();
                $data->titulo = 'Biblioteca - UAL';
                $data->opcion='Mantenimiento';
                $data->subOpcion='Edicion';
                $data->contenido = 'reporte/prestamosdevueltosenmalestado';
                $data->prestamos = '';
                $this->load->view('frontend',$data);
                }
        }else{
            redirect(base_url());
        }
    }
    public function listarCatalogo(){
        $documentos = $this->Model_Documento->buscar('','','','','');
        $data = new stdClass();
        $data->titulo = 'Biblioteca - UAL';
        $data->opcion='Catalago';
        $data->subOpcion='Nuevo';
        $data->contenido = 'reporte/listarcatalogo';
        $data->documentos = $documentos;
        $this->load->view('frontend',$data);
    }
    public function pdfHistoricoPorLector($lector,$fechaInicio,$fechaFin){
        $fechaInicio = str_replace('_', '/', $fechaInicio);
        $fechaFin = str_replace('_', '/', $fechaFin);
        $prestamos = $this->Model_Reporte->historicoPorLector($lector,$fechaInicio,$fechaFin);
        if(count($prestamos)>0){
            foreach($prestamos as $prestamo){
                break;
            }
        }        
        $this->pdf = new Pdf();
        // Agregamos una página
        $this->pdf->AddPage();
        // Define el alias para el número de página que se imprimirá en el pie
        $this->pdf->AliasNbPages();
        $this->pdf->SetTitle($lector);
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(5);
        
        //$this->pdf->cabeceraHistoricoPorLector('HISTORICO DE PRESTAMOS'); 
        //CABECERA DE PAGINA        
        $this->pdf->Image(base_url('assets/img/logo.png'),10,7,15,12,'','');
        $this->pdf->SetFont('Arial','B',8);
        $this->pdf->Cell(185,5,'BIBLIOTECA - UNIVERSIDAD ARZOBISPO LOAYZA',0,0,'C');
        $this->pdf->Ln(5);
        $this->pdf->Cell(185,5,'HISTORICO DE PRESTAMOS POR LECTOR',0,0,'C');
        $this->pdf->Ln(10);
        $this->pdf->SetFont('Arial','B',6);
        $this->pdf->Cell(13,5,'LECTOR: ',0,0,'L');
        $this->pdf->Cell(100,5,strtoupper($lector),0,0,'L');
        $this->pdf->Cell(10,5,'DESDE: ',0,0,'L');
        $this->pdf->Cell(20,5,$fechaInicio,0,0,'L');
        $this->pdf->Cell(10,5,'HASTA: ',0,0,'L');
        $this->pdf->Cell(15,5,$fechaFin,0,0,'L');
        $this->pdf->Ln(3 );
        $this->pdf->Cell(13,5,'NOMBRE: ',0,0,'L');
        if(isset($prestamo)){
            $this->pdf->Cell(100,5,utf8_decode($prestamo->NOMBRE_LECTOR),0,0,'L');
            if($prestamo->CARRERA){
                $this->pdf->Cell(13,5,'CARRERA: ',0,0,'L');
                $this->pdf->Cell(50,5,utf8_decode($prestamo->CARRERA),0,0,'L');
            }
        }
        $this->pdf->Ln(10 );
        //FIN DE LA CABECERA
        
        $this->pdf->SetFillColor(200,200,200);
        $this->pdf->SetFont('Arial', 'B', 6);
    $this->pdf->Cell(20,7,'MATERIAL','TBLR',0,'C','1');
        $this->pdf->Cell(20,7,'CLASIFICACION','TBR',0,'L','1');
        $this->pdf->Cell(105,7,'TITULO','TBR',0,'L','1');
        $this->pdf->Cell(15,7,'PRESTADO','TBR',0,'C','1');
        $this->pdf->Cell(15,7,'DEVUELTO','TBR',0,'C','1');
        $this->pdf->Cell(13,7,'RETRASO','TBR',0,'C','1');
        $this->pdf->Ln(7);
        $this->pdf->SetFont('Arial', '', 6);
        reset($prestamos);
        
        foreach($prestamos as $prestamo){
            $longitud = strlen(utf8_decode($prestamo->TITULO));        
            if($prestamo->DIAS_RETRASO==0){$prestamo->DIAS_RETRASO='';}
            if($longitud<=77){
                $this->pdf->Cell(20,5,$prestamo->MATERIAL,'LBRT',0,'C','0');
                $this->pdf->Cell(20,5,$prestamo->CLASIFICACION,'LBRT',0,'L','0');
                $this->pdf->Cell(105,5,utf8_decode($prestamo->TITULO),'LBRT',0,'L','0');
                $this->pdf->Cell(15,5,$prestamo->FECHA_PRESTAMO,'LBRT',0,'C','0');
                $this->pdf->Cell(15,5,$prestamo->FECHA_REAL_DEVOLUCION,'LBRT',0,'C','0');
                $this->pdf->Cell(13,5,$prestamo->DIAS_RETRASO,'LBRT',0,'C','0');
            }else{
                if($longitud<=154){
                    $this->pdf->Cell(20,5,$prestamo->MATERIAL,'LRT',0,'C','0');
                    $this->pdf->Cell(20,5,$prestamo->CLASIFICACION,'LRT',0,'L','0');
                    $this->pdf->Cell(105,5,substr(utf8_decode($prestamo->TITULO),0,77),'LRT',0,'L','0');
                    $this->pdf->Cell(15,5,$prestamo->FECHA_PRESTAMO,'LRT',0,'C','0');
                    $this->pdf->Cell(15,5,$prestamo->FECHA_REAL_DEVOLUCION,'LRT',0,'C','0');
                    $this->pdf->Cell(13,5,$prestamo->DIAS_RETRASO,'LRT',0,'C','0');
                    $this->pdf->Ln(3);    
                    $this->pdf->Cell(20,5,'','LBR',0,'C','0');
                    $this->pdf->Cell(20,5,'','LBR',0,'L','0');
                    $this->pdf->Cell(105,5,substr(utf8_decode($prestamo->TITULO),77,77),'LBR',0,'L','0');
                    $this->pdf->Cell(15,5,'','LBR',0,'C','0');
                    $this->pdf->Cell(15,5,'','LBR',0,'C','0');
                    $this->pdf->Cell(13,5,'','LBR',0,'C','0');
                }else{
                    if($longitud<=231){
                        $this->pdf->Cell(20,5,$prestamo->MATERIAL,'LRT',0,'C','0');
                        $this->pdf->Cell(20,5,$prestamo->CLASIFICACION,'LRT',0,'L','0');
                        $this->pdf->Cell(105,5,substr(utf8_decode($prestamo->TITULO),0,77),'LRT',0,'L','0');
                        $this->pdf->Cell(15,5,$prestamo->FECHA_PRESTAMO,'LRT',0,'C','0');
                        $this->pdf->Cell(15,5,$prestamo->FECHA_REAL_DEVOLUCION,'LRT',0,'C','0');
                        $this->pdf->Cell(13,5,$prestamo->DIAS_RETRASO,'LRT',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(20,5,'','LR',0,'C','0');
                        $this->pdf->Cell(20,5,'','LR',0,'L','0');
                        $this->pdf->Cell(105,5,substr(utf8_decode($prestamo->TITULO),77,77),'LR',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(20,5,'','LBR',0,'C','0');
                        $this->pdf->Cell(20,5,'','LBR',0,'L','0');
                        $this->pdf->Cell(105,5,substr(utf8_decode($prestamo->TITULO),154,77),'LBR',0,'L','0');
                        $this->pdf->Cell(15,5,'','LBR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LBR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LBR',0,'C','0');    
                    }else{
                        $this->pdf->Cell(20,5,$prestamo->MATERIAL,'LRT',0,'C','0');
                        $this->pdf->Cell(20,5,$prestamo->CLASIFICACION,'LRT',0,'L','0');
                        $this->pdf->Cell(105,5,substr(utf8_decode($prestamo->TITULO),0,77),'LRT',0,'L','0');
                        $this->pdf->Cell(15,5,$prestamo->FECHA_PRESTAMO,'LRT',0,'C','0');
                        $this->pdf->Cell(15,5,$prestamo->FECHA_REAL_DEVOLUCION,'LRT',0,'C','0');
                        $this->pdf->Cell(13,5,$prestamo->DIAS_RETRASO,'LRT',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(20,5,'','LR',0,'C','0');
                        $this->pdf->Cell(20,5,'','LR',0,'L','0');
                        $this->pdf->Cell(105,5,substr(utf8_decode($prestamo->TITULO),77,77),'LR',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(20,5,'','LR',0,'C','0');
                        $this->pdf->Cell(20,5,'','LR',0,'L','0');
                        $this->pdf->Cell(105,5,substr(utf8_decode($prestamo->TITULO),154,77),'LR',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(20,5,'','LBR',0,'C','0');
                        $this->pdf->Cell(20,5,'','LBR',0,'L','0');
                        $this->pdf->Cell(105,5,substr(utf8_decode($prestamo->TITULO),231,77),'LBR',0,'L','0');
                        $this->pdf->Cell(15,5,'','LBR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LBR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LBR',0,'C','0');    
                    }                    
                }
            }            
            $this->pdf->Ln(5);
        }
        $this->pdf->Output("Historico de prestamos.pdf", 'I');
    }
    
    public function pdfHistoricoPorClasificacion($clasificacion,$fechaInicio,$fechaFin){
        $clasificacion = str_replace('_', '/', $clasificacion);
        $fechaInicio = str_replace('_', '/', $fechaInicio);
        $fechaFin = str_replace('_', '/', $fechaFin);
        $prestamos = $this->Model_Reporte->historicoPorClasificacion($clasificacion,$fechaInicio,$fechaFin);
        if(count($prestamos)>0){
            foreach($prestamos as $prestamo){
                break;
            }     
        }    
        $this->pdf = new Pdf();
        // Agregamos una página
        $this->pdf->AddPage();
        // Define el alias para el número de página que se imprimirá en el pie
        $this->pdf->AliasNbPages();
        $this->pdf->SetTitle($clasificacion);
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(5);

        //$this->pdf->cabeceraHistoricoPorLector('HISTORICO DE PRESTAMOS'); 
        //CABECERA DE PAGINA
        $this->pdf->Image(base_url('assets/img/logo.png'),10,7,15,12,'','');
        $this->pdf->SetFont('Arial','B',8);
        $this->pdf->Cell(185,5,'BIBLIOTECA - UNIVERSIDAD ARZOBISPO LOAYZA',0,0,'C');
        $this->pdf->Ln(5);
        $this->pdf->Cell(185,5,'HISTORICO DE PRESTAMOS POR CODIGO DE CLASIFICACION',0,0,'C');
        $this->pdf->Ln(10);
        $this->pdf->SetFont('Arial','B',6);
        $this->pdf->Cell(15,5,'MATERIAL: ',0,0,'L');
        //$this->pdf->Cell(100,5,strtoupper($lector),0,0,'L');
        if(isset($prestamo)){
            $this->pdf->Cell(40,5,$prestamo->MATERIAL,0,0,'L');
        }else{
            $this->pdf->Cell(40,5,'',0,0,'L');
        }
        $this->pdf->Cell(20,5,'CLASIFICACION: ',0,0,'L');
        $this->pdf->Cell(40,5,$clasificacion,0,0,'L');
        $this->pdf->Cell(10,5,'DESDE: ',0,0,'L');
        $this->pdf->Cell(20,5,$fechaInicio,0,0,'L');
        $this->pdf->Cell(10,5,'HASTA: ',0,0,'L');
        $this->pdf->Cell(15,5,$fechaFin,0,0,'L');
        $this->pdf->Ln(5);
        $this->pdf->Cell(15,5,'TITULO: ',0,0,'L');
        if(isset($prestamo)){
            $longitud = strlen(utf8_decode($prestamo->TITULO));
            if($longitud<=120){
                $this->pdf->Cell(100,5,utf8_decode($prestamo->TITULO),0,0,'L');            
            }else{
                if($longitud<=240){
                    $this->pdf->Cell(100,5,substr(utf8_decode($prestamo->TITULO),0,120),0,0,'L');            
                    $this->pdf->Ln(3 );
                    $this->pdf->Cell(15,5,'',0,0,'L');
                    $this->pdf->Cell(100,5,substr(utf8_decode($prestamo->TITULO),120),0,0,'L');            
                }else{
                    $this->pdf->Cell(100,5,substr(utf8_decode($prestamo->TITULO),0,120),0,0,'L');            
                    $this->pdf->Ln(3 );
                    $this->pdf->Cell(15,5,'',0,0,'L');
                    $this->pdf->Cell(100,5,substr(utf8_decode($prestamo->TITULO),120,120),0,0,'L');            
                    $this->pdf->Ln(3 );
                    $this->pdf->Cell(15,5,'',0,0,'L');
                    $this->pdf->Cell(100,5,substr(utf8_decode($prestamo->TITULO),240),0,0,'L');            
                }
            }
            
        }else{
            $this->pdf->Cell(100,5,'',0,0,'L');            
        }            
        $this->pdf->Ln(10 );
        //FIN DE LA CABECERA

        $this->pdf->SetFillColor(200,200,200);
        $this->pdf->SetFont('Arial', 'B', 6);
        $this->pdf->Cell(25,5,'TIPO','TBLR',0,'C','1');
        $this->pdf->Cell(25,5,'LECTOR','TBR',0,'L','1');
        $this->pdf->Cell(73,5,'NOMBRE DEL LECTOR','TBR',0,'L','1');
        $this->pdf->Cell(25,5,'CARRERA','TBR',0,'C','1');
        $this->pdf->Cell(15,5,'PRESTADO','TBR',0,'C','1');
        $this->pdf->Cell(15,5,'DEVUELTO','TBR',0,'C','1');
        $this->pdf->Cell(13,5,'RETRASO','TBR',0,'C','1');
        $this->pdf->Ln(5);
        $this->pdf->SetFont('Arial', '', 6);
        reset($prestamos);
        foreach($prestamos as $prestamo){
            if($prestamo->DIAS_RETRASO==0){$prestamo->DIAS_RETRASO='';}
            //$this->pdf->Cell(20,5,$prestamo->MATERIAL,'0',0,'C','0');
            $this->pdf->Cell(25,5,$prestamo->TIPO_USUARIO_DES,'LBR',0,'C','0');
            $this->pdf->Cell(25,5,$prestamo->LECTOR,'LBR',0,'L','0');
            $this->pdf->Cell(73,5,utf8_decode($prestamo->NOMBRE_LECTOR),'LBR',0,'L','0');
            $this->pdf->Cell(25,5, utf8_decode(substr($prestamo->CARRERA,0,15)),'LBR',0,'C','0');
            $this->pdf->Cell(15,5,$prestamo->FECHA_PRESTAMO,'LBR',0,'C','0');
            $this->pdf->Cell(15,5,$prestamo->FECHA_REAL_DEVOLUCION,'LBR',0,'C','0');
            $this->pdf->Cell(13,5,$prestamo->DIAS_RETRASO,'LBR',0,'C','0');
            $this->pdf->Ln(5);
        }
        $this->pdf->Output("Historico de prestamos por clasificacion.pdf", 'I');
    }
    
    public function pdfPrestamosPorClasificacion($carrera,$fechaInicio,$fechaFin){                
        $fechaInicio = str_replace('_', '/', $fechaInicio);
        $fechaFin = str_replace('_', '/', $fechaFin);
        $carrera = utf8_decode($carrera);
        if($carrera == 'todo'){$carrera = '';}
        $prestamos = $this->Model_Reporte->prestamosPorClasificacion($carrera,$fechaInicio,$fechaFin);        
        
        $this->pdf = new Pdf();
        // Agregamos una página
        $this->pdf->AddPage();
        // Define el alias para el número de página que se imprimirá en el pie
        $this->pdf->AliasNbPages();
        $this->pdf->SetTitle('Prestamos por clasificacion');
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(5);

        //CABECERA DE PAGINA
        $this->pdf->Image(base_url('assets/img/logo.png'),10,7,15,12,'','');
        $this->pdf->SetFont('Arial','B',8);
        $this->pdf->Cell(185,5,'BIBLIOTECA - UNIVERSIDAD ARZOBISPO LOAYZA',0,0,'C');
        $this->pdf->Ln(5);
        $this->pdf->Cell(185,5,'NUMERO DE PRESTAMOS POR CODIGO DE CLASIFICACION',0,0,'C');
        $this->pdf->Ln(12);
        $this->pdf->SetFont('Arial','B',6);
        
        $this->pdf->Cell(10,5,'DESDE: ',0,0,'L');
        $this->pdf->Cell(20,5,$fechaInicio,0,0,'L');
        $this->pdf->Cell(10,5,'HASTA: ',0,0,'L');
        $this->pdf->Cell(50,5,$fechaFin,0,0,'L');
        if($carrera!=''){
            $this->pdf->Cell(15,5,'CARRERA: ',0,0,'L');
            $this->pdf->Cell(50,5,$carrera,0,0,'L');
        }
        
        $this->pdf->Ln(3);        
        $this->pdf->Ln(5 );
        //FIN DE LA CABECERA
        
        $this->pdf->SetFillColor(200,200,200);
        $this->pdf->SetFont('Arial', 'B', 6);
        $this->pdf->Cell(10,5,utf8_decode('N°'),'TBLR',0,'C','1');
        $this->pdf->Cell(164,5,'DATOS DEL MATERIAL','TBR',0,'L','1');        
        $this->pdf->Cell(17,5,'PRESTAMOS','TBR',0,'C','1');        
        $this->pdf->Ln(5);
        $this->pdf->SetFont('Arial', '', 6);
        $i=1;
        foreach($prestamos as $prestamo){            
            $longitud = strlen(utf8_decode($prestamo->TITULO));            
            if($longitud<=100){
                $this->pdf->Cell(10,5,$i,'LRT',0,'C','0');
                $this->pdf->Cell(20,5,'TITULO','LT',0,'L','0');
                $this->pdf->Cell(4,5,' : ','T',0,'L','0');
                $this->pdf->Cell(140,5,utf8_decode($prestamo->TITULO),'RT',0,'L','0');                
                $this->pdf->Cell(17,5,$prestamo->NRO_PRESTAMOS,'LRT',0,'C','0');
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LR',0,'L','0');            
                $this->pdf->Cell(20,5,'EDITORIAL','L',0,'L','0');                
                $this->pdf->Cell(4,5,' : ','',0,'L','0');
                $this->pdf->Cell(140,5,utf8_decode($prestamo->EDITORIAL),'R',0,'L','0');            
                $this->pdf->Cell(17,5,'','LR',0,'C','0');
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LR',0,'L','0');            
                $this->pdf->Cell(20,5,'CLASIFICACION','L',0,'L','0');                
                $this->pdf->Cell(4,5,' : ','',0,'L','0');
                $this->pdf->Cell(140,5,utf8_decode($prestamo->CLASIFICACION),'R',0,'L','0');            
                $this->pdf->Cell(17,5,'','LR',0,'C','0');
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LBR',0,'BL','0');            
                $this->pdf->Cell(20,5,'MATERIAL','BL',0,'L','0');                
                $this->pdf->Cell(4,5,' : ','B',0,'L','0');
                $this->pdf->Cell(140,5,utf8_decode($prestamo->MATERIAL),'BR',0,'L','0');            
                $this->pdf->Cell(17,5,'','LBR',0,'C','0');
            }else{
                if($longitud<=200){
                    $this->pdf->Cell(10,5,$i,'LRT',0,'C','0');
                    $this->pdf->Cell(20,5,'TITULO','LT',0,'L','0');
                    $this->pdf->Cell(4,5,' : ','T',0,'L','0');
                    $this->pdf->Cell(140,5,substr(utf8_decode($prestamo->TITULO),0,100),'RT',0,'L','0');                
                    $this->pdf->Cell(17,5,$prestamo->NRO_PRESTAMOS,'LRT',0,'C','0');
                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LR',0,'C','0');
                    $this->pdf->Cell(20,5,'','L',0,'L','0');
                    $this->pdf->Cell(4,5,'','',0,'L','0');
                    $this->pdf->Cell(140,5,substr(utf8_decode($prestamo->TITULO),100,100),'R',0,'L','0');                
                    $this->pdf->Cell(17,5,'','LR',0,'C','0');
                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LR',0,'L','0');            
                    $this->pdf->Cell(20,5,'EDITORIAL','L',0,'L','0');                
                    $this->pdf->Cell(4,5,' : ','',0,'L','0');
                    $this->pdf->Cell(140,5,utf8_decode($prestamo->EDITORIAL),'R',0,'L','0');            
                    $this->pdf->Cell(17,5,'','LR',0,'C','0');
                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LR',0,'L','0');            
                    $this->pdf->Cell(20,5,'CLASIFICACION','L',0,'L','0');                
                    $this->pdf->Cell(4,5,' : ','',0,'L','0');
                    $this->pdf->Cell(140,5,utf8_decode($prestamo->CLASIFICACION),'R',0,'L','0');            
                    $this->pdf->Cell(17,5,'','LR',0,'C','0');
                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LBR',0,'BL','0');            
                    $this->pdf->Cell(20,5,'MATERIAL','BL',0,'L','0');                
                    $this->pdf->Cell(4,5,' : ','B',0,'L','0');
                    $this->pdf->Cell(140,5,utf8_decode($prestamo->MATERIAL),'BR',0,'L','0');            
                    $this->pdf->Cell(17,5,'','LBR',0,'C','0');
                }else{
                    if($longitud<=300){
                        $this->pdf->Cell(10,5,$i,'LRT',0,'C','0');
                        $this->pdf->Cell(20,5,'TITULO','LT',0,'L','0');
                        $this->pdf->Cell(4,5,' : ','T',0,'L','0');
                        $this->pdf->Cell(140,5,substr(utf8_decode($prestamo->TITULO),0,100),'RT',0,'L','0');                
                        $this->pdf->Cell(17,5,$prestamo->NRO_PRESTAMOS,'LRT',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(4,5,'','',0,'L','0');
                        $this->pdf->Cell(140,5,substr(utf8_decode($prestamo->TITULO),100,100),'R',0,'L','0');                
                        $this->pdf->Cell(17,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(4,5,'','',0,'L','0');
                        $this->pdf->Cell(140,5,substr(utf8_decode($prestamo->TITULO),200,100),'R',0,'L','0');                
                        $this->pdf->Cell(17,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');            
                        $this->pdf->Cell(20,5,'EDITORIAL','L',0,'L','0');                
                        $this->pdf->Cell(4,5,' : ','',0,'L','0');
                        $this->pdf->Cell(140,5,utf8_decode($prestamo->EDITORIAL),'R',0,'L','0');            
                        $this->pdf->Cell(17,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');            
                        $this->pdf->Cell(20,5,'CLASIFICACION','L',0,'L','0');                
                        $this->pdf->Cell(4,5,' : ','',0,'L','0');
                        $this->pdf->Cell(140,5,utf8_decode($prestamo->CLASIFICACION),'R',0,'L','0');            
                        $this->pdf->Cell(17,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LBR',0,'BL','0');            
                        $this->pdf->Cell(20,5,'MATERIAL','BL',0,'L','0');                
                        $this->pdf->Cell(4,5,' : ','B',0,'L','0');
                        $this->pdf->Cell(140,5,utf8_decode($prestamo->MATERIAL),'BR',0,'L','0');            
                        $this->pdf->Cell(17,5,'','LBR',0,'C','0');
                    }else{
                        $this->pdf->Cell(10,5,$i,'LRT',0,'C','0');
                        $this->pdf->Cell(20,5,'TITULO','LT',0,'L','0');
                        $this->pdf->Cell(4,5,' : ','T',0,'L','0');
                        $this->pdf->Cell(140,5,substr(utf8_decode($prestamo->TITULO),0,100),'RT',0,'L','0');                
                        $this->pdf->Cell(17,5,$prestamo->NRO_PRESTAMOS,'LRT',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(4,5,'','',0,'L','0');
                        $this->pdf->Cell(140,5,substr(utf8_decode($prestamo->TITULO),100,100),'R',0,'L','0');                
                        $this->pdf->Cell(17,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(4,5,'','',0,'L','0');
                        $this->pdf->Cell(140,5,substr(utf8_decode($prestamo->TITULO),200,100),'R',0,'L','0');                
                        $this->pdf->Cell(17,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(4,5,'','',0,'L','0');
                        $this->pdf->Cell(140,5,substr(utf8_decode($prestamo->TITULO),300,100),'R',0,'L','0');                
                        $this->pdf->Cell(17,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');            
                        $this->pdf->Cell(20,5,'EDITORIAL','L',0,'L','0');                
                        $this->pdf->Cell(4,5,' : ','',0,'L','0');
                        $this->pdf->Cell(140,5,utf8_decode($prestamo->EDITORIAL),'R',0,'L','0');            
                        $this->pdf->Cell(17,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');            
                        $this->pdf->Cell(20,5,'CLASIFICACION','L',0,'L','0');                
                        $this->pdf->Cell(4,5,' : ','',0,'L','0');
                        $this->pdf->Cell(140,5,utf8_decode($prestamo->CLASIFICACION),'R',0,'L','0');            
                        $this->pdf->Cell(17,5,'','LR',0,'C','0');
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LBR',0,'BL','0');            
                        $this->pdf->Cell(20,5,'MATERIAL','BL',0,'L','0');                
                        $this->pdf->Cell(4,5,' : ','B',0,'L','0');
                        $this->pdf->Cell(140,5,utf8_decode($prestamo->MATERIAL),'BR',0,'L','0');            
                        $this->pdf->Cell(17,5,'','LBR',0,'C','0');
                    }
                }
            }                        
            $this->pdf->Ln(5);
            $i++;
        }
        $this->pdf->Output("Historico de prestamos por clasificacion.pdf", 'I');
    }
    
    public function pdfPrestamosPorTipoUsuario($fechaInicio,$fechaFin){
        $fechaInicio = str_replace('_', '/', $fechaInicio);
        $fechaFin = str_replace('_', '/', $fechaFin);
        $prestamos = $this->Model_Reporte->prestamosPorTipoUsuario($fechaInicio,$fechaFin);
        if(count($prestamos)>0){
            foreach($prestamos as $prestamo){
                break;
            }
        }
        $this->pdf = new Pdf();
        // Agregamos una página
        $this->pdf->AddPage();
        // Define el alias para el número de página que se imprimirá en el pie
        $this->pdf->AliasNbPages();
        $this->pdf->SetTitle('Prestamos por Tipo de Usuario');
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(5);

        //$this->pdf->cabeceraHistoricoPorLector('HISTORICO DE PRESTAMOS'); 
        //CABECERA DE PAGINA
        $this->pdf->Image(base_url('assets/img/logo.png'),10,7,15,12,'','');
        $this->pdf->SetFont('Arial','B',8);
        $this->pdf->Cell(185,5,'BIBLIOTECA - UNIVERSIDAD ARZOBISPO LOAYZA',0,0,'C');
        $this->pdf->Ln(5);
        $this->pdf->Cell(185,5,'NUMERO DE PRESTAMOS POR TIPO DE USUARIO',0,0,'C');
        $this->pdf->Ln(12);
        $this->pdf->SetFont('Arial','B',6);
        
        $this->pdf->Cell(57);
        $this->pdf->Cell(10,5,'DESDE: ',0,0,'L');
        $this->pdf->Cell(20,5,$fechaInicio,0,0,'L');
        $this->pdf->Cell(17);
        $this->pdf->Cell(10,5,'HASTA: ',0,0,'L');
        $this->pdf->Cell(15,5,$fechaFin,0,0,'L');
        $this->pdf->Ln(3);
        
        $this->pdf->Ln(5 );
        //FIN DE LA CABECERA
        
        $this->pdf->SetFillColor(200,200,200);
        $this->pdf->SetFont('Arial', 'B', 6);
        $this->pdf->Cell(57);
        $this->pdf->Cell(50,5,'TIPO DE USUARIO','TBLR',0,'L','1');        
        $this->pdf->Cell(20,5,'PRESTAMOS','TBR',0,'C','1');        
        $this->pdf->Ln(5);
        $this->pdf->SetFont('Arial', '', 6);
        foreach($prestamos as $prestamo){            
            $this->pdf->Cell(57);
            $this->pdf->Cell(50,5,$prestamo->TIPO_USUARIO,'LBR',0,'L','0');            
            $this->pdf->Cell(20,5,$prestamo->PRESTAMOS,'RB',0,'C','0');            
            $this->pdf->Ln(5);
        }
        $this->pdf->Output("Historico de prestamos por clasificacion.pdf", 'I');
    }
    public function pdfPrestamosPorCarrera($fechaInicio,$fechaFin){
        $fechaInicio = str_replace('_', '/', $fechaInicio);
        $fechaFin = str_replace('_', '/', $fechaFin);
        $prestamos = $this->Model_Reporte->prestamosPorCarrera($fechaInicio,$fechaFin);
        if(count($prestamos)>0){
            foreach($prestamos as $prestamo){
                break;
            }
        }
        $this->pdf = new Pdf();
        // Agregamos una página
        $this->pdf->AddPage();
        // Define el alias para el número de página que se imprimirá en el pie
        $this->pdf->AliasNbPages();
        $this->pdf->SetTitle('Prestamos por Carrera');
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(5);

        //$this->pdf->cabeceraHistoricoPorLector('HISTORICO DE PRESTAMOS'); 
        //CABECERA DE PAGINA
        
        $this->pdf->Image(base_url('assets/img/logo.png'),20,7,15,12,'','');
        $this->pdf->SetFont('Arial','B',8);
        $this->pdf->Cell(185,5,'BIBLIOTECA - UNIVERSIDAD ARZOBISPO LOAYZA',0,0,'C');
        $this->pdf->Ln(5);
        $this->pdf->Cell(185,5,'NUMERO DE PRESTAMOS POR CARRERA',0,0,'C');
        $this->pdf->Ln(12);
        $this->pdf->SetFont('Arial','B',6);
        
        $this->pdf->Cell(57);
        $this->pdf->Cell(10,5,'DESDE: ',0,0,'L');
        $this->pdf->Cell(20,5,$fechaInicio,0,0,'L');
        $this->pdf->Cell(17);
        $this->pdf->Cell(10,5,'HASTA: ',0,0,'L');
        $this->pdf->Cell(15,5,$fechaFin,0,0,'L');
        $this->pdf->Ln(3);
        
        $this->pdf->Ln(5 );
        //FIN DE LA CABECERA
        
        $this->pdf->SetFillColor(200,200,200);
        $this->pdf->SetFont('Arial', 'B', 6);
        $this->pdf->Cell(48);
        $this->pdf->Cell(70,5,'CARRERA','TBLR',0,'L','1');        
        $this->pdf->Cell(20,5,'PRESTAMOS','TBR',0,'C','1');        
        $this->pdf->Ln(5);
        $this->pdf->SetFont('Arial', '', 6);
        foreach($prestamos as $prestamo){            
            $this->pdf->Cell(48);
            $this->pdf->Cell(70,5,  utf8_decode($prestamo->CARRERA),'LBR',0,'L','0');            
            $this->pdf->Cell(20,5,$prestamo->PRESTAMOS,'RB',0,'C','0');            
            $this->pdf->Ln(5);
        }
        $this->pdf->Output("Historico de prestamos por carrera.pdf", 'I');
    }
    public function pdfPrestamosVencidos($fechaInicio,$fechaFin){        
        $fechaInicio = str_replace('_', '/', $fechaInicio);
        $fechaFin = str_replace('_', '/', $fechaFin);
        $prestamos = $this->Model_Reporte->prestamosVencidos($fechaInicio,$fechaFin);
        if(count($prestamos)>0){
            foreach($prestamos as $prestamo){
                break;
            }     
        }    
        $this->pdf = new Pdf();
        // Agregamos una página
        $this->pdf->AddPage();
        // Define el alias para el número de página que se imprimirá en el pie
        $this->pdf->AliasNbPages();
        $this->pdf->SetTitle('Prestamos Vencidos');
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(5);

        //$this->pdf->cabeceraHistoricoPorLector('HISTORICO DE PRESTAMOS'); 
        //CABECERA DE PAGINA
        $this->pdf->Image(base_url('assets/img/logo.png'),10,7,15,12,'','');
        $this->pdf->SetFont('Arial','B',8);
        $this->pdf->Cell(185,5,'BIBLIOTECA - UNIVERSIDAD ARZOBISPO LOAYZA',0,0,'C');
        $this->pdf->Ln(5);
        $this->pdf->Cell(185,5,'RELACION DE PRESTAMOS VENCIDOS',0,0,'C');
        $this->pdf->Ln(12);
        $this->pdf->SetFont('Arial','B',6);
        
        $this->pdf->Cell(10,5,'DESDE: ',0,0,'L');
        $this->pdf->Cell(20,5,$fechaInicio,0,0,'L');
        $this->pdf->Cell(17);
        $this->pdf->Cell(10,5,'HASTA: ',0,0,'L');
        $this->pdf->Cell(15,5,$fechaFin,0,0,'L');
        $this->pdf->Ln(3);
        
        $this->pdf->Ln(5 );
        //FIN DE LA CABECERA
        
        $this->pdf->SetFillColor(200,200,200);
        $this->pdf->SetFont('Arial', 'B', 6);
        $this->pdf->Cell(10,7,utf8_decode('N°'),'TBLR',0,'C','1');        
        $this->pdf->Cell(150,7,'DATOS DEL LECTOR Y MATERIAL PRESTAMO','TBLR',0,'L','1');        
        $this->pdf->Cell(15,7,'PRESTADO','TBLR',0,'C','1');
        $this->pdf->Cell(13,7,'RETRASO','TBLR',0,'C','1');
        $this->pdf->Ln(7);
        $this->pdf->SetFont('Arial', '', 6);
        $i=1;
        foreach($prestamos as $prestamo){            
            $this->pdf->Cell(10,5,$i++,'LR',0,'C','0');            
            $this->pdf->Cell(20,5,'LECTOR','L',0,'L','0');
            $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->NOMBRE_LECTOR),'R',0,'L','0');
            $this->pdf->Cell(15,5,$prestamo->FECHA_PRESTAMO,'LR',0,'C','0');
            $this->pdf->Cell(13,5,$prestamo->DIAS_RETRASO,'LR',0,'C','0');
            $this->pdf->Ln(3);
            $this->pdf->Cell(10,5,'','LR',0,'L','0');
            $this->pdf->Cell(20,5,'USUARIO','L',0,'L','0');
            $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->LECTOR).' / '.utf8_decode($prestamo->TIPO_USUARIO_DES),'R',0,'L','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');
            $this->pdf->Cell(13,5,'','LR',0,'C','0');                        
            if($prestamo->CARRERA){
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LR',0,'L','0');
                $this->pdf->Cell(20,5,'CARRERA','L',0,'L','0');
                $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->CARRERA),'R',0,'L','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');
                $this->pdf->Cell(13,5,'','LR',0,'C','0');
            }
            if($prestamo->TELEFONO){
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LR',0,'L','0');
                $this->pdf->Cell(20,5,'TELEFONO','L',0,'L','0');
                $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->TELEFONO),'R',0,'L','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');
                $this->pdf->Cell(13,5,'','LR',0,'C','0');
            }
            $longitud = strlen(utf8_decode($prestamo->TITULO));
            if($longitud<=95){
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LR',0,'L','0');
                $this->pdf->Cell(20,5,'TITULO','L',0,'L','0');
                $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->TITULO),'R',0,'L','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');
                $this->pdf->Cell(13,5,'','LR',0,'C','0');
            }else{
                if($longitud<=190){
                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LR',0,'L','0');
                    $this->pdf->Cell(20,5,'TITULO','L',0,'L','0');
                    $this->pdf->Cell(130,5,':   '.substr(utf8_decode($prestamo->TITULO),0,95),'R',0,'L','0');
                    $this->pdf->Cell(15,5,'','LR',0,'C','0');
                    $this->pdf->Cell(13,5,'','LR',0,'C','0');

                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LR',0,'L','0');
                    $this->pdf->Cell(20,5,'','L',0,'L','0');
                    $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),95,95),'R',0,'L','0');
                    $this->pdf->Cell(15,5,'','LR',0,'C','0');
                    $this->pdf->Cell(13,5,'','LR',0,'C','0');
                }else{
                    if($longitud<=285){
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'TITULO','L',0,'L','0');
                        $this->pdf->Cell(130,5,':   '.substr(utf8_decode($prestamo->TITULO),0,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');

                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),95,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');
                        
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),190,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');
                    }else{
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'TITULO','L',0,'L','0');
                        $this->pdf->Cell(130,5,':   '.substr(utf8_decode($prestamo->TITULO),0,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');

                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),95,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');
                        
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),190,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');
                        
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),285,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(13,5,'','LR',0,'C','0');
                    }
                }
            }
            
            $this->pdf->Ln(3);
            $this->pdf->Cell(10,5,'','LR',0,'L','0');
            $this->pdf->Cell(20,5,'CLASIFICACION','L',0,'L','0');
            $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->CLASIFICACION),'R',0,'L','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');
            $this->pdf->Cell(13,5,'','LR',0,'C','0');
            $this->pdf->Ln(3);
            $this->pdf->Cell(10,5,'','LRB',0,'L','0');
            $this->pdf->Cell(20,5,'MATERIAL','LB',0,'L','0');
            $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->MATERIAL),'RB',0,'L','0');
            $this->pdf->Cell(15,5,'','LRB',0,'C','0');
            $this->pdf->Cell(13,5,'','LRB',0,'C','0');                
            
            $this->pdf->Ln(5);                        
        }
        $this->pdf->Output("Historico de prestamos por clasificacion.pdf", 'I');
    }
    public function pdfprestamosDevueltosEnMalEstado($fechaInicio,$fechaFin){        
        $fechaInicio = str_replace('_', '/', $fechaInicio);
        $fechaFin = str_replace('_', '/', $fechaFin);
        $prestamos = $this->Model_Reporte->prestamosDevueltosEnMalEstado($fechaInicio,$fechaFin);
        if(count($prestamos)>0){
            foreach($prestamos as $prestamo){
                break;
            }     
        }    
        $this->pdf = new Pdf();
        // Agregamos una página
        $this->pdf->AddPage();
        // Define el alias para el número de página que se imprimirá en el pie
        $this->pdf->AliasNbPages();
        $this->pdf->SetTitle('Prestamos en mal estado');
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(5);

        //$this->pdf->cabeceraHistoricoPorLector('HISTORICO DE PRESTAMOS'); 
        //CABECERA DE PAGINA
        $this->pdf->Image(base_url('assets/img/logo.png'),10,7,15,12,'','');
        $this->pdf->SetFont('Arial','B',8);
        $this->pdf->Cell(185,5,'BIBLIOTECA - UNIVERSIDAD ARZOBISPO LOAYZA',0,0,'C');
        $this->pdf->Ln(5);
        $this->pdf->Cell(185,5,'RELACION DE PRESTAMOS DEVUELTOS EN MAL ESTADO',0,0,'C');
        $this->pdf->Ln(10);
        $this->pdf->SetFont('Arial','B',6);
        
        $this->pdf->Cell(10,5,'DESDE: ',0,0,'L');
        $this->pdf->Cell(20,5,$fechaInicio,0,0,'L');
        $this->pdf->Cell(17);
        $this->pdf->Cell(10,5,'HASTA: ',0,0,'L');
        $this->pdf->Cell(15,5,$fechaFin,0,0,'L');
        $this->pdf->Ln(3);
        
        $this->pdf->Ln(5 );
        //FIN DE LA CABECERA
        
        $this->pdf->SetFillColor(200,200,200);
        $this->pdf->SetFont('Arial', 'B', 6);
        $this->pdf->Cell(10,7,utf8_decode('N°'),'TBLR',0,'C','1');        
        $this->pdf->Cell(150,7,'DATOS DEL LECTOR Y MATERIAL PRESTAMO','TBLR',0,'L','1');        
        $this->pdf->Cell(15,7,'PRESTADO','TBLR',0,'C','1');
        $this->pdf->Cell(15,7,'DEVUELTO','TBLR',0,'C','1');
        $this->pdf->Ln(7);
        $this->pdf->SetFont('Arial', '', 6);
        $i=1;
        foreach($prestamos as $prestamo){            
            $this->pdf->Cell(10,5,$i++,'LR',0,'C','0');            
            $this->pdf->Cell(20,5,'LECTOR','L',0,'L','0');
            $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->NOMBRE_LECTOR),'R',0,'L','0');
            $this->pdf->Cell(15,5,$prestamo->FECHA_PRESTAMO,'LR',0,'C','0');
            $this->pdf->Cell(15,5,$prestamo->FECHA_DEVOLUCION,'LR',0,'C','0');
            $this->pdf->Ln(3);
            $this->pdf->Cell(10,5,'','LR',0,'L','0');
            $this->pdf->Cell(20,5,'USUARIO','L',0,'L','0');
            $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->LECTOR).' / '.utf8_decode($prestamo->TIPO_USUARIO_DES),'R',0,'L','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');                        
            if($prestamo->CARRERA){
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LR',0,'L','0');
                $this->pdf->Cell(20,5,'CARRERA','L',0,'L','0');
                $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->CARRERA),'R',0,'L','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');
            }
            if($prestamo->TELEFONO){
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LR',0,'L','0');
                $this->pdf->Cell(20,5,'TELEFONO','L',0,'L','0');
                $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->TELEFONO),'R',0,'L','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');
            }
            $longitud = strlen(utf8_decode($prestamo->TITULO));
            if($longitud<=95){
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LR',0,'L','0');
                $this->pdf->Cell(20,5,'TITULO','L',0,'L','0');
                $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->TITULO),'R',0,'L','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');
            }else{
                if($longitud<=190){
                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LR',0,'L','0');
                    $this->pdf->Cell(20,5,'TITULO','L',0,'L','0');
                    $this->pdf->Cell(130,5,':   '.substr(utf8_decode($prestamo->TITULO),0,95),'R',0,'L','0');
                    $this->pdf->Cell(15,5,'','LR',0,'C','0');
                    $this->pdf->Cell(15,5,'','LR',0,'C','0');

                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LR',0,'L','0');
                    $this->pdf->Cell(20,5,'','L',0,'L','0');
                    $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),95,95),'R',0,'L','0');
                    $this->pdf->Cell(15,5,'','LR',0,'C','0');
                    $this->pdf->Cell(15,5,'','LR',0,'C','0');
                }else{
                    if($longitud<=285){
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'TITULO','L',0,'L','0');
                        $this->pdf->Cell(130,5,':   '.substr(utf8_decode($prestamo->TITULO),0,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');

                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),95,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),190,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                    }else{
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'TITULO','L',0,'L','0');
                        $this->pdf->Cell(130,5,':   '.substr(utf8_decode($prestamo->TITULO),0,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');

                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),95,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),190,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'L','0');
                        $this->pdf->Cell(20,5,'','L',0,'L','0');
                        $this->pdf->Cell(130,5,'    '.substr(utf8_decode($prestamo->TITULO),285,95),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');
                    }
                }
            }
            
            $this->pdf->Ln(3);
            $this->pdf->Cell(10,5,'','LR',0,'L','0');
            $this->pdf->Cell(20,5,'CLASIFICACION','L',0,'L','0');
            $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->CLASIFICACION),'R',0,'L','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');
            $this->pdf->Ln(3);
            $this->pdf->Cell(10,5,'','LR',0,'L','0');
            $this->pdf->Cell(20,5,'MATERIAL','L',0,'L','0');
            $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->MATERIAL),'R',0,'L','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');                
            $this->pdf->SetTextColor(255,0,0);
            $this->pdf->Ln(3);
            $this->pdf->Cell(10,5,'','LR',0,'L','0');
            $this->pdf->Cell(20,5,'EST. DEVOLUCION','L',0,'L','0');
            $this->pdf->Cell(130,5,':   '.utf8_decode($prestamo->ESTADO_DEVOLUCION_DES),'R',0,'L','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');
            $this->pdf->Cell(15,5,'','LR',0,'C','0');                
            $this->pdf->Ln(3);
            $this->pdf->Cell(10,5,'','LRB',0,'L','0');
            $this->pdf->Cell(20,5,'OBSERVACION','LB',0,'L','0');
            $this->pdf->Cell(130,5,':   '.strtoupper(utf8_decode($prestamo->OBSERVACION)),'RB',0,'L','0');
            $this->pdf->Cell(15,5,'','LRB',0,'C','0');
            $this->pdf->Cell(15,5,'','LRB',0,'C','0');                
            $this->pdf->Ln(5);                        
            $this->pdf->SetTextColor(0,0,0);
        }
        $this->pdf->Output("Historico de prestamos por clasificacion.pdf", 'I');
    }
    public function pdfCatalogo(){                
        $documentos = $this->Model_Documento->buscar('','','','','');
        /*if(count($prestamos)>0){
            foreach($prestamos as $prestamo){
                break;
            }     
        }*/   
        $this->pdf = new Pdf();
        // Agregamos una página
        $this->pdf->AddPage();
        // Define el alias para el número de página que se imprimirá en el pie
        $this->pdf->AliasNbPages();
        $this->pdf->SetTitle('Catalogo');
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(5);

        //$this->pdf->cabeceraHistoricoPorLector('HISTORICO DE PRESTAMOS'); 
        //CABECERA DE PAGINA
        $this->pdf->Image(base_url('assets/img/logo.png'),10,7,15,12,'','');
        $this->pdf->SetFont('Arial','B',8);
        $this->pdf->Cell(185,5,'BIBLIOTECA - UNIVERSIDAD ARZOBISPO LOAYZA',0,0,'C');
        $this->pdf->Ln(5);
        $this->pdf->Cell(185,5,  utf8_decode('CATÁLOGO DE MATERIALES'),0,0,'C');        
        $this->pdf->SetFont('Arial','B',6);
        $this->pdf->Ln(10);                       
        //FIN DE LA CABECERA
        
        $this->pdf->SetFillColor(200,200,200);
        $this->pdf->SetFont('Arial', 'B', 6);
        $this->pdf->Cell(10,7,utf8_decode('N°'),'TBLR',0,'C','1');        
        $this->pdf->Cell(165,7,'DATOS DEL MATERIAL','TBLR',0,'L','1');        
        $this->pdf->Cell(15,7,utf8_decode('N° EJE'),'TBLR',0,'C','1');        
        $this->pdf->Ln(7);
        $this->pdf->SetFont('Arial', '', 6);
        $i=1;
        foreach($documentos as $documento){            
            $longitud = strlen(utf8_decode($documento->TITULO));            
            if($longitud<=100){                
                $this->pdf->Cell(10,5,$i++,'LRT',0,'C','0');
                $this->pdf->Cell(18,5,'TITULO','TL',0,'L','0');
                $this->pdf->Cell(147,5,':   '.utf8_decode($documento->TITULO),'TR',0,'L','0');
                $this->pdf->Cell(15,5,$documento->EJM,'LRT',0,'C','0');                
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LR',0,'C','0');
                $this->pdf->Cell(18,5,'CLASIFICACION','L',0,'L','0');
                $this->pdf->Cell(147,5,':   '.utf8_decode($documento->CLASIFICACION),'R',0,'L','0');
                $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                $this->pdf->Ln(3);
                $this->pdf->Cell(10,5,'','LRB',0,'C','0');
                $this->pdf->Cell(18,5,'MATERIAL','LB',0,'L','0');
                $this->pdf->Cell(147,5,':   '.utf8_decode($documento->MATERIALDES),'RB',0,'L','0');
                $this->pdf->Cell(15,5,'','LRB',0,'C','0');                
                $this->pdf->Ln(5);
            }else{
                if($longitud<=200){                    
                    $this->pdf->Cell(10,5,$i++,'LRT',0,'C','0');
                    $this->pdf->Cell(18,5,'TITULO','TL',0,'L','0');
                    $this->pdf->Cell(147,5,':   '.substr(utf8_decode($documento->TITULO),0,100),'TR',0,'L','0');
                    $this->pdf->Cell(15,5,$documento->EJM,'LRT',0,'C','0');                
                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LR',0,'C','0');
                    $this->pdf->Cell(18,5,'','L',0,'L','0');
                    $this->pdf->Cell(147,5,':   '.substr(utf8_decode($documento->TITULO),100,100),'R',0,'L','0');
                    $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                    $this->pdf->Ln(3);
                    
                    $this->pdf->Cell(10,5,'','LR',0,'C','0');
                    $this->pdf->Cell(18,5,'CLASIFICACION','L',0,'L','0');
                    $this->pdf->Cell(147,5,':   '.utf8_decode($documento->CLASIFICACION),'R',0,'L','0');
                    $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                    $this->pdf->Ln(3);
                    $this->pdf->Cell(10,5,'','LRB',0,'C','0');
                    $this->pdf->Cell(18,5,'MATERIAL','LB',0,'L','0');
                    $this->pdf->Cell(147,5,':   '.utf8_decode($documento->MATERIALDES),'RB',0,'L','0');
                    $this->pdf->Cell(15,5,'','LRB',0,'C','0');                
                    $this->pdf->Ln(5);
                }else{
                    if($longitud<=300){
                        $this->pdf->Cell(10,5,$i++,'LRT',0,'C','0');
                        $this->pdf->Cell(18,5,'TITULO','TL',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.substr(utf8_decode($documento->TITULO),0,100),'TR',0,'L','0');
                        $this->pdf->Cell(15,5,$documento->EJM,'LRT',0,'C','0');                
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(18,5,'','L',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.substr(utf8_decode($documento->TITULO),100,100),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(18,5,'','L',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.substr(utf8_decode($documento->TITULO),200,100),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                        $this->pdf->Ln(3);

                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(18,5,'CLASIFICACION','L',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.utf8_decode($documento->CLASIFICACION),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LRB',0,'C','0');
                        $this->pdf->Cell(18,5,'MATERIAL','LB',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.utf8_decode($documento->MATERIALDES),'RB',0,'L','0');
                        $this->pdf->Cell(15,5,'','LRB',0,'C','0');                
                        $this->pdf->Ln(5);
                    }else{
                        $this->pdf->Cell(10,5,$i++,'LRT',0,'C','0');
                        $this->pdf->Cell(18,5,'TITULO','TL',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.substr(utf8_decode($documento->TITULO),0,100),'TR',0,'L','0');
                        $this->pdf->Cell(15,5,$documento->EJM,'LRT',0,'C','0');                
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(18,5,'','L',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.substr(utf8_decode($documento->TITULO),100,100),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(18,5,'','L',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.substr(utf8_decode($documento->TITULO),200,100),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(18,5,'','L',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.substr(utf8_decode($documento->TITULO),300,100),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                        $this->pdf->Ln(3);

                        $this->pdf->Cell(10,5,'','LR',0,'C','0');
                        $this->pdf->Cell(18,5,'CLASIFICACION','L',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.utf8_decode($documento->CLASIFICACION),'R',0,'L','0');
                        $this->pdf->Cell(15,5,'','LR',0,'C','0');                
                        $this->pdf->Ln(3);
                        $this->pdf->Cell(10,5,'','LRB',0,'C','0');
                        $this->pdf->Cell(18,5,'MATERIAL','LB',0,'L','0');
                        $this->pdf->Cell(147,5,':   '.utf8_decode($documento->MATERIALDES),'RB',0,'L','0');
                        $this->pdf->Cell(15,5,'','LRB',0,'C','0');                
                        $this->pdf->Ln(5);
                    }
                }
            }
        }
        $this->pdf->Output("Historico de prestamos por clasificacion.pdf", 'I');
    }
    public function excelCatalogo(){        
        to_excel($this->Model_Reporte->exportarCatalogo(), "archivoexcel");
    }                
    public function buscarAlumno(){
        if(isset($_SESSION)){
            if($this->input->is_ajax_request()){
        $texto = $this->input->post('texto');                
                $alumnos = $this->Model_Reporte->buscarAlumno(1,$texto);
                                
                $div='';
                $div .= '<table class="table table-sm table-bordered table-condensed" style="width: 100%; font-family: calibri; font-size: 12px;">';
                $div .= '<thead><tr>';
                $div .= '<th style="width: 10%; text-align:center;">CODIGO</th>';
                $div .= '<th style="width: 40%">APELLIDOS Y NOMBRES</th>';
                $div .= '<th style="width: 20%">CARRERA</th>';
                $div .= '<th style="width: 20%">TELEFONO</th>';
                $div .= '<th style="width: 10%; text-align:center;"></th>';
                $div .= '</tr></thead>';
                $div .= '<tbody>';
                //reset($prestamos);
                foreach($alumnos as $alumno){
                    $div .= '<tr>';
                    $div .= '<td style="text-align:center;">'.$alumno->ALUMNO.'</td>';
                    $div .= '<td>'.$alumno->NOMBRE_ALUMNO.'</td>';
                    $div .= '<td>'.$alumno->CARRERA_DES.'</td>';
                    $div .= '<td>'.$alumno->TELEFONO.' / '.$alumno->CELULAR.'</td>';
                    $div .= '<td style="text-align:center;"><a href="'.base_url().'reporte/buscarunalumno/'.$alumno->ALUMNO.'" target="_blank">Ver mas</a></td>';
                    $div .= '</tr>';
                }
                $div .= '</tbody>';
                $div .= '</table>';
                $data = array(
                    'respuesta'=>'success',
                    'div' => $div
                );
                echo json_encode($data);
            }else{
                $data = new stdClass();
                $data->titulo = 'Biblioteca - UAL';
                $data->opcion='Mantenimiento';
                $data->subOpcion='Edicion';
                $data->contenido = 'reporte/buscaralumno';
                $data->prestamos = '';
                $this->load->view('frontend',$data);
                }
        }else{
            redirect(base_url());
        }
    }
    public function buscarUnAlumno($alumno){
        if(isset($_SESSION)){
            $alumno = $this->Model_Reporte->buscarAlumno(2,$alumno);
            $data = new stdClass();
            $data->titulo = 'Biblioteca - UAL';
            $data->opcion='Mantenimiento';
            $data->subOpcion='Edicion';
            $data->contenido = 'reporte/detallealumno';
            $data->alumno = $alumno;            
            $this->load->view('frontend2',$data);            
        }else{
            redirect(base_url());
        }
    }
    public function validarFecha($fecha){
        $valores = explode('/', $fecha);
    if(count($valores) == 3 && checkdate($valores[1], $valores[0], $valores[2])){
            if($valores[2]>999){
                return true;            
            }
        }
    return false;
    }    
}
