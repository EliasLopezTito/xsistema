<!DOCTYPE html>
<html>
    <head>
        <title>SIGA | LOAYZA</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">        
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <link href="<?php echo base_url('assets/bootstrap/bootstrap.min.css'); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url('assets/adminlte/AdminLTE.min.css'); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url('assets/adminlte/_all-skins.css'); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url('assets/icomoon/font-icomoon.css'); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url('assets/css/main.css'); ?>" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
        
        <?php
            if(isset($csss)){
                foreach($csss as $css){            
                    echo "<link href=\"".base_url("assets/css/").$css."\" rel=\"stylesheet\" type=\"text/css\" />";    
                }
            }        
        ?>
        
    </head>
    <!--<body class="hold-transition skin-blue sidebar-mini">-->
    <body style="background-color: #e0e0e0;">    
        
        