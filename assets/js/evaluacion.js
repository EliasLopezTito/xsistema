$(document).ready(function(){
    
});

$("#btnGrabar").click(function(){
    var campos = document.getElementById("frmEncuesta").elements;
    var preguntas = $("#nroPreguntas").val();
    var radios = 0;
    for (var i = 0; i < campos.length; i++) {
        if (campos[i].type == "radio" && campos[i].checked){
            radios += 1;
        }
    }
    
    if(preguntas == radios){
        var target = path + "encuesta/registrar";
        $("#frmEncuesta").attr("action",target);
        $("#frmEncuesta").attr("target","");
        $("#frmEncuesta").submit();
        return true;
    }else{
        alert("Debe responder todas las preguntas para finalizar la encuesta");
    }
});
