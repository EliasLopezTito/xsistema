  <div class="container-fluid">
  <div class="panel-default panel-primary" style="margin:0 -10px; ">
    <div class="panel-group">
      <div class="panel panel-primary">
        <div class="panel-heading">Asignacion de Permisos A Grupos de Usuario </div>
        <div class="panel-body">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-lg-10 col-md-8 col-sm-12 col-xs-12" style="text-align: left; margin-left: 12px; font-weight: bold;" >
              <label for="" class="text-primary">GRUPO USUARIO:</label>
            </div>
            <div class="col-lg-3 col-md-8 col-sm-12 col-xs-12" style="text-align: left; margin-left: 12px; " >
                <select name="grupousuario" id="grupousuario" class="selectoption">
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
            <div class="row" style="margin: 0px 10px; ">
              <div class="col-lg-7 col-sm-12" style="padding:0 0 0 5px;">
              
                <div class="controls">
                  <button class="btn btn-success btn-sm">Ocultar<span class="icon-list" style="margin: 0px 10px;"></button>
                  <button class="btn btn-info btn-sm">Desplegar<span class="icon-tree" style="margin: 0px 10px;"></span></button>
                  <button class="btn btn-warning btn-sm">Activar Todos<span class="icon-checkbox-checked" style="margin: 0px 10px;"></span></button>
                  <button class="btn btn-danger btn-sm">Desactivar Todos<span class="icon-checkbox-unchecked" style="margin: 0px 10px;"></span></button>
                  <button class="btn btn-success btn-sm" type="button" id="btnasignarpermiso"> ASIGNAR PERMISOS  <span class="icon-key"></span></button>
                </div>
              </div>
            </div>

            <div class="row" style="margin: 0px 10px;">
              <form action="" id="frmpermisos">
                <input type="hidden" id="idgrupousuario" name="grupousuario">
                <div class="col-lg-7 col-sm-12 table-responsive treemenucontenido">
                      <ul class="tree" id="tree">
                          <?php
                              if($nivel1 != null && $nivel1 != "vacio"){
                                  foreach ($nivel1 as $n1) {
                          ?>
                        <li class="has">
                          <input type="checkbox" name="menus[]" value="<?php echo $n1->MENU; ?>" >
                          <!-- <span class="icon-folder-plus" style="margin: 0px 10px;"> -->
                          <label><?php echo $n1->DESCRIPCION; ?><span class="total"></span></label>  
                                <!-- Nivel 2 -->
                                <ul id="treeChild">
                                  <?php 
                                     if($nivel2 != null && $nivel2 != "vacio"){
                                        foreach ($nivel2 as $n2) {
                                          if ($n1->MENU==$n2->PADRE) {
                                  ?>
                                    <li class="has">
                                      <input type="checkbox" name="menus[]" value="<?php echo $n2->MENU; ?>">
                                      <label><?php echo $n2->DESCRIPCION; ?> <span class="total"></span></label>
                                      <!-- Nivel 3 -->
                                      <ul id="treeSubChild">
                                        <?php 
                                             if($nivel3 != null && $nivel3 != "vacio"){
                                            foreach ($nivel3 as $n3) {
                                               if ($n2->MENU==$n3->PADRE) {
                                        ?>
                                          <li>
                                            <input type="checkbox" name="menus[]" value="<?php echo $n3->MENU; ?>">
                                            <label><?php echo $n3->DESCRIPCION; ?></label>
                                          </li>
                                        <?php 

                                              }
                                            }
                                          }
                                        ?>
                                      </ul>
                                    </li>
                                      <!-- Fin Nivel 3 -->
                                  <?php 
                                      }
                                    }
                                  }
                                  ?>
                                </ul>
                                <!-- Fin Nivel 2 -->
                            <?php 
                                }
                              }
                            ?>
                        </li>
                      </ul>
                  <div id="listerror">
                  </div>
                </div>
              </form>

            </div>
          </div>
        <div class="panel-footer">
          <div class="row">
            <div id="totalseleccionado" class="col-lg-7 col-sm-12" style="font-size: 13px; font-weight: bold; text-align: right;" ></div>
          </div>
          <div class="row">
            <div class="col-lg-7 col-sm-12" style="margin-left: 12px;">
              <div id="errorGuardar">
              </div>
            </div>
          </div>
        </div>

        </div>        
    </div>
  </div>

  </div>