$(document).ready(function () {

    

});

$("#btnVerEncuestas").click(function () {
   
    $("#panel_eprogramados").css("display", "none");  
    $("#panel_docente_cursos_programados").css("display", "none");  
    $("#panel_tutores_programados").css("display", "none");  
    $("#panel_result_encuesta_docente").css("display", "none");  
    $("#panel_result_encuesta_tutor").css("display", "none");  


    var tbodyEncuestasProgramadas = $("#tablaEncuestasProgramadas tbody");
    tbodyEncuestasProgramadas.find('tr').remove(); 

    var tbodyDocente = $("#tablaDocentesProgramados tbody");
    tbodyDocente.find('tr').remove(); 

    var tbodyTutor = $("#tablaTutoresProgramados tbody");
    tbodyTutor.find('tr').remove(); 

    var tbodyResultencuestaDocente = $("#tablaResultadoEncuestaDocente tbody");
    tbodyResultencuestaDocente.find('tr').remove(); 

    var tbodyResultencuestaTutor = $("#tablaResultadoEncuestaTutor tbody");
    tbodyResultencuestaTutor.find('tr').remove(); 

    verEncuestasProgramadas();

});

function verEncuestasProgramadas()
{

    var anio = $("#anio").val();
    var mes = $("#mes").val();

    var tbodyEncuestasProgramadas = $("#tablaEncuestasProgramadas tbody");

    $.ajax({
        url: path + "Programacion/rptEncuestasProgramadas",
        type: "POST",
        data: {
            anio: anio,
            mes: mes,
            opcion: "encuestasProgramadas"
        },
        beforeSend: function () {
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
        },
        success: function (data) {
 
            $("#modalLoader").modal("hide");
            
            //console.log(data);

            $("#panel_eprogramados").css("display", "block");

            var datos = JSON.parse(data);

            if (datos.respuesta == "success") {
                
                if(datos.encuestas != "vacio")
                {
                    
                    var encuestas = datos.encuestas;

                    var onclick = "";

                    for (i = 0; i < encuestas.length; i++) 
                    {
                        var encuesta = encuestas[i]; 

                        if(encuesta.id_ClasificacionEncuesta == 1)
                        {

                            onclick = "cargarDocentesProgramados(this,"+encuesta.id_Encuesta+ ");";

                        }else
                        {
                            onclick = "cargarTutoresProgramados(this,"+encuesta.id_Encuesta+ ");";
                            
                        }

                        var tr = "<tr class=\"fila_programacion_tbl1\" onclick=\""+onclick+ "\">" +
                                    "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                    "    <td class=\"celda-centrada\">" + encuesta.Descripcion + "</td>" +
                                    "    <td class=\"celda-centrada\">" + encuesta.DescripcionClasificacionEncuesta + "</td>" +
                                    "    <td class=\"celda-centrada\">" + encuesta.NroItem + "</td>" +
                                    "</tr>";
                            tbodyEncuestasProgramadas.append(tr);
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

function cargarDocentesProgramados(elemento,idEncuesta)
{

    $(".fila_programacion_tbl1").css("background-color","white");

    $(elemento).css("background-color","#3abfff");//pintando fila

    var anio = $("#anio").val();
    var mes = $("#mes").val();

    $("#panel_docente_cursos_programados").css("display", "none");
    $("#panel_tutores_programados").css("display", "none");

    var tbodyDocente = $("#tablaDocentesProgramados tbody");
    tbodyDocente.find('tr').remove();

    var tbodyTutor = $("#tablaTutoresProgramados tbody");
    tbodyTutor.find('tr').remove();

    $("#panel_result_encuesta_docente").css("display", "none");
    $("#panel_result_encuesta_tutor").css("display", "none");

    var tbodyResultencuestaDocente = $("#tablaResultadoEncuestaDocente tbody");
    tbodyResultencuestaDocente.find('tr').remove();

    var tbodyResultencuestaTutor = $("#tablaResultadoEncuestaTutor tbody");
    tbodyResultencuestaTutor.find('tr').remove();
    
    $.ajax({
        url: path + "Programacion/rptEncuestasProgramadas",
        type: "POST",
        data: {
            anio: anio,
            mes: mes,
            idEncuesta: idEncuesta,
            opcion: "docentesProgramados"
        },
        beforeSend: function () {
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
        },
        success: function (data) {
 
            $("#modalLoader").modal("hide");
            
            //console.log(data);

            $("#panel_docente_cursos_programados").css("display", "block");

            var datos = JSON.parse(data);

            if (datos.respuesta == "success") {
                
                if(datos.arrayProgramacionesDocente != "")
                {
                    var arrayProgramacionesDocente = datos.arrayProgramacionesDocente;

                    for (i = 0; i < arrayProgramacionesDocente.length; i++) 
                    {
                        var arrayProgramacionDocente = arrayProgramacionesDocente[i]; 

                        var tr = "<tr class=\"fila_programacion_tbl2_1\" onclick=\"cargarResultadoEncuestaDocente(this,"+idEncuesta+ ",'"+arrayProgramacionDocente.cod_curso+ "','"+arrayProgramacionDocente.cod_prof+ "');\">" +
                                    "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayProgramacionDocente.DescripcionCurso + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayProgramacionDocente.NombreCompletoDocente + "</td>" +
                                    "    <td class=\"celda-centrada\">" + arrayProgramacionDocente.CantAlumnosRespondieronEncuesta+"/"+arrayProgramacionDocente.CantAlumnosProgramados + "</td>" +
                                    "</tr>";
                            tbodyDocente.append(tr);
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

function cargarResultadoEncuestaDocente(elemento,idEncuesta,cod_curso,cod_docente)
{

    $(".fila_programacion_tbl2_1").css("background-color","white");

    $(elemento).css("background-color","#3abfff");//pintando fila

    var anio = $("#anio").val();
    var mes = $("#mes").val();

    var tbodyResultencuestaDocente = $("#tablaResultadoEncuestaDocente tbody");
    tbodyResultencuestaDocente.find('tr').remove();

    $.ajax({
        url: path + "Programacion/rptEncuestasProgramadas",
        type: "POST",
        data: {
            anio: anio,
            mes: mes,
            idEncuesta: idEncuesta,
            codCurso: cod_curso,
            codDocente: cod_docente,
            opcion: "resultadosEncuestasDocentes"
        },
        beforeSend: function () {
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            $("#lbl_encuesta_docente").text("");
            $("#lbl_docente").text("");
            $("#lbl_curso").text("");
            $("#lbl_item1_docente").text("");
            $("#lbl_item2_docente").text("");
            $("#lbl_item3_docente").text("");
            $("#lbl_item4_docente").text("");
            $("#lbl_item5_docente").text("");
            $("#lbl_item6_docente").text("");
            $("#lbl_item7_docente").text("");
            $("#lbl_item8_docente").text("");
            $("#lbl_item9_docente").text("");
            $("#lbl_item10_docente").text("");
        },
        success: function (data) {
 
            $("#modalLoader").modal("hide");
            
            //console.log(data);

            $("#panel_result_encuesta_docente").css("display", "block");

            var datos = JSON.parse(data);

            if (datos.respuesta == "success")
            {
                
                var arrayItems = datos.arrayItems;

                if(arrayItems != "vacio")
                {

                    for (i = 0; i < arrayItems.length; i++) 
                    {

                        var arrayItem = arrayItems[i]; 
                        $("#lbl_item"+(i + 1)+"_docente").text((arrayItem.Descripcion).charAt(0).toUpperCase() + (arrayItem.Descripcion).slice(1).toLowerCase());

                    }
                }

                if(datos.arrayResultadosEncuesta != "")
                {
                    
                    var arrayResultadosEncuesta = datos.arrayResultadosEncuesta;
                    
                    for (i = 0; i < arrayResultadosEncuesta.length; i++) 
                    {
                        var arrayResultadoEncuesta = arrayResultadosEncuesta[i]; 
                        
                        var tr = "<tr>" +
                                    "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.cod_alumno + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.NombreCompletoAlumno + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item1 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item2 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item3 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item4 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item5 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item6 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item7 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item8 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item9 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item10 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.TotalPuntaje + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.Comentarios + "</td>" +
                                    "</tr>";

                        tbodyResultencuestaDocente.append(tr);
                    }

                }

                $("#lbl_encuesta_docente").text(datos.descripcionEncuesta);
                $("#lbl_docente").text(datos.NombreCompletoDocente);
                $("#lbl_curso").text(datos.descripcionCurso);
               
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

function cargarTutoresProgramados(elemento,idEncuesta)
{

    $(".fila_programacion_tbl1").css("background-color","white");

    $(elemento).css("background-color","#3abfff");//pintando fila

    var anio = $("#anio").val();
    var mes = $("#mes").val();

    $("#panel_docente_cursos_programados").css("display", "none");
    $("#panel_tutores_programados").css("display", "none");

    var tbodyDocente = $("#tablaDocentesProgramados tbody");
    tbodyDocente.find('tr').remove();

    var tbodyTutor = $("#tablaTutoresProgramados tbody");
    tbodyTutor.find('tr').remove();

    $("#panel_result_encuesta_docente").css("display", "none");
    $("#panel_result_encuesta_tutor").css("display", "none");

    var tbodyResultencuestaDocente = $("#tablaResultadoEncuestaDocente tbody");
    tbodyResultencuestaDocente.find('tr').remove();

    var tbodyResultencuestaTutor = $("#tablaResultadoEncuestaTutor tbody");
    tbodyResultencuestaTutor.find('tr').remove();
    
    $.ajax({
        url: path + "Programacion/rptEncuestasProgramadas",
        type: "POST",
        data: {
            anio: anio,
            mes: mes,
            idEncuesta: idEncuesta,
            opcion: "tutoresProgramados"
        },
        beforeSend: function () {
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
        },
        success: function (data) {
 
            $("#modalLoader").modal("hide");
            
            //console.log(data);

            $("#panel_tutores_programados").css("display", "block");

            var datos = JSON.parse(data);

            if (datos.respuesta == "success") {
                
                if(datos.arrayTutoresProgramados != "")
                {
                    var arrayTutoresProgramados = datos.arrayTutoresProgramados;

                    for (i = 0; i < arrayTutoresProgramados.length; i++) 
                    {
                        var arrayTutorProgramado = arrayTutoresProgramados[i]; 

                        var tr = "<tr class=\"fila_programacion_tbl2_2\" onclick=\"cargarResultadoEncuestaTutor(this,"+idEncuesta+ ","+arrayTutorProgramado.id_Tutor+ ",'"+arrayTutorProgramado.cod_emp+ "');\">" +
                                    "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayTutorProgramado.NombreCompletoTutor + "</td>" +
                                    "    <td class=\"celda-centrada\">" + arrayTutorProgramado.CantAlumnosRespondieronEncuesta+"/"+arrayTutorProgramado.CantAlumnosProgramadosByTutor + "</td>" +
                                    "</tr>";
                            tbodyTutor.append(tr);
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

function cargarResultadoEncuestaTutor(elemento,idEncuesta, idTutor, codEmp)
{

    $(".fila_programacion_tbl2_2").css("background-color","white");

    $(elemento).css("background-color","#3abfff");//pintando fila

    var anio = $("#anio").val();
    var mes = $("#mes").val();

    var tbodyResultEncuestaTutor = $("#tablaResultadoEncuestaTutor tbody");
    tbodyResultEncuestaTutor.find('tr').remove();

    $.ajax({
        url: path + "Programacion/rptEncuestasProgramadas",
        type: "POST",
        data: {
            anio: anio,
            mes: mes,
            idEncuesta: idEncuesta,
            idTutor: idTutor,
            codEmp: codEmp,
            opcion: "resultadosEncuestasTutores"
        },
        beforeSend: function () {
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            $("#lbl_encuesta_tutor").text("");
            $("#lbl_tutor").text("");
            $("#lbl_item1_tutor").text("");
            $("#lbl_item2_tutor").text("");
            $("#lbl_item3_tutor").text("");
            $("#lbl_item4_tutor").text("");
            $("#lbl_item5_tutor").text("");
            $("#lbl_item6_tutor").text("");
        },
        success: function (data) {
 
            $("#modalLoader").modal("hide");
            
            //console.log(data);

            $("#panel_result_encuesta_tutor").css("display", "block");

            var datos = JSON.parse(data);

            if (datos.respuesta == "success")
            {
                
                var arrayItems = datos.arrayItems;

                if(arrayItems != "vacio")
                {

                    for (i = 0; i < arrayItems.length; i++) 
                    {

                        var arrayItem = arrayItems[i]; 
                        $("#lbl_item"+(i + 1)+"_tutor").text((arrayItem.Descripcion).charAt(0).toUpperCase() + (arrayItem.Descripcion).slice(1).toLowerCase());

                    }
                }

                if(datos.arrayResultadosEncuesta != "")
                {
                    
                    var arrayResultadosEncuesta = datos.arrayResultadosEncuesta;
                    
                    for (i = 0; i < arrayResultadosEncuesta.length; i++) 
                    {
                        var arrayResultadoEncuesta = arrayResultadosEncuesta[i]; 
                        
                        var tr = "<tr>" +
                                    "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.cod_alumno + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.NombreCompletoAlumno + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item1 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item2 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item3 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item4 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item5 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.item6 + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.TotalPuntaje + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + arrayResultadoEncuesta.Comentarios + "</td>" +
                                    "</tr>";

                        tbodyResultEncuestaTutor.append(tr);
                    }

                }

                $("#lbl_encuesta_tutor").text(datos.descripcionEncuesta);
                $("#lbl_tutor").text(datos.NombreCompletoTutor);
               
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

