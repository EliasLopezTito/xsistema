$(document).ready(function () {

    autocomplete();
    cargarInstituciones(true, true);
});

document.addEventListener('click', (e) => {

    if (e.target.matches('#btnProgramacion')) {
        mostrarProgramaciones();
    }

});

document.addEventListener('change', (e) => {

    if (e.target.matches('#anioProg')) {
        mostrarProgramaciones();
    }

    if (e.target.matches('#mesProg')) {
        mostrarProgramaciones();
    }

    if (e.target.matches('#periodo')) {
        mostrarProgramaciones();
    }

    if (e.target.matches('#sede')) {
        mostrarProgramaciones();
    }

    if (e.target.matches('#institucion')) {
        mostrarProgramaciones();
    }

    if (e.target.matches('#especialidad')) {
        mostrarProgramaciones();
    }

})

function mostrarProgramaciones(){
    var docente = $("#docente").attr('data-code');
    if(docente && docente.trim() !== ''){
        verProgramaciones();

        $("#panel_notas").css("display", "none");
        $("#panel_notas_no_pagantes").css("display", "none"); 

        var tbody = $("#tablaNotasProgramacion tbody");
        tbody.find('tr').remove();
        var tbody2 = $("#tablaNotasProgramacionNoPagantes tbody");
        tbody2.find('tr').remove();
    } else {
        Notiflix.Notify.Failure('Debe llenar el campo docente.');
        $("#docente").focus();
    }
}


function autocomplete(){
    $("#docente").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Notas/verRegistro",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarDocente'
                },
                success: function(data){
                    $("#docente").removeAttr("data-code");
                    $("#docente").next('i').removeClass('glyphicon-ok');
                    $("#docente").next('i').addClass('glyphicon-remove');
                    $("#docente").parent().removeClass('has-success');
                    $("#docente").parent().addClass('has-error');
                    let tbody = $("#tablaCursosProgramados tbody");
                    tbody.find('tr').remove();

                    $("#panel_notas").css("display", "none");     
                    tbody = $("#tablaNotasProgramacion tbody");
                    tbody.find('tr').remove();

                    $("#panel_notas_no_pagantes").css("display", "none");     
                    tbody2 = $("#tablaNotasProgramacionNoPagantes tbody");
                    tbody2.find('tr').remove();



                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;

                    response(result);
                }
            });
        },
        minLength: 3,
        select: function(event, ui){

            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#docente").val(ui.item.nombre);
                $("#docente").attr('data-code', ui.item.cod_emp);
                $("#docente").next('i').removeClass('glyphicon-remove');
                $("#docente").next('i').addClass('glyphicon-ok');
                $("#docente").parent().removeClass('has-error');
                $("#docente").parent().addClass('has-success');
                mostrarProgramaciones();
                mostrarDatos(ui.item.Telefonos, ui.item.Correo);
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        if (item.vacio) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div>" + item.cod_emp + " - " +item.nombre + "</div>" )
            .appendTo( ul );
    };

    $("#docente").focus();
}
function mostrarDatos(tel, correo) {
    $('#div-datos').show('300');
    $('#lbl-telefono').text(tel);
    $('#lbl-correo').text(correo);
}
function verProgramaciones()
{
    let cod_emp = $("#docente").attr('data-code');
    let periodo = $("#periodo").val();
    let especialidad = $("#especialidad").val();
    let institucion = $("#institucion").val();
    let sede = $("#sede").val();

    let tbody = $("#tablaCursosProgramados tbody");
	tbody.find('tr').remove();

    $.ajax({
        url: path + "supervisor/controlDocente2",
        type: "POST",
        data: {
            cod_emp: cod_emp,
            periodo: periodo,
            especialidad: especialidad,
            institucion: institucion,
            sede: sede,
        	opcion: "cursosProgramados"
        },
        beforeSend: function () {

            $('.text-loader').text('Consultando datos, por favor espere...');
            $("#modalLoader").modal();

            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            $("#cod_local").val("");
        	$("#tipo_espe").val("");
        	$("#cod_espe").val("");
        	$("#ciclo").val("");
        	$("#semestre").val("");
        	$("#malla_curricular").val("");
        	$("#codCursoM").val("");
        	$("#aula").val("");
        },
        success: function (data) {
        	$("#modalLoader").modal("hide");
            
            //console.log(data);

            $("#panel_cprogramados").css("display", "block");

            var datos = JSON.parse(data);

            console.log("daat", datos)
            
            if (datos.respuesta == "success") {
                
                if(datos.arrayProgramaciones != "vacio")
                {
					
					var arrayProgramaciones = datos.arrayProgramaciones;

                	for (i = 0; i < arrayProgramaciones.length; i++) 
                	{
                        var programacion = arrayProgramaciones[i];                       

                        var tr = "<tr class=\"fila_programacion\" onclick=\"cargarAlumnosProgramacion(this,'" + programacion.ciclo + "','" + programacion.codTipoEspecialidad + "','" + programacion.codEspecialidad + "','" + programacion.codLocal + "','" + programacion.codCursoM + "','" + programacion.aula + "','" + programacion.semestre + "'," + programacion.anioProg + ",'" + programacion.mesProg + "','" + programacion.turno +"','" + programacion.cod_sede +"'); \">" +
                                    "    <td class=\"celda-centrada\">" + programacion.tcar + "</td>" +
                                    "    <td class=\"celda-centrada\">" + programacion.sede + "</td>" +
                                    "    <td class=\"celda-centrada\">" + programacion.aula + "</td>" +
                                    "    <td class=\"celda-centrada\">" + programacion.carrera + "</td>" +
                                    "    <td class=\"celda-centrada\">" + programacion.curso + "</td>" +
                                    "    <td class=\"celda-centrada\">" + programacion.turno + "</td>" +
                                    "    <td class=\"celda-centrada\">" + programacion.ciclo + "</td>" +
                                    "    <td class=\"celda-centrada\">" + programacion.nroalu + "</td>" +
                                    "    <td class=\"celda-centrada\">" + programacion.codCursoM + "</td>" +
                                    "</tr>";
                            tbody.append(tr);
                    }
                }
               
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                Notiflix.Notify.Failure('El docente no tiene progrmaciones en el periodo seleccionado!');
                // mostrarMensaje("error", "ERROR", errores);
            }
        },
        complete: function(){
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
        }
    });

}

