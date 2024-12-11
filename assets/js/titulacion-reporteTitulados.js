/* console.log('lodsad titulacion semestre'); */
document.addEventListener("DOMContentLoaded", () => {
     
    autocompleteAlumno();
    autocompleteAlumnoModal();
    cargarDocumentos();
    cargarUbicacion();

});

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

function autocompleteAlumno(){
    $("#alumno").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/declaracionJurada",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    console.log(data);
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
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
                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#codigoAlumno").val(ui.item.cod_alumno.trim());
                $("#cod_espe").val(ui.item.Cod_espe.trim());
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
                //cargarDataAlumno(ui.item.cod_alumno,ui.item.Cod_espe.trim());
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
    $("#alumno").focus();
} 

$("#alumno").keyup(function(){
    if( $(this).val().length < 1){        
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").next('i').addClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-success');
        $("#alumno").parent().addClass('has-error');
    }
})

function autocompleteAlumnoModal() {
    $("#alumnoAgregar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/declaracionJurada",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {

                    $("#alumnoAgregar").attr("codigo", ""); 
                    $("#alumnoAgregar").attr("codespe", ""); 
                    $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                    $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                    $("#alumnoAgregar").parent().removeClass('has-success');
                    $("#alumnoAgregar").parent().addClass('has-error');
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

                $("#alumnoAgregar").val(ui.item.cod_alumno + " - " + ui.item.nombre);                
                $("#alumnoAgregar").attr("codigo", ui.item.cod_alumno);    
                $("#alumnoAgregar").attr("codespe", ui.item.Cod_espe);             
                $("#alumnoAgregar").next('i').removeClass('glyphicon-remove');
                $("#alumnoAgregar").next('i').addClass('glyphicon-ok');
                $("#alumnoAgregar").parent().removeClass('has-error');
                $("#alumnoAgregar").parent().addClass('has-success');                
                
                $("#apellidosM").val(ui.item.apellidos);
                $("#nombresM").val(ui.item.nombres);
                $("#codigoM").val(ui.item.cod_interno);
                $("#documentoM").val(ui.item.documento);
                $("#domicilioM").val(ui.item.domicilio);
                $("#telefonosM").val(ui.item.telefono);
                $("#fechaNacM").val(ui.item.fecha_naci);

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
    $("#alumnoAgregar").focus();
} 

let backgroundColor = [
    'rgb(255, 99, 132,0.2)',
    'rgb(54, 162, 235,0.2)',
    'rgb(255, 205, 86,0.2)',
    'rgb(112, 173, 70,0.2)',
    'rgb(230, 148, 92,0.2)',
    'rgb(54, 162, 235,0.2)',
    'rgb(75, 192, 192,0.2)',
    'rgb(255, 205, 86,0.2)',
    'rgb(255, 99, 132,0.2)',
    'rgb(201, 203, 207,0.2)',
    'rgb(83, 211, 87,0.2)',
    'rgb(237, 208, 98,0.2)'
];

$('#btnBuscar').click(function () {
    cargarDataAlumno()
})


$('#btnReporte').click(function () {
        $('.ver_anio').show()
        $('.ver_mes').hide()
        $("#modalReporte").modal({
            backdrop: 'static',
            keyboard: false
        });
})

function cargarDataAlumno(){

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
            url: path + "titulacion/reporteTitulados",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: 'cargarData',
                alumno: $('#alumno').val().substring(0, 9),
                especialidad: $('#especialidad').val(),
                periodo: $('#periodo2').val(),
                fecha_1: $('#fecha_1').val(),
                fecha_2: $('#fecha_2').val()
            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log("data", response.data);
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.data;
                }
            },
        },
        columnDefs: [
            {
                defaultContent: "-",
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
                render: function (data, type, row, meta) {
                    return data.RegAuxiliar;
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Cod_Alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoDocumento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NumDocumento;
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
                    return data.Sexo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaNac;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.ProgramaEstudio;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Creditos;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Modulos;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NivelFormativo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Inicio;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Termino;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.ModalidadServicio;
                }
            }
        ],
        language: language
    });


}

function eliminar(btn){

    const op = $(btn).attr("op");
    const codigo = $(btn).attr("codigo");

    Notiflix.Confirm.Show(
        'Confirmación',
        `¿Está seguro de eliminar la operación seleccionada?`,
        'Si',
        'No',
        function () {
            
            $.ajax({
                url: path + "titulacion/declaracionJurada",
                dataType: "JSON",
                type: 'POST',
                data: {
                    opcion: "eliminar",
                    op: op
                },
                success: function (data) {

                    if (data.respuesta === "success") {

                        Notiflix.Notify.Success("EL REGISTRO SE ELIMINO CON ÉXITO", { timeout: 5000 });
                        //cargarDataAlumno(codigo);

                    } else {

                        Notiflix.Notify.Failure('Ocurrió un error inesperado, vuelva a intentarlo', { timeout: 5000 });

                    }

                }
            });

        },
        function () {
            
        }
    );
       
}

function cargarDocumentos() {

    $.ajax({
        url: path + "titulacion/declaracionJurada",
        dataType: 'JSON',
        type: 'POST',
        data: {
            opcion: 'cargarDocumentos'
        },        
        success: function (data) {

            if (data.respuesta === 'success') {
                
                data.data.forEach((e, k) => {
                    $("#tablaListado tbody").append(`<tr>
                        <td class='text-center'>${e.Alumno.trim()}</td>
                        <td class='text-center'>${e.Especialidad.trim()}</td>
                        <td class='text-center'>${e.Semestre.trim()}</td>                                                                    
                        <td class='text-center'>${e.Ciclo.trim()}</td>
                        <td class='text-center'>${e.Turno.trim()}</td>                                                                                        
                    </tr>`);
                });

            }  
        }
    });

}

