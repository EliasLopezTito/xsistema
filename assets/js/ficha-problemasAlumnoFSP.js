const language = {
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
};

let dataGlobal = []

$(document).ready(function(){

    //$("#tablaListado").DataTable({ data: [], language: language, ordering: false, });

});



$("#btnConsultar").click(function () {
    console.log("Ejecutando función")

    $("#modalLoader").modal(),
        $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...'),

        setTimeout(() => {
            $('#tablaListado').hide();
            $('#tablaListado_2').hide();
            $('#tablaListado_2').dataTable().fnDestroy();
            $('#tablaListado_2').dataTable().fnDraw();
            $('#tablaListado_2').dataTable().fnClearTable();
            ejecutarFuncionEgresados()
                .then(() => setTimeout(() => {
                    $('#tablaListado').show();
                    calcularTotales(dataGlobal)
                    //$('#tablaListado_2').show();
                    //$("#modalLoader").modal("hide")
                }, 1000))
                .catch(() => setTimeout(() => {
                    $("#modalLoader").modal("hide")
                    Notiflix.Notify.Failure('Actualize la pagina por favor...');
                }, 1000))
        }, 500);


})

function ejecutarFuncionEgresados(){
    return new Promise((resolve, reject) => {
        // Código que toma mucho tiempo
        //tablaResumen();
        //resolve(tablaResumen(), tablaDetalle() )
        resolve(tablaResumen())
    })
}

function tablaResumen(){
    const sede = $("#sede").val();
    
    //$('#tablaListado').empty();
    $('#tablaListado').dataTable().fnDestroy();
    $("#tablaListado").DataTable({
        ordering: false,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
        ajax: {
            url: path + "psicopedagogico/problemasAlumnoFSP",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar",
                sede: sede
            },
            beforeSend: function () {
                // $("#modalLoader").modal();
                // $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log(response.data);
                if (response.respuesta === "error") {
                    return {}
                } else {                    
                    dataGlobal = response.data
                    console.log("glo", dataGlobal);
                    
                    return response.data;
                }                
            },
        },
        order: [[2, 'asc']],
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [50, 75, 100],
            [50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data) {
                    return data.Problemas;
                }
            },
            {
                data: {},
                className: 'celda-centrada',
                render: function (data) {
                    return `<a class='btn boton-tabla' title='Ver alumnos' onclick='tablaDetalle("${sede}", "${data.Problemas}", "Siempre")'>${data.P5}`;
                }
            },
            {
                data: {},
                className: 'celda-centrada',
                render: function (data) {
                    return `<a class='btn boton-tabla' title='Ver alumnos' onclick='tablaDetalle("${sede}", "${data.Problemas}", "Casi siempre")'>${data.P4}`;
                }
            },
            {
                data: {},
                className: 'celda-centrada',
                render: function (data) {
                    return `<a class='btn boton-tabla' title='Ver alumnos' onclick='tablaDetalle("${sede}", "${data.Problemas}", "A veces")'>${data.P3}`;
                }
            },
            {
                data: {},
                className: 'celda-centrada',
                render: function (data) {
                    return `<a class='btn boton-tabla' title='Ver alumnos' onclick='tablaDetalle("${sede}", "${data.Problemas}", "Casi nunca")'>${data.P2}`;
                }
            },
            {
                data: {},
                className: 'celda-centrada',
                render: function (data) {
                    return `<a class='btn boton-tabla' title='Ver alumnos' onclick='tablaDetalle("${sede}", "${data.Problemas}", "Nunca")'>${data.P1}`;
                }
            }
            // {
            //     data: null,
            //     render: function (data) {
            //         return "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"tablaDetalle('"+data.UltSemestre+"');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
            //     }
            // }
        ],
        language: language
    });
     
}

function tablaDetalle(sede, problema, estado){
    //const semestre = $("#semestre").val();

    //$('#tablaListado_2').empty();
    $('#tablaListado_2').show();
    $('#tablaListado_2').dataTable().fnDestroy();
    $("#tablaListado_2").DataTable({
        ordering: false,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
        ajax: {
            url: path + "psicopedagogico/problemasAlumnoFSP",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar_detalle",
                sede: sede,
                problema: problema,
                estado: estado
            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.data;
                }
            },
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [10, 18, 20, 50, 75, 100],
            [10, 18, 20, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Problemas;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.CodAlumno;
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
                    return data.ciclo;
                }
            },            
            {
                data: null,
                render: function (data) {
                    return data.turno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Celular;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Correo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FNacimiento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Documento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.modalidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.vida;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fechaReg;
                }
            },
            {
                data: 'CodAlumno',
                className: 'celda-centrada',
                render: function(data){
                    return `<button class='btn boton-tabla boton-verde' data-code='${data}' type='button' onclick='verReportePDF(this)'><span class='icon-file-pdf'></span></button>`;
                }
            },
        ],
        language: language
    });
}

function descargarHistorico(codAlumno, codEspe, semestre){
    $.ajax({
        url: path + "psicopedagogico/problemasAlumnoFSP",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "historicoPDF",
            codAlumno: codAlumno,
            codEspe: codEspe,
            semestre: semestre
        },
        beforeSend: function () {
            // $('.text-loader').text('GENERANDO HISTORICO, PORFAVOR ESPERE...');
            // $("#modalLoader").modal();
        },
        complete: function () {
            // $("#modalLoader").modal("hide");
        },
        success: function (response) {

            console.log(response);

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.historico + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })
}

function calcularTotales(dataGlobal) {

    console.log("calcularTotales", dataGlobal);
  //Inicializar variables
  let tabla = $("#tablaListado").DataTable();
  let total_5 = 0;
  let total_4 = 0;
  let total_3 = 0;
  let total_2 = 0;
  let total_1 = 0;
  //Recorrer los datos para calcular los totales
  dataGlobal.forEach(function(item, index) {
    total_5 += item.P5;
    total_4 += item.P4;
    total_3 += item.P3;
    total_2 += item.P2;
    total_1 += item.P1;
  });
  //Usar el método .append() de jQuery para agregar la fila al final
  let totales = `<tr>
    <td class="celda-centrada"><b>Total</b></td>
    <td class="celda-centrada"><b>${total_5}</b></td>
    <td class="celda-centrada"><b>${total_4}</b></td>
    <td class="celda-centrada"><b>${total_3}</b></td>
    <td class="celda-centrada"><b>${total_2}</b></td>
    <td class="celda-centrada"><b>${total_1}</b></td>
  </tr>`;
  //Agregar la fila al final de la tabla
  $("#tablaListado").append(totales);
};

function verReportePDF(e){
    let cod = e.getAttribute('data-code');

    document.getElementById('codigo').value = cod;
    document.getElementById('opcion').value = 'pdf';
    document.getElementById("frmFicha").submit();
}
