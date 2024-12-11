var path = "http://istalcursos.edu.pe/egresados/";

$(document).ready(function(){
    $("#btnNuevo").click(function(){
        window.location = path + "encuesta/nuevo";        
    });
});

/*
$("#btnListado").on('click', function() {
    var anioEgreso =$("#anioEgreso").val();
    var carrera =$("#carrera").val();        
    window.open(path+"Consultas/rptListadoEgresados?anio="+anioEgreso+'&carrera='+carrera);
});

$("#btnConsolidado").on('click', function() {
    var anioEgreso =$("#anioEgreso").val();    
    window.open(path+"Consultas/rptEgresadosPorAnioConsolidado?anio="+anioEgreso);
});
*/

function mostrarEncuestados(btn){
    var idEncuesta = $(btn).parent().parent().find("td").eq(0).html();
    cargarEncuestados(idEncuesta);
    $("#miModalEgresados").modal({backdrop: 'static', keyboard: false});
    $("#miModalEgresados").draggable({ handle: ".modal-header"});
}

function mostrarEstadisticas(btn){        
    var idEncuesta = $(btn).parent().parent().find("td").eq(0).html();
    window.open(path+"Encuesta/rptResultados?id_encuesta="+idEncuesta);
}

function cargarEncuestados(idEncuesta){
    $.ajax({
            url: path + "consultas/listarEncuestados",
            type: "POST",
            data: {
                idEncuesta: idEncuesta,
            },
            success: function(data){              
                var tbody = $("#tablaEncuestados tbody");
                tbody.find('tr').remove();
                
                var datos = JSON.parse(data);
                if(datos.respuesta=="success"){
                    if(datos.encuestados != "vacio"){
                        var encuestados = datos.encuestados;
                        for(i=0;i<encuestados.length;i++){
                            var encuestado = encuestados[i];
                            
                            var tr = "<tr>" + 
                                     "<td>" + encuestado.cod_alumno + "</td>" +
                                     "<td>" + encuestado.apellidos + " " + encuestado.nombres + "</td>" +
                                     "</tr>";
                        
                            tbody.append(tr);
                        }
                    }
                }else{        
                    $("#errorEncuestado").text(datos.error);
                    $("#errorEncuestado").css("color","red");
                    $("#errorEncuestado").css("display","block");
                }
            }
        });
}