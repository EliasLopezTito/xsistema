$(document).ready(function() {
    cargarInstituciones();
    cargarSedes();
    $("#btnBuscar").click(function() {
        cargarLista();
    });
    
});

function cargarLista() {
    var institucion = $("#institucion").val();
    var sede = $("#sede").val();
    var anio = $("#anio").val();
    var mes = $("#mes").val();
    var ciclo = $("#ciclo").val();
    var turno = $("#turno").val();
    var codigo = $("#codigo").val();

    $("#container-generarVacaciones").css("display", "block");

    if ($.fn.DataTable.isDataTable('#tablaGenerarVacaciones')) {
        $('#tablaGenerarVacaciones').DataTable().clear().destroy();
    }

    var tablaVacaciones = $("#tablaGenerarVacaciones").DataTable({
        autoWidth: false,
        ordering: false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
        ],
        lengthMenu: [
            [50, 100, -1], 
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "programacion/generarVacaciones",
            type: "POST",
            data: {
                institucion: institucion,
                sede: sede,
                anio: anio,
                mes: mes,
                ciclo: ciclo,
                turno: turno,
                codigo: codigo,
                opcion: 'buscar1'
            },
            dataSrc: function(data) {
                if (data.respuesta == "success" && data.vacaciones !== "vacio") {
                    $("#container-listaAlumnos").css("display", "none");
                    if ($.fn.DataTable.isDataTable('#tablaListaAlumnos')) {
                        $('#tablaListaAlumnos').DataTable().clear().destroy();
                    }
                    return data.vacaciones;
                } else {
                    $("#container-listaAlumnos").css("display", "none");
                    if ($.fn.DataTable.isDataTable('#tablaListaAlumnos')) {
                        $('#tablaListaAlumnos').DataTable().clear().destroy();
                    }
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
        columns: [
            { data: null, render: function(data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; } },
            { data: 'Sede' },
            { data: 'Especialidad' },
            { data: 'cod_ciclo' },
            { data: 'cod_turno' },
            { data: 'codigo' },
            { data: 'ano' },
            { data: 'mes' },
            { data: 'capacidad' },
            { data: 'Modalidad' },
            { data: 'Fecha_reg' },
            { data: 'Usuario' }
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

    $('#tablaGenerarVacaciones tbody').on('click', 'tr', function() {
        $('#tablaGenerarVacaciones tbody tr').removeClass('selected').css('background-color', '');

        $(this).addClass('selected').css('background-color', '#b9def0');

        var selectedData = tablaVacaciones.row(this).data();
        if (selectedData) {
            var selectedCiclo = selectedData.cod_ciclo;
            var selectedTurno = selectedData.cod_turno;
            var selectedCodigo = selectedData.codigo;
            var selectedAno = selectedData.ano;
            var selectedMes = selectedData.mes;

            if (selectedCiclo !== undefined && selectedTurno !== undefined && selectedCodigo !== undefined && selectedAno !== undefined && selectedMes !== undefined) {
                procesarSeleccion(institucion, sede, selectedAno, selectedMes, selectedCiclo, selectedTurno, selectedCodigo);
                $("#container-listaAlumnos").show();
            } else {
                console.error('Algunos datos están indefinidos:', {
                    selectedCiclo,
                    selectedTurno,
                    selectedCodigo,
                    selectedAno,
                    selectedMes
                });
            }
        } else {
            console.error('No se encontró información para la fila seleccionada.');
        }
    });
}

function procesarSeleccion(institucion, sede, ano, mes, cod_ciclo, cod_turno, codigo) {
    if ($.fn.DataTable.isDataTable('#tablaListaAlumnos')) {
        $('#tablaListaAlumnos').DataTable().clear().destroy();
    }

    var tablaListaAlumnos = $("#tablaListaAlumnos").DataTable({
        autoWidth: false,
        ordering: false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
        ],
        lengthMenu: [
            [15, 25, 50, -1],
            [15, 25, 50, 'TODO']
        ],
        ajax: {
            url: path + "programacion/generarVacaciones",
            type: "POST",
            data: {
                institucion: institucion,
                sede: sede,
                anio: ano,
                mes: mes,
                ciclo: cod_ciclo,
                turno: cod_turno,
                codigo: codigo,
                opcion: 'buscar2'
            },
            dataSrc: function(data) {
                if (data.respuesta == "success" && data.alumnos !== "vacio") {
                    return data.alumnos;
                } else {
                    return [];
                }
            }
        },
        columnDefs: [
            {
                targets: 0,
                className: 'select-checkbox',
                render: function(data, type, row) {
                    return '<input type="checkbox" class="row-checkbox">';
                }
            },
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
            { data: null, render: function(data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; } },
            { data: 'Sede' },
            { data: 'Especialidad' },
            { data: 'cod_ciclo' },
            { data: 'cod_turno' },
            { data: 'codigo' },
            { data: 'ano' },
            { data: 'mes' },
            { data: 'cod_alumno' },
            { data: 'Alumno' },
            { data: 'Modalidad' },
            { data: 'AnoCurri' },
            { data: 'Esta_Cod' },
            { data: 'Fecha_reg' },
            { data: 'Usuario' }
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


