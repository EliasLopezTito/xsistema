let reader = new FileReader;
let result, validado = false;
let file, estructuraCuotas = '';
let inputFile = document.getElementById('inputFileCuotas');
let errores = [];
let myTable;
let btnRegistrarAlumnos = document.getElementById('btnRegistrarAlumnos');

$(document).ready(function(){
    setSelectCuotasVer();
    cargarCuotasApiconfig();
    cargarCantidadAlumnosCuotas();

});

document.addEventListener('change', e => {
    if (e.target.matches('#inputFileCuotas')) {
        validarArchivo();
    }
})

document.addEventListener('click', e => {
    if(e.target.matches('#btnRegistrarAlumnos')){
        
        if (inputFile.files.length > 0 && validado === true) {
            registrarAlumnos();
        } else{
            Notiflix.Notify.Failure('Por favor seleccione un archivo!');
        }

    }

    if (e.target.matches('#btnEliminarAlumnosTxt')) {
        if (inputFile.files.length > 0 && validado === true) {
            
            Notiflix.Confirm.Show(
                'Advertencia',
                '¿Seguro que desea eliminar todos los alumnos del archivo de texto?',
                'Si',
                'No',
                function(){
                    eliminarAlumnosTxt();
                },
                function(){
    
                }
            );

        } else{
            Notiflix.Notify.Failure('Por favor seleccione un archivo!');
        }
    }

    if (e.target.matches('#btnVerAlumnos')) {
        consultarRegistrosAlumnos();
    }

    // if (e.target.matches('#btnEliminarAlumnos')) {

    //     Notiflix.Confirm.Show(
    //         'Confirmación',
    //         '¿Desea eliminar todos los alumnos asignados a la cuota?',
    //         'Si',
    //         'No',
    //         function(){
    //             $id_config = e.target.getAttribute('data-id');
    //             eliminarAlumnos($id_config);
    //         },
    //         function(){

    //         }
    //     );
    // }

})

function eliminarAlumnosTxt() {

    $.ajax({
        url: path + "caja/alumnosCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            opcion: "eliminarAlumnosTxt",
            codigos: result
        },
        beforeSend: function() {
            $('.text-loader').text('Eliminando alumnos, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function(data){
            console.log(data);
            if (data.respuesta === 'success') {
                cargarCantidadAlumnosCuotas();
                Notiflix.Notify.Success('Alumnos eliminados correctamente!');
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al eliminar los alumnos!');
            }
            
        },
        error: function(error){
            console.log('Hay un error: ');
            console.log(error);
        },
        complete: function() {
            $("#modalLoader").modal("hide");
        }
    });

}

function setSelectCuotasVer() {
    $.ajax({
        url: path + "caja/alumnosCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            opcion: "selectApiConfig"
        },
        success: function(data){

            if (data.respuesta === 'success') {
                setCuotasSelectVer(data.cuotas);
            }
            
        },
        error: function(error){
            console.log('Hay un error: ');
            console.log(error);
        }
    });
}

