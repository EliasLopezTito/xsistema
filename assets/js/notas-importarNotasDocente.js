$(document).ready(function ()
{
	$("#codDocente").attr("readonly", true);
    $("#nombreDocente").attr("readonly", true);
    //bloquearMasivos();
    
});

$("#btnBuscar").click(function () {
    $("#codigoDocente").val("");
    $("#apellidosNombresDocente").val("");
    $("#tablaModalDocente tbody").find('tr').remove();
    $("#codigoDocente").focus();
    $("#modalDocentes").modal({backdrop: 'static', keyboard: false});
});

$("#codigoDocente, #apellidosNombresDocente").keydown(function (event) {
    if (event.keyCode == 13) {
        buscarDocentesRegistroNotas();
    }
});

$("#cbSelectAll").change(function(){
    if (this.checked) {
        $("#btnBuscar").prop('disabled', true);
    }else{
        $("#btnBuscar").prop('disabled', false);
    }
});

$("#btnImportarNotas").click(function ()
{
    $('#cbSelectAll').is(':checked') ? importarNotas(1) : importarNotas(2);

});

function buscarDocentesRegistroNotas() {
    var codigoDocente = $("#codigoDocente").val().trim();
    var apellidosNombresDocente = $("#apellidosNombresDocente").val().trim();

    if (codigoDocente == "" && apellidosNombresDocente == "") {
        $("#errorDocenteBus").html("Debe ingresar el código o apellidos y nombres a buscar");
        $("#errorDocenteBus").css("display", "block");
        return false;
    } else {
        $("#errorDocenteBus").html("");
        $("#errorDocenteBus").css("display", "none");
    }

    $.ajax({
        url: path + "notas/importarNotasDocente",
        type: "POST",
        data: {
            codigoDocente: codigoDocente,
            apellidosNombresDocente: apellidosNombresDocente,
            opcion: "buscarDocente"
        },
        success: function (data) {

            var tbody = $("#tablaModalDocente tbody");
            tbody.find('tr').remove();

            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.docentes != "vacio") {
                    var docentes = datos.docentes;
                    for (i = 0; i < docentes.length; i++) {
                        var docente = docentes[i];
                        var tr = "<tr ondblclick=\"seleccionarDocente(this);\">" +
                                "<td class=\"celda-centrada\">" + docente.CodDocente + "</td>" +
                                "<td>" + docente.ApellidosNombres + "</td>" +
                                "</tr>";
                        tbody.append(tr);
                    }
                }
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
}

function seleccionarDocente(tr) 
{

    var codDocente = $(tr).find("td").eq(0).html();
    var apellidosNombres = $(tr).find("td").eq(1).html();
  
    $("#codDocente").val(codDocente);
    $("#nombreDocente").val(apellidosNombres);

    
    $("#modalDocentes").modal("hide");

}

function importarNotas(opcionImportacion)
{

    Notiflix.Confirm.Show(
        'Mensaje de confirmación',
        '¿Seguro que desea importar las notas?',
        'Continuar',
        'Cancelar',
        function(){ // Yes button callback

            var anioProg = $("#anioProg").val();
            var mesProg = $("#mesProg").val();
            var codDocente = $("#codDocente").val();

            $.ajax({
                url: path + "notas/importarNotasDocente",
                type: "POST",
                data: {
                    anioProg: anioProg,
                    mesProg: mesProg,
                    codDocente: codDocente,
                    opcionImportacion: opcionImportacion,
                    opcion: "importarNotas"
                },
                beforeSend: function () {
                    $("#modalLoader").modal({backdrop: 'static', keyboard: false});
                    $('#resultados_ver').hide()
                    $('#mensaje_resultado').hide()
                },
                success: function (data) {
                    //console.log(data);

                    $("#modalLoader").modal("hide");

                    var datos = JSON.parse(data);
                    console.log(datos);
                    

                    if (datos.respuesta == "success")
                    {
                        //Notiflix.Report.Success("Importación Exitosa","Las notas del docente se han importado correctamente.", "Cerrar");
                        $('#mensaje_resultado').append("<b>¡Las notas del docente se han importado correctamente!</b>");
                        $('#mensaje_resultado').show('600')
                        // setTimeout(() => {
                        //     $('#mensaje_resultado').hide(600)
                        // }, 2000);
                                                
                        $('#C1').html(datos.data.C1);
                        $('#C2').html(datos.data.C2);
                        $('#C3').html(datos.data.C3);
                        $('#C4').html(datos.data.C4);

                        $('#resultados_ver').show(200)
            
                    }else
                    {   
                        $('#resultados_ver').hide(200)
                        var errores = "";
                        for (i = 0; i < datos.errores.length; i++) {
                            errores += datos.errores[i] + "<br>";
                        }

                        Notiflix.Report.Failure('Error',errores,"Cerrar");
                    }
                }
            });
        },
        function(){ // No button callback

        }
    );

}

/*
function importAllNotasDocentes()
{
    Notiflix.Confirm.Show(
        'Mensaje de confirmación',
        '¿Seguro que desea importar todas las notas del periodo seleccionado?',
        'Continuar',
        'Cancelar',
        function(){ // Yes button callback 
            // Notiflix.Loading.Standard('Loading...');
            let anioProg = $("#anioProg").val();
            let mesProg = $("#mesProg").val();

            $.ajax({
                url: path + "notas/importarNotasDocente",
                type: "POST",
                data: {
                    anioProg: anioProg,
                    mesProg: mesProg,
                    opcion: "importarTodo"
                },
                beforeSend: function () {
                    $("#modalLoader").modal({backdrop: 'static', keyboard: false});
                },
                success: function (data) {
                    $("#modalLoader").modal("hide");
                    // console.log(data);
                    let datos = JSON.parse(data);
                    if (datos.respuesta == "success")
                    {
                        mostrarMensaje("exito", "Importación Exitosa", "Las notas del periodo se han importado correctamente.");
                    
                    } else {
                        var errores = "";
                        for (i = 0; i < datos.errores.length; i++) {
                            errores += datos.errores[i] + "<br>";
                        }
                        mostrarMensaje("error", "ERROR", errores);
                    }
                }
            });
        },
        function(){ // No button callback 
            
        } 
    ); 
    
}

function importarNotasDocente()
{   
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var codDocente = $("#codDocente").val();

    $.ajax({
        url: path + "notas/importarNotasDocente",
        type: "POST",
        data: {
            anioProg: anioProg,
            mesProg: mesProg,
            codDocente: codDocente,
            opcion: "importarNotas"
        },
        success: function (data) {
            //console.log(data);            
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") 
            {

            	mostrarMensaje("exito", "Importación Exitosa", "Las notas del docente se han importado correctamente.");
            
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
}
*/