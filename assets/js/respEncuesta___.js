/*var path = "http://istalcursos.edu.pe/egresados/";*/

$("#btnGrabar").click(function(){
    var campos = document.getElementById("frmEncuesta").elements;
    var preguntas = $("#nroPreguntas").val();
    var radios = 0;
    for (var i = 0; i < campos.length; i++) {
        if (campos[i].type == "radio" && campos[i].checked){
            radios += 1;
        }
    }
    $("#frmEncuesta").submit();
        return true;
    /*if(preguntas == radios){
        $("#frmEncuesta").submit();
        return true;
    }else{
        $("#frmEncuesta").submit();
        return true;|||
        //alert("Debe responder todas las preguntas para finalizar la encuesta");
    }*/
});

/*
function validarDatos(){
    var error = "";
    if($("#usuario").val().trim() == ""){
        $("#error").html("Ingrese su Usuario");
        $("#error").css({"display":"block"});
        $("#usuario").focus();
        error = "Ingrese su Usuario"
    }
    if($("#password").val().trim() == ""){
        $("#error").html("Ingrese su Password");
        $("#error").css({"display":"block"});
        $("#password").focus();
        error = "Ingrese su Password";
    }
    if($("#usuario").val().trim() == "" && $("#password").val().trim() == ""){
        $("#error").html("Ingrese su Usuario y Password");
        $("#error").css({"display":"block"});
        $("#usuario").focus();
        error = "Ingrese su Usuario y Password";
    }
    return error;
}

$(document).ready(function(){
    $("#usuario").focus();    
    
    $("#btnAcceder").click(function(){
        validarLogin();
    });
    
    $("#usuario").keyup(function (e) {
        if (e.which == 13) {
            validarLogin();
        }
    });
    
    $("#password").keyup(function (e) {
        if (e.which == 13) {
            validarLogin();
        }
    });
});

function validarLogin(){
    var msg = validarDatos();
    if(msg == ""){
        $.ajax({
            url: path + "Auth/signin",
            type: "POST",
            data: $("#frmLogin").serialize(),
            success: function(data){
                // alert(data);
                var datos = JSON.parse(data);
                //console.log(datos.respuesta);
                if(datos.respuesta == "success"){
                    // alert("Bienvenido");
                    //redirect                        
                    window.location.href = path + "Auth/principal";
                }else{                    
                    $("#error").text(datos.error);                        
                    $("#error").css("display","block");                        
                    $("#usuario").val("");
                    $("#password").val("");
                    $("#usuario").focus();
                }
            }
        });
    }
}
*/


