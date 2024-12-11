  <div class="panel-default panel-primary" style="margin: 5px;">
    <div class="panel-group">
      <div class="panel panel-primary">
        <div class="panel-heading">Formulario de Grupo Usuario</div>
        <div class="panel-body">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-lg-4 col-md-8 col-sm-12 col-xs-12" style="text-align: left; margin-left: 12px; " >
              <label>Usuario:</label>
              <div class="input-group">
                <input type="text" name="usuariobuscar" id="usuariobuscar" class="form-control">
                <span class="input-group-btn">
                    <button class="btn boton-buscar" title="Buscar Usuario" onclick="listausuario();" style="margin-left: 1px; border-radius: 2px;" type="button"><span class="icon icon-search"></span></button>
                </span>
                <span class="input-group-btn">
                    <button class="btn boton-buscar" title="Nuevo Usuario" id="nuevousuario" style="margin-left: 1px; border-radius: 2px;" type="button"><span class="icon icon-users"></span></button>
                </span>
              </div>
            </div>
          </div>
          
          <div class="col-lg-6 col-sm-12 table-responsive">
            <table class="table table-condensed table-bordered mi-tabla" id="listausuario" style="margin-bottom: 0px;">
                <thead>
                  <tr>
                    <th style="width: 3%;" class="celda-centrada">#</th>
                    <th style="width: 15%;" class="celda-centrada">USUARIO</th>
                    <th style="width: 30%;" class="celda-centrada">APELLIDOS Y NOMBRES</th>
                    <th style="width: 15%;" class="celda-centrada">GRUPO USUARIO</th>
                    <th style="width: 17%;" class="celda-centrada">ESTADO</th>
                    <th style="width: 10%;" class="celda-centrada">Accion</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
                <tfoot>
                </tfoot>
            </table>
            <div id="mensajelist">
              
            </div>
          </div>
        </div>
        <div class="panel-footer">
        </div>
      </div>
    </div>
  </div>



<!-- Modal para usuario -->
<!-- modal fade bd-example-modal-lg ui-draggable in -->
<div class="modal fade bd-example-modal-lg ui-draggable in" id="idmodalnuevousuario" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" >
  <div class="modal-dialog" role="document" style="width: 400px;">
    <form action="" class="" id="idformusuario" method="POST">
      <div class="modal-content" style="height: auto; vertical-align: middle">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <label class="modal-title" id="myModalLabel">Nuevo Usuario</label>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila">
              <div>
                <label>Persona:</label>
              </div>
              <div>
                <input type="hidden" name="" id="idusuario">
                <div class="input-group">
                  <input type="hidden" name="idpersona" id="idpersona" class="form-control">
                  <input type="text" name="persona" id="persona" class="form-control" disabled="">
                  <span class="input-group-btn">
                      <button class="btn boton-buscar" title="Seleccionar Persona" id="idbtnseleccionarpersona" style="margin-left: 1px; border-radius: 2px;" type="button"><span class="icon icon-users"></span></button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila">
              <div>
                <label>Grupo Usuario:</label>
              </div>
              <div>
                <!-- <input type="hidden" name="grupousuarioid" id="grupousuarioid">
                <input type="text" name="grupousuario" id="grupousuario" /> -->
                <select name="grupousuario" id="grupousuario">
                    <option value="">[SELECCIONE]</option>
                    <?php 
                      if ($grupousuario!='error') {
                        foreach ($grupousuario as $listagrupousuario) {
                          echo "<option value='".$listagrupousuario->GRUPO_USUARIO."'>".$listagrupousuario->DESCRIPCION."</option>";
                        }
                      }
                    ?>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila">
              <div>
                <label>Usuario:</label>
              </div>
              <div>
                <input type="hidden" name="usuarioE" id="usuarioE" />
                <input type="text" name="usuario" id="usuario" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila">
              <div>
                <label>Password:</label>
              </div>
              <div>
                <input type="password" name="password1" id="password1" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila">
              <div>
                <label>Confirmar Password:</label>
              </div>
              <div>
                <input type="password" name="password2" id="password2" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row-fila">
              <div>
                <label>Estado:</label>
              </div>
              <div>
                <select name="estado" id="estado">
                  <option value="0">Activo</option>
                  <option value="1">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-7 col-sm-7 col-sm-7 col-xs-7 row-fila"></div>
            <div class="col-lg-4 col-sm-4 col-sm-4 col-xm-4 row-fila" style="margin: 10px 0px 0px 30px;">
              <button type="button" class="btn btn-primary" id="btnguardar">Gruardar</button>
              <button type="button" class="btn btn-success" id="btnactualizar">Actualizar</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
            <div class="" id="errorGuardar" hidden="hidden" style="padding: 10px; margin: 5px; text-align: left;">
            </div>
        </div>
        
      </div>
    </form>
  </div>
</div>
<!-- Fin modal Usuario -->


<!-- Modal para seleccionar Persona -->
<div class="modal fade" id="idmodalpersona" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document" style="width: 500px;">
        <div class="modal-content" style="height: auto; vertical-align: middle">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <label class="modal-title" id="myModalLabel">Buscar Persona</label>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 row-fila">
                        <div>
                            <label>Paterno:</label>
                        </div>
                        <div>
                            <input type="text" name="idpaternoBusP" id="idpaternoBusP" />
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 row-fila">
                        <div>
                            <label>Materno:</label>
                        </div>
                        <div>
                            <input type="text" name="idmaternoBusP" id="idmaternoBusP" />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 row-fila">
                        <div>
                            <label>Nombres:</label>
                        </div>
                        <div>
                            <input type="text" name="idnombresBusP" id="idnombresBusP" />
                        </div>
                    </div>                            
                </div><br />
                <div class="row row-fila">
                    <div class="col-lg-12 table-responsive scrollVertical" style="height: 300px;">
                        <table class="table table-condensed table-bordered mi-tabla" id="idtablaBuscarPersona">
                            <thead>
                                <tr>
                                    <th class="celda-centrada">Apellidos y Nombres</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                            <tfoot>                                    
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 row-fila" id="msjError" style="display: none">                                
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Fin modal Persona -->     

