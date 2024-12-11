<div class="content-wrapper">
    <section class="content">
        <div class="row">
            <section class="col-lg-12 connectedSortable">
               
                <div class="mi-panel">
                    <div class="panel-group">
                        <div class="panel panel-primary">
                            <div class="panel-heading"> Cambiar Contraseña</div>
                            <div class="panel-body" style="padding-bottom: 20px;">
                                
                                    <table>
                                        <tr>
                                            <td></td>
                                        </tr>
                                    </table>
                                    <div class="row">
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-4">
                                            <label>USUARIO:</label>
                                        </div>
                                        <div class="col-lg-10 col-md-10 col-sm-9 col-xs-8 row-fila">
                                            <label><?php echo $usuario[0]->usuario; ?></label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-4">
                                            <label>NOMBRE:</label>
                                        </div>
                                        <div class="col-lg-10 col-md-10 col-sm-9 col-xs-8 row-fila">
                                            <label><?php echo $usuario[0]->nombre; ?></label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-4">
                                            <label>NUEVA CONTRASEÑA:</label>
                                        </div>
                                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-8 row-fila">
                                            <input type="password" class="form-control" id="contrasena" />
                                        </div>
                                    </div>
                                    <div class="row" style="margin-top: 15px;">
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                            <button class="btn btn-success mipanel-btn-img-texto" title="Actualizar Contraseña" id="btnActualizar" type="button" style="width: 100%" ><span class="icon-floppy-disk" style="padding-right: 10px;"></span> Actualizar</button>
                                        </div>
                                    </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>
</div>

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
                <button type="button" class="btn mipanel-btn-img-texto" id="mensaje-boton-aceptar"></button>
                <button type="button" class="btn mipanel-btn-img-texto" data-dismiss="modal" id="mensaje-boton"></button>
            </div>
        </div>
    </div>
</div>