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

    if (e.target.matches('#abrirListaDocente')) {

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

    let miFecha = new Date();
    fecha = miFecha.setMonth(mesProg - 1);
    mesFecha = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(fecha).toUpperCase()
    $(".fechaConsulta").text(mesFecha+" DEL "+anioProg);


    $('#tablaListaFaltaDocentes').dataTable().fnDestroy();
    tablaEgresados = $("#tablaListaFaltaDocentes").DataTable({
        responsive: true,
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        ajax: {
            url: path + "Notas/docentesSinNotas",
            type: 'POST',
            beforeSend: function(){
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
            },
            data: {
                anioProg: anioProg,
        	    mesProg: mesProg,
        	    opcion: "verListaFaltaDocentes",
            },
            dataSrc: function(response){           
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
            [15 ,25, 50, 75 , 100],
            [15 ,25, 50, 75 , 100]
        ],
        columns: [
            { 
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: null, render: function (data) { return data.CodMallaCurricular; } },
            { data: null, render: function (data) { return data.Tipo; } },
            { data: null, render: function (data) { return data.Especialidad; } },
            { data: null, render: function (data) { return data.CodDocente; } },
            { data: null, render: function (data) { return data.Docente; } },
            { data: null, render: function (data) { return data.Ciclo; } },
            { data: null, render: function (data) { return data.CodAlumno; } },
            { data: null, render: function (data) { return data.Alumno; } },
            { data: null, render: function (data) { return data.Aula; } },
            { data: null, render: function (data) { return data.CodCurso; } },
            { data: null, render: function (data) { return data.Curso; } },
            { data: null, render: function (data) { return data.ap1; } },
            { data: null, render: function (data) { return data.ed1; } },
            { data: null, render: function (data) { return data.ep; } },
            { data: null, render: function (data) { return data.ac1; } },
            { data: null, render: function (data) { return data.pr1; } },
            { data: null, render: function (data) { return data.ap2; } },
            { data: null, render: function (data) { return data.ed2; } },
            { data: null, render: function (data) { return data.ef; } },
            { data: null, render: function (data) { return data.ac2; } },
            { data: null, render: function (data) { return data.pr2; } },
            { data: null, render: function (data) { return data.pr; } },
            { data: null, render: function (data) { return data.er; } }
            
            //,
            // {
            //     data: null,
            //     render: function (data) {                 
            //         return `
            //             <button class='btn boton-tabla btn-warning verProgramacionDocente' type='button' onclick="cargarAlumnosProgramacion('${data.codDocente.trim()}','${data.ciclo}','${data.codTipoEspecialidad}','${data.codEspecialidad}','${data.codLocal}','${data.codCursoM}','${data.aula}','${data.semestre}','${anioProg}','${mesProg}','${data.turno}')"><span class='icon-pencil2'></span></button>                       
            //         `;                               
            //     }
            // }
            
        ],
        /**createdRow : function( row, data, dataIndex ) {
            if ( data.acceso == "true" ) {
                $( row ).addClass( "success" );
            }
        },**/
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

// $("#btnEnviarCorreo").click(function () {
function enviarCorreo(){
    let destino = $("#destino").val().trim();
    let asunto = $("#asunto").val().trim();
    let mensaje = $("#mensaje").val().trim();
    let nombre = $("#nombre_docente").val().trim();
    if (validarCamposEmail(asunto, mensaje)) {
   
        $.ajax({
            url: path + "Notas/verRegistro",
            type: "POST",
            data: {
                destino: destino,
                asunto: asunto,
                mensaje: mensaje,
                nombre: nombre,
                opcion: "enviarCorreo"
            },
            beforeSend: function () {
                $("#btnEnviarCorreo").hide();
                $("#mensajeEnviando").css("display", "block");
            },
            success: function (data) {
                let datos = JSON.parse(data);

                if (datos.respuesta === 'success') {
                    Notiflix.Report.Success("Correo enviado","El correo fue enviado correctamente.", "Aceptar");
                } else{
                    Notiflix.Notify.Failure('Ocurrió un error al enviar el correo');
                }

                $("#modalEnviarCorreo").modal("hide");
                limpiarModalCorreo();
                                
            },
            error: function (error) {
                console.log(error);
            }
        });
        
    }
};

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
                $("#telefono").html(docente.telefono);
            
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



function imprimirNotasByProgramacion()
{

	var anioProg = $("#anioProg").val();
	var mesProg = $("#mesProg").val();
    let codDocente = $("#docente").attr('data-code');

	var form = $("#frmNotasDocente").serializeArray();
        form.push({name: "opcion", value: "imprimirNotasProgramacion"});
        form.push({name: "anio", value: anioProg});
        form.push({name: "mes", value: mesProg});
        form.push({name: "codDocente", value: codDocente});
        
        $.ajax({
            url: path + "Notas/verRegistro",
            type: "POST",
            data: $.param(form),
            beforeSend: function () {
                $("#modalLoaderTitle").html("Imprimiendo Notas de la Programación seleccionada...");
                $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            },
            success: function (data) {
                //console.log(data);
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