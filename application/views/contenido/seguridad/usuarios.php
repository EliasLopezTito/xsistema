<div class="content-wrapper">
    <section class="content">
        <div class="row">
            <section class="col-lg-12 connectedSortable">
                <?php
                if (isset($sedes)) {
                    //print_r($sedes);
                }
                ?>

                <div class="mi-panel">
                    <div class="panel-group">
                        <div class="panel panel-primary">
                            <div class="panel-heading"> Seguridad - Usuarios</div>
                            <div class="panel-body" style="">
                                <form id="frmListados" method="post" target="_blank">
                                    
                                    <div class="row">

                                        <div class="col-xs-12 col-sm-6 col-md-8 col-lg-4">
                                            <label for="">REALIZAR UNA BÚSQUEDA</label>
                                            <div>
                                                <input type="text" id="filtrar__usuarios" class="form-control" placeholder="Ingrese su código o nombres "/>
                                            </div>
                                        </div>
                                        <div class="col-sm-6 col-md-4 col-lg-2">
                                            <label for="">ÁREA</label>
                                            <div>
                                                <select  class="selectpicker form-control mipanel-combo" id="filtrar__area">
                                                    <option value="">TODOS</option>
                                                    <?php
                                                        if ($areas != null && $areas != "vacio") {
                                                            foreach ($areas as $area) {
                                                    ?>
                                                                <option value="<?php echo $area->id_area; ?>"><?php echo $area->descripcion; ?></option>
                                                    <?php
                                                        }
                                                    }
                                                    ?>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-sm-6 col-md-4 col-lg-2">
                                            <label>ESTADO:</label>
                                            <div>
                                                <select class="selectpicker form-control mipanel-combo" id="filtrar__estado">
                                                    <option value="2">TODOS</option>
                                                    <option value="1">INACTIVO</option>
                                                    <option value="0">ACTIVO</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-1">
                                            <label for=""></label>
                                            <div>                               
                                                <button class="btn btn-success mipanel-btn-img-texto" id="btn__filtrar__usuarios" type="button" style="width: 100%"><span class="icon-search" style="padding-right: 10px"></span></button>
                                            </div>
                                        </div>                         
                                        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-1">
                                            <label for=""></label>                          
                                            <div>                                                
                                                <button class="btn btn-success mipanel-btn-img-texto" id="btnNuevoUsuario" type="button" style="width: 100%"><span class="icon-users" style="padding-right: 10px"></span> Nuevo </button>                                          
                                            </div>                                         
                                        </div>

                                    </div>

                                    <div class="mi-panel" style="margin-top: 10px;">
                                        <div class="panel-group">
                                            <div class="panel panel-primary" style="border-color: #b9def0;">
                                                <div class="panel-heading" style="background-color: #b9def0; color: #286090;"> Usuarios registrados</div>
                                                <div class="panel-body">
                                                    <div class="row">
                                                        <div class="col-lg-12 table-responsive" style="padding-top: 5px; padding-bottom: 5px;">
                            
                                                            <table class="table table-condensed table-bordered mi-tabla" style="width:100%" id="tabla__lista__usuarios">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="celda-centrada">N°</th>
                                                                        <th class="celda-centrada">USUARIO</th><!--style="padding: 0px 14px"-->
                                                                        <th class="celda-centrada">APELLIDOS</th>
                                                                        <th class="celda-centrada">NOMBRES</th>
                                                                        <th class="celda-centrada">ÁREA</th>
                                                                        <th class="celda-centrada">ESTADO</th>
                                                                        <th class="celda-centrada">OPERACIONES</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                </tbody>
                                                            </table>
                                                            <br><br>
                                                            <div id="grid"></div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>
</div>

