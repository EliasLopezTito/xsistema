$(document).ready(function(){
    $("#empresa").change(function(){
        limpiarDatosBuscados();
    });
     
    $("#tipoPlanilla").change(function(){
        limpiarDatosBuscados();
    });
    
    $("#mes").change(function(){
        limpiarDatosBuscados();
    });
     
    $("#anio").change(function(){
        limpiarDatosBuscados();
    });
    
    $("#btnListar").click(function (){
        var empresa = $("#empresa").val();
        var tipoPlanilla = $("#tipoPlanilla").val();
        var anio = $("#anio").val();
        var mes = $("#mes").val();
                                
        if(empresa == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar la Empresa");
            return false;
        }
        if(tipoPlanilla == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Tipo de Planilla");
            return false;
        }
        if(anio == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Año");
            return false;
        }
        if(mes == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Mes");
            return false;
        }
        
        $.ajax({
            url: path + "planilla/reporteDescargaBoleta",
            type: "POST",
            data: {
                empresa : empresa,
                tipoPlanilla : tipoPlanilla,
                anio : anio,
                mes : mes                
            },
            success: function(data){
                console.log(data);
                var tbody = $("#tablaDescargas tbody");
                tbody.find("tr").remove();

                var datos = JSON.parse(data);
                if(datos.respuesta == "success"){
                    if(datos.descargas != "vacio"){
                        var descargas = datos.descargas;
                        
                        for(i=0; i< descargas.length; i++){
                            fila =  "<tr>" +
                                    "   <td class=\"celda-centrada\">" + descargas[i].dni + "</td>" +
                                    "   <td class=\"celda-centrada\">" + descargas[i].codempleado + "</td>" +
                                    "   <td class=\"celda-centrada\">" + descargas[i].apellidos_nombres + "</td>" +
                                    "   <td class=\"celda-centrada\">" + descargas[i].empresa + "</td>" +
                                    "   <td class=\"celda-centrada\">" + descargas[i].proceso + "</td>" +
                                    "   <td class=\"celda-centrada\">" + descargas[i].mesletras + "</td>" +
                                    "   <td class=\"celda-centrada\">" + descargas[i].anio + "</td>" +
                                    "   <td class=\"celda-centrada\">" + descargas[i].fechadescarga + "</td>" +
                                    "</tr>";
                            tbody.append(fila);
                        }
                    }
                }else{
                    mostrarMensaje("error","ERROR",datos.errores);
                }
            }
        });
    });
    
    $("#btnPdf").click(function (){
        var empresa = $("#empresa").val();
        var tipoPlanilla = $("#tipoPlanilla").val();
        var anio = $("#anio").val();
        var mes = $("#mes").val();
                
        if(empresa == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar la Empresa");
            return false;
        }
        if(tipoPlanilla == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Tipo de Planilla");
            return false;
        }
        if(anio == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Año");
            return false;
        }
        if(mes == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Mes");
            return false;
        }
        
        $("#opcion").val("pdf");
        $("#empresaLetras").val($("#empresa option:selected").text());
        $("#tipoPlanillaLetras").val($("#tipoPlanilla option:selected").text());
        $("#frmReporteDescargaBoleta").attr("target","_blank");
        $("#frmReporteDescargaBoleta").submit();
    });
    
    $("#btnExcel").click(function (){
        var empresa = $("#empresa").val();
        var tipoPlanilla = $("#tipoPlanilla").val();
        var anio = $("#anio").val();
        var mes = $("#mes").val();
                                
        if(empresa == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar la Empresa");
            return false;
        }
        if(tipoPlanilla == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Tipo de Planilla");
            return false;
        }
        if(anio == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Año");
            return false;
        }
        if(mes == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Mes");
            return false;
        }
        
        $("#opcion").val("excel");
        $("#empresaLetras").val($("#empresa option:selected").text());
        $("#tipoPlanillaLetras").val($("#tipoPlanilla option:selected").text());
        $("#frmReporteDescargaBoleta").attr("target","_blank");
        $("#frmReporteDescargaBoleta").submit();
    });
});

function limpiarDatosBuscados(){
    var tbody = $("#tablaDescargas tbody");
    tbody.find("tr").remove();
}
