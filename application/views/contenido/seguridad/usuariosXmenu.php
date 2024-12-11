<div class="content-wrapper">
    <section class="content">
        <div class="row">
            <section class="col-lg-12 connectedSortable">
                
                <div class="mi-panel">
                    <div class="panel-group">
                        <div class="panel panel-primary">
                            <div class="panel-heading"> Usuarios X Menu </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-lg-10 col-md-12 col-sm-12 col-xs-12">
                                        <div>
                                            <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 mipanel-row-fila row-fila">
                                                <label>MENU:</label>
                                                <select required class="selectpicker form-control mipanel-combo class-remove-id" id="menu" name="menu">
                                                    <option value="">TODOS</option>
                                                    <?php foreach ($menus as $key => $menus): ?>
                                                        <option value="<?=$menus->descripcion?>"><?=$menus->descripcion?></option>
                                                    <?php endforeach ?>                                                                            
                                                </select>
                                            </div>
                                            <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 mipanel-row-fila row-fila">
                                                <label>ESTADO:</label>
                                                <div>
                                                    <select class="selectpicker form-control mipanel-combo" id="filtrar__estado">
                                                        <option value="2">TODOS</option>
                                                        <option value="1">INACTIVO</option>
                                                        <option value="0">ACTIVO</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-2 col-md-4 col-sm-12 col-xs-12 mipanel-row-fila row-fila" style="margin-top: 21px;">
                                            <button class="btn btn-success mipanel-btn-img-texto btn-block" id="btnBuscar" type="button" ><span class="icon-search"></span> </button>
                                        </div>
                                    </div>  
                                </div>
                                <div class="mi-panel" style="margin-top: 25px;"  id="listado_menu">
                                    <div class="panel-group">
                                        <div class="panel panel-primary" style="border-color: #b9def0;">
                                            <div class="panel-heading" style="background-color: #b9def0; color: #286090;"> Lista </div>
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive" style="padding-top: 5px; padding-bottom: 5px;">                                                            
                                                        <table class="table table-condensed table-bordered mi-tabla" style="margin-bottom: 0px;" id="tablaUsuariosXmenu">
                                                            <thead>
                                                                <tr>
                                                                    <th style="" class="celda-centrada">Area</th>
                                                                    <th style="" class="celda-centrada">ID Usuario</th>
                                                                    <th style="" class="celda-centrada">Usuario</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>                                                               
                                                            </tbody>                                                            
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
<div class="modal fade" id="modalLoader" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div id="preloader">
        <div id="preloader-inner"></div>
        <div class="text-loader"></div>
    </div>
</div>