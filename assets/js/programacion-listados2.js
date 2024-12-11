$(document).ready(function(){
    $("#pabellon").attr("disabled", "disabled");
    $("#piso").attr("disabled", "disabled");
    $("#aula").attr("disabled", "disabled");
    
    cargarInstituciones(false);
    //cargarSedes();
    cargarPabellones();
    cargarPisos();
    cargarComboAulas();
    activarBotonesRptIndividuales(false);
});

// $("#btnExcel").click(function (){
//     $("#frmReporteDocentesProgramados").attr("target","_blank");
//     $("#frmReporteDocentesProgramados").submit();
// });

$("#btnImprimir").click(function (){
    $("#turno").val("");
    $("#curso").val("");
    $("#docente").val("");
    $("#ciclo").val("");
    $("#hora").val("");
    $("#tipo").val("");
    $("#frmListados").submit();
});

function activarListadoIndividual(){
    if($("#cbxPorAula").prop("checked") == true){
        $("#pabellon").attr("disabled",false);
        $("#piso").attr("disabled",false);
        $("#aula").attr("disabled",false);
        $("#btnImprimir").attr("disabled",true);
        $("#tipoListado").attr("disabled",true);
        cargarProgramacion();
    }else{
        var tbody = $("#tablaProgramacion tbody");
        tbody.find('tr').remove();
        $("#pabellon").attr("disabled", true);
        $("#piso").attr("disabled", true);
        $("#aula").attr("disabled", true);
        $("#btnImprimir").attr("disabled",false);
        $("#tipoListado").attr("disabled",false);
    }
}

function activarBotonesRptIndividuales(activar){
    $("#tablaProgramacion tbody").find("tr").each(function(){        
        if(activar == true){
            $(this).find("button").eq(0).attr("disabled",false);
            $(this).find("button").eq(1).attr("disabled",false);
            $(this).find("button").eq(2).attr("disabled",false);
        }else{
            $(this).find("button").eq(0).attr("disabled",true);
            $(this).find("button").eq(1).attr("disabled",true);
            $(this).find("button").eq(2).attr("disabled",true);
        }
    }); 
}

$("#institucion").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarComboAulas();
    }
});

$("#sede").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarComboAulas();
    }
});

$("#anioProg").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarProgramacion();
    }
});

$("#mesProg").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarProgramacion();
    }
});

$("#pabellon").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarComboAulas();
    }
});

$("#piso").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarComboAulas();
    }
});

$("#aula").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarProgramacion();
    }
});

