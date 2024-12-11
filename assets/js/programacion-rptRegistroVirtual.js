$(document).ready(function(){
    $("#btnListar").click(function (){
        var desde = $("#desde").val();
        var hasta = $("#hasta").val();
        $("#filtro").val("");
        var filtro = "";
        filtrar(desde, hasta, filtro);
    });
    
    $("#filtro").keydown(function(event){
        if(event.which == 13){
            var desde = "01/01/1900"; 
            var hasta = "31/12/2900"; 
            var filtro = $("#filtro").val().trim();
            filtrar(desde, hasta, filtro);
        }
    });
    
    $("#btnExcel").click(function (){        
        $("#frmReporteRegistroVirtual").attr("target","_blank");
        $("#frmReporteRegistroVirtual").submit();
    });
});

function filtrar(desde, hasta, filtro){
    var opcion = "select";
    
    $.ajax({
        url: path + "programacion/rptRegistroVirtual",
        type: "POST",
        data: {
            opcion : opcion,
            desde : desde,
            hasta : hasta,
            filtro : filtro
        },
        success: function(data){
            var tbody = $("#tablaRegistros tbody");
            tbody.find("tr").remove();

            var datos = JSON.parse(data);
            if(datos.respuesta == "success"){
                if(datos.registros != "vacio"){
                    var registros = datos.registros;
                        
                    for(i=0; i< registros.length; i++){
                        var fila =  "<tr>" +
                                    "   <td class=\"celda-centrada\">" + registros[i].cod_alumno + "</td>" +
                                    "   <td>" + registros[i].apellidos + " " + registros[i].nombres + "</td>" +
                                    "   <td>" + registros[i].carrera_des + "</td>" +
                                    "   <td class=\"celda-centrada\">" + registros[i].turno + "</td>" +
                                    "   <td class=\"celda-centrada\">" + registros[i].ciclo + "</td>" +
                                    "   <td>" + registros[i].cursos + "</td>" +
                                    "   <td class=\"celda-centrada\">" + registros[i].sede + "</td>" +
                                    "   <td class=\"celda-centrada\">" + registros[i].fecha_registro + "</td>" +
                                    "   <td class=\"celda-centrada\">" +
                                    "       <button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminar(this);\" title=\"Eliminar registro\"><span class=\"icon-bin\"></span></button>" +
                                    "   </td>" +
                                    "</tr>";
                        tbody.append(fila);
                    }
                }
            }else{
                var errores = "";
                for(i = 0; i < datos.errores.length; i++){
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error","ERROR",errores);
            }
        }
    });
}

function eliminar(btn){
    var codAlumno = $(btn).parent().parent().find("td").eq(0).html();
    var nombre = $(btn).parent().parent().find("td").eq(1).html();    
    $("#codAlumnoD").val("");
    
    if(codAlumno != null && codAlumno != "" && nombre != null && nombre != ""){
        $("#codAlumnoD").val(codAlumno);
        mostrarMensaje("confirmacion","CONFIRMAR","Se va a eliminar el registro del alumno(a): <b>" + nombre + "</b>, desea continuar");
    }
}

$("#mensaje-boton-aceptar").click(function (){
    $("#modalMensaje").modal("hide");
    var codAlumno = $("#codAlumnoD").val();
        
    if(codAlumno != null && codAlumno != ""){        
        $.ajax({
            url: path + "programacion/rptRegistroVirtual",
            type: "POST",
            data: {
                opcion: "delete",
                codAlumno: codAlumno                
            },
            success: function(data){
                console.log(data);
                var datos = JSON.parse(data);
                if(datos.respuesta=="success"){
                    var desde = $("#desde").val();
                    var hasta = $("#hasta").val();
                    var filtro = $("#filtro").val().trim();
                    if(filtro != ""){
                        desde = "01/01/1900";
                        hasta = "31/12/2900";
                    }
                    filtrar(desde, hasta, filtro);
                }else{
                    var errores = "";
                    for(i=0; i<datos.errores.length; i++){
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error","ERROR",errores);
                }
            }
        });
    }
});

function limpiarDatosBuscados(){
    var tbody = $("#tablaRegistros tbody");
    tbody.find("tr").remove();
}
