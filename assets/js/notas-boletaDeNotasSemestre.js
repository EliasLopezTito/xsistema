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
    
    $("#codAlumno").attr("readonly", true);
    $("#nombreAlumno").attr("readonly", true);

    $("#btnBuscar").click(function () {
        $("#codigoBus").val("");
        $("#apellidosNombresBus").val("");
        $("#tablaModalAlumno tbody").find('tr').remove();
        $("#codigoBus").focus();
        $("#modalAlumnosMatriculados").modal({backdrop: 'static', keyboard: false});
    });

    $("#btnMostrarNroAluXSeccion").click(function () {
        $("#divCursos").css("display", "none");
        preListasAlumnos();
    });


    $("#btnImprimirBoleta").click(function () {
        if ($("#codAlumno").val() != null && $("#carrera").val() != null && $("#periodo").val() != null && $("#codAlumno").val() != "" && $("#carrera").val() != "" && $("#periodo").val() != "") {
            $('#tipo').val('btnImprimirBoleta');
            setTimeout(() => {
                $("#frmBoleta").submit();
            }, 100);
            return;
            var form = $("#frmBoleta").serializeArray();
            form.push({name: "opcion", value: "imprimirBoletaNotas"});
            $.ajax({
                url: path + "notas/boletaDeNotas",
                type: "POST",
                data: $.param(form),
                beforeSend: function () {
                    $("#modalLoaderTitle").html("Imprimiendo Boleta...");
                    $("#modalLoader").modal({backdrop: 'static', keyboard: false});
                },
                success: function (data) {
                    console.log(data);
                    $("#modalLoader").modal("hide");
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        var a = $("<a>");
                        a.attr("href", datos.file);
                        $("body").append(a);
                        a.attr("download", "file.pdf");
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
        } else {
            mostrarMensaje("error", "ERROR", "Seleccione todos los parametros");
        }
    });

    
    
});
$("#btnExportar").click(function () {
    exportarExcel();
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
        // dom: 'lBfrtip',
        // buttons: [
        //     { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        // ],
        lengthMenu: [
            [50, 100, -1],
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "notas/boletaNotasSemestre",
            type: "POST",
            data: {
                periodo: periodo,
                sede: sede,
                carrera: carrera,
                ciclo:ciclo,
                opcion: "listar"
            },
            dataSrc: function(data) {
                /* console.log("data", data); */
                if (data.respuesta === "success" && data.lista !== "vacio") {
                    var lista = data.lista;
                    console.log("lista", lista);                    
                    return lista
                } else {
                    return [];
                }
            }            
        },
        columnDefs: [
            {   
                targets: '_all',
                className: 'celda-centrada',
                orderable: false,
                // targets: [7,8,9],
                // visible: false
            }
        ],
        scrollX: true,
        columns: [
            {
                data: null,
                render: function (data) {
                    var colorAsesor = getColorAsesor(data.cod_alumno);
                    return "<div class=\"celda-centrada\" style=\"background-color: " + colorAsesor + "; font-weight: bold;\">" + data.cod_alumno + "</div>";
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_seccion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.codigoM;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Sede;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Semestre;
                }
            },
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.curso;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.creditos;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.Nota;
            //     }
            // },
            // {
            //     data: null,
            //     render: function(data) {
            //         return "<button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"cargarCursos('"+data.Semestre.trim()+"','"+data.cod_sede.trim()+"','"+data.cod_espe.trim()+"','"+data.cod_ciclo.trim()+"','"+data.cod_alumno.trim()+"');\" title=\"Ver\"><span class=\"icon-eye\"></span></button>&nbsp;&nbsp;&nbsp;"+
            //                 "<button class=\"btn boton-tabla btn-warning\" type=\"button\" onclick=\"verHistoricoNotasAlumno('"+data.Semestre.trim()+"','"+data.cod_sede.trim()+"','"+data.cod_espe.trim()+"','"+data.cod_ciclo.trim()+"','"+data.cod_alumno.trim()+"');\" title=\"Ver\"><span class=\"icon-printer\"></span></button>"
            //     }
            // },
            {
                data: null,
                render: function(data) {
                    return "<button class=\"btn boton-tabla btn-warning\" type=\"button\" onclick=\"verHistoricoNotasAlumno('"+data.Semestre.trim()+"','"+data.cod_sede.trim()+"','"+data.cod_espe.trim()+"','"+data.cod_ciclo.trim()+"','"+data.cod_alumno.trim()+"');\" title=\"Ver\"><span class=\"icon-printer\"></span></button>"
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
        lengthMenu: [
            [20, 50, 75, 100],
            [20, 50, 75, 100]
        ],
    });

});
    
}
 
function cargarCursos(semestre, sede, codEspe, cod_ciclo, alumno) {
    limpiarCampos(3);

    $.ajax({
        url: path + "notas/boletaNotasSemestre",
        type: "POST",
        data: {
            semestre: semestre,
            sede: sede,
            codEspe: codEspe,
            cod_ciclo: cod_ciclo,
            alumno:alumno,
            opcion: "cursos"
        },
        beforeSend: function () {
            $("#modalLoaderTitle").html("Consultando datos...");
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
        },
        success: function (data) {
            //console.log(data);
            $("#modalLoader").modal("hide");
            var tbody = $("#tablaCursos tbody");
            var datos = JSON.parse(data);
            console.log("data", datos);
            
            if (datos.respuesta == "success") {
                $("#divCursos").css("display", "block");
                if (datos.boletaNotasArray != "vacio") {
                    var boletaNotas = datos.boletaNotasArray;

                    for (i = 0; i < boletaNotas.length; i++) {
                        var boletaNota = boletaNotas[i];
                        var color = colorNota(boletaNota.pf.trim());
                        var tr = "<tr>" +
                                "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                "    <td class=\"celda-centrada\">" + boletaNota.codCiclo + "</td>" +
                                "    <td class=\"celda-centrada\">" + boletaNota.codCurso + "</td>" +
                                "    <td class=\"celda-izquierda\">" + boletaNota.descripcionCurso+"</td>" +
                                "    <td class=\"celda-centrada\">" + boletaNota.DescripcionTipoNota + "    </td>" +
                                "    <td class=\"celda-centrada\" " + color + " >" + boletaNota.pf.trim() + "</td>" +
                                "</tr>";
                        tbody.append(tr);

                    }

                    var trTotalAprobados = "<tr>" +
                                     "    <td colspan=\"3\" class=\"celda-centrada\" style=\"font-weight:bold;background: #cfeefd;color: #286090;\">TOTAL CURSOS APROBADOS: </td>" +
                                     "    <td colspan=\"3\" class=\"celda-izquierda\">" +datos.cantCAprobados+ "</td>" +
                                    "</tr>";  
                    tbody.append(trTotalAprobados);

                    var trTotalDesaprobados = "<tr>" +
                                     "    <td colspan=\"3\" class=\"celda-centrada\" style=\"font-weight:bold;background: #cfeefd;color: #286090;\">TOTAL CURSOS DESAPROBADOS: </td>" +
                                     "    <td colspan=\"3\" class=\"celda-izquierda\">" +datos.cantCDesaprobados+ "</td>" +
                                    "</tr>";   
                    tbody.append(trTotalDesaprobados); 

                } else {
                    mostrarMensaje("error", "ERROR", "No existen cursos matriculados en el periodo seleccionado");
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

function exportarExcel() {
    $.ajax({
        url: path + "notas/boletaNotasSemestre",
        type: "POST",
        data: {
            opcion: "exportar",
            periodo: $("#periodo").val(),
            sede: $("#sede").val(),
            carrera: $("#carrera").val(),
            ciclo: $("#ciclo").val(),
        },
        beforeSend: function () {
            $("#labelL").html("Exportando Datos...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
        },
        success: function (data) {
            //console.log(data);
            $("#modalLoader").modal("hide");
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                var a = $("<a>");
                a.attr("href", datos.file);
                $("body").append(a);
                a.attr("download", "Notas_por_Semestre.xls");
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

function verHistoricoNotasAlumno(semestre, sede, codEspe, cod_ciclo, alumno){
    //if ($("#codAlumno").val() != null && $("#carrera").val() != null && $("#codAlumno").val() != "" && $("#carrera").val() != "") {
        // $('#tipo').val('btnImprimirHistorico');
        // setTimeout(() => {
        //     $("#frmBoleta").submit();
        // }, 100);
        // return;
        //var form = $("#frmBoleta").serializeArray();
        //form.push({name: "opcion", value: "imprimirHistoricoNotas"});
        $.ajax({
            url: path + "notas/boletaNotasSemestre",
            type: "POST",
            data: {
                semestre: semestre,
                sede: sede,
                codEspe: codEspe,
                cod_ciclo: cod_ciclo,
                alumno:alumno,
                opcion : 'imprimirBoletaNotas'
            },
            beforeSend: function () {
                $("#modalLoaderTitle").html("Imprimiendo Histórico...");
                $("#modalLoader").modal({backdrop: 'static', keyboard: false});
                $("body").css({ "padding": 0 });
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
                    Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
                }    


                // var datos = JSON.parse(data);
                // if (datos.respuesta == "success") {
                //     var a = $("<a>");
                //     a.attr("href", datos.file);
                //     $("body").append(a);
                //     a.attr("download", "file.pdf");
                //     a[0].click();
                //     a.remove();
                // } else {
                //     var errores = "";
                //     for (i = 0; i < datos.errores.length; i++) {
                //         errores += datos.errores[i] + "<br>";
                //     }
                //     mostrarMensaje("error", "ERROR", errores);
                // }
            }
        });
    // } else {
    //     mostrarMensaje("error", "ERROR", "Seleccione todos los parametros");
    // }
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

function colorNota(nota) {
    if (isNaN(nota) || nota == "") {
        return "";
    } else {
        if (isNaN(parseInt(nota))) {
            return "";
        } else {
            nota = parseInt(nota);
            if (nota < 0 || nota > 20) {
                return "";
            } else {
                if (nota < 13) {
                    return "style=\"color: red;\"";
                } else {
                    return "style=\"color: blue;\"";
                }
            }
        }
    }
}

$("#cerraModal").click(function(){
    console.log("cerrado");
    
    $("body").css({"padding-right" : 0 })
})

function limpiarCampos(op) {
    switch (op) {
        case 1:
            $("#codAlumno").val("");
            $("#nombreAlumno").val("");
            $("#carrera").find('option').remove();
        case 2:
            $("#cod_local").val("");
            $("#tipo_espe").val("");
            $("#cod_espe").val("");
            $("#malla_curricular").val("");
            $("#periodo").find('option').remove();
        case 3:
            $("#divCursos").css("display", "none");
            $("#tablaCursos tbody").find('tr').remove();
            break;
    }
}


