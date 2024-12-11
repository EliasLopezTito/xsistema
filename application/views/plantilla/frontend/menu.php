<?php
    $nivel1 = $this->session->userdata('nivel1');
    $nivel2 = $this->session->userdata('nivel2');
    $nivel3 = $this->session->userdata('nivel3');
    $usuario = $this->session->userdata("usuario");
    $apellido = $this->session->userdata("apellido");
    $nombre = $this->session->userdata("nombre");
    $area_descrip = $this->session->userdata("area_descrip");
    $id_area = $this->session->userdata("id_area");
    $href = "";
?>

<aside class="main-sidebar" style="background: linear-gradient(90deg, rgb(20%, 40%, 60%), rgb(22, 83, 172));">
    <section class="sidebar">
        <div class="user-panel" style="padding-top: 25px; padding-bottom: 25px;">
            <div class="pull-left image" style="margin-top: 7px;">
                <img src="<?php echo base_url('assets/img/user.png'); ?>" class="img-circle" alt="User Image" title="<?php echo $this->session->userdata('usuario'); ?>">
            </div>
            <div class="pull-left info" style="color: #fff;">
                <p style="font-size:14px;margin-bottom: 1px"><?php echo ucwords(strtolower($apellido)); ?></p>
                <p style="font-size:14px;margin-bottom: 3px"><?php echo ucwords(strtolower($nombre)); ?></p>
                <p style="font-size:14px;margin-bottom: 3px"><?php echo $usuario; ?></p>
                <p style="font-size:14px"><?php echo substr($area_descrip, 0,18); ?></p>
            </div>
        </div>

        <!-- NAVIDAD -->
        <!-- <div class="user-panel" style="display: flex; align-items: center; justify-content: space-between;">
            <div class="image" style="margin-top: 7px;">
                <img src="<?php echo base_url('assets/img/user.png'); ?>" class="img-circle" alt="User Image" title="<?php echo $this->session->userdata('usuario'); ?>">
            </div>
            <div class="info" style="color: #fff; position: static;">
                <p style="font-size:14px;margin-bottom: 1px"><?php echo ucwords(strtolower($apellido)); ?></p>
                <p style="font-size:14px;margin-bottom: 3px"><?php echo ucwords(strtolower($nombre)); ?></p>
                <p style="font-size:14px"><?php echo $usuario; ?></p>
                
            </div>
            <div style="display: grid; text-align: center;">
                <div class="estrella">🌟</div>
                <div id="arbol"></div>
            </div>
        </div> -->
        <!-- NAVIDAD -->
        <ul class="sidebar-menu" data-widget="tree">
            <li class="header">MENU DE OPCIONES</li>

            <?php
                if($nivel1 != null && $nivel1 != "vacio"){
                    foreach($nivel1 as $n1){
                        
						$class = "";
						$target = "";
						if($n1->href == "#"){
							$class = "treeview";
							$target = "";
						}else{
							$class = "";
							$target = "_blank";
						}
            ?>

                        <?php         
                            foreach($nivel2 as $n2){
                                $break = "no";  
                                if($n2->padre === $n1->id_menu){                                                        
                                    foreach($nivel3 as $n3){                  
                                        if($n3->padre === $n2->id_menu){
                                            if( $n3->href == str_replace('/siga/','',$_SERVER['REQUEST_URI']) ){
                                                $break = "si";
                                                $active1 = "active";
                                                break;
                                            }else{
                                                $active1 = "";
                                            }                                                                                            
                                        }
                                    }    
                                }
                                if($break === "si" ){
                                    break;
                                }
                            }
                        ?>
                        
                        
                        <li class="<?=$class?> <?=(isset($active1)?$active1:'')?>">
                            <a href="<?=base_url($n1->href)?>" class="menu-item" target="<?=$target?>" >
                                <i class="<?=$n1->icono?>" style="margin-right: 5px;"></i>
                                <span><?=$n1->descripcion?></span>
                            </a>
            
                            
            <?php
                        if($nivel2 != null && $nivel2 != "vacio"){
            ?>
                            <ul class="treeview-menu">
            <?php                    
                            foreach($nivel2 as $n2){
                                                                                                             
                                foreach($nivel3 as $n3){                  
                                    if($n3->padre === $n2->id_menu){
                                        if( $n3->href == str_replace('/siga/','',$_SERVER['REQUEST_URI']) ){
                                            $break2 = "si";
                                            $active2 = "active";
                                            break;
                                        }else{
                                            $active2 = "";
                                        }                                                                                            
                                    }
                                }    
                        
                                if($n2->padre == $n1->id_menu){
            ?>
                                <li class="treeview <?=(isset($active2)?$active2:'')?>"><!--active-->
                                    <a href="#" class="sub-menu-item">
                                        <i class="<?php echo $n2->icono; ?>"></i> <?php echo $n2->descripcion; ?>
                                    </a>
            <?php
                                        if($nivel3 != null && $nivel3 != "vacio"){
            ?>
                                                <ul class="treeview-menu">
            <?php
                                            foreach($nivel3 as $n3){
                                                if($n3->padre == $n2->id_menu){
            ?>
                                                    <li><a href="<?=base_url($n3->href)?>" class="item" style="<?=($n3->href === str_replace('/siga/','',$_SERVER['REQUEST_URI'])?'color:#003bff':'')?>"> <?=$n3->descripcion?></a></li>
            <?php                                    
                                                }
                                            }
            ?>
                                                </ul>
            <?php
                                        }
            ?>                            
                                </li>
            <?php                    
                                }
                            }
            ?>
                            </ul>
            <?php                    
                        }
            ?>
                        </li> 
            <?php            
                    }
                }
            ?>
            
            <li>
                <a href="<?php echo base_url('auth/cerrarsession'); ?>" class="menu-item">
                    <i class="icon-switch" style="margin-right: 5px;"></i>
                    <span>Salir</span>
                </a>
            </li>
                        
            <!--
            <li class="treeview">
                <a href="#" class="menu-item">
                    <i class="icon-cog" style="margin-right: 5px;"></i>
                    <span>Programacion</span>
                </a>                            
                <ul class="treeview-menu">
                    <li class="treeview">
                        <a href="#" class="sub-menu-item"><i class="icon-play3"></i> Archivo</a>
                        <ul class="treeview-menu">
                            <li><a href="#" class="item"> Pabellon</a></li>
                            <li><a href="#" class="item"> Secciones</a></li>
                            <li><a href="#" class="item"> Adm. Secciones</a></li>
                            <li><a href="#" class="item"> Adm. Docentes</a></li>
                            <li><a href="#" class="item"> Cursos Ministerio</a></li>
                            <li><a href="#" class="item"> Cursos Internos</a></li>
                            <li><a href="#" class="item"> Curricula Interna</a></li>
                        </ul>
                    </li>
                    <li class="treeview">
                        <a href="#" class="sub-menu-item"><i class="icon-play3"></i> Procesos</a>
                        <ul class="treeview-menu">
                            <li><a href="#" class="item"> Trasladar Program</a></li>
                            <li><a href="#" class="item"> Importar Program</a></li>
                            <li><a href="#" class="item"> Importar Docente</a></li>
                        </ul>
                    </li>
                    <li class="treeview">
                        <a href="#" class="sub-menu-item"><i class="icon-play3"></i> Prog. Interna</a>
                        <ul class="treeview-menu">
                            <li><a href="#" class="item"> Disponibilidad</a></li>
                            <li><a href="#" class="item"> Prog. Vacaciones</a></li>
                            <li><a href="#" class="item"> Iniciando Prog</a></li>
                            <li><a href="#" class="item"> Prog. Cic. Sup</a></li>
                        </ul>
                    </li>
                    <li class="treeview">
                        <a href="#" class="sub-menu-item"><i class="icon-play3"></i> Consultas</a>
                        <ul class="treeview-menu">
                            <li><a href="#" class="item"> Consulta en linea</a></li>
                        </ul>
                    </li>
                    <li class="treeview">
                        <a href="#" class="sub-menu-item"><i class="icon-play3"></i> Reportes</a>
                        <ul class="treeview-menu">
                            <li><a href="<?php //echo base_url('programacion/listados'); ?>" class="item"> Imprimir Listas</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="treeview">
                <a href="#" class="menu-item">
                    <i class="icon-books" style="margin-right: 5px;"></i>
                    <span>Planilla</span>
                </a>                            
                <ul class="treeview-menu">
                    <li class="treeview">
                        <a href="#" class="sub-menu-item"><i class="icon-play3"></i> Reportes</a>
                        <ul class="treeview-menu">
                            <li><a href="<?php //echo base_url('planilla/generaExcelPlanillaElectronica'); ?>" class="item"> Env. Electronico Planilla</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            -->
        </ul>
    </section>
</aside>