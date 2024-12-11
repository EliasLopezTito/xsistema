$(document).ready(function(){
    
});

function mostrarEncuesta(btn){
    var idEncuesta = $(btn).parent().parent().find("td").eq(0).html();
    var sede = $(btn).parent().parent().find("td").eq(1).html();
    var codTurno = $(btn).parent().parent().find("td").eq(2).html();
    var codAula = $(btn).parent().parent().find("td").eq(3).html();
    var docente = $(btn).parent().parent().find("td").eq(4).html();
    var codLocalInst = $(btn).parent().parent().find("td").eq(5).html();
    var codProf = $(btn).parent().parent().find("td").eq(6).html();
    var anoProg = $(btn).parent().parent().find("td").eq(7).html();    
    var mesProg = $(btn).parent().parent().find("td").eq(8).html();    
    
    var target = path + "encuesta/mostrar";
    $("#frmEncuestasPendientes").attr("action",target);
    $("#frmEncuestasPendientes").attr("target","");
    $("#idEncuesta").val(idEncuesta);
    $("#sede").val(sede);
    $("#codTurno").val(codTurno);
    $("#codAula").val(codAula);
    $("#docente").val(docente);
    $("#codLocalInst").val(codLocalInst);
    $("#codProf").val(codProf);
    $("#anoProg").val(anoProg);
    $("#mesProg").val(mesProg);
    
    $("#frmEncuestasPendientes").submit();
}

