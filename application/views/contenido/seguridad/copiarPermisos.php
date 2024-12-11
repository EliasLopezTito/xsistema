<div class="content-wrapper">
    <section class="content">
        <div class="row">
            <section class="col-lg-12 connectedSortable">
                
                <div class="mi-panel">
                    <div class="panel-group">
                        <div class="panel panel-primary">
                            <div class="panel-heading"> Copiar Permisos </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-4">
                                                <label>ÁREA :</label>
                                                <select class="selectpicker form-control mipanel-combo" id="area">
                                                    <option value="0">TODAS LAS ÁREAS</option>
                                                    <?php foreach ($areas as $key => $area): ?>
                                                        <option value="<?=$area->id_area?>"><?=$area->descripcion?></option>
                                                    <?php endforeach ?>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    

                                    <div class="col-lg-12 mipanel-row-fila row-fila">
                                        <label>USUARIO INICIAL:</label>
                                        <select class="selectpicker form-control mipanel-combo usuarios_class" id="usuario1">
                                    
                                        </select>
                                    </div>
                                    
                                    <div class="col-lg-12 mipanel-row-fila row-fila">
                                        <label>USUARIO :</label>
                                        <select class="selectpicker form-control mipanel-combo usuarios_class" id="usuario2">
                                    
                                        </select>
                                    </div>

                                    <div class="col-lg-offset-5 col-lg-2 col-md-offset-4 col-md-4">

                                        <button class="btn btn-success btn-block mipanel-btn-img-texto" id="btnCopiarPermisos" style="margin:10px 0"> <span class="icon-copy"></span> Copiar Permisos </button>

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

<!-- Modal Loader -->
<div class="modal fade" id="modalLoader" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div id="preloader">
        <div id="preloader-inner"></div>
        <div class="text-loader"></div>
    </div>
</div>
<!-- Fin Modal Loader -->