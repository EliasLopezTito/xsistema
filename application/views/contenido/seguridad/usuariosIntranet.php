<div class="content-wrapper">
    <section class="content">
        <div class="row">
            <section class="col-lg-12 connectedSortable">
                <?php
                    if(isset($sedes)){
                        //print_r($sedes);
                    }
                ?>
                
                <div class="mi-panel">
                    <div class="panel-group">
                        <div class="panel panel-primary">
                            <div class="panel-heading"> Generar Usuarios (Intranet)</div>
                            <div class="panel-body" style="">
                                    <div class="row">
                                        <div class="col-lg-4 col-md-3 col-sm-2 col-xs-0"></div>
                                        <div class="col-lg-4 col-md-6 col-sm-8 col-xs-12">
                                            <div class="mi-panel" style="margin-top: 25px;">
                                                <div class="panel-group">
                                                    <div class="panel panel-primary" style="border-color: #b9def0;">
                                                        <div class="panel-body">
                                                            <div class="row">
                                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mipanel-row-fila row-fila">
                                                                    <label>AÑO DE PROGRAMACION:</label>
                                                                    <div>
                                                                        <select class="selectpicker form-control mipanel-combo" name="anioProg" id="anioProg">
                                                                            <?php
                                                                                $anioActual = (int)strftime("%Y");
                                                                                $selected = "selected";
                                                                                if(isset($anios)){
                                                                                    $anios = array_reverse($anios);
                                                                                    foreach( $anios as $anio){
                                                                                        if($anio == $anioActual){
                                                                                            $selected = "selected";
                                                                                        }else{
                                                                                            $selected = "";
                                                                                        }
                                                                            ?>
                                                                                        <option value="<?php echo $anio; ?>" <?php echo $selected; ?>><?php echo $anio; ?></option>
                                                                            <?php
                                                                                    }
                                                                                }
                                                                            ?>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mipanel-row-fila row-fila">
                                                                    <label>MES DE PROGRAMACION:</label>
                                                                    <div>
                                                                        <select class="selectpicker form-control mipanel-combo" name="mesProg" id="mesProg">
                                                                            <?php
                                                                                $mesActual = (int)strftime("%m");
                                                                                $selected = "selected";
                                                                                if(isset($meses)){
                                                                                    foreach($meses as $k => $v){
                                                                                        if($mesActual == $k){
                                                                                            $selected = "selected";
                                                                                        }else{
                                                                                            $selected = "";
                                                                                        }
                                                                            ?>
                                                                                    <option value="<?php echo $k; ?>" <?php echo $selected; ?>><?php echo $v; ?></option>
                                                                            <?php            
                                                                                    }
                                                                                }
                                                                            ?>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mipanel-row-fila row-fila">
                                                                    <label>TIPO DE USUARIO:</label>
                                                                    <div>
                                                                        <select class="selectpicker form-control mipanel-combo" name="tipoUsuario" id="tipoUsuario">
                                                                            <option value="" selected disabled hidden></option>
                                                                            <option value="3">ALUMNOS</option>
                                                                            <option value="2">DOCENTES</option>                                                                            
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mipanel-row-fila row-fila">
                                                                    <label></label>
                                                                    <div style="text-align: center;">
                                                                        <button class="btn btn-success mipanel-btn-img-texto" title="Generar usuarios" id="btnGenerar" type="button" style="width: auto"><span class="icon-cog" style="padding-right: 10px;"></span> Generar Usuarios</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>            
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-3 col-sm-2 col-xs-0"></div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>
</div>

<!-- Modal Loader -->
<div class="modal fade" id="modalLoader" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document" style="width: 100%; max-width:250px; height: auto; margin: 100px auto;">
        <div class="modal-content" style="height: auto;">
            <div class="" style="text-align: center; padding-top: 15px; padding-bottom: 0px; background-color: #F0F0F0;">
                <img src="<?php echo base_url('assets/img/loader.gif'); ?>" />
                <label style="text-align: center; width: 100%; color: #666666; margin-top: 5px; font-size: 13px;" id="labelL">
                    Generando usuarios...
                </label>
            </div>
        </div>
    </div>
</div>
<!-- End Modal Loader -->
<!-- Modal -->
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
