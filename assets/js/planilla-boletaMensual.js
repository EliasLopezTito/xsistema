

$("#consultarBoleta").click(function() {
    const proceso = $("#planilla").val();  
    const institucion = $("#institucion").val();
    const anio = $("#anio").val();
    const mes = $("#mes").val();
    const tipoPlanilla = $("#proceso").val();

    // Verificar si DataTable ya está inicializado y destruirlo
    if ($.fn.DataTable.isDataTable('#tablaEmpleados')) {
        $('#tablaEmpleados').DataTable().destroy();
    }

    // Vaciar la tabla antes de reinicializar
    $('#tablaEmpleados').empty();

    // Inicializar DataTable
    $("#tablaEmpleados").DataTable({
        ordering: false,
        ajax: {
            url: path + "planilla/boletaMensual",
            type: "POST",
            dataType: "JSON",
            data: {
                institucion: institucion,
                planilla: proceso,
                anio: anio,
                mes: mes,
                tipoPlanilla: tipoPlanilla,
                opcion: "buscar"
            },
            beforeSend: function() {
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
            },
            dataSrc: function(dat) {
                console.log(dat);
                if (dat.respuesta === "success") {
                    return dat.personal;
                } else {  
                    return [];
                }
            },
            complete: function() {
                $("#modalLoader").modal("hide");
                Notiflix.Notify.Success("INFORMACIÓN CARGADA CON ÉXITO."); 
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
            [10, 15, 25, 50], // Valores disponibles para seleccionar
            [10, 15, 25, 50]  // Etiquetas que se mostrarán en el menú desplegable
        ],
        columns: [
            {
                data: null,
                title: 'N°',
                render: function (data, type, row, meta) {
                    return meta.row + 1; // +1 porque las filas comienzan desde 0
                }
            },
            { data: 'Anio', title: 'Año' },
            { data: 'Mes', title: 'Mes' },
            { data: 'cod_emp', title: 'Código' },
            { data: 'empleado', title: 'Empleado' },
            { data: 'dni', title: 'DNI' },
            { data: 'Cargo', title: 'Cargo' },
            { data: 'fecingreso', title: 'F. Ingreso' },
            { data: 'empresa', title: 'Empleador' },
            { data: 'feccese', title: 'F. cese' }
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
});
