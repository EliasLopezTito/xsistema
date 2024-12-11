document.addEventListener('DOMContentLoaded', () => {

})

document.addEventListener('click', (e) => {

    if (e.target.matches('#btnGenerar')) {
        generar();
    }

    if (e.target.matches('#btnVerRegistros')) {
        cargarData();
    }

    if (e.target.matches('#btnVerReporte')) {
        generarReporteExcel();
    }

})

function generar(){

    let mes = document.getElementById('mes').value;
    let anio = document.getElementById('anio').value;

    $.ajax({
        url: path + "Planilla/horarioDocentesProgramados",
        type: "POST",
        dataType: 'json',
        data: {
            mes: mes,
            anio: anio,
            opcion: 'ejecutarConsulta'
        },
        beforeSend: function(){
            $('.text-loader').text('Cargando información, por favor espere..');
            $("#modalLoader").modal();
        },
        success: function(data){
            Notiflix.Notify.Success('Docentes generados correctamente!');
            cargarData();
        },
        error: function(error){
            console.log(error);
        },
        complete: function(data){
            $("#modalLoader").modal("hide");
        }
    });

}

function cargarData(){

    $('#tablaListaDisponibilidades').dataTable().fnDestroy();
    $("#tablaListaDisponibilidades").DataTable({
        ordering:  false,
        ajax: {
            url: path + "Planilla/horarioDocentesProgramados",
            type: 'post',
            beforeSend: function(){
                $('.text-loader').text('Cargando información, por favor espere..');
                $("#modalLoader").modal();
            },
            data: {
                opcion: 'selectRegistrosDocentesProgramados'
            },
            dataSrc: function(data){
                return data.registros;
            },
            complete: function(data){
                $("#modalLoader").modal("hide");
                $("#modalCargarVoucher").modal("hide");
            }
        },
        lengthMenu: [
            [25, 50, 100], 
            [25, 50, 100]
        ],
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }

        ],
        columns: [

            { 
                data: 'Programacion',
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: 'Programacion' },
            { data: 'COD_EMP' },
            { data: 'Docente' },
            { data: 'COD_TURNO' },
            { data: 'hora' },
            { data: 'horaIngreso' },
            { data: 'horaSalida' },
            { data: 'fechaInicio' },
            { data: 'fechaFin' },

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
    });

}

function generarReporteExcel() {

    $.ajax({
        type:'POST',
        url: path + "planilla/generarReporteExcelDocentesProgramados",
        data:{},
        dataType:'json',
        contentType:false,
        processData:false,
        cache:false,
        beforeSend: function(){
            $('.text-loader').text('Estamos creando tu reporte, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function(data){
            // $("#modalLoader").modal("hide");
            // $("#modalCargarVoucher").modal("hide");
            var $a = $("<a>");
            $a.attr("href",data.file);
            $("body").append($a);
            $a.attr("download","file.xls");
            $a[0].click();
            $a.remove();
        },
        error: function(error){

            Notiflix.Notify.Failure('Ocurrió un error al crear el reporte!');

        },
        complete: function(){
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
        }
    });

}