function cargarAlumnosProgramacion(elemento, ciclo, codTipoEspe, codEspecialidad, codlocal,codCursoM, aula, semestre, anio, mes , turno, sede){
    
    $(".fila_programacion").css("background-color","white");

    $(elemento).css("background-color","#3abfff");//pintando fila
    let codigoDocente = $("#docente").attr('data-code');

    $.ajax({
        url: path + "supervisor/controlDocente2",
        type: "POST",
        data: {
            ciclo: ciclo,
            codTipoEspe: codTipoEspe,
            codEspecialidad: codEspecialidad,
            codlocal: codlocal,
            codCursoM: codCursoM,
            aula: aula,
            anio: anio,
            mes: mes,
            semestre: semestre,
            codigoDocente: codigoDocente,
            turno: turno,
            sede: sede,
            opcion: "selectNotas"
        },
        beforeSend: function()
        {
            $('.text-loader').text('Consultando datos, por favor espere...');
            $("#modalLoader").modal();

            $("#cod_local").val("");
            $("#tipo_espe").val("");
            $("#cod_espe").val("");
            $("#ciclo").val("");
            $("#semestre").val("");
            $("#malla_curricular").val("");
            $("#codCursoM").val("");
            $("#aula").val("");
        },
        success: function (data) {
            
            let datos = JSON.parse(data);
            console.log(datos)
            let tbody = $("#tablaNotasProgramacion tbody");
                tbody.find('tr').remove();

            let tbody2 = $("#tablaNotasProgramacionNoPagantes tbody");
                tbody2.find('tr').remove();

            if (datos.respuesta == "success") 
            {
            
                $("#panel_notas").css("display", "block");
                $("#panel_notas_no_pagantes").css("display", "block");     
                
                if (datos.arrayNotasProgramacion.length > 0)
                {

                    $("#cod_local").val(codlocal);
                    $("#tipo_espe").val(codTipoEspe);
                    $("#cod_espe").val(codEspecialidad);
                    $("#ciclo").val(ciclo);
                    $("#semestre").val(semestre);
                    $("#malla_curricular").val(datos.mallaCurricular);
                    $("#codCursoM").val(codCursoM);
                    $("#aula").val(aula);

                    var arrayNotasProgramacion = datos.arrayNotasProgramacion;
                
                    for (i = 0; i < arrayNotasProgramacion.length; i++)
                    {

                        var arrayNotaProgramacion = arrayNotasProgramacion[i];

                        var tr = "<tr>" +
                                        "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                        "    <td class=\"celda-centrada\">" + arrayNotaProgramacion.cod_alumno + "</td>" +
                            "    <td class=\"celda-izquierda\">" + arrayNotaProgramacion.NombreCompletoAlumno + " <span style=\"color:red;font-weight:bold;float:right;\">"+arrayNotaProgramacion.descripcionBloqueoPago+"</span></td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ap1[]\" disabled value=\"" + arrayNotaProgramacion.ap1.trim() + "\" />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ed1[]\" disabled value=\"" + arrayNotaProgramacion.ed1.trim() + "\" />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ac1[]\" disabled value=\"" + arrayNotaProgramacion.ac1.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ep[]\" disabled value=\"" + arrayNotaProgramacion.ep.trim() + "\" />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;background-color:rgb(205, 237, 245);text-transform: uppercase;\" name=\"pr1[]\" disabled value=\"" + arrayNotaProgramacion.pr1.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ap2[]\" disabled value=\"" + arrayNotaProgramacion.ap2.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ed2[]\" disabled value=\"" + arrayNotaProgramacion.ed2.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ac2[]\" disabled value=\"" + arrayNotaProgramacion.ac2.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ef[]\" disabled value=\"" + arrayNotaProgramacion.ef.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;background-color:rgb(205, 237, 245);text-transform: uppercase;\" name=\"pr2[]\" disabled value=\"" + arrayNotaProgramacion.pr2.trim() + "\"   />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;background-color:#fff2c8fc;text-transform: uppercase;\" name=\"pr[]\" disabled value=\"" + arrayNotaProgramacion.pr.trim() + "\"   />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"er[]\" disabled value=\""  + arrayNotaProgramacion.er.trim() + "\"   />" +
                                        "    </td>" +
                                        "</tr>";
                                tbody.append(tr);
                    }

                    pintarNotasProgramacion();
                }                
                
                if (datos.arrayNotasProgramacionNoPagantes.length > 0)
                {

                    var arrayNotasProgramacion = datos.arrayNotasProgramacionNoPagantes;
                
                    for (i = 0; i < arrayNotasProgramacion.length; i++)
                    {

                        var arrayNotaProgramacion = arrayNotasProgramacion[i];

                        var tr = "<tr>" +
                                        "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                        "    <td class=\"celda-centrada\">" + arrayNotaProgramacion.cod_alumno + "</td>" +
                                        "    <td class=\"celda-izquierda\">" + arrayNotaProgramacion.NombreCompletoAlumno + " <span style=\"color:red;font-weight:bold;float:right;\"></span></td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ap1[]\" disabled value=\"" + arrayNotaProgramacion.ap1.trim() + "\" />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ed1[]\" disabled value=\"" + arrayNotaProgramacion.ed1.trim() + "\" />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ac1[]\" disabled value=\"" + arrayNotaProgramacion.ac1.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ep[]\" disabled value=\"" + arrayNotaProgramacion.ep.trim() + "\" />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;background-color:rgb(205, 237, 245);text-transform: uppercase;\" name=\"pr1[]\" disabled value=\"" + arrayNotaProgramacion.pr1.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ap2[]\" disabled value=\"" + arrayNotaProgramacion.ap2.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ed2[]\" disabled value=\"" + arrayNotaProgramacion.ed2.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ac2[]\" disabled value=\"" + arrayNotaProgramacion.ac2.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ef[]\" disabled value=\"" + arrayNotaProgramacion.ef.trim() + "\"  />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;background-color:rgb(205, 237, 245);text-transform: uppercase;\" name=\"pr2[]\" disabled value=\"" + arrayNotaProgramacion.pr2.trim() + "\"   />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;background-color:#fff2c8fc;text-transform: uppercase;\" name=\"pr[]\" disabled value=\"" + arrayNotaProgramacion.pr.trim() + "\"   />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"er[]\" disabled value=\""  + arrayNotaProgramacion.er.trim() + "\"   />" +
                                        "    </td>" +
                                        "</tr>";
                                tbody2.append(tr);
                    }

                    pintarNotasProgramacion2();
                }

            } else {

                $("#panel_notas").css("display", "none");
                $("#panel_notas_no_pagantes").css("display", "none");     

                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        },
        complete: function(){
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
        }
    });

}

function pintarNotasProgramacion() {
    $("#tablaNotasProgramacion tbody").find("tr").each(function () {
        var nroText = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroText; i++) {
            validarNota($(this).find("input:text").eq(i));
        }
    });

}

function pintarNotasProgramacion2() {
    $("#tablaNotasProgramacionNoPagantes tbody").find("tr").each(function () {
        var nroText = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroText; i++) {
            validarNota($(this).find("input:text").eq(i));
        }
    });

}

function validarNota(text) 
{

    var nota = $(text).val().trim();

    $(text).css({"color": "black"});

    if(nota == 'NSP' || nota == 'nsp')
    {
        
        $(text).css({"color": "red"});
        $(text).val("NSP");

    }else if (isNaN(nota) || nota == "") 
    {

        $(text).val("");

    } else 
    {

        if (isNaN(parseInt(nota)))
        {

            $(text).val("");

        } else 
        {
            
            nota = parseInt(nota);
            if (nota < 0 || nota > 20) {
                $(text).val("");
            } else {
                if (nota >= 0 && nota <= 9) {
                    $(text).val("0" + nota.toString());
                } else {
                    $(text).val(nota);
                }
                if (nota < 13) {
                    $(text).css({"color": "red"});
                } else {
                    $(text).css({"color": "blue"});
                }
            }
        }
    }
}