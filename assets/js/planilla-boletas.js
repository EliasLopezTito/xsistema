$(document).ready(function(){
    $("#mes").change(function(){
        limpiarDatosBuscados();
    });
     
    $("#anio").change(function(){
        limpiarDatosBuscados();
    });
     
    $("#dni").keydown(function(event){
        if(event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40 && event.which != 18 && event.which != 13 && event.which != 20 && event.which != 9){
            limpiarDatosBuscados();
        }
    });
    
    $("#codEmpleado").keydown(function(event){
        if(event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40 && event.which != 18 && event.which != 13 && event.which != 20 && event.which != 9){
            limpiarDatosBuscados();
        }
    });
});

$("#btnBuscar").click(function(){
    verificarEstado();
});

function limpiarDatosBuscados(){
    var thead = $("#tablaBoletas thead");
    var tbody = $("#tablaBoletas tbody");
    thead.find("tr").remove();
    tbody.find("tr").remove();
    $("#nombre").html("");
    $("#btnBuscar").attr("disabled",false);
}

function verificarEstado(){
    let mes = $("#mes").val().trim();
    let anio = $("#anio").val().trim();
    let cod_emp = $('#codEmpleado').val().trim();

    $.ajax({
        url: path + "planilla2/activarDescargaBoletas",
        type: "POST",
        dataType: 'json',
        data: {
            mes : mes,
            anio : anio,
            cod_emp : cod_emp
        },
        success: function(data){
            if (data.respuesta === 'success') {
                buscarBoletas();
            } else{
                Notiflix.Notify.Failure('Las boletas para el periodo seleccionado no se encuentran disponibles!');
            }
        }
    });
}

function buscarBoletas(){
    var dni = $("#dni").val().trim();
    var codEmpleado = $("#codEmpleado").val().trim();
    var mes = $("#mes").val().trim();
    var anio = $("#anio").val().trim();
    $.ajax({
        url: path + "planilla2/boletas",
        type: "POST",
        data: {
            dni : dni,
            codEmpleado : codEmpleado,
            mes : mes,
            anio : anio
        },
        success: function(data){
            console.log(data);
            var thead = $("#tablaBoletas thead");
            var tbody = $("#tablaBoletas tbody");
            thead.find("tr").remove();
            tbody.find("tr").remove();
                
            var datos = JSON.parse(data);
            if(datos.respuesta == "success"){
                if(datos.boletas != "NO EXISTEN BOLETAS REGISTRADAS"){
                    var boletas = datos.boletas;
                    $("#nombre").html(boletas[0].empleado);
                    
                    var fila =  "<tr>" +
                                "   <th class=\"celda-centrada\">EMPRESA</th>" +
                                "   <th class=\"celda-centrada\">TIPO</th>" +
                                "   <th class=\"celda-centrada\"></th>" +
                                "</tr>";
                    thead.append(fila);
                    
                    for(i=0; i< boletas.length; i++){                      
                        fila =  "<tr>" + 
                                "   <td class=\"celda-centrada\" hidden=\"hidden\">" + boletas[i].codproceso + "</td>" +    
                                "   <td class=\"celda-centrada\" hidden=\"hidden\">" + boletas[i].cod_emp + "</td>" +    
                                "   <td class=\"celda-centrada\" hidden=\"hidden\">" + boletas[i].dni + "</td>" +    
                                "   <td class=\"celda-centrada\" hidden=\"hidden\">" + boletas[i].codlocal + "</td>" +    
                                "   <td class=\"celda-centrada\" hidden=\"hidden\">" + boletas[i].tipoplanilla + "</td>" +    
                                "   <td class=\"celda-centrada\" hidden=\"hidden\">" + boletas[i].tipoproceso + "</td>" +    
                                "   <td class=\"celda-centrada\">" + boletas[i].empresa.split(" ")[0] + "</td>" +
                                "   <td class=\"celda-centrada\">" + boletas[i].proceso.toUpperCase() + "</td>" +
                                "   <th class=\"celda-centrada\">" +
                                "       <button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"descargarBoleta(this);\" title=\"Descargar boleta de pago\"><span class=\"icon-download2\"></span></button>" +
                                "   </th>" +
                                "</tr>";
                            tbody.append(fila);
                        }
                        $("#btnBuscar").attr("disabled",true);
                }else{
                    $("#nombre").html(datos.boletas);
                }
            }else{
                //mostrarMensaje("error","ERROR",datos.errores);
                $("#nombre").html(datos.errores);
            }
        }
    });
}

function descargarBoleta(btn){
    $("#mesH").val($("#mes").val().trim());
    $("#anioH").val($("#anio").val().trim());
    $("#codProcesoH").val($(btn).parent().parent().find("td").eq(0).html());
    $("#codEmpleadoH").val($(btn).parent().parent().find("td").eq(1).html());
    $("#dniH").val($(btn).parent().parent().find("td").eq(2).html());
    $("#codLocalH").val($(btn).parent().parent().find("td").eq(3).html());
    $("#tipoPlanillaH").val($(btn).parent().parent().find("td").eq(4).html());
    $("#tipoProcesoH").val($(btn).parent().parent().find("td").eq(5).html());
    var target = path + "planilla2/imprimirBoleta";
    $("#frmBoletas").attr("action",target);
    $("#frmBoletas").attr("target","_blank");    
    $("#frmBoletas").submit();
}