function reporteTitulados() {
    // const anio = $('#anioProg').val();
    // const mes = $('#mesProg').val();
    //const opcionReporte = document.querySelector('input[name="opcionReporte"]:checked').value

    $.ajax({
        url: path + "Certificados/titulados",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "exportarReporte2",
            //opcionReporte: opcionReporte,
            alumno: $('#alumno').val().substring(0, 9),
            especialidad: $('#especialidad').val(),
            periodo: $('#periodo2').val(),
        },
        beforeSend: function () {
            $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function () {
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
            console.log(response);

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.reporte + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Notify.Failure("No hay datos en el periodo seleccionado");

            }
        },
    })
}

$("#formulario").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"registrar"})
    data.push({ name: "codigoAlumno", value: $("#alumnoAgregar").attr("codigo") });
    data.push({ name: "especialidad", value: $("#alumnoAgregar").attr("codespe") });
    
    $.ajax({
        url: path + "titulacion/declaracionJurada",
        dataType: "JSON",
        type: 'POST',
        data: $.param(data),
        success: function (data) {
            
            if(data.respuesta === "success"){
                Notiflix.Notify.Success( "SU REGISTRO SE REALIZÓ CON ÉXITO" , { timeout: 5000 }); 

                $(".colegioM").val("");               
                $("#telefonosM").val("");
                $("#lugarNacM").val("");
                $("#domicilioM").val("");
                $("#documentoM").val("");
                $("#codigoM").val("");
                $("#nombresM").val("");
                $("#apellidosM").val("");
                $("#alumnoAgregar").attr("codigo", "");
                $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                $("#alumnoAgregar").parent().removeClass('has-success');
                $("#alumnoAgregar").parent().addClass('has-error');
                $("#alumnoAgregar").val("");
                $("#modalAgregarEditar").modal("hide");

            }else if(data.respuesta === "warning"){
                Notiflix.Notify.Warning( data.error , {timeout:5000})
            }else{
                Notiflix.Notify.Failure('Ocurrió un error inesperado, vuelva a intentarlo', { timeout: 5000 });
            }

        }
    });
    

})

$("#alumnoAgregar").keyup(function(){
    if( $(this).val().length < 1){
        $("#alumnoAgregar").attr("codigo", "");
        $("#alumnoAgregar").attr("codespe", "");  
        $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
        $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
        $("#alumnoAgregar").parent().removeClass('has-success');
        $("#alumnoAgregar").parent().addClass('has-error');
    }
})

$(document).on("change", "input[name='opcionReporte']", function () {
    valorActivo = document.querySelector('input[name="opcionReporte"]:checked').value;
    let elementoActivo = document.querySelector('input[name="opcionReporte"]:checked');
    console.log(elementoActivo);
    if (elementoActivo.value == 1) {
        $('.ver_anio').show()
        $('.ver_mes').hide()
    } else {
        $('.ver_anio').show()
        $('.ver_mes').show()
    }
});

$("#btnAgregar").click(function () {

    $("#modalAgregarEditar").modal({backdrop:"static",keyboard:false});

})

$("#paisM").change(function(){
    cargarUbicacion(false);
})

$("#departamentoM").change(function () {
    cargarUbicacion(false,false);
})

$("#provinciaM").change(function () {
    cargarUbicacion(false,false,false);
})

$("#distritosM").change(function () {
    cargarUbicacion(false,false,false,false);
})

//FUNCIONES PAISES - DEPARTAMENTO - PROVINCIA - DISTRITOS
async function cargarUbicacion(pais_ = true , departamento_ = true , provincia_ = true , distrito_ = true ) {
    
    const headers = { "Content-Type": "application/json", 'Accept': 'application/json' };

    //PAISES
    if(pais_){
        let paises = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST", 
            headers: headers,
            body: JSON.stringify({opcion:"cargarPaises"})
        });
        paises = await paises.json();
        $("#paisM").html("");
        paises.paises.forEach( pais => {
            $("#paisM").append(`<option value="${pais.ID}" ${pais.ID==="20"?"selected":""} > ${pais.Nombre.toUpperCase()} </option>`);
        }); 
    }

    //DEPARTAMENTOS
    if(departamento_){
        let departamentos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDepartamentos", pais: $("#paisM").val() })
        });
        departamentos = await departamentos.json();
        $("#departamentoM").html("");
        departamentos.departamentos.forEach( departamento => {
            $("#departamentoM").append(`<option value="${departamento.ID}" ${departamento.ID === "23" ? "selected" : ""} > ${departamento.Nombre.toUpperCase()} </option>`);
        });
    }

    //PROVINCIAS
    if(provincia_){
        let provincias = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarProvincias", departamento: $("#departamentoM").val() })
        });
        provincias = await provincias.json();
        $("#provinciaM").html("");
        provincias.provincias.forEach(provincia => {
            $("#provinciaM").append(`<option value="${provincia.ID}" ${provincia.ID === "20" ? "selected" : ""} > ${provincia.Nombre.toUpperCase()} </option>`);
        });
    }

    //DISTRITOS
    if(distrito_){
        let distritos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDistritos", provincia: $("#provinciaM").val() })
        });
        distritos = await distritos.json();
        $("#distritosM").html("");
        distritos.distritos.forEach(distrito => {
            $("#distritosM").append(`<option value="${distrito.ID}" > ${distrito.Nombre.toUpperCase()} </option>`);
        });
    }
    
}