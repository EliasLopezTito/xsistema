$(document).ready(function(){
    bloquearDesbloquear(1);
    $("#codDocente").attr("readonly",true);
    $("#apellidos").attr("readonly", true);
    $("#nombres").attr("readonly", true);
    $("#telefono").attr("readonly", true);
});

$("#apellidosNombresDocenteBus, #codigoDocenteBus").keydown(function(event) {
    if (event.keyCode === 13) {
        buscarDoentes();
    }
    if(this.value.length > 2) {
        buscarDoentes();
    }
});

function mostrarAlertas(estilo, titulo, mensaje) {
    asignarEstiloModal(estilo);
    $("#mensaje-titulo").html(titulo);
    $("#mensaje-contenido").html(mensaje);
    $("#modalMensaje").modal({backdrop: 'static', keyboard: false});
}

$("#btnBuscar").click(function(){
    $("#codigoDocenteBus").val("");
    $("#apellidosNombresDocenteBus").val("");
    $("#tablaModalDocentes tbody").find('tr').remove();
    $("#codigoDocenteBus").focus();
    $("#modalDocentes").modal({backdrop: 'static', keyboard: false});
});

$("#btnEditar").click(function(){
    bloquearDesbloquear(3);
});

$("#btnCancelar").click(function(){
    bloquearDesbloquear(2);
});



function bloquearDesbloquear(op){
    var band = true;
    switch(op){
        case 1: //inicio
            $("#btnBuscar").attr("disabled",false);
            $("#btnEditar").attr("disabled",true);
            $("#btnGrabar").attr("disabled",true);
            $("#btnCancelar").attr("disabled",true);
            break;
        case 2: //select
            $("#btnBuscar").attr("disabled",false);
            $("#btnEditar").attr("disabled",false);
            $("#btnGrabar").attr("disabled",true);
            $("#btnCancelar").attr("disabled",true);
            break;
        case 3: //editar
            $("#btnBuscar").attr("disabled",true);
            $("#btnEditar").attr("disabled",true);
            $("#btnGrabar").attr("disabled",false);
            $("#btnCancelar").attr("disabled",false);
            band = false;
            break;
    }

    $('#email').attr('readonly',band);
}



function buscarDoentes(){
    var codigoBus = $("#codigoDocenteBus").val().trim();
    var apellidosNombresBus = $("#apellidosNombresDocenteBus").val().trim();

    $.ajax({
        url: path + "programacion/consultaDocentes",
        method: "POST",
        data: {
            codigoBus : codigoBus,
            apellidosNombresBus : apellidosNombresBus,
            opcion: "buscar"
        },
        success: function(data){
            console.log(data);
            var tbody = $("#tablaModalDocentes tbody");
            tbody.find('tr').remove();
            var datos = JSON.parse(data);
            console.log(data);
            if(datos.respuesta=="success"){
                if(datos.docentes != "vacio"){
                    var docentes = datos.docentes;
                    for(i=0; i<docentes.length; i++){
                        var docente = docentes[i];
                        var tr = "<tr ondblclick=\"seleccionarDocente(this);\">" +
                                 "<td class=\"celda-centrada\">" + docente.cod_emp + "</td>" +
                                 "<td>" + docente.nombres + "</td>" +
                                 "</tr>";
                        tbody.append(tr);
                    }
                }
            }else{
                var errores = "";
                for(i = 0; i < datos.errores.length; i++){
                    errores += datos.errores[i] + "<br>";
                }

                mostrarAlertas("error","ERROR",errores);
            }
        }
    });
}

function seleccionarDocente(tr){
    var codDocente = $(tr).find("td").eq(0).html();
    
    $.ajax({
        url: path + "programacion/consultaDocentes",
        method: "POST",
        data: {            
            codDocente : codDocente,
            opcion: "seleccionar"
        },
        success: function(data){
            console.log('Exito');
            var datos = JSON.parse(data);
            if(datos.respuesta == "success"){
                $("#modalDocentes").modal("hide");
                if(datos.docente != "vacio"){
                    var docente = datos.docente[0];
                    $("#codDocente").val(docente.cod_emp.trim());
                    $("#apellidos").val(docente.apellidos.trim());
                    $("#nombres").val(docente.nombres.trim());
                    $("#telefono").val(docente.Telefonos);
                    $("#email").val(docente.Correo);
                    bloquearDesbloquear(2);
                }
            }else{
                var errores = "";
                for(i = 0; i < datos.errores.length; i++){
                    errores += datos.errores[i] + "<br>";
                }
                mostrarAlertas("error","ERROR",errores);
            }
        }
    });
}

$("#btnGrabar").click(function(){
    let codigoDocente = $("#codDocente").val().trim();
    let email = $("#email").val().trim();

    console.log(codigoDocente, email);
    $.ajax({
        url: path + "programacion/consultaDocentes",
        method: "POST",
        data: {
            codigoDocente: codigoDocente,
            email: email,
            opcion: 'actualizar'
        },
        success: function(data){
            // console.log(data);
            var datos = JSON.parse(data);
            if(datos.respuesta=="success"){
                bloquearDesbloquear(2);
                mostrarAlertas('exito','EXITO','Datos actualizados con éxito');
            }else{
                var errores = "";
                for(i = 0; i < datos.errores.length; i++){
                    errores += datos.errores[i] + "<br>";
                }
                mostrarAlertas("error","ERROR",errores);
            }
        },
        error: function(error){
            console.log(error);
        }
    });
});