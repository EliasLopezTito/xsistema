$(document).ready(function () {
    $("#codAlumno").attr("readonly", true);
    $("#nombreAlumno").attr("readonly", true);

    $("#btnBuscar").click(function () {
        $("#codigoBus").val("");
        $("#apellidosNombresBus").val("");
        $("#tablaModalAlumno tbody").find('tr').remove();
        $("#codigoBus").focus();
        $("#modalAlumnosMatriculados").modal({backdrop: 'static', keyboard: false});
    });


    $("#carrera").change(function () {

        obtenerCursosPagos();

    });

    $("#ciclo").change(function () {

        obtenerCursosPagos();

    });

    $("#btnActualizar").click(function () {
        obtenerCursosPagos();
    });

});

function obtenerCursosPagos()
{

    var carrera = $("#carrera").val();

    if (carrera != undefined) {

        var parametros = carrera.split("-");
        var codLocal = parametros[0];
        var tipoEspe = parametros[1];
        var codEspe = parametros[2];
        //var mallaCurricular = parametros[3];
        
        var ciclo = $("#ciclo").val();
        var codAlumno = $("#codAlumno").val();

        cargarCursosMatriculados(codAlumno, tipoEspe, codEspe, ciclo,codLocal);
        cargarPagos(codAlumno, tipoEspe, codEspe, ciclo,codLocal);

    }else
    {

        mostrarMensaje("error", "ERROR", "Seleccione la carrera.");

    }

}

function buscarAlumnoMatriculado() {
    var codigoBus = $("#codigoBus").val().trim();
    var apellidosNombresBus = $("#apellidosNombresBus").val().trim();

    if (codigoBus == "" && apellidosNombresBus == "") {
        $("#errorAlumnoBus").html("Debe ingresar el código o apellidos y nombres a buscar");
        $("#errorAlumnoBus").css("display", "block");
        return false;
    } else {
        $("#errorAlumnoBus").html("");
        $("#errorAlumnoBus").css("display", "none");
    }

    $.ajax({
        url: path + "programacion/listadoMatriculasPagos",
        type: "POST",
        data: {
            codigoBus: codigoBus,
            apellidosNombresBus: apellidosNombresBus,
            opcion: "buscarAlumno"
        },
        success: function (data) {

        	//console.log(data);

            var tbody = $("#tablaModalAlumno tbody");
            tbody.find('tr').remove();

            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.alumnos != "vacio") {
                    var alumnos = datos.alumnos;
                    for (i = 0; i < alumnos.length; i++) {
                        var alumno = alumnos[i];
                        var tr = "<tr ondblclick=\"seleccionarAlumno(this,'"+alumno.telefono+"');\">" +
                                "<td class=\"celda-centrada\">" + alumno.cod_alumno + "</td>" +
                                "<td>" + alumno.apellidos_nombres + "</td>" +
                                "</tr>";
                        tbody.append(tr);
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

function seleccionarAlumno(tr,telefono) 
{

    var codAlumno = $(tr).find("td").eq(0).html();
    var apellidosNombres = $(tr).find("td").eq(1).html();
  
    $("#codAlumno").val(codAlumno);
    $("#nombreAlumno").val(apellidosNombres);
	$("#nroCelular").text(telefono);

    cargarCarrerasMatriculadas();

    $("#ciclo").val("00");
                
    $("#modalAlumnosMatriculados").modal("hide");
    $("#fila_carrera_ciclo").css("display", "block");
    $("#divCursos").css("display", "block");
    $("#divPagos").css("display", "block");
    $("#divBtnActualizar").css("display", "block");
    


}

function cargarCarrerasMatriculadas() {

    var codAlumno = $("#codAlumno").val();

    $.ajax({
        url: path + "programacion/listadoMatriculasPagos",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            opcion: 'cargarCarreras'
        },
        success: function (data) {
            //console.log(data);
            $("#carrera").find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.carreras != "vacio") {
                    var carreras = datos.carreras;
                    $("#carrera").append("<option value=\"00\" selected disabled hidden>00 --- SELECCIONE UNA OPCIÓN</option>");
                    for (i = 0; i < carreras.length; i++) {
                        var carrera = carreras[i];
                        $("#carrera").append("<option value=\"" + carrera.cod_local + "-" + carrera.CodigoTipoEspecialidad + "-" + carrera.CodigoEspecialidad + "\">" + carrera.cod_local + " --- " + carrera.TipoEspecialidad + " --- " + carrera.DescripcionEspecialidad + "</option>");
                    }
                } else {
                    //mostrarMensaje("error", "ERROR", "El alumno no cuenta con carreras matriculadas.");
                    Notiflix.Notify.Warning('EL ALUMNO NO CUENTA CON CARRERAS MATRICULADAS');
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

function cargarCursosMatriculados(codAlumno, tipoEspe, codEspe, ciclo, codLocal) {

    $.ajax({
        url: path + "programacion/listadoMatriculasPagos",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            tipoEspe: tipoEspe,
            codEspe: codEspe,
            ciclo: ciclo,
            codLocal:codLocal,
            opcion: 'cargarCursosMatriculados'
        },
        beforeSend: function () {
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            $("#tablaCursos tbody").find('tr').remove();
        },
        success: function (data) {

            //console.log(data);

            $("#modalLoader").modal("hide");
            var thead = $("#tablaCursos thead");
            var tbody = $("#tablaCursos tbody");

            var datos = JSON.parse(data);

            var cicloProgramado = ""; 
			
			var meses =  new Array();

            var item = 0;

            var cantidadCursos = 0;
			
			var cantidadMeses = 0;

            if (datos.respuesta == "success") {

                if (datos.cursos != "vacio") {

                    var cursos = datos.cursos;

                    cantidadCursos = cursos.length;                   

                   for (i = 0; i < cursos.length; i++) {
                       
                        var curso = cursos[i];

                        item = item + 1;

                        if(curso.cod_ciclo != cicloProgramado)
                        {

                            cicloProgramado = curso.cod_ciclo;

                            item = 1;

                            var trTitulo = "<tr style=\"background: #cfeefd;color: #286090;\">" +
                                "   <td class=\"celda-centrada\" colspan=\"10\">"+
                                        "<label style=\"margin-bottom:unset;\">CICLO: "+curso.ciclo+"</label><br>"+
                                        "<label style=\"margin-bottom:unset;\">INSTITUCIÓN: "+curso.DescripcionLocal+" - SEDE: "+curso.DescripcionSede+"</label><br>"+
                                    "</td>" +
                                "</tr>";
                            tbody.append(trTitulo);
                        }

                        if(datos.usuario == "UserName" || datos.usuario == "SOPORTE"){
                            var trCabeza =  `<tr>                                        
                                                <th style="width: 15%;" class="celda-centrada">Docente</th>                                                
                                                <th style="width: 17%;" class="celda-centrada">Curso del registro</th>
                                                <th style="width: 17%;" class="celda-centrada">Curso que se dicta</th>
                                                <th style="width: 4%;" class="celda-centrada">Hora</th>
                                                <th style="width: 6%;" class="celda-centrada">Aula</th>
                                                <th style="width: 4%;" class="celda-centrada">Turno</th>
                                                
                                            </tr>`
                            var tr = "<tr>" +
                                /**"    <td class=\"celda-centrada\">" + item + "</td>" +**/
                                /**"    <td class=\"celda-centrada\">" + curso.cod_prof + "</td>" +**/
                                "    <td class=\"celda-izquierda\">" + curso.Docente + "</td>" +
                                /**"    <td class=\"celda-centrada\">" + curso.cod_curso + "</td>" +**/
								"    <td class=\"celda-centrada\">" + curso.DescripcionCurso + "</td>" +
                                "    <td class=\"celda-centrada\">" + curso.DescripcionCursoInterno+ "</td>" +
                                "    <td class=\"celda-centrada\">" + curso.Hora + "    </td>" +
                                "    <td class=\"celda-centrada\">" + curso.Aula + "</td>" +
                                "    <td class=\"celda-centrada\">" + curso.Turno + "    </td>" +
                                /**"    <td class=\"celda-centrada\">" + curso.Mes + "    </td>" +**/
                                /* "    <td class=\"celda-centrada\">" + curso.Semestre + "    </td>" + */
                                "</tr>";
                            thead.html(trCabeza);
                        }else{
                            var tr = "<tr>" +
                                /**"    <td class=\"celda-centrada\">" + item + "</td>" +**/
                                /**"    <td class=\"celda-centrada\">" + curso.cod_prof + "</td>" +**/
                                "    <td class=\"celda-izquierda\">" + curso.Docente + "</td>" +
                                /**"    <td class=\"celda-centrada\">" + curso.cod_curso + "</td>" +**/
								"    <td class=\"celda-centrada\">" + curso.DescripcionCurso + "</td>" +
                                "    <td class=\"celda-centrada\">" + curso.DescripcionCursoInterno+ "</td>" +
                                "    <td class=\"celda-centrada\">" + curso.Hora + "    </td>" +
                                "    <td class=\"celda-centrada\">" + curso.Aula + "</td>" +
                                "    <td class=\"celda-centrada\">" + curso.Turno + "    </td>" +
                                "    <td class=\"celda-centrada\">" + curso.Mes + "    </td>" +
                                "    <td class=\"celda-centrada\">" + curso.Ano + "    </td>" +
                                /* "    <td class=\"celda-centrada\">" + curso.Semestre + "    </td>" + */
                                "</tr>";
                        }

                        
                        tbody.append(tr);
						
						var valor = $.inArray(curso.Mes, meses); 

                        if(valor == "-1")
                        {
                            meses.push(curso.Mes);
                        }
                    }

                } else {
                    //mostrarMensaje("error", "ERROR", "El alumno no cuenta con cursos matriculados.");
                    Notiflix.Notify.Warning('EL ALUMNO NO CUENTA CON CURSOS MATRICULADOS');
                
                }
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
			
			cantidadMeses = meses.length;

            $("#nroCursos").text(cantidadMeses);
            //$("#nroCursos").text(cantidadCursos);
        }
    });
}

function cargarPagos(codAlumno, tipoEspe, codEspe, ciclo, codLocal) {

    $.ajax({
        url: path + "programacion/listadoMatriculasPagos",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            tipoEspe: tipoEspe,
            codEspe: codEspe,
            ciclo: ciclo,
            codLocal:codLocal,
            opcion: 'cargarPagos'
        },
        beforeSend: function () {
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            $("#tablaPagos tbody").find('tr').remove();
        },
        success: function (data) {

            //console.log(data);

            $("#modalLoader").modal("hide");

            var thead = $("#tablaPagos thead");

            var tbody = $("#tablaPagos tbody"); 

            var datos = JSON.parse(data);

            var cicloProgramado = ""; 

            var item = 0;

            var montoTotal = 0;

            if (datos.respuesta == "success") {

                if (datos.pagos != "vacio") {

                    var pagos = datos.pagos;

                   for (i = 0; i < pagos.length; i++) {
                       
                        var pago = pagos[i];

                        item = item + 1;

                        montoTotal = montoTotal + parseFloat(pago.Monto);

                        if(pago.cod_ciclo != cicloProgramado)
                        {

                            cicloProgramado = pago.cod_ciclo;

                            item = 1;

                            var trTitulo = "<tr style=\"background: #cfeefd;color: #286090;\">" +
                                "   <td class=\"celda-centrada\" colspan=\"10\">"+
                                        "<label style=\"margin-bottom:unset;\">CICLO: "+pago.cicloPagado+"</label><br>"+
                                        "<label style=\"margin-bottom:unset;\">INSTITUCIÓN: "+pago.DescripcionLocal+" - SEDE: "+pago.DescripcionSede+"</label><br>"+
                                    "</td>" +
                                "</tr>";
                            tbody.append(trTitulo);
                        }

                        if(datos.usuario == "UserName" || datos.usuario == "SOPORTE"){
                            var trCabeza =  `<tr>                                        
                                                <th style="width: 6%;" class="celda-centrada">Talón</th>
                                                <th style="width: 6%;" class="celda-centrada">Recibo</th>
                                                <th style="width: 10%;" class="celda-centrada">Fecha</th>
                                                <th style="width: 20%;" class="celda-centrada">Concepto</th>
                                                <th style="width: 10%;" class="celda-centrada">Monto</th>
                                                
                                                <th style="width: 25%;" class="celda-centrada">Observación</th>
                                            </tr>`

                            var tr = "<tr>" +
                                    /**"    <td class=\"celda-centrada\">" + item + "</td>" +**/
                                    "    <td class=\"celda-centrada\">" + pago.Talon + "</td>" +
                                    "    <td class=\"celda-centrada\">" + pago.Recibo + "</td>" +
                                    "    <td class=\"celda-centrada\">" + pago.Fecha + "</td>" +
                                    "    <td class=\"celda-centrada\">" + pago.Concepto + "    </td>" +
                                    "    <td class=\"celda-centrada\">" + parseFloat(pago.Monto).toFixed(2) + "</td>" +
                                    /**"    <td class=\"celda-centrada\">" + pago.Mensualidad + "    </td>" +**/
                                    /* "    <td class=\"celda-centrada\">" + pago.Semestre + "</td>" + */
                                    "    <td class=\"celda-centrada\">" + pago.Observacion + "    </td>" +
                                    "</tr>";
                                thead.html(trCabeza);
                        }else{
                            var tr = "<tr>" +
                                /**"    <td class=\"celda-centrada\">" + item + "</td>" +**/
                                "    <td class=\"celda-centrada\">" + pago.Talon + "</td>" +
                                "    <td class=\"celda-centrada\">" + pago.Recibo + "</td>" +
                                "    <td class=\"celda-centrada\">" + pago.Fecha + "</td>" +
                                "    <td class=\"celda-centrada\">" + pago.Concepto + "    </td>" +
                                "    <td class=\"celda-centrada\">" + parseFloat(pago.Monto).toFixed(2) + "</td>" +
                                "    <td class=\"celda-centrada\">" + pago.Mensualidad + "    </td>" +
                                "    <td class=\"celda-centrada\">" + pago.Ano + "</td>" +
                                "    <td class=\"celda-centrada\">" + pago.Observacion + "    </td>" +
                                "</tr>";
                        }
                        tbody.append(tr);
                    }

                } else {
                    mostrarMensaje("error", "ERROR", "El alumno no cuenta con pagos matriculados.");
                }
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }

            $("#montoTotalAbonado").text(montoTotal.toFixed(2));
        }
    });
}

function limpiarCampos() 
{

    $("#ciclo").val("00");
            
}