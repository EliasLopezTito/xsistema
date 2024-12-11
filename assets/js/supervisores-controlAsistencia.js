$(document).ready(function () {

    autocomplete();

});

  $( function() {

    var semana = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        var fecha = new Date()
        $("#diaSemana").text(semana[fecha.getDay()]);
        $("#dia").text(fecha.getDate());
        $("#mes").text(meses[fecha.getMonth()]);
        $("#anio").text(fecha.getFullYear());   
  } )


    $.datepicker.regional['es'] = {
    closeText: 'Cerrar',
    prevText: '< Ant',
    nextText: 'Sig >',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
    dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
    weekHeader: 'Sm',
    dateFormat: 'dd/mm/yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);

    $.datepicker.setDefaults({
    showOn: "both",
    buttonImageOnly: true,
    buttonImage: "../assets/img/calendario.png",
    buttonText: "Calendario",
});

document.addEventListener('click', (e) => {

    if (e.target.matches('#btnProgramacion')) {
        mostrarProgramaciones();
    }

});

$("#btnGrabarNotas").click(function () {

    grabarNotasByProgramacion('#frmNotasDocente', 1);

});

document.addEventListener('change', (e) => {

    if (e.target.matches('#anioProg')) {
        mostrarProgramaciones();
    }

    if (e.target.matches('#mesProg')) {
        mostrarProgramaciones();
    }

})

function mostrarProgramaciones(){
    if($("#docente").attr('data-code')){
        verProgramaciones();

        $("#panel_notas").css("display", "none");
        $("#panel_notas_no_pagantes").css("display", "none"); 

        var tbody = $("#tablaNotasProgramacion tbody");
        tbody.find('tr').remove();
        var tbody2 = $("#tablaNotasProgramacionNoPagantes tbody");
        tbody2.find('tr').remove();
    }else{
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
    fecha = $("#fechaDia").val().split("-");
    mesProg = fecha[1]
    anioProg = fecha[0]
    let cod_emp = $("#docente").attr('data-code');

    let tbody = $("#tablaCursosProgramados tbody");
	tbody.find('tr').remove();

    $.ajax({
        url: path + "Notas/verRegistro",
        type: "POST",
        data: {
            mesProg: mesProg,
        	anioProg: anioProg,
            cod_emp: cod_emp,
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

                        var tr = "<tr class=\"fila_programacion\" onclick=\"cargarAlumnosProgramacion(this,'" + programacion.ciclo + "','" + programacion.codTipoEspecialidad + "','" + programacion.codEspecialidad + "','" + programacion.codLocal + "','" + programacion.codCursoM + "','" + programacion.aula + "','" + programacion.semestre + "'," + anioProg + ",'" + mesProg + "','" + programacion.turno +"','" + programacion.cod_sede +"'); \">" +
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
        url: path + "Notas/asistencia",
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

            let tbody = $("#tablaNotasProgramacion tbody");
                tbody.find('tr').remove();

            let tbody2 = $("#tablaNotasProgramacionNoPagantes tbody");
                tbody2.find('tr').remove();

            if (datos.respuesta == "success") 
            {
            
                $("#panel_notas").css("display", "block");   
                
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
                    $("#sede").val(sede);
                    $("#turno").val(turno);

                    var arrayNotasProgramacion = datos.arrayNotasProgramacion;
                
                    for (i = 0; i < arrayNotasProgramacion.length; i++)
                    {

                        var arrayNotaProgramacion = arrayNotasProgramacion[i];

                        if(arrayNotaProgramacion.Asistencia == 1){ punto1 = 'checked'; bloqueo1 = 'disabled' }else{ punto1 = ''; bloqueo1 = ''}
                        if(arrayNotaProgramacion.Asistencia == 2){ punto2 = 'checked'; bloqueo2 = 'disabled' }else{ punto2 = ''; bloqueo2 = ''}
                        if(arrayNotaProgramacion.Asistencia == 3){ punto3 = 'checked'; bloqueo3 = 'disabled' }else{ punto3 = ''; bloqueo3 = ''}

                        // if(arrayNotaProgramacion.Asistencia > 0){
                        //     bloqueoX = 'disabled'
                        //     $('#btnGrabarNotas').attr("disabled", true);
                        // }else{
                        //     bloqueoX = ''
                        //     $('#btnGrabarNotas').attr("disabled", false);
                        // }

                        if(arrayNotaProgramacion.Op == ""){
                            ope = 0 
                         }else{
                            ope = arrayNotaProgramacion.Op
                         }

                        var tr = "<tr>" +
                                        "    <input type=\"hidden\" name=\"op[]\" value=\"" + ope + "\">" +
                                        "    <input type=\"hidden\" name=\"tipo_grabado[]\" value=\"" + arrayNotaProgramacion.tipo_grabado + "\">" +
                                        "    <input type=\"hidden\" name=\"id_NotaD[]\" value=\"" + arrayNotaProgramacion.Op + "\">" +
                                        "    <input type=\"hidden\" name=\"cod_alumno[]\" value=\"" + arrayNotaProgramacion.cod_alumno + "\">" +
                                        "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                        "    <td class=\"celda-centrada\">" + arrayNotaProgramacion.cod_alumno + "</td>" +
                            "    <td class=\"celda-izquierda\">" + arrayNotaProgramacion.NombreCompletoAlumno + " <span style=\"color:red;font-weight:bold;float:right;\">"+arrayNotaProgramacion.descripcionBloqueoPago+"</span></td>" +
                                        "    <td class=\"celda-centrada estadoAsistencia_"+(i+1)+" \" >" +
                                        "        <div class=\"form-check\"><input type=\"radio\" class=\"form-check-input\" "+ punto1 +" onchange=\"validarColor(this, "+(i+1)+")\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"estadoAsistencia_"+(i)+"[]\" value=\"1\"/></div>" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada estadoAsistencia_"+(i+1)+"\">" +
                                        "        <div class=\"form-check\"><input type=\"radio\" class=\"form-check-input\" "+ punto2 +" onchange=\"validarColor(this, "+(i+1)+")\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"estadoAsistencia_"+(i)+"[]\" value=\"2\"/></div>" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada estadoAsistencia_"+(i+1)+"\" >" +
                                        "        <div class=\"form-check\"><input type=\"radio\" class=\"form-check-input\" "+ punto3 +" onchange=\"validarColor(this, "+(i+1)+")\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"estadoAsistencia_"+(i)+"[]\" value=\"3\"/></div>" +
                                        "    </td>"+
                                        "    <td class=\"celda-centrada estadoAsistencia_"+(i+1)+"\">" +
                                        "        <label style=\"margin-bottom:unset;\">" + arrayNotaProgramacion.ucrea + "</label><br>" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada estadoAsistencia_"+(i+1)+"\" >" +
                                        "        <label style=\"margin-bottom:unset;\">" + arrayNotaProgramacion.UsuarioMod + "</label><br>" +
                                        "    </td>"+
                                        "</tr>";
                                tbody.append(tr);
                    }

                    pintarNotasProgramacion();
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

function grabarNotasByProgramacion(form,estado)
{

    $("input:text").removeAttr("disabled");

    //var mesProg = $("#mesProg").val();
    //var anioProg = $("#anioProg").val();
    // var  d = new  Date();
    // var  anioProg = d.getFullYear();
    // var mesProg = "04"
    fecha = $("#fechaDia").val().split("-");
    mesProg = fecha[1]
    anioProg = fecha[0]
    //var fechaPicker = $("#datepicker").val();
    var fechaPicker = $("#fechaDia").val()
    let codigoDocente = $("#docente").attr('data-code');

    var form = $(form).serializeArray();
        form.push({name: "opcion", value: "grabarNotasDocente"});
        form.push({name: "mesProg", value: mesProg});
        form.push({name: "anioProg", value: anioProg});
        form.push({name: "fechaPicker", value: fechaPicker });
        form.push({name: "codigoDocente", value: codigoDocente });

    $.ajax({
        url: path + "Notas/asistencia",
        type: "POST",
        data: $.param(form),
        success: function (data) 
        {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if(datos.mensaje == false){
                    //desactivarCamposNotas(true);
                    mostrarMensaje("exito", "Notas Guardadas", "Las asistencias fueron guardadas correctamente");
                    verProgramaciones();

                    $("#panel_leyenda").css("display", "none");
                    $("#panel_notas").css("display", "none");
                    $("#panel_notas_no_pagantes").css("display", "none");    

                    var tbody = $("#tablaNotasProgramacion tbody");
                    tbody.find('tr').remove();
                    
                    var tbody2 = $("#tablaNotasNoPagantesProgramacion tbody");
                    tbody2.find('tr').remove();
                }else{
                    Notiflix.Notify.Warning("FALTA LLENAR LA ASISTENCIA");
                    return;
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

function validarColor(text, num){
    
    var valor = $(text).val().trim();
    $('.estadoAsistencia_'+num).css("background-color", "white")
    if (valor == 1) { $(text.closest('.celda-centrada')).css("background-color", "#bbf7d0")}
    if (valor == 2) { $(text.closest('.celda-centrada')).css("background-color", "#fef08a")}
    if (valor == 3) { $(text.closest('.celda-centrada')).css("background-color", "#fecaca")}
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