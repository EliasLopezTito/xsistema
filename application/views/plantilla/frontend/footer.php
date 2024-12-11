
<!-- EFECTO NIEVE - PARA TEMPORADA NAVIDEÑA -->
<!-- <div id="snowflakes-container" style="width: 100vw;height: 100vh;position: absolute;overflow: hidden;top: 0;z-index:-1"></div> -->

<!-- EFECTO NIEVE - PARA TEMPORADA NAVIDEÑA - END -->

    
    <!-- <img src="<?php echo base_url('assets/img/pumpkin01.png'); ?>" width="100" height="100" class="pumpkin01">
    <img src="<?php echo base_url('assets/img/spider.png'); ?>"  width="100" class="spider">  -->

<?php 
    if($blanco == false){
?>
        <footer class="main-footer">
            <div style="position: relative;">
                <div style="position: absolute; background: linear-gradient(90deg, rgb(20%, 40%, 60%), rgb(22, 83, 172)); width: 231px; height: 30px; left: -246px; bottom: -24px;"></div>
            </div>
            <div class="pull-right hidden-xs">
                <b>Version</b> 2.5
            </div>
            Copyright &copy; 2024 <strong><a href="http://www.arzobispoloayza.edu.pe" target="_blank"> Instituto Arzobispo Loayza.</a></strong> Todos los derechos reservados.
        </footer>
        
    </div>
<?php        
    }
?>
    <div id="snowflakes-container" style="width: 100vw;height: 100%;position: absolute;overflow: hidden;top: 0;z-index:-1;"></div>
    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>  
        <script src="https://unpkg.com/magic-snowflakes/dist/snowflakes.min.js"></script>        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
        <script src="<?php echo base_url('assets/plugins/global/plugins.bundle.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/js/scripts.bundle.js'); ?>" type="text/javascript"></script>
        <!-- <script src="<?php echo base_url('assets/bootstrap/bootstrap.min.js'); ?>" type="text/javascript"></script>    
        <script src="<?php echo base_url('assets/adminlte/adminlte.min.js'); ?>" type="text/javascript"></script> -->
        <script src="<?php echo base_url('assets/notiflix/notiflix-2.7.0.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/js/main.js').'?v='.rand(1,50); ?>" type="text/javascript"></script>

        <!-- <script src="<?php echo base_url('assets/jquery/jquery.dataTables.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/jquery/dataTables.buttons.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/jquery/jszip.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/jquery/buttons.html5.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/jquery/buttons.print.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/jquery/pdfmake.min.js'); ?>" type="text/javascript"></script> -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>


        <!-- <script src="<?php echo base_url('assets/jquery/chart.min.js'); ?>" type="text/javascript"></script>
        <script src="<?php echo base_url('assets/jquery/chartjs-plugin-datalabels@2.0.js') ?>" type="text/javascript"></script>

        <script src="<?php echo base_url('assets/jquery/mobiscroll.jquery.min.js') ?>" type="text/javascript"></script> -->

        <!-- first include tsParticles engine -->
        <script src="https://cdn.jsdelivr.net/npm/tsparticles-engine"></script>

        <!-- then include any tsParticles plugin needed -->
        <script src="https://cdn.jsdelivr.net/npm/tsparticles/tsparticles.bundle.min.js"></script>

        <!-- then include jquery wrapper -->
        <script src="https://cdn.jsdelivr.net/npm/jquery-particles"></script>

        <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

        <script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>  

        <script src="https://cdn.datatables.net/rowgroup/1.4.0/js/dataTables.rowGroup.min.js"></script>  

        
        
    <?php
        if(isset($jss)){
            foreach($jss as $js){
				//Se agregó la versión aleatoriamente al final de la ruta js para limpiar cache cada vez q se referencia 
				//Author Huancollo Chambi Jessica
				//echo "<script src=\"".base_url("assets/js/").$js."\" type=\"text/javascript\"></script>";
                echo "<script src=\"".base_url("assets/js/").$js."?v=".rand(1,50)."\" type=\"text/javascript\"></script>";
            }
        }
    ?>
    </body>
</html>