function registrarDescarga(dni, empresa, mes, anio){
    $.ajax({
        url: path + "planilla2/registroDescargaBoleta",
        type: "POST",
        data: {
            dni : dni,
            empresa : empresa,
            mes : mes,
            anio : anio
        },
        success: function(data){
            console.log(data);
            var datos = JSON.parse(data);
            
            if(datos.respuesta == "success"){
                
            }else{
                //mostrarMensaje("error","ERROR",datos.errores);
                //$("#nombre").html(datos.errores);
            }
        }
    });
}

/*
$("#btnMostrarMatriculados").click(function(){
    cargarAlumnosMatriculados();
    $("#btnImprimirActa").attr("disabled",false);
});

$("#btnImprimirActa").click(function(){    
    var target = path + "notas/actas";
    $("#frmActa").attr("action",target);
    $("#frmActa").attr("target","_blank");    
    $("#frmActa").submit();
});

function borrarResultado(){
    $("#btnImprimirActa").attr("disabled",true);
    var tbody = $("#tablaMatriculados tbody");
    tbody.find('tr').remove();
    $("#nroAlumnos").html("-");
    
    var thead = $("#tablaMatriculados thead");
    var tr = thead.find('tr')[2];
    tbody.find("tr").remove();
                                                                
    for(i=0; i<$(tr).find("th").length; i++){
        $($(tr).find("th")[i]).html("");
    }
}

function cargarAlumnosMatriculados(){
    var sede = $("#sede").val();
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var mallaCurricular = $("#mallaCurricular").val();
    var periodo = $("#periodo").val();
    var turno = $("#turno").val();
    var ciclo = $("#ciclo").val();
    var seccion = $("#seccion").val();
    
    $.ajax({
        url: path + "notas/getAlumnosMatriculadosEnUnaSeccionConNotas",
        type: "POST",
        data: {
            sede : sede,
            institucion : institucion,
            tipoEspecialidad : tipoEspecialidad,
            especialidad : especialidad,
            mallaCurricular : mallaCurricular,
            periodo : periodo,
            turno : turno,
            ciclo : ciclo,
            seccion : seccion
        },
        success: function(data){
            console.log(data);
            var datos = JSON.parse(data);
            if(datos.respuesta == "success"){
                var tbody = $("#tablaMatriculados tbody");
                var thead = $("#tablaMatriculados thead");
                var tr = thead.find('tr')[2];
                tbody.find("tr").remove();
                                                                
                for(i=0; i<$(tr).find("th").length; i++){
                    $($(tr).find("th")[i]).html("");
                }
                
                if(datos.alumnos != "vacio"){
                    var alumnos = datos.alumnos;
                    for(i=0; i<alumnos.length; i++){
                        var alumno = alumnos[i];
                        var cursosAprobados = 0;
                        
                        if(alumno.nota1 != ""){
                            if(parseInt(alumno.nota1) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota2 != ""){
                            if(parseInt(alumno.nota2) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota3 != ""){
                            if(parseInt(alumno.nota3) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota4 != ""){
                            if(parseInt(alumno.nota4) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota5 != ""){
                            if(parseInt(alumno.nota5) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota6 != ""){
                            if(parseInt(alumno.nota6) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota7 != ""){
                            if(parseInt(alumno.nota7) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota8 != ""){
                            if(parseInt(alumno.nota8) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota9 != ""){
                            if(parseInt(alumno.nota9) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota10 != ""){
                            if(parseInt(alumno.nota10) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        if(alumno.nota11 != ""){
                            if(parseInt(alumno.nota11) >= 13){
                                cursosAprobados += 1;
                            }
                        }
                        
                        if(i === 0){
                            $($(tr).find("th")[0]).html(alumno.creditos1);
                            $($(tr).find("th")[1]).html(alumno.creditos2);
                            $($(tr).find("th")[2]).html(alumno.creditos3);
                            $($(tr).find("th")[3]).html(alumno.creditos4);
                            $($(tr).find("th")[4]).html(alumno.creditos5);
                            $($(tr).find("th")[5]).html(alumno.creditos6);
                            $($(tr).find("th")[6]).html(alumno.creditos7);
                            $($(tr).find("th")[7]).html(alumno.creditos8);
                            $($(tr).find("th")[8]).html(alumno.creditos9);
                            $($(tr).find("th")[9]).html(alumno.creditos10);
                            $($(tr).find("th")[10]).html(alumno.creditos11);
                        }
                        
                        
                        
                        var fila =  "<tr>" +
                                    "   <td class=\"celda-centrada\">" + alumno.dni + "</td>" +
                                    "   <td class=\"celda-izquierda\">" + alumno.apellidos_nombres + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota1 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota2 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota3 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota4 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota5 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota6 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota7 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota8 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota9 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota10 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + alumno.nota11 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + cursosAprobados + "</td>" +
                                    "   <td class=\"celda-centrada\">" + (alumno.nro_cursos - cursosAprobados) + "</td>" +
                                    "</tr>";
                        tbody.append(fila);
                    }
                    var nroAlumnos = $("#tablaMatriculados > tbody > tr").length;
                    $("#nroAlumnos").html(nroAlumnos);
                }else{
                    $("#nroAlumnos").html("0");
                }
            }else{
                mostrarMensaje("error","ERROR",datos.errores);
            }
        }
    });
}
*/
