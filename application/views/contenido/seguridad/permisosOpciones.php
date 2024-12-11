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
                            <div class="panel-heading"> Seguridad - Usuarios - Opciones</div>
                            <div class="panel-body" style="">
                                <form id="frmListados" method="post" target="_blank">
                                    
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-1">
                                            <label for=""></label>                          
                                            <div>                                                
                                                <button class="btn btn-success mipanel-btn-img-texto" id="btnNuevoPermiso" type="button" style="width: 100%"><span class="icon-users" style="padding-right: 10px"></span> Nuevo </button>                                          
                                            </div>                                         
                                        </div>
                                    </div>

                                    <div class="mi-panel" style="margin-top: 10px;">
                                        <div class="panel-group">
                                            <div class="panel panel-primary" style="border-color: #b9def0;">
                                                <div class="panel-heading" style="background-color: #b9def0; color: #286090;"> Listado</div>
                                                <div class="panel-body">
                                                    <div class="row">
                                                        <div class="col-lg-12 table-responsive" style="padding-top: 5px; padding-bottom: 5px;">
                            
                                                            <table class="table table-condensed table-bordered mi-tabla" style="width:100%" id="tablaPermisoOpciones">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="celda-centrada">N°</th>
                                                                        <th class="celda-centrada">AREA</th>
                                                                        <th class="celda-centrada">USUARIO</th>
                                                                        <th class="celda-centrada">NOMBRE COMPLETO</th>
                                                                        <th class="celda-centrada">OPERACION</th>
                                                                        <th class="celda-centrada">RUTA</th>
                                                                        <th class="celda-centrada">UBICACION</th>
                                                                        <th class="celda-centrada">ACCIONES</th>
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
<div class="modal fade" id="modalNuevoPermiso" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document" style="width: 100%; max-width:350px; height: auto; margin: 100px auto;">
        <div class="modal-content" style="height: auto;">
            <div class="modal-header modal-header-busqueda">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <label class="modal-title modal-title-busqueda">REGISTRAR PERMISO</label>
            </div>
            <div class="modal-body modal-body-busqueda" style="padding-top: 20px; padding-bottom: 20px;">
                <form id="frmModalPermiso" method="post">
                    <input type="hidden" value="0" id="id" name="id">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Usuario:</label>
                            <div class="inner-addon right-addon form-group has-error">
                                <input type="text" id="usuario" class="form-control ui-autocomplete-input" placeholder="Escriba código, nombres o apellidos"/>
                                <i class="glyphicon glyphicon-remove"></i>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Tipo Accion:</label>
                            <div>
                                <select class="selectpicker form-control mipanel-combo" id="tipoAccion">
                                    <option value="1">Nuevo</option>
                                    <option value="2">Editar</option>
                                    <option value="3">Eliminar</option>
                                    <option value="4">Carnet Medio Pasaje</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Menu 1:</label>
                            <select class="selectpicker form-control mipanel-combo" id="menu1">
                            </select>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Menu 2:</label>
                            <select class="selectpicker form-control mipanel-combo" id="menu2">
                            </select>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila mimodal-row-fila">
                            <label>Menu 3:</label>
                            <select class="selectpicker form-control mipanel-combo" id="menu3">
                            </select>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila">
                            <label></label>
                            <div>
                                <button class="btn btn-success mipanel-btn-img-texto btn-block" type="submit">Guardar</button>                                                                        
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalLoader" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div id="preloader">
        <div id="preloader-inner"></div>
        <div class="text-loader"></div>
    </div>
</div>