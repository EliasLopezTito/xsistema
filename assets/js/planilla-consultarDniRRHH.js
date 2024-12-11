$(document).ready(function () {

    Notiflix.Loading.Init({
        clickToClose: true
    });
    
    $("#codAlumno").attr("readonly", true);
    //$("#dni").attr("readonly", true);
    $("#ce").attr("readonly", true);
});

$("#apellidos").keydown(function (event) {
    if (event.keyCode == 13) {
        console.log("enviar");
    }
});

$("#btnBuscar").click(function () {
    $("#codigoBus").val("");
    $("#apellidosNombresBus").val("");
    $("#tablaModalAlumno tbody").find('tr').remove();
    $("#codigoBus").focus();
    $("#modalAlumnos").modal({ backdrop: 'static', keyboard: false });
});

$("#idConsultarReniec").click(function () {
    consultarApiReniec();
});


function consultarApiReniec(){
    const dni = $("#dni").val();
    console.log("dni", dni)
    $.ajax({
        url: path + "notas/actualizarDatosDni",
        type: "POST",
        data: {
            dni: dni,
            opcion: 'consultarDNIApi'
        },
        beforeSend: function () {
            Notiflix.Loading.Hourglass('Cargando...');
        },
        success: function (data) {
            const datos = JSON.parse(data);
            $("#NotiflixLoadingWrap").trigger("click");
            console.log("response", datos);
            if (datos.data !== null) {
                if (datos.data.success === true) {

                    resp = datos.data.data
                    console.log("resp", resp);
                    $("#idDni").val(resp.numero); 
                    $("#idDni").css("border", "1px solid green");
                    $("#idNombres").val(resp.nombres);
                    $("#idApellidos").val(resp.apellido_paterno + " " + resp.apellido_materno);
                    resp.sexo != null ? $("#idSexo").val(resp.sexo) : $("#idSexo").val("")
                    resp.fecha_nacimiento != null ? $("#idFechaNac").val(resp.fecha_nacimiento) : $("#idFechaNac").val("")
                    $("#idDepartamento").val(resp.departamento);
                    $("#idProvincia").val(resp.provincia);
                    $("#idDistrito").val(resp.distrito);                    
                    $("#idDireccion").val(resp.direccion_completa);
                    $("#codigo_verificacion").val(resp.codigo_verificacion);
                    $("#estado_civil").val(resp.estado_civil);

                    if(resp.nombres.trim() != $("#nombres").val().trim()){
                        $("#idNombres").css("border", "1px solid blue");
                    }else{
                        $("#idNombres").css("border", "1px solid green");
                    }
                    
                    if($("#idApellidos").val().trim() != $("#apellidos").val().trim()){
                        $("#idApellidos").css("border", "1px solid blue");
                    }else{
                        $("#idApellidos").css("border", "1px solid green");
                    }

                } else {
                    consultarApiReniec_respaldo()
                }
            } else {
                consultarApiReniec_respaldo()
            }


        }
    });
}

function consultarApiReniec_respaldo(){
    const dni = $("#dni").val();
    console.log("dni", dni)
    $.ajax({
        url: path + "notas/actualizarDatosDni",
        type: "POST",
        data: {
            dni: dni,
            opcion: 'consultarDNIApi_2'
        },
        beforeSend: function () {
            Notiflix.Loading.Hourglass('Cargando...');
        },
        success: function (data) {
            const datos = JSON.parse(data);
            $("#NotiflixLoadingWrap").trigger("click");
            console.log("response", datos);
            if (datos.data !== null) {
                if (datos.data.success === true) {

                    resp = datos.data
                    console.log("resp", resp);
                    $("#idDni").val(datos.dni); 
                    $("#idDni").css("border", "1px solid green");
                    $("#idNombres").val(resp.nombres);
                    $("#idApellidos").val(resp.apellidoPaterno + " " + resp.apellidoMaterno);
                    
                    if(resp.nombres.trim()){
                        $("#idNombres").css("border", "1px solid blue");
                    }else{
                        $("#idNombres").css("border", "1px solid green");
                    }
                    
                    if($("#idApellidos").val().trim()){
                        $("#idApellidos").css("border", "1px solid blue");
                    }else{
                        $("#idApellidos").css("border", "1px solid green");
                    }

                } else {
                    Notiflix.Notify.Failure("EL DNI NO EXISTE RESPALDO")
                }
            } else {
                console.log("CONSULTELO MAS TARDE RESPALDO");
            }


        }
    });
}

$('#dni').keyup(function(){
    dni = $('#dni').val()
    if(dni.length == 8){
        $("#idConsultarReniec").attr("disabled", false);
    }else{
        $("#idConsultarReniec").attr("disabled", true);
    }
})