<!-- Modal Usuario -->
<div class="modal fade" id="modalNuevoEditUsuario" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document" style="width: 100%; max-width:350px; height: auto; margin: 100px auto;">
        <div class="modal-content" style="height: auto;">
            <div class="modal-header modal-header-busqueda">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <label class="modal-title modal-title-busqueda">EDITAR USUARIO</label>
            </div>
            <div class="modal-body modal-body-busqueda" style="padding-top: 20px; padding-bottom: 20px;">
                <form id="frmModalNuevoEditUsuario" method="post">
                    <input type="hidden" id="accion" name="accion" value="" />
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Usuario:</label>
                            <div>
                                <input type="text" style="text-transform: uppercase;" class="form-control" name="usuario" id="usuario" />
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila" id="divContrasenia">
                            <label>Contraseña:</label>
                            <div>
                                <input type="password" class="form-control" name="contrasenia" id="contrasenia" />
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Apellidos:</label>
                            <div>
                                <input type="text" style="text-transform: uppercase;" class="form-control" name="apellidos" id="apellidos" />
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Nombres:</label>
                            <div>
                                <input type="text" style="text-transform: uppercase;" class="form-control" name="nombres" id="nombres" />
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Area:</label>
                            <div>
                                <select class="selectpicker form-control mipanel-combo" name="area" id="area">
                                    <?php
                                    if ($areas != null && $areas != "vacio") {
                                        foreach ($areas as $area) {
                                    ?>
                                            <option value="<?php echo $area->id_area; ?>"><?php echo $area->descripcion; ?></option>
                                    <?php
                                        }
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Estado:</label>
                            <div>
                                <select class="selectpicker form-control mipanel-combo" name="estado" id="estado">
                                    <option value="1">INACTIVO</option>
                                    <option value="0">ACTIVO</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila">
                            <label></label>
                            <div>
                                <button class="btn btn-success mipanel-btn-img-texto" title="Registrar Datos" id="btnRegistrarDatos" type="button" style="width: 100%">
                                    <span class="icon-floppy-disk" style="padding-right: 10px;"></span> Grabar Datos
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12 row-fila modal-error-busqueda" id="errorAlumnoBus" style="">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- End Modal Usuario -->

<!-- Modal Editar Contraseña -->
<div class="modal fade" id="modalCambiarContrasenia" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document" style="width: 100%; max-width:300px; height: auto; margin: 100px auto;">
        <div class="modal-content" style="height: auto;">
            <div class="modal-header modal-header-busqueda">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <label class="modal-title modal-title-busqueda">CAMBIAR CONTRASEÑA</label>
            </div>
            <div class="modal-body modal-body-busqueda" style="padding-top: 20px; padding-bottom: 20px;">
                <form id="frmModalEditarContrasenia" method="post">
                    <input type="hidden" id="accion" name="accion" value="" />
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Usuario:</label>
                            <div>
                                <input type="text" class="form-control" name="usuarioC" id="usuarioC" />
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Nueva Contraseña:</label>
                            <div>
                                <input type="password" class="form-control" name="contraseniaC" id="contraseniaC" />
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Confirmar Contraseña:</label>
                            <div>
                                <input type="password" class="form-control" name="contrasenia2C" id="contrasenia2C" />
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila">
                            <label></label>
                            <div>
                                <button class="btn btn-success mipanel-btn-img-texto" title="Cambiar Contraseña" id="btnCambiarContrasenia" type="button" style="width: 100%">
                                    <span class="icon-floppy-disk" style="padding-right: 10px;"></span> Cambiar Contraseña
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12 row-fila modal-error-busqueda" id="errorAlumnoBus" style="">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- End Modal Editar Contraseña -->

<!-- Modal mensajes -->
<div class="modal fade modal-confirmacion" id="modalMensaje" tabindex="-1" role="dialog" aria-labelledby="exampleModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header" id="mensaje-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <span class="icon-notification" id="mensaje-icono"></span>
                <label class="modal-title" id="mensaje-titulo">TITULO</label>
            </div>
            <div class="modal-body" id="mensaje-contenido">MENSAJE</div>
            <div class="modal-footer">
                <button type="button" class="btn mipanel-btn-img-texto" data-dismiss="modal" id="mensaje-boton">Cerrar mensaje</button>
            </div>
        </div>
    </div>
</div>