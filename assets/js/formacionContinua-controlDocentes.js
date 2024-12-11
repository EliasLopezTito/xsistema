$(document).ready(function () {

    autocomplete();

});

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

                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;
                    response(result);
                }
            });
        },
        minLength: 2,
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

document.addEventListener('click', (e) => {

    if (e.target.matches('#btnProgramacion')) {
        mostrarProgramaciones();
    }

});

/**document.addEventListener('change', (e) => {

    if (e.target.matches('#anioProg')) {
        mostrarProgramaciones();
    }

    if (e.target.matches('#mesProg')) {
        mostrarProgramaciones();
    }

})**/

function mostrarProgramaciones(){
    if($("#docente").attr('data-code')){
        verProgramaciones();

        $("#panel_notas").css("display", "none");

        var tbody = $("#tablaNotasProgramacion tbody");
        tbody.find('tr').remove();
    }else{
        $("#docente").focus();
    }
}

function mostrarDatos(tel, correo) {
    $('#div-datos').show('300');
    $('#lbl-telefono').text(tel);
    $('#lbl-correo').text(correo);
}

function verProgramaciones()
{

	let anioProg = $("#anioProg").val();
    let mesProg = $("#mesProg").val();
    let cod_emp = $("#docente").attr('data-code');

    let tbody = $("#tablaCursosProgramados tbody");
	tbody.find('tr').remove();

    $.ajax({
        url: path + "formacionContinua/controlDocentes",
        type: "POST",
        data: {
        	anioProg: anioProg,
        	mesProg: mesProg,
            cod_emp: cod_emp,
        	opcion: "cursosProgramados"
        },
        beforeSend: function () {
            $('.text-loader').text('Consultando datos, por favor espere...');
            $("#modalLoader").modal();
            $("#cod_local").val("");
        	$("#tipo_espe").val("");
        	$("#cod_espe").val("");
        	$("#ciclo").val("");        	
        	$("#codCursoM").val("");
        	$("#aula").val("");
        },
        success: function (data) {
 
        	$("#modalLoader").modal("hide");
            $("#panel_cprogramados").css("display", "block");
            var datos = JSON.parse(data);
            
            if (datos.respuesta == "success") {
                
                if(datos.arrayProgramaciones != "vacio"){
					
					var arrayProgramaciones = datos.arrayProgramaciones;

                	for (i = 0; i < arrayProgramaciones.length; i++) 
                	{
                        var programacion = arrayProgramaciones[i];                       

                        var tr = "<tr class=\"fila_programacion\" onclick=\"cargarAlumnosProgramacion(this,'" + programacion.ciclo + "','" + programacion.codTipoEspecialidad + "','" + programacion.codEspecialidad + "','" + programacion.codLocal + "','" + programacion.codCursoM + "','" + programacion.aula + "'," + anioProg + ",'" + mesProg + "','" + programacion.turno +"'); \">" +
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
            }
        },
        complete: function(){
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
        }
    });

}


function cargarAlumnosProgramacion(elemento, ciclo, codTipoEspe, codEspecialidad, codlocal,codCursoM, aula, anio, mes,turno){
    
    $(".fila_programacion").css("background-color","white");

    $(elemento).css("background-color","#3abfff");//pintando fila
    let codigoDocente = $("#docente").attr('data-code');

    $.ajax({
        url: path + "formacionContinua/controlDocentes",
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
            codigoDocente: codigoDocente,
            turno: turno,
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
            $("#codCursoM").val("");
            $("#aula").val("");

        },
        success: function (data) {
            
            let datos = JSON.parse(data);
            let tbody = $("#tablaNotasProgramacion tbody");
                tbody.find('tr').remove();

            if (datos.respuesta == "success") 
            {
            
                $("#panel_notas").css("display", "block");     
                
                if (datos.arrayNotasProgramacion.length > 0)
                {

                    $("#cod_local").val(codlocal);
                    $("#tipo_espe").val(codTipoEspe);
                    $("#cod_espe").val(codEspecialidad);
                    $("#ciclo").val(ciclo);                                      
                    $("#codCursoM").val(codCursoM);
                    $("#aula").val(aula);
                                                      
                    datos.arrayNotasProgramacion.forEach( ( alumno , key ) => {
             
                        const tr = `<tr>                             
                                <td class="celda-centrada">                                     
                                    ${key+1}
                                </td>

                                <td class="celda-centrada">${alumno.cod_alumno}</td>

                                <td class="celda-izquierda">${alumno.NombreCompletoAlumno} <span style="color:red;font-weight:bold;float:right">${alumno.descripcionBloqueoPago}</span> </td>

                                <td class="celda-centrada">
                                    <input disabled type="text" class="form-control" style="text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase" value="${alumno.ap.trim()}" />
                                </td>                               

                                <td class="celda-centrada">
                                    <input disabled type="text" class="form-control" style="text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase" value="${alumno.ac.trim()}" />
                                </td>

                                <td class="celda-centrada">
                                    <input disabled type="text" class="form-control" style="text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase" value="${alumno.ef.trim()}" />
                                </td>

                                <td class="celda-centrada">
                                    <input disabled type="text" class="form-control" style="text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase" value="${alumno.pr.trim()}" />
                                </td>
                                                                                                  
                            </tr>`;

                        tbody.append(tr);

                    });

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