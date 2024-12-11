$(document).ready(function(){
    /*$("#pabellon").attr("disabled", "disabled");
    $("#piso").attr("disabled", "disabled");
    $("#aula").attr("disabled", "disabled");
    
    cargarInstituciones(false);
    cargarSedes();
    cargarPabellones();
    cargarPisos();
    cargarComboAulas();
    activarBotonesRptIndividuales(false);*/
});

$("#btnExcel").click(function (){
    var target = path + "programacion/rptRelacionDocenteAvanceCurso";
    $("#frmRptRelacionDocenteAvanceCurso").attr("action",target);
    $("#frmRptRelacionDocenteAvanceCurso").attr("target","_blank");
    $("#frmRptRelacionDocenteAvanceCurso").submit();
});


