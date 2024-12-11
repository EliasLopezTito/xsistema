<!--
<aside class="main-sidebar" style="background-color: #1c4c75;">
    <section class="sidebar">
        <div class="user-panel" style="padding-top: 25px; padding-bottom: 25px;">
            <div class="pull-left image">
                <img src="<?php echo base_url('assets/img/user.png'); ?>" class="img-circle" alt="User Image" style="padding-top: 7px;">
            </div>
            <div class="pull-left info" style="color: #fff;">
                <p style="margin-bottom: 3px;"><?php echo substr(ucwords(strtolower($this->session->userdata("apellidos"))),0,20); ?></p>
                <p style="margin-bottom: 3px;"><?php echo substr(ucwords(strtolower($this->session->userdata("nombres"))),0,20); ?></p>
                <p style="margin-bottom: 3px;"><?php echo $this->session->userdata("cod_emp"); ?></p>
            </div>
        </div>

        <ul class="sidebar-menu" data-widget="tree">
            <li class="header">MENU DE OPCIONES</li>
            <li>
                <a href="<?php echo base_url('Docente/notas'); ?>" class="menu-item">
                    <i class="icon-pencil" style="margin-right: 5px;"></i>
                    <span>Reg. Notas</span>
                </a>
            </li>
            <li>
                <a href="<?php echo base_url('Docente/asistencias'); ?>" class="menu-item">
                    <i class="icon-user-check" style="margin-right: 5px;"></i>
                    <span>Reg. Asistencia</span>
                </a>
            </li>
            <li>
                <a href="<?php echo base_url('Docente/horario'); ?>" class="menu-item">
                    <i class="icon-calendar" style="margin-right: 5px;"></i>
                    <span>Horario</span>
                </a>
            </li>
            <li>
                <a href="<?php echo base_url('Docente/cargaHoraria'); ?>" class="menu-item">
                    <i class="icon-stats-bars" style="margin-right: 5px;"></i>
                    <span>Carga Horaria</span>
                </a>
            </li>
            <li>
                <a href="<?php echo base_url('Docente/disponibilidad'); ?>" class="menu-item">
                    <i class="icon-hour-glass" style="margin-right: 5px;"></i>
                    <span>Disponibilidad</span>
                </a>
            </li>
            <li>
                <a href="<?php echo base_url('Docente/biblioteca'); ?>" class="menu-item">
                    <i class="icon-books" style="margin-right: 5px;"></i>
                    <span>Biblioteca</span>
                </a>
            </li>
            <li>
                <a href="<?php echo base_url('Docente/seguridad'); ?>" class="menu-item">
                    <i class="icon-wrench" style="margin-right: 5px;"></i>
                    <span>Seguridad</span>
                </a>
            </li>
            <li>
                <a href="<?php echo base_url('Auth/cerrarSession'); ?>" class="menu-item">
                    <i class="icon-exit" style="margin-right: 5px;"></i>
                    <span>Salir</span>
                </a>
            </li>
        </ul>
    </section>
</aside>
-->