/*var path = "http://istalcursos.edu.pe/egresados/";*/

$(document).ready(function(){
    $("#btnBuscar").click(function(){
        buscarEgresados();
    });
    
    $("#btnEditar").click(function(){
        var codigo = $("#codigoM").val();
        var dni = $("#dniM").val();
        var apellidosNombres = $("#apellidosNombresM").val();
        var carrera = $("#carreraM").val();
        var telefono = $("#telefonoM").val();
        var email = $("#emailM").val();
        var periodo = $("#periodoM").val();
        
        $.ajax({
            url: path + "Consultas/actualizarDatos",
            type: "POST",
            data: {
                codigo : codigo,
                dni : dni,
                apellidosNombres : apellidosNombres,
                carrera : carrera,
                telefono : telefono,
                email : email,
                periodo : periodo
            },
            success: function(data){
                var datos = JSON.parse(data);
                if(datos.respuesta == "success"){
                    buscarEgresados();
                    $("#miModalEgresado").modal("hide");
                }else{
                    var errores = "<ul style='list-style: none'>";
                    for(i=0;i<datos.errores.length;i++){
                        errores += "<li>" + datos.errores[i] + "</li>";
                    }
                    errores += "<ul>";
                    $("#error").html(errores);
                    $("#error").css({"display":"block"});
                }
            }
        });
    });
});

function seleccionarEgresado(fila){    
    var codigo = $(fila).find("td").eq(0).html();
    var dni = $(fila).find("td").eq(1).html();
    var apellidosNombres = $(fila).find("td").eq(2).html();
    var carrera = $(fila).find("td").eq(3).html();
    var telefono = $(fila).find("td").eq(4).html();
    var email = $(fila).find("td").eq(5).html();
    var periodo = $(fila).find("td").eq(6).html();
    
    $("#codigoM").val(codigo);
    $("#dniM").val(dni);
    $("#apellidosNombresM").val(apellidosNombres);
    $("#carreraM").val(carrera);
    $("#telefonoM").val(telefono);
    $("#emailM").val(email);
    $("#periodoM").val(periodo);
    
    $("#miModalEgresado").modal({backdrop: 'static', keyboard: false});
    $("#miModalEgresado").draggable({ handle: ".modal-header"});
}

function buscarEgresados(){
    var apellidosNombres = $("#apellidosNombres").val();
    var anioEgreso = $("#anioEgreso").val();
    var carrera = $("#carrera").val();
        
        $.ajax({
            url: path + "Consultas/listarEgresados",
            type: "POST",
            data: {
                apellidosNombres: apellidosNombres,
                anioEgreso: anioEgreso,
                carrera: carrera,                
            },
            success: function(data){
                var tbody = $("#tblEgresados tbody");
                tbody.find('tr').remove();                
                var datos = JSON.parse(data);
                if(datos.respuesta == "success"){
                    if(datos.egresados != "vacio"){
                        $("#divTblEgresados").css({"height":"360px"});
                        var egresados = datos.egresados;                        
                        for(i=0;i<egresados.length;i++){
                            var egresado = egresados[i];
                            var tr = "<tr ondblclick='seleccionarEgresado(this)'>" +
                                     "<td class=\"celda-centrada\">" + egresado.codigo + "</td>" +
                                     "<td class=\"celda-centrada\">" + egresado.dni + "</td>" +
                                     "<td>" + egresado.apellidos + ' ' + egresado.nombres + "</td>" +
                                     "<td class=\"celda-centrada\">" + egresado.carrera + "</td>" +
                                     "<td class=\"celda-centrada\">" + egresado.telefono + "</td>" +
                                     "<td class=\"celda-centrada\">" + egresado.email + "</td>" +
                                     "<td class=\"celda-centrada\">" + egresado.periodo_egreso + "</td>" +
                                     "</tr>";
                             
                            tbody.append(tr);
                        }
                    }
                }else{
                    var errores = "<ul style='list-style: none'>";
                    for(i=0;i<datos.errores.length;i++){
                        errores += "<li>" + datos.errores[i] + "</li>";
                    }
                    errores += "<ul>";
                    $("#error").html(errores);
                    $("#error").css({"display":"block"});
                }
            }
        });
}

$("#btnListado").on('click', function() {
    var anioEgreso =$("#anioEgreso").val();
    var carrera =$("#carrera").val();        
    window.open(path+"Consultas/rptListadoEgresados?anio="+anioEgreso+'&carrera='+carrera);
});

$("#btnConsolidado").on('click', function() {
    var anioEgreso =$("#anioEgreso").val();    
    window.open(path+"Consultas/rptEgresadosPorAnioConsolidado?anio="+anioEgreso);
});
