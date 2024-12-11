<header class="main-header">
    <a href="<?php echo base_url('main'); ?>" class="logo" style="background: linear-gradient(90deg, rgb(20%, 40%, 60%), rgb(22, 83, 172)); color: #fff;">
        <span class="logo-mini">
            <!--Begin /*PARA NAVIDAD EN SIGA*/-->
            <!-- <img src="<?php echo base_url('assets/img/logo-navideno.png'); ?>"> -->
            <!--End /*PARA NAVIDAD EN SIGA*/-->
            
            <img src="<?php echo base_url('assets/img/logo.png'); ?>">

        </span>
        <span class="logo-lg">
            <!--Begin /*PARA NAVIDAD EN IA - Jessica*/-->
            <!-- <img src="<?php echo base_url('assets/img/logo-navideno.png'); ?>"> <b>IAL</b> -->
            <!--End /*PARA NAVIDAD EN IA - Jessica*/-->

            <img src="<?php echo base_url('assets/img/logo.png'); ?>"> <b>IAL</b>
            
        </span>
    </a>
    <?php
    if(trim($_SERVER['REQUEST_URI']) == "/siga/main"){
    ?>
        <nav class="navbar navbar-static-top" style="background-image: url('assets/img/fondo_header.jpg');">
    <?php
    }else{
    ?>
        <nav class="navbar navbar-static-top" style="background-image: url('../assets/img/fondo_header.jpg');">
    <?php
    }
    ?>
        <a href="<?php echo base_url('main'); ?>" class="sidebar-toggle" style="padding-top: 10px; padding-bottom: 10px; font-size: 20px; color: #fff;">
            <b style="font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;">Sistema Integrado Gestión Académica</b>
        </a>
        <!-- <b  id="text-halloween">
                <span style="--i:1;">¿</span>
                <span style="--i:1;">D</span>
                <span style="--i:2;">u</span>
                <span style="--i:3;">l</span>
                <span style="--i:4;">c</span>
                <span style="--i:5; margin-right: 15px;">e </span>
                <span style="--i:7; margin-right: 15px;">o</span>
                <span style="--i:9;">T</span>
                <span style="--i:9;">r</span>
                <span style="--i:9;">a</span>
                <span style="--i:9;">v</span>
                <span style="--i:9;">e</span>
                <span style="--i:9;">s</span>
                <span style="--i:9;">u</span>
                <span style="--i:9;">r</span>
                <span style="--i:9;">a</span>
                <span style="--i:9; margin-right: 15px;">?</span>
                <span style="--i:9;">🎃</span>
        </b> -->
        
        <!-- <div id="tsparticles" style="max-height: 50px !important;"> -->
            <!-- <b  id="text-navidad">
                <span style="--i:1;">F</span>
                <span style="--i:2;">e</span>
                <span style="--i:3;">l</span>
                <span style="--i:4;">i</span>
                <span style="--i:5;">c</span>
                <span style="--i:6;">e</span>
                <span style="--i:7; margin-right: 10px;">s</span>
                <span style="--i:8;">F</span>
                <span style="--i:9;">i</span>
                <span style="--i:9;">e</span>
                <span style="--i:9;">s</span>
                <span style="--i:9;">t</span>
                <span style="--i:9;">a</span>
                <span style="--i:9; margin-right: 10px;">s</span>
                <span style="--i:9;">🎅 🎄</span>
            </b> -->
        <div class="navbar-custom-menu" style="float:right;" >
            <ul class="nav navbar-nav">
                <li class="dropdown tasks-menu">
                    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button" style="padding-top: 12px; padding-bottom: 12px; font-size: 25px; color: #fff;">
                        <i class="icon-menu"></i>
                    </a>
                </li>     
            </ul>
        </div>
        <!-- </div> -->
        
    </nav>
</header>