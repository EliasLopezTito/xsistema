<style>
.contenedor {
  width: 100%;
  height: 100%;
  max-width: 1000px;
  margin: auto;
}
.widget {
  width: 100%;
  height: 40%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.widget p {
  display: inline-block;
  line-height: 1em;
}
.reloj {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  width: 100%;
  padding: 20px;
  font-size: 12rem;
  text-align: center;
  color: red;
  font-weight: bold;
}
.reloj .cajaSegundos {
  display: inline-block;  
}
.reloj .ampm, .reloj .segundos{
  display: block;
  font-size: 12rem;
}
    </style>
</style>
<div class="content-wrapper">
    <section class="content">
        <div class="row">
            <section class="col-lg-12 connectedSortable">
                <div class="mi-panel">
                    <div class="panel-group">
                        <div class="panel panel-primary">
                            <div class="panel-heading"> Identificación QR</div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-lg-5 col-md-5 col-sm-0 col-xs-0"></div>
                                    <div class="col-lg-2 col-md-2 col-sm-0 col-xs-0">
                                        <input type="text" class="form-control" name="codAlumno" id="codAlumno" focus/>
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-0 col-xs-0"></div>
                                </div>
                                <br>
                                <div id="infoAlumno" style="display: none;">
                                    <div class="row">
                                        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text_align_center padding_16px_15px">
                                            <br>
                                            <img src="https://istalcursos.edu.pe/intranet/assets/files/FotoPerfil/user-ia.png" id="foto-estudiante" name="foto-estudiante">
                                            <br>
                                        </div>
                                        <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 padding_16px_15px">
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">COD. ALUMNO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="codigo"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">ALUMNO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="nomCompleto"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">F. MATRICULA:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="fMatricula"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">TIPO DOCUMENTO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="tipoD"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">DNI:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="dni"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">P. ACADÉMICO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="especialidad"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">ESTADO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="estado"></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="infoDocente" style="display: none;">
                                    <div class="row">
                                        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text_align_center padding_16px_15px">
                                            <br>
                                            <img src="https://istalcursos.edu.pe/intranet/assets/files/FotoPerfil/user-ia.png" id="foto-estudiante" name="foto-estudiante">
                                            <br>
                                        </div>
                                        <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 padding_16px_15px">
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">COD. EMPLEADO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="codigoEmpleado"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">EMPLEADO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="nomCompletoEmpleado"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">TIPO DOCUMENTO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="tipoDoc"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">NRO DOCUMENTO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="nroDoc"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">F. INGRESO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="fIngreso"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">CARGO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="cargo"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">ESTADO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto" id="estadoEmpleado"></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="alerta-danger" style="display:none">
                                    <div class="col-xs-12">
                                        <div class="alert alert-danger alert-dismissible text-center">
                                            <h1>NO SE ENCONTRARON DATOS DEL ALUMNO O DOCENTE INGRESADO</h1>                                            
                                        </div>
                                    </div>
                                </div>
                                <div id="infoVacio">
                                    <div class="row">
                                        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text_align_center padding_16px_15px">
                                            <br>
                                            <img src="https://istalcursos.edu.pe/intranet/assets/files/FotoPerfil/user-ia.png" id="foto-estudiante" name="foto-estudiante">
                                            <br>
                                        </div>
                                        <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 padding_16px_15px">
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">COD. ALUMNO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">ALUMNO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">F. MATRICULA:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">TIPO DOCUMENTO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">DNI:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">P. ACADÉMICO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto"></label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                    <b><label class="color_1d4064 texto">ESTADO:</label></b>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                                    <label class="color_1d4064 texto"></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                

                                <div class="row">
                                    <div class="col-xs-12">
                                        <div class="alert alert-success alert-dismissible">
                                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                                            <h4><i class="icon fa fa-check"></i> Información!</h4>
                                            <p>- Si la lectura del código QR se realiza desde un dispositivo móvil, se recomienda subir el brillo al máximo para facilitar la lectura.</p>
                                            <p>- Los alumnos y docentes pueden generar y descargar su código QR desde la plataforma INTRANET.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="contenedor">
                                    <div class="widget">
                                        <div class="reloj">
                                            <p id="horas" class="horas"></p>
                                            <p>:</p>
                                            <p id="minutos" class="minutos"></p>
                                            <p>:</p>
                                            <div class="cajaSegundos">
                                                <!-- <p id="ampm" class="ampm"></p> -->
                                                <p id="segundos" class="segundos"></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>
</div>