function cargarProgramacion(){
    var institucion = $("#institucion").val();
    var sede = $("#sede").val();
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var pabellon = $("#pabellon").val();
    var piso = $("#piso").val();
    var aula = $("#aula").val();
    
    if(institucion != null && sede != null && anioProg != null && mesProg != null && pabellon != null && piso != null && aula != null){
        var tbody = $("#tablaProgramacion tbody");
        tbody.find('tr').remove();
        $.ajax({
            url: path + "programacion/getProgramacionParaListadosVirtuales",
            type: "POST",
            data: {
                institucion: institucion,
                sede: sede,
                anioProg: anioProg,
                mesProg: mesProg,
                pabellon: pabellon,
                piso: piso,
                aula: aula
            },
            success: function(data){
                let datos = JSON.parse(data);

                $.ajax({
                    url: path + "programacion/getEstadoExcelAlumnosMatriculados",
                    type: "GET",
                    success: function(respuesta){
                        let estado = JSON.parse(respuesta);
                        estado = estado.permiso;

                        if(datos.respuesta=="success"){
                            if(datos.programacion != "vacio"){
                                var programaciones = datos.programacion;
                                for(i=0;i<programaciones.length;i++){
                                    var programacion = programaciones[i];
                                    var tr = "<tr>" + 
                                             "<td class=\"celda-centrada\">" + programacion.ciclo + "</td>" +
                                             "<td class=\"celda-centrada\">" + programacion.hora + "</td>" +
                                             "<td class=\"celda-centrada\">" + programacion.cod_turno + "</td>" +
                                             "<td class=\"celda-izquierda\">" + programacion.curso + "</td>" +
                                             "<td class=\"celda-izquierda\">" + programacion.profesor + "</td>" +
                                             "<td class=\"celda-centrada\">" + programacion.fecha_inicio + "</td>" +
                                             "<td class=\"celda-centrada\">" + programacion.fecha_final + "</td>" +
                                             "<td class=\"celda-centrada\">" + programacion.cod_prof + "</td>" +
                                             "<td class=\"celda-centrada\">" + programacion.num_horas + "</td>" +
                                             "<td class=\"celda-centrada\">" + programacion.cantAlumnos + "</td>" +
                                             "<td class=\"celda-centrada\">";
        
                                    if(estado) tr += "<button class='btn boton-tabla boton-naranja icon-file-excel' type=\"button\" onclick=\"imprimirListadoIndividualVirtual(this,1,true,1);\" title=\"Alumnos matriculados - Reporte Excel\"></button>"; 
                                    //if(datos.usuario != "TUTOR"){
                                    tr += "<button class='btn boton-tabla boton-azul icon-file-pdf' type=\"button\" onclick=\"imprimirListadoIndividualVirtual(this,1,false,0);\" title=\"Alumnos matriculados - Reporte PDF\"></button>"; 
                                    //}                                    
                                    tr += "<button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"imprimirListadoIndividualVirtual(this,2,false,0);\" title=\"Alumnos pagantes\"><span class=\"icon-user-plus\"></span></button>";                                            
                                    //if(datos.usuario != "TUTOR"){
                                    tr += "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"imprimirListadoIndividualVirtual(this,3,false,0);\" title=\"Alumnos no pagantes\"><span class=\"icon-user-minus\"></span></button>";
                                    //}                                        
                                    tr += "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"imprimirListadoIndividualVirtual(this,3,true,2);\" title=\"Alumnos no pagantes excel\"><span class=\"icon-file-excel\"></span></button>";

                                    tr +=    "</td>" +
                                             "<td style=\"display: none;\">" + programacion.cod_curso + "</td>" +
                                             "</tr>";
                                    tbody.append(tr);
                                }
                            }
                        }else{
                            mostrarMensaje("error","ERROR",datos.errores);
                        }


                    }
                });

            }
        });
    }
}
/*
function imprimirListadoIndividual(btn,tipo){
    var turno = $(btn).parent().parent().find("td").eq(2).html();
    var curso = $(btn).parent().parent().find("td").eq(10).html();
    var docente = $(btn).parent().parent().find("td").eq(7).html();
    var ciclo = $(btn).parent().parent().find("td").eq(0).html();
    var hora = $(btn).parent().parent().find("td").eq(1).html();
        
    $("#turno").val(turno);
    $("#curso").val(curso);
    $("#docente").val(docente);
    $("#ciclo").val(ciclo);
    $("#hora").val(hora);
    $("#tipo").val(tipo);
    $("#frmListados").submit();
}
*/
function imprimirListadoIndividualVirtual(btn,tipo,excel=false,tipo_excel){
    var turno = $(btn).parent().parent().find("td").eq(2).html();
    var curso = $(btn).parent().parent().find("td").eq(11).html();//modificado
    var docente = $(btn).parent().parent().find("td").eq(7).html();
    var ciclo = $(btn).parent().parent().find("td").eq(0).html();
    var hora = $(btn).parent().parent().find("td").eq(1).html();
        
    $("#turno").val(turno);
    $("#curso").val(curso);
    $("#docente").val(docente);
    $("#ciclo").val(ciclo);
    $("#hora").val(hora);
    $("#tipo").val(tipo);
    $("#excel").val(excel);
    $("#tipo_excel").val(tipo_excel);
    $("#frmListados").submit();
}

function cargarComboAulas(){
    var institucion = $("#institucion").val();
    var sede = $("#sede").val();
    var pabellon = $("#pabellon").val();
    var piso = $("#piso").val();
    if(institucion != null && sede != null && pabellon != null && piso != null){
        $.ajax({
            url: path + "programacion/getAulasVirtuales",
            type: "POST",
            data: {
                institucion: institucion,
                sede: sede,
                pabellon: pabellon,
                piso: piso
            },
            success: function(data){
                console.log(data);
                $("#aula").html("");
                var datos = JSON.parse(data);                
                if(datos.respuesta=="success"){
                    if(datos.aulas != "vacio"){            
                        var aulas = datos.aulas;
                        for(i=0;i<aulas.length;i++){
                            var aula = aulas[i];
                            $("#aula").append("<option value='" + aula.cod_aula + "'>" + aula.cod_aula + "</option>");
                        }
                        cargarProgramacion();
                    }else{
                        var tbody = $("#tablaProgramacion tbody");
                        tbody.find('tr').remove();
                    }
                }else{
                    mostrarMensaje("error","ERROR",datos.errores);
                }
            }
        });
    }
}