function setCuotasSelectVer(cuotas) {
    let cboCuotas = $('#selectCuotasVer');

    cuotas.forEach((cuota, index) => {
        if (index === 0) {
            cboCuotas.append(`<option value='%'>TODO</option>`);
            cboCuotas.append(`<option value='${cuota.id}'>${cuota.id}.  Cuota: S/. ${cuota.monto}.00</option>`);
        } else{
            cboCuotas.append(`<option value='${cuota.id}'>${cuota.id}.  Cuota: S/. ${cuota.monto}.00</option>`);
        }
        
    })
}
function consultarRegistrosAlumnos(){
    let id_config = $('#selectCuotasVer').val();

    $('#tablaListaAlumnosCuotas').dataTable().fnDestroy();
    $("#tablaListaAlumnosCuotas").DataTable({
        // searching: false,
        // serverSide: true,
        // processing: true,
        ordering:  false,
        // order: [[2,'desc']],
        lengthMenu: [
            [10, 25, 50, 100], 
            [10, 25, 50, 100]
        ],
        ajax: {
            url: path + "Caja/alumnosCuotas",
            type: 'post',
            data: {
                id_config: id_config,
                opcion: 'selectAlumnosCuota'
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
            { data: 'cod_alumno' },
            { data: 'nombre' },
            {
                data: {},
                className: 'celda-centrada',
                render: function (data) {
                    return `<a class='btn boton-tabla boton-rojo' data-code='${data.cod_alumno}' onclick='showEliminarAlumno(this)'><span class="icon-cross"></span>`;
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

function showEliminarAlumno(btn) {

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Seguro desea eliminar el alumno?',
        'Si',
        'No',
        function(){
            eliminarUnAlumno(btn);
        },
        function(){

        }
    );
}

function eliminarUnAlumno(btn) {

    let cod_alumno = btn.getAttribute('data-code');
    console.log('El codigo es ' + cod_alumno);
    $.ajax({
        url: path + "caja/alumnosCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            opcion: "eliminarUnAlumno",
            cod_alumno: cod_alumno
        },
        success: function(data){
            console.log(data);
            if (data.respuesta === 'success') {
                let $row = $(btn).parents("tr").eq(0);
                $row.remove(); 
                Notiflix.Notify.Success('Alumno Eliminado Correctamente!');
                cargarCantidadAlumnosCuotas();
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al eliminar el alumno!');
            }
            
        },
        error: function(error){
            console.log(error);
        }
    });
}

function validarArchivo(){
    validado = false;
    result = '';
    file = inputFile.files[0];
    
    reader.readAsText(file);

    reader.onload = () => {

        result = reader.result;

        result = result.split(/\r\n|\n/);

        result = result.filter(el => el.trim());
        let length_1 = result.length;

        result = result.filter(el => el.length === 9);
        let length_2 = result.length;

        if (length_1 === length_2 && length_1 > 0) {
            Notiflix.Notify.Success('Archivo correcto!');
            validado = true;
        } else{
            validado = false;
            Notiflix.Report.Failure("Advertencia","El archivo seleccionado es incorrecto, por favor verificar!", "Aceptar");
            inputFile.value = '';
        }

    }

}

function registrarAlumnos(){

    let id_config = document.getElementById('selectApiConfig').value;

    $.ajax({
        // async: false,
        url: path + "caja/alumnosCuotas",
        type: 'POST',
        dataType: 'json',
        data: {
            opcion: 'registrarAlumnos',
            id_config: id_config,
            codigos: result
        },
        beforeSend: function() {
            $('.text-loader').text('Registrando alumnos, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function(data) {
            if (data.respuesta === 'success') {
                cargarCantidadAlumnosCuotas();
                Notiflix.Report.Success("Registro exitoso","Los alumnos fueron registrados correctamente", "Aceptar");
            } else{
                Notiflix.Notify.Failure('Ocurrio un error al registrar los alumnos, intentar nuevamente');
            }
        },
        error: function(e) {
            
        },
        complete: function() {
            $("#modalLoader").modal("hide");
        }
    });
    
}

function cargarCuotasApiconfig(){
    
    $.ajax({
        url: path + "caja/alumnosCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            opcion: "selectApiConfig"
        },
        success: function(data){

            if (data.respuesta === 'success') {
                setCuotasInput(data.cuotas);
            }
            
        },
        error: function(error){
            console.log('Hay un error: ');
            console.log(error);
        }
    });
}

function setCuotasInput(cuotas){
    let cboCuotas = $('#selectApiConfig');
    cuotas.forEach(cuota => {
        
        if (cuota.fechaBaja === null) {
            cboCuotas.append(`<option value='${cuota.id}' style='font-weight: bold;'>Monto: S/. ${cuota.monto}.00 - Mora: S/. ${cuota.mora}.00 - Principal </option>`);
        } else {
            cboCuotas.append(`<option value='${cuota.id}'>Monto: S/. ${cuota.monto}.00  -  Mora: S/. ${cuota.mora}.00 </option>`);
        }

    });

}

function cargarCantidadAlumnosCuotas(){
    $.ajax({
        url: path + "caja/alumnosCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            opcion: "selectAlumnosCuotas"
        },
        success: function(data){

            if (data.respuesta === 'success') {
                let tbody = $("#tablaCuotasAlumnos tbody");
                tbody.find('tr').remove();

                $.each(data.cuotasAlumnos, function(i, cuota) {

                    let disabled = '';
                    if(cuota.cantidad === 0) disabled = 'disabled';

                        let tr=`<tr>
                            <td class='text-center'>${cuota.empresa}</td>
                            <td class='text-center'>S/. ${cuota.monto}.00</td>
                            <td class='text-center'>S/. ${cuota.mora}.00</td>
                            <td class='text-center'>${cuota.cantidad.toLocaleString('en-US')}</td>
                            </tr>`;

                    tbody.append(tr);
                })
            }
            
        }
    });
}