/*
function desactivarFiltro(valor){
    $("#anioProg").attr("disabled",valor);
    $("#mesProg").attr("disabled",valor);
    $("#btnProgramacion").attr("disabled", valor);
}

$("#btnProgramacion").click(function (){    
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    iniciarCamposOcultos();
    if(anioProg !== null && mesProg !== null){
        var tbody = $("#tablaProgramacion tbody");
        tbody.find('tr').remove();
        $.ajax({
            url: path + "Docente/getProgramacionParaRegistrarNotas",
            type: "POST",
            data: {
                anioProg: anioProg,
                mesProg: mesProg
            },
            beforeSend: function(){
                $("#loader").css({"display":"block"});
                desactivarFiltro(true);
            },
            success: function(data){
                console.log(data);                
                var datos = JSON.parse(data);
                if(datos.respuesta === "success"){
                    $("#loader").css({"display":"none"});
                    desactivarFiltro(false);
                    
                    if(datos.programacion !== "vacio"){
                        var programaciones = datos.programacion;
                        for(i=0;i<programaciones.length;i++){
                            var programacion = programaciones[i];
                            var tr = "<tr>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.cod_local + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.tipo_espe + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.cod_espe + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.cod_localinst + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.local_descripcion + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.sede_descripcion + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.pabellon + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.cod_nivel + "</td>" +                                     
                                     "<td class=\"celda-centrada\">" + programacion.cod_aula + "</td>" +
                                     "<td>" + programacion.especialidad_descripcion + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.cod_curso + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.cod_cursoI + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.curso_descripcion + "</td>" +                                     
                                     "<td class=\"celda-centrada\">" + programacion.cod_turno + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.cod_ciclo + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.hora + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.numhoras + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.hora_inicio + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.hora_fin + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.nro_alumnos + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.cod_prof + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.curriculaI + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.cursoI_descripcion + "</td>" +
                                     "<td style=\"display: none;\" class=\"celda-centrada\">" + programacion.cursoM_descripcion + "</td>" +
                                     "<td class=\"celda-centrada\">" +
                                     "<button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"registrarNotas(this);\" title=\"Registrar Notas\"><span class=\"icon-users\"></span></button>" +
                                     "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"imprimirRegistroNotas(this);\" title=\"Imprimir Registro de Notas\"><span class=\"icon-printer\"></span></button>" +
                                     "</td>" +
                                     "</tr>";
                                     
                            tbody.append(tr);
                        }
                    }
                }else{
                    $("#loader").css({"display":"none"});
                    desactivarFiltro(false);
                    mostrarMensaje("error","ERROR",datos.errores);
                }
            },
            error: function(){
                $("#loader").css({"display":"none"});
                desactivarFiltro(false);
            }
        });
    }else{
        mostrarMensaje("error","ERROR","Debe seleccionar el Año y Mes de programacion");
    }
});

$("#anioProg").change(function(){
    var tbody = $("#tablaProgramacion tbody");
    tbody.find('tr').remove();
    iniciarCamposOcultos();
});

$("#mesProg").change(function(){
    var tbody = $("#tablaProgramacion tbody");
    tbody.find('tr').remove();
    iniciarCamposOcultos();
});

function iniciarCamposOcultos(){
    $("#codLocal").val("");
    $("#codLocalInst").val("");
    $("#localDescripcion").val("");
    $("#sedeDescripcion").val("");
    $("#pabellon").val("");
    $("#codNivel").val("");
    $("#codAula").val("");
    $("#codCurso").val("");
    $("#codCursoI").val("");
    $("#cursoDescripcion").val("");    
    $("#codTurno").val("");
    $("#codCiclo").val("");
    $("#hora").val("");
    $("#numHoras").val("");
    $("#horaInicio").val("");
    $("#horaFin").val("");
    $("#profesor").val("");
    $("#curriculaI").val("");
    $("#cursoIDescripcion").val("");
    $("#cursoMDescripcion").val("");
    $("#frmProgramacionAsignada").attr("action","#");
    $("#frmProgramacionAsignada").attr("target","");
}

function registrarNotas(btn){
    var target = path + "docente/registrarNotas";
    var codLocal = $(btn).parent().parent().find("td").eq(0).html();
    var tipoEspe = $(btn).parent().parent().find("td").eq(1).html();
    var codEspe = $(btn).parent().parent().find("td").eq(2).html();
    var codLocalInst = $(btn).parent().parent().find("td").eq(3).html();
    var localDescripcion = $(btn).parent().parent().find("td").eq(4).html();
    var sedeDescripcion = $(btn).parent().parent().find("td").eq(5).html();
    var pabellon = $(btn).parent().parent().find("td").eq(6).html();
    var codNivel = $(btn).parent().parent().find("td").eq(7).html();    
    var codAula = $(btn).parent().parent().find("td").eq(8).html();
    var carreraDescripcion = $(btn).parent().parent().find("td").eq(9).html();
    var codCurso = $(btn).parent().parent().find("td").eq(10).html();
    var codCursoI = $(btn).parent().parent().find("td").eq(11).html();
    var cursoDescripcion = $(btn).parent().parent().find("td").eq(12).html();    
    var codTurno = $(btn).parent().parent().find("td").eq(13).html();
    var codCiclo = $(btn).parent().parent().find("td").eq(14).html();
    var hora = $(btn).parent().parent().find("td").eq(15).html();
    var numHoras = $(btn).parent().parent().find("td").eq(16).html();
    var horaInicio = $(btn).parent().parent().find("td").eq(17).html();
    var horaFin = $(btn).parent().parent().find("td").eq(18).html();
    var docente = $(btn).parent().parent().find("td").eq(20).html();
    var curriculaI = $(btn).parent().parent().find("td").eq(21).html();
    var cursoIDescripcion = $(btn).parent().parent().find("td").eq(22).html();
    var cursoMDescripcion = $(btn).parent().parent().find("td").eq(23).html();
    
    $("#frmProgramacionAsignada").attr("action",target);
    $("#frmProgramacionAsignada").attr("target","");
    $("#codLocal").val(codLocal);
    $("#tipoEspe").val(tipoEspe);
    $("#codEspe").val(codEspe);
    $("#codLocalInst").val(codLocalInst);
    $("#localDescripcion").val(localDescripcion);
    $("#sedeDescripcion").val(sedeDescripcion);
    $("#pabellon").val(pabellon);
    $("#codNivel").val(codNivel);
    $("#carreraDescripcion").val(carreraDescripcion);
    $("#codAula").val(codAula);
    $("#codCurso").val(codCurso);
    $("#codCursoI").val(codCursoI);
    $("#cursoDescripcion").val(cursoDescripcion);
    $("#codTurno").val(codTurno);
    $("#codCiclo").val(codCiclo);
    $("#hora").val(hora);
    $("#numHoras").val(numHoras);
    $("#horaInicio").val(horaInicio);
    $("#horaFin").val(horaFin);
    $("#docente").val(docente);
    $("#curriculaI").val(curriculaI);
    $("#cursoIDescripcion").val(cursoIDescripcion);
    $("#cursoMDescripcion").val(cursoMDescripcion);
    $("#frmProgramacionAsignada").submit();
}

function imprimirRegistroNotas(btn){
    var target = path + "docente/imprimirRegistroNotas";
    var codLocal = $(btn).parent().parent().find("td").eq(0).html();
    var tipoEspe = $(btn).parent().parent().find("td").eq(1).html();
    var codEspe = $(btn).parent().parent().find("td").eq(2).html();
    var codLocalInst = $(btn).parent().parent().find("td").eq(3).html();
    var localDescripcion = $(btn).parent().parent().find("td").eq(4).html();
    var sedeDescripcion = $(btn).parent().parent().find("td").eq(5).html();
    var pabellon = $(btn).parent().parent().find("td").eq(6).html();
    var codNivel = $(btn).parent().parent().find("td").eq(7).html();    
    var codAula = $(btn).parent().parent().find("td").eq(8).html();
    var carreraDescripcion = $(btn).parent().parent().find("td").eq(9).html();
    var codCurso = $(btn).parent().parent().find("td").eq(10).html();
    var codCursoI = $(btn).parent().parent().find("td").eq(11).html();
    var cursoDescripcion = $(btn).parent().parent().find("td").eq(12).html();    
    var codTurno = $(btn).parent().parent().find("td").eq(13).html();
    var codCiclo = $(btn).parent().parent().find("td").eq(14).html();
    var hora = $(btn).parent().parent().find("td").eq(15).html();
    var numHoras = $(btn).parent().parent().find("td").eq(16).html();
    var horaInicio = $(btn).parent().parent().find("td").eq(17).html();
    var horaFin = $(btn).parent().parent().find("td").eq(18).html();
    var docente = $(btn).parent().parent().find("td").eq(20).html();
    var curriculaI = $(btn).parent().parent().find("td").eq(21).html();
    var cursoIDescripcion = $(btn).parent().parent().find("td").eq(22).html();
    var cursoMDescripcion = $(btn).parent().parent().find("td").eq(23).html();
    
    $("#frmProgramacionAsignada").attr("action",target);
    $("#frmProgramacionAsignada").attr("target","_blank");
    $("#codLocal").val(codLocal);
    $("#tipoEspe").val(tipoEspe);
    $("#codEspe").val(codEspe);
    $("#codLocalInst").val(codLocalInst);
    $("#localDescripcion").val(localDescripcion);
    $("#sedeDescripcion").val(sedeDescripcion);
    $("#pabellon").val(pabellon);
    $("#codNivel").val(codNivel);
    $("#carreraDescripcion").val(carreraDescripcion);
    $("#codAula").val(codAula);
    $("#codCurso").val(codCurso);
    $("#codCursoI").val(codCursoI);
    $("#cursoDescripcion").val(cursoDescripcion);
    $("#codTurno").val(codTurno);
    $("#codCiclo").val(codCiclo);
    $("#hora").val(hora);
    $("#numHoras").val(numHoras);
    $("#horaInicio").val(horaInicio);
    $("#horaFin").val(horaFin);
    $("#docente").val(docente);
    $("#curriculaI").val(curriculaI);
    $("#cursoIDescripcion").val(cursoIDescripcion);
    $("#cursoMDescripcion").val(cursoMDescripcion);
    $("#frmProgramacionAsignada").submit();
}
*/