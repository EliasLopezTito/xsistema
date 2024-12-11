$(document).ready(function () {

    tablaEgresados = $("#tablaListaFaltaDocentes").DataTable({
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
            
        ],
        language: {
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "No se encontraron registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "search": "Buscar:",
            "infoThousands": ",",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
        }
    })

    $("#docente").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Notas/registroNotasDocente",
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
                $("#docente").val(ui.item.cod_emp + " - " +ui.item.nombre);
                $("#docente").attr('data-code', ui.item.cod_emp);
                $("#docente").next('i').removeClass('glyphicon-remove');
                $("#docente").next('i').addClass('glyphicon-ok');
                $("#docente").parent().removeClass('has-error');
                $("#docente").parent().addClass('has-success');
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

    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){
                    
                    $("#btnImprimirBoleta").prop("disabled",true);
                    $("#btnImprimirHistorico").prop("disabled",true);
                    $("#carrera").html("").prop("disabled",true);
                    $("#tablaCursos tbody").html("");

                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumno").attr('codigo', ui.item.cod_alumno);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
            } 
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        if (item.hasOwnProperty('vacio')) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }
        return $( "<li>" )
            .append( "<div>"+item.cod_alumno+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    $("#alumno").focus();
    
});

document.addEventListener('click', (e) => {
    if (e.target.matches('#btnVerModalCorreo')) {
        $("#modalEnviarCorreo").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (e.target.matches('#btnEnviarCorreo')) {
        enviarCorreo();
    }

    if (e.target.matches('#listaDocentes')) {

        var tbody = $("#tablaNotasProgramacion tbody");
        tbody.find('tr').remove();
        verListaFaltaDocentes();
        
    }

    if (e.target.matches('#docente')) {
        document.getElementById('docente').select();
    }

    if (e.target.matches('#btnImprimir')) {
        imprimirNotasByProgramacion();
    }

});



function verListaFaltaDocentes() {

	let anioProg = $("#anioProg").val();
    let mesProg = $("#mesProg").val();
    let codEspe = $("#especialidad").val();
    let docente = $("#docente").val();
    let alumno = $("#alumno").val();
    let curso = $("#curso").val();

    $('#tablaListaFaltaDocentes').dataTable().fnDestroy();
    tablaEgresados = $("#tablaListaFaltaDocentes").DataTable({
        responsive: true,
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        ajax: {
            url: path + "Notas/registrosCompletos",
            type: 'POST',
            beforeSend: function(){
                $('.text-loader').text('SRTA. ISIS, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
            },
            data: {
                anioProg: anioProg,
        	    mesProg: mesProg,
                codEspe: codEspe,
                docente: docente,
                alumno: alumno,
                curso: curso,
                opcion: "verListaDocentesCompletos",
            },
            dataSrc: function(response){ 
                console.log(response);
                
                return response.arrayDocente;
            },
            complete: function(data){
                $("#panel_docentes").css("display", "block");
                $("#modalLoader").modal("hide");
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [20 ,25, 50, 75 , 100],
            [20 ,25, 50, 75 , 100]
        ],
        columns: [
            { 
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: null, render: function (data) { return data.Especialidad; } },
            { data: null, render: function (data) { return data.CodDocente; } },
            { data: null, render: function (data) { return data.Docente; } },
            { data: null, render: function (data) { return data.cod_alumno; } },
            { data: null, render: function (data) { return data.Alumno; } },
            { data: null, render: function (data) { return data.SemestreProg; } },
            { data: null, render: function (data) { return data.Ciclo; } },
            { data: null, render: function (data) { return data.Aula; } },
            { data: null, render: function (data) { return data.turno; } },
            { data: null, render: function (data) { return data.CodCurso; } },
            { data: null, render: function (data) { return data.Curso; } },
            { data: null, render: function (data) { return data.Nota; } },
            { data: null, render: function (data) { return data.NotaActa; } },
            { data: null, render: function (data) { 
                
                comparacion = 'IGUAL'
                if(data.Nota !== data.NotaActa){
                    comparacion = 'DIFERENTE'
                }   
                return  comparacion; 
            } }
            
        ],
        createdRow : function( row, data, dataIndex ) {
            if ( data.Nota !== data.NotaActa ) {
                $( row ).addClass( "low-score" );
            }
        },
        language: {
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "No se encontraron registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "search": "Buscar:",
            "infoThousands": ",",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
        }
    });

}


// $("#btnVerModalCorreo").click(function () {

//     $("#modalEnviarCorreo").modal({
// 		backdrop: 'static',
// 		keyboard: false
// 	});
// })

function validarCamposEmail(asunto, mensaje){
    let resp = true;
    if (asunto.trim() === '') {
        $("#asunto").parent().addClass('has-error');
        resp = false;
    }
    if (mensaje.trim() === '') {
        $("#mensaje").parent().addClass('has-error');
        resp = false;
    }

    return resp;
}

function limpiarModalCorreo() {
	// $("#asunto").val('');
	// $("#mensaje").val('');

    $("#btnEnviarCorreo").show();
    $("#mensajeEnviando").css("display", "none");
}

function verProgramaciones() {

	let anioProg = $("#anioProg").val();
    let mesProg = $("#mesProg").val();
    let cod_emp = $("#docente").attr('data-code');

    let tbody = $("#tablaCursosProgramados tbody");
	tbody.find('tr').remove();

    $.ajax({
        url: path + "Notas/verRegistro",
        type: "POST",
        data: {
        	anioProg: anioProg,
        	mesProg: mesProg,
            cod_emp: cod_emp,
        	opcion: "cursosProgramados"
        },
        beforeSend: function () {
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
            
            if (datos.respuesta == "success") {
                
                if(datos.arrayProgramaciones != "vacio")
                {
					
					var arrayProgramaciones = datos.arrayProgramaciones;

                	for (i = 0; i < arrayProgramaciones.length; i++) 
                	{
                        var programacion = arrayProgramaciones[i];                       

                        var tr = "<tr class=\"fila_programacion\" onclick=\"cargarAlumnosProgramacion(this,'" + programacion.ciclo + "','" + programacion.codTipoEspecialidad + "','" + programacion.codEspecialidad + "','" + programacion.codLocal + "','" + programacion.codCursoM + "','" + programacion.aula + "','" + programacion.semestre + "'," + anioProg + ",'" + mesProg + "','" + programacion.turno +"'); \">" +
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
        }
    });

}

function cargarAlumnosProgramacion(elemento, ciclo, codTipoEspe, codEspecialidad, codlocal,codCursoM, aula, semestre, anio, mes, turno){
    
    $(".fila_programacion").css("background-color","white");
    $("#turno_").val(turno);
    $(elemento).css("background-color","#3abfff");//pintando fila
    elemento.length == 6 ? codigoDocente = elemento : codigoDocente = $("#docente").attr('data-code') 
    //let codigoDocente = $("#docente").attr('data-code');

    $.ajax({
        url: path + "Notas/verRegistro",
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
            opcion: "selectNotas"
        },
        beforeSend: function()
        {
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
            let tbody = $(".tablaNotasProgramacion tbody");
                tbody.find('tr').remove();
            let docente = datos.docente;

            if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(docente.correo)){
                $('#btnVerModalCorreo').prop('disabled', true);
            } else{
                $('#btnVerModalCorreo').prop('disabled', false);
                $('#destino').val(docente.correo);
                $('#nombre_docente').val(docente.nombre);
                limpiarModalCorreo();
            }


            if (datos.respuesta == "success") 
            {
            
                $("#panel_docentes").css("display", "block");     
                
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
                                tbody.append(tr);
                    }

                    pintarNotasProgramacion();
                }                
                
            } else {

                $("#panel_notas").css("display", "none");

                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });

}

function validarNota(text) {

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


function pintarNotasProgramacion() {
    $("#tablaNotasProgramacion tbody").find("tr").each(function () {
        var nroText = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroText; i++) {
            validarNota($(this).find("input:text").eq(i));
        }
    });

}

function obtenerPromedio1(elemento)
{
    var ap1 = ($(elemento).parent().parent().find("input:text").eq(0).val()).trim();
    var ed1 = ($(elemento).parent().parent().find("input:text").eq(1).val()).trim();
    var ep = ($(elemento).parent().parent().find("input:text").eq(2).val()).trim();
    var ac1 = ($(elemento).parent().parent().find("input:text").eq(3).val()).trim();
    
    if(ap1  != "" && ed1 != "" && ep != "" && ac1 != "")
    {

        if(ap1 == ""){ ap1 = 0; }
        if(ed1 == ""){ ed1 = 0; }
        if(ep == ""){ ep = 0; }
        if(ac1 == ""){ ac1 = 0; }

        var pr1 = ((parseInt(ap1) + parseInt(ed1) + parseInt(ep) + parseInt(ac1)) / 4).toFixed(0);
        
        $(elemento).parent().parent().find("input:text").eq(4).val(pr1);

        validarNota($(elemento).parent().parent().find("input:text").eq(4));


        //obteniendo promedio general
        var pr1 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(9).val()).trim();

        if(pr1 != "" && pr2 != "" && pr1 != "NSP" && pr2 != "NSP" && pr1 != "nsp" && pr2 != "nsp")
        { 


            var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);

            $(elemento).parent().parent().find("input:text").eq(10).val(pr);
            validarNota($(elemento).parent().parent().find("input:text").eq(10));

        }else
        {

            $(elemento).parent().parent().find("input:text").eq(10).val("");
        }

    }

}

function obtenerPromedio2(elemento)
{

    var ap2 = ($(elemento).parent().parent().find("input:text").eq(5).val()).trim();
    var ed2 = ($(elemento).parent().parent().find("input:text").eq(6).val()).trim();
    var ef = ($(elemento).parent().parent().find("input:text").eq(7).val()).trim();
    var ac2 = ($(elemento).parent().parent().find("input:text").eq(8).val()).trim();
    
    //console.log(ap2 + ' ' + ed2 + ' ' + ef + ' '+ ac2);

    if(ap2  != "" && ed2 != "" && ef != "" && ac2 != "")
    {
        if(ap2 == ""){ ap2 = 0; }
        if(ed2 == ""){ ed2 = 0; }
        if(ef == ""){ ef = 0; }
        if(ac2 == ""){ ac2 = 0; }

        var pr2 = ((parseInt(ap2) + parseInt(ed2) + parseInt(ef) + parseInt(ac2)) / 4).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(9).val(pr2);

        validarNota($(elemento).parent().parent().find("input:text").eq(9));

        //obteniendo promedio general
        var pr1 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(9).val()).trim();

        if(pr1 != "" && pr2 != "" && pr1 != "NSP" && pr2 != "NSP" && pr1 != "nsp" && pr2 != "nsp")
        { 


            var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);

            $(elemento).parent().parent().find("input:text").eq(10).val(pr);
            validarNota($(elemento).parent().parent().find("input:text").eq(10));

        }else
        {

            $(elemento).parent().parent().find("input:text").eq(10).val("");
        }

    }      
}



function imprimirNotasByProgramacion(CodDocente, Cod_local, Tipo_espe, Cod_espe, Ciclo, semestre, CodMallaCurricular, CodCurso, Aula, turno)
{

	var anioProg = $("#anioProg").val();
	var mesProg = $("#mesProg").val();

	var form = [];
        form.push({name: "opcion", value: "imprimirNotasProgramacion"});
        form.push({ name: "codDocente", value: CodDocente });
        form.push({ name: "cod_local", value: Cod_local });
        form.push({ name: "tipo_espe", value: Tipo_espe });
        form.push({ name: "cod_espe", value: Cod_espe });
        form.push({ name: "ciclo", value: Ciclo });
        form.push({ name: "semestre", value: semestre });
        form.push({ name: "malla_curricular", value: CodMallaCurricular });
        form.push({ name: "codCursoM", value: CodCurso });
        form.push({ name: "aula", value: Aula });
        form.push({ name: "turno", value: turno });

        form.push({name: "anio", value: anioProg});
        form.push({name: "mes", value: mesProg});
        
        $.ajax({
            url: path + "Notas/docentesNotasCompletas",
            type: "POST",
            data: $.param(form),
            beforeSend: function () {
                $("#modalLoaderTitle").html("Imprimiendo Notas de la Programación seleccionada...");
                $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            },
            success: function (data) {
                //console.log("datax", data);
                $("#modalLoader").modal("hide");
                var datos = JSON.parse(data);
                if (datos.respuesta == "success") {
                    var a = $("<a>");
                    a.attr("href", datos.file);
                    $("body").append(a);
                    a.attr("download", "registro_evaluacion.pdf");
                    a[0].click();
                    a.remove();
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