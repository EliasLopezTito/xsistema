let coloresAsesores = {};
const coloresFondo  = [ 
    "rgba(54, 162, 235, 0.3)",
    "rgba(75, 192, 192, 0.3)",
    "rgba(255, 205, 86, 0.3)",
    "rgba(255, 99, 132, 0.3)",
    "rgba(201, 203, 207, 0.3)",
    "rgba(83, 211, 87, 0.3)",
    "rgba(237, 208, 98, 0.3)"  
]
$(document).ready(function () {
     Notiflix.Loading.Init({
        clickToClose: true
    });
    $("#codAlumno").attr("readonly", true);
    $("#nombreAlumno").attr("readonly", true);

    $("#btnBuscar").click(function () {
        $("#codigoBus").val("");
        $("#apellidosNombresBus").val("");
        $("#tablaModalAlumno tbody").find('tr').remove();
        $("#codigoBus").focus();
        $("#modalAlumnosMatriculados").modal({backdrop: 'static', keyboard: false});
    });

    $("#btnActualizar").click(function () {
        obtenerCursosPagos();
    });

    $("#btnMostrarNroAluXSeccion").click(function () {
        $("#divCursos").css("display", "none");
        preListasAlumnos();
    });

    $('#tablaMatriculados tbody').on('click', 'tr', function() {
        $('#tablaMatriculados tbody tr').removeClass('selected');
        $(this).addClass('selected');
    });

});



async function preListasAlumnos() {
    await listaAlumnosMatriculados()
}

function listaAlumnosMatriculados() {

    return new Promise(resolve => {

    var periodo = $('#periodo').val().trim();
    var sede = $('#sede').val();
    var carrera = $('#carrera').val();
    var ciclo = $('#ciclo').val();
    
    tablaRT = $("#tablaMatriculados").DataTable({
        destroy: true,
        ordering: false,
        responsive: true,
        dom: 'lBfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        lengthMenu: [
            [50, 100, -1],
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "programacion/listadoMatriculas",
            type: "POST",
            data: {
                periodo: periodo,
                sede: sede,
                carrera: carrera,
                ciclo:ciclo,
                opcion: "listar"
            },
            beforeSend: function () {
                Notiflix.Loading.Hourglass('Cargando...');
            },
            complete: function (data) {
                $("#NotiflixLoadingWrap").trigger("click");
            },
            dataSrc: function(data) {
                /* console.log("data", data); */
                if (data.respuesta === "success" && data.lista !== "vacio") {
                    var lista = data.lista;
                    return lista
                } else {
                    return [];
                }
            }            
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        scrollX: true,
        columns: [
            // {   
            //     data: 'cod_alumno', 
            //     title: 'Codigo Alumno',  
            //     render: function (data) {
            //         var colorAsesor = getColorAsesor(data);
            //         return "<div class=\"celda-centrada\" style=\"background-color: " + colorAsesor + "; font-weight: bold;\">" + data + "</div>";
            //     }
            // },
            { data: 'cod_alumno', title: 'Codigo' },
            { data: 'TipoDocumento', title: 'T. Doc.' },
            { data: 'NumDocumento', title: 'N. Doc.' },
            { data: 'Alumno', title: 'Alumno' },            
            { data: 'Especialidad', title: 'Especialidad' },
            { data: 'Sede', title: 'Sede' },
            { data: 'cod_ciclo', title: 'Ciclo' },
            { data: 'Semestre', title: 'Semestre' },            
            // {
            //     data: null,
            //     render: function(data) {
            //         return "<button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"cargarCursosMatriculados('"+data.Semestre.trim()+"','"+data.codsde.trim()+"','"+data.cod_espe.trim()+"','"+data.cod_ciclo.trim()+"','"+data.cod_alumno.trim()+"');\" title=\"Ver\"><span class=\"icon-eye\"></span></button>&nbsp;&nbsp;&nbsp;"+
            //                 "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"verConstancia('"+data.cod_ciclo.trim()+"','"+data.cod_alumno.trim()+"','"+data.Alumno.trim()+"');\" title=\"Ver\"><span class=\"icon-file-pdf\"></span></button>"
            //     }
            // },
            {
                data: null,
                render: function(data) {
                    return "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"verConstancia('"+data.cod_ciclo.trim()+"','"+data.cod_alumno.trim()+"','"+data.Alumno.trim()+"');\" title=\"Ver\"><span class=\"icon-file-pdf\"></span></button>"
                }
            }
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
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [20, 50, 75, 100],
            [20, 50, 75, 100]
        ],
    });

});
    
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

function cargarCursosMatriculados(semestre, sede, codEspe, cod_ciclo, alumno) {

    $.ajax({
        url: path + "programacion/listadoMatriculas",
        type: "POST",
        data: {
            semestre: semestre,
            sede: sede,
            codEspe: codEspe,
            cod_ciclo: cod_ciclo,
            alumno:alumno,
            opcion: 'cargarCursosMatriculados2'
        },
        beforeSend: function () {
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            $("#tablaCursos tbody").find('tr').remove();
        },
        success: function (data) {

            //console.log(data);

            $("#divCursos").css("display", "block");

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

function verConstancia(cod_ciclo, alumno, nombre){
        $.ajax({
            url: path + "programacion/listadoMatriculas",
            type: "POST",
            data: {
                ciclo: cod_ciclo,
                codigo_alumno:alumno,
                nombre:nombre,
                opcion : 'imprimirConstancias'
            },
            beforeSend: function () {
                $("#modalLoaderTitle").html("Imprimiendo Constancia...");
                $("#modalLoader").modal({backdrop: 'static', keyboard: false});
                $("body").css({ "padding-right": "1px" });
            },
            success: function (data) {
                //console.log(response);
                var response = JSON.parse(data);
                $("#modalLoader").modal("hide");
                if (response.respuesta === "success") {
                    $("#modalVistaPreviaCertificado").modal("show")
                    $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                    let pdf = '<iframe src="' + response.file + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                    $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);
                } else {
                    $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                    Notiflix.Report.Warning("Aviso,", "No se ecnontro data para este alumno.", "Aceptar");
                }    

            }
        });
}

function generarColorAleatorio() {
    return coloresFondo[Math.floor(Math.random() * coloresFondo.length)];
}
function getColorAsesor(asesor) {
    if (!coloresAsesores[asesor]) {
        coloresAsesores[asesor] = generarColorAleatorio();
    }
    return coloresAsesores[asesor];
}

function limpiarCampos() 
{

    $("#ciclo").val("00");
            
}