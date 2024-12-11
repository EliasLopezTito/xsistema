<?php 
    if($blanco == false){
?>
        <footer>
            
        </footer>
<?php        
    }
?>
        <script src="<?php echo base_url('assets/jquery/jquery-3.3.1.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/jquery/jquery-ui.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/bootstrap/bootstrap.min.js'); ?>" type="text/javascript"></script>    
        <script src="<?php echo base_url('assets/adminlte/adminlte.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/js/main.js'); ?>" type="text/javascript"></script>
        <!--
        <script src="<?php //echo base_url('assets/js/main.js'); ?>" type="text/javascript"></script>    
        -->
    <?php
        if(isset($jss)){
            foreach($jss as $js){
                echo "<script src=\"".base_url("assets/js/").$js."\" type=\"text/javascript\"></script>";
            }
        }
    ?>
    </body>
</html>