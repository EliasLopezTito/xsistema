<!DOCTYPE html>
<html>
    <head>
        <title>X | SISTEMA</title>        
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">   
		<!-- <link rel="shortcut icon" type="image/png" href="<?php echo base_url('assets/img/logo.png'); ?>">  -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="description" content="X Sistema">
        <link href="<?php echo base_url('assets/plugins/global/plugins.bundle.css'); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url('assets/css/style.bundle.css'); ?>" rel="stylesheet" type="text/css"/> 
        <!-- <link href="<?php echo base_url('assets/jquery/jquery-ui.min.css'); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url('assets/bootstrap/bootstrap.min.css'); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url('assets/adminlte/AdminLTE.min.css'); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url('assets/adminlte/_all-skins.css'); ?>" rel="stylesheet" type="text/css"/> -->
        <link href="<?php echo base_url('assets/notiflix/notiflix-2.7.0.min.css'); ?>" rel="stylesheet" type="text/css"/>
        <!-- <link href="<?php echo base_url('assets/icomoon/font-icomoon.css'); ?>" rel="stylesheet" type="text/css"/> -->
        <!-- <link href="<?php echo base_url('assets/css/main.css').'?v='.rand(1,50); ?>" rel="stylesheet" type="text/css"/> -->
        <!-- <link href="<?php echo base_url('assets/css/mobiscroll.jquery.min.css'); ?>" rel="stylesheet" type="text/css"/> -->
        <!-- <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/> -->
        <!-- <link href="<?php echo base_url('assets/jquery/jquery.dataTables.min.css'); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url('assets/jquery/buttons.dataTables.min.css'); ?>" rel="stylesheet" type="text/css"/> -->

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700"/>
        <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

        <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap.min.css">

        <link rel="stylesheet" href="https://cdn.datatables.net/rowgroup/1.4.0/css/rowGroup.dataTables.min.css">

        <?php
            if(isset($csss)){
                foreach($csss as $css){            
                    echo "<link href=\"".base_url("assets/css/").$css."\" rel=\"stylesheet\" type=\"text/css\" />";    
                }
            }        
        ?>
        
    </head>
    
    <?php 
        if($blanco == false){
    ?>
          <body
                id="kt_app_body"
                data-kt-app-layout="dark-sidebar"
                data-kt-app-header-fixed="true"
                data-kt-app-sidebar-enabled="true"
                data-kt-app-sidebar-fixed="true"
                data-kt-app-sidebar-hoverable="true"
                data-kt-app-sidebar-push-header="true"
                data-kt-app-sidebar-push-toolbar="true"
                data-kt-app-sidebar-push-footer="true"
                data-kt-app-toolbar-enabled="true"
                class="app-default"
            >
            <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
                <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
    <?php
        }else{
    ?>
        <body class="hold-transition skin-blue sidebar-mini">
        <!-- <div class="wrapper">   -->
    <?php
        }
    ?>