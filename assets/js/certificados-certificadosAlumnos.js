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


$("#usuarios").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "certificados/listadoCertificado",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    $("#usuarios").attr("codigo", "");
                    $("#usuarios").next('i').removeClass('glyphicon-ok');
                    $("#usuarios").next('i').addClass('glyphicon-remove');
                    $("#usuarios").parent().removeClass('has-success');
                    $("#usuarios").parent().addClass('has-error');
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                
                $("#num_celular").val(ui.item.telefono.trim().substring(0, 9));
                $("#codAlumno").val(ui.item.cod_alumno.trim());
                $("#usuarios").val(ui.item.cod_alumno.trim() + " - " + ui.item.nombre.trim());
                $("#usuarios").next('i').removeClass('glyphicon-remove');
                $("#usuarios").next('i').addClass('glyphicon-ok');
                $("#usuarios").parent().removeClass('has-error');
                $("#usuarios").parent().addClass('has-success');
                
            }
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
            if (item.hasOwnProperty('vacio')) {
                return $("<li>")
                    .append("<div>No se encontraron resultados</div>")
                    .appendTo(ul);
            }
            return $("<li>")
                .append("<div>" + item.cod_alumno + " - " + item.nombre + "</div>")
                .appendTo(ul);
        };
    $("#usuarios").focus();


async function preListasAlumnos() {
    await listaAlumnosMatriculados()
}

function listaAlumnosMatriculados() {

    return new Promise(resolve => {
        

    var codigoAlumno = $('#usuarios').val().trim().substring(0, 9);
    var sede = $('#sede').val() == "00" ? '' : $('#sede').val();
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
            url: path + "certificados/certificadosAlumnos",
            type: "POST",
            data: {
                codigoAlumno: codigoAlumno,
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
            // {
            //     data: null,
            //     render: function(data) {
            //         return data.cod_alumno + '.'
            //     }
            // },
            {
                data: null,
                render: function(data) {
                    return '. ' + data.cod_alumno
                }
            },
            { data: 'Alumno', title: 'Alumno' },            
            { data: 'Especialidad', title: 'Especialidad' },
            { data: 'Sede', title: 'Sede' },
            { data: 'cod_seccion', title: 'Seccion' },         
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
                    return "<button class=\"btn boton-tabla btn-azul\" type=\"button\" onclick=\"verCertificados('"+data.idcertPK+"');\" title=\"Ver\"><span class=\"icon-download\"></span></button>"
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

function verCertificados(idPK){
        $.ajax({
            url: path + "certificados/certificadosAlumnos",
            type: "POST",
            data: {
                idPK: idPK,
                opcion : 'imprimirCertificados'
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