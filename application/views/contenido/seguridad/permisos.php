<div class="content-wrapper">
    <section class="content">
        <div class="row">
            <section class="col-lg-12 connectedSortable">
                
                <div class="mi-panel">
                    <div class="panel-group">
                        <div class="panel panel-primary">
                            <div class="panel-heading"> Seguridad - Permisos</div>
                            <div class="panel-body" style="">
                                <div class="row">
                                    
                                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mipanel-row-fila row-fila">
                                        <label>USUARIO:</label>
                                        <div class="inner-addon right-addon form-group has-error">
                                            <input type="text" id="usuarios" class="form-control" placeholder="Ingresa código o nombres"/>
                                            <i class="glyphicon glyphicon-remove"></i>
                                        </div>
                                    </div>
                                    
                                    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 mipanel-row-fila row-fila seccion_menu" style="display: none;">
                                        <label for="">MENUS</label>
                                        <div>
                                            <select  class="selectpicker form-control mipanel-combo" id="filtrar__area">
                                                <option value="0">TODOS</option>
                                                <?php
                                                    if ($listaMenus != null && $listaMenus != "vacio") {
                                                        foreach ($listaMenus as $listaMenus) {
                                                ?>
                                                            <option value="<?php echo 'id_'.$listaMenus->id_menu; ?>"><?php echo strtoupper($listaMenus->descripcion); ?></option>
                                                <?php
                                                    }
                                                }
                                                ?>
                                            </select>
                                        </div>
                                    </div>

                                    <style>

                                        #rowButton{
                                            position: fixed;
                                            bottom: 30px;
                                            right: 30px;
                                            z-index: 999;
                                        }

                                    </style>

                                    <div style="text-align: center; font-weight: bold; display: none" id="rowButton">
                                        <button class="btn btn-success" title="Actualizar Permisos" id="btnGuardarPermisos" type="button" style="width: auto;">ACTUALIZAR PERMISOS</button>
                                    </div>

                                    

                                    <!--<div class="row" id="rowButton" style="display: block;">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mipanel-row-fila row-fila">
                                            <div style="text-align: center; font-weight: bold;">
                                                <button class="btn btn-success" title="Actualizar Permisos" id="btnGuardarPermisos" type="button" style="width: auto;">Actualizar Permisos</button>
                                            </div>
                                        </div>
                                    </div>-->
                                    <!-- <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12 mipanel-row-fila row-fila">
                                        <label></label>
                                        <div>
                                            <button class="btn btn-success mipanel-btn-img-texto" title="Ver permisos" id="btnVerPermisos" type="button" style="width: 100%"><span class="icon-search" ></span>Ver permisos</button>
                                        </div>
                                    </div> -->
                                </div>
                                        
                                <div class="mi-panel" style="display: block;">
                                    <div class="panel-group">
                                        <div class="panel panel-primary" style="border-color: #b9def0;">
                                            <div class="panel-heading" style="background-color: #b9def0; color: #286090;"> Permisos Usuarios</div>
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-lg-12 table-responsive" style="padding-top: 5px; padding-bottom: 5px;">
                                                        <table class="table table-condensed table-bordered tabla-permisos"  style="margin-bottom: 0px;" id="tablaPermisos">
                                                            <thead>
                                                                <tr>
                                                                    <th style="width: 2%;" class="celda-centrada">ID</th>
                                                                    <th style="width: 20%;" class="celda-centrada">Nivel I</th>
                                                                    <th style="width: 20%;" class="celda-centrada">Nivel II</th>
                                                                    <th style="width: 20%;" class="celda-centrada">Nivel III</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                
                                                            </tbody>
                                                            <tfoot>                                
                                                            </tfoot>
                                                        </table>
                                                    </div>                            
                                                </div>
                                                
                                            </div>            
                                        </div>
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

<template id="templateCbo">
    <label class="checkbox-inline">
        <input type="checkbox" id="checkMenu"><span></span>
    </label>
</template>