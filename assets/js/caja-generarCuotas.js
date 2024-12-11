document.addEventListener('click', (e) => {
    if (e.target.matches('#btnBuscar')) {
        consultarAlumnos();
    }
})

document.addEventListener('change', e => {
    if (e.target.matches('#anio') || e.target.matches('#mes')) {
        $('#tablaCuotas').dataTable().fnDestroy();
        let tbody = $("#tablaCuotas tbody");
        tbody.find('tr').remove();
    }
})

let meses = {
    '01' : 'ENERO',
    '02' : 'FEBRERO',
    '03' : 'MARZO',
    '04' : 'ABRIL',
    '05' : 'MAYO',
    '06' : 'JUNIO',
    '07' : 'JULIO',
    '08' : 'AGOSTO',
    '09' : 'SEPTIEMBRE',
    '10' : 'OCTUBRE',
    '11' : 'NOVIEMBRE',
    '12' : 'DICIEMBRE',
}

function consultarAlumnos(){
    
    let anio = document.getElementById('anio').value;
    let mes = document.getElementById('mes').value;

    $('#tablaCuotas').dataTable().fnDestroy();
    $("#tablaCuotas").DataTable({
        ordering:  false,
        lengthMenu: [
            [10, 25, 50, 100], 
            [10, 25, 50, 100]
        ],
        ajax: {
            url: path + "Caja/generarCuotas",
            type: 'post',
            data: {
                anio: anio,
                mes: mes,
                opcion: 'consultarAlumnos'
            },
            beforeSend: function(){
                $('.text-loader').text('Consultando datos, por favor espere...');
                $("#modalLoader").modal();
            },
            dataSrc: function(data){
                console.log(data);
                return data.alumnos;
            },
            complete: function(){
                $("#modalLoader").modal("hide");
            }
        },
        columns: [
            { 
                data: {},
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: 'cod_alumno',
                className: 'celda-centrada'
            },
            {
                data: 'nombre',
                className: 'celda-centrada'
            },
            {
                data: 'monto',
                className: 'celda-centrada',
                render: function(data) {
                    return `S/.${data}.00`;
                }
            },
            {
                data: {},
                className: 'celda-centrada',
                render: function (data) {
                    return `<a class='btn boton-tabla boton-verde' data-code='${data.cod_alumno}' data-name='${data.nombre}' title='Generar Cuota' onclick='generarCuota(this)'><span class="icon-ticket"></span>`;
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
        }
    });
}

function generarCuota(btn) {
    let cod_alumno = btn.getAttribute('data-code');
    let nombre = btn.getAttribute('data-name');
    let mes = document.getElementById('mes').value;

    Notiflix.Confirm.Show(
        'Confirmación',
        `Seguro desea generar una cuota al alumno ${nombre} para el mes de ${meses[mes]}?`,
        'Si',
        'No',
        function(){
            registrarCuota(cod_alumno);
        },
        function(){
            
        }
    );
}

function registrarCuota(cod_alumno) {

    let mes = document.getElementById('mes').value;
    let anio = document.getElementById('anio').value;

    $.ajax({
        url: path + "caja/generarCuotas",
        method: 'post',
        dataType: "json",
        data: {
            cod_alumno: cod_alumno,
            anio: anio,
            mes: mes,
            opcion: 'registrarCuota'
        },
        success: function(data){
            
            if (data.respuesta === 'success') {
                Notiflix.Report.Success("Operación exitosa","La cuota ha sido registrada correctamente!", "Aceptar");
            } else{
                Notiflix.Report.Failure("Operación fallida","Ocurrió un error al registrar la cuota, por favor intentar nuevamente", "Aceptar");
            }
            consultarAlumnos();
        }
    });
}
