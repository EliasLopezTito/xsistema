var tablaListado = ''
$(document).ready(function () {
    $("#codigo").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "certificados/certificadoEstudios",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){
                    $("#codigo").attr("codigo","");
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#codigo").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#codigo").next('i').removeClass('glyphicon-remove');
                $("#codigo").next('i').addClass('glyphicon-ok');
                $("#codigo").parent().removeClass('has-error');
                $("#codigo").parent().addClass('has-success');
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {

        if (item.hasOwnProperty('vacio')) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div><b>"+item.cod_alumno+"</b>"+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    $("#codigo").focus();
    $("#codigo_alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "certificados/certificadoEstudios",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){
                    $("#codigo_alumno").attr("codigo","");
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                console.log("data proce",ui.item)
                $("#codigo_alumno").val(ui.item.cod_alumno);
                $("#nombres-apellidos").val(ui.item.nombres + " " + ui.item.apellidos);
                $('#numContacto').val(ui.item.telefono);
                $('#tip-documento').val(ui.item.TipoDocumento);
                $('#num-documento').val(ui.item.NumDocumento);
                $('#email').val(ui.item.email);
                $('#fnacimiento').val(ui.item.fecha_naci);
                $('#direccion').val(ui.item.domicilio);
                $("#codigo_alumno").next('i').removeClass('glyphicon-remove');
                $("#codigo_alumno").next('i').addClass('glyphicon-ok');
                $("#codigo_alumno").parent().removeClass('has-error');
                $("#codigo_alumno").parent().addClass('has-success');
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {

        if (item.hasOwnProperty('vacio')) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div><b>"+item.cod_alumno+"</b>"+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    $("#codigo_alumno").focus();
    $('#btnNuevo').click(function () {
        $('#modalFichaSocioEconomica').modal('show');
        limpiarFormulario(false)
    });
    $('#btnBuscar').click(function () {
        buscarListaSocioEconomico()
    });
    $('#dtFamil_ocupacion_1').change(function() {
        toggleInput();
    });
    $('#dtFamil_ocupacion_2').change(function() {
        toggleInput2();
    });
    $('#dtFamil_ocupacion_3').change(function() {
        toggleInput3();
    });
    $('#dtFamil_ocupacion_4').change(function() {
        toggleInput4();
    });
    $('#ingreEcon_ocupacion_1').change(function() {
        toggleInput5();
    });
    $('#ingreEcon_ocupacion_2').change(function() {
        toggleInput6();
    });
    $('#ingreEcon_ocupacion_3').change(function() {
        toggleInput7();
    });
    $('#numEmergencia_parentesco').change(function() {
        toggleInputParentesco();
    });
    $('#dtFamil_parentesco_1').change(function() {
        toggleInputParentesco1();
    });
    $('#dtFamil_parentesco_2').change(function() {
        toggleInputParentesco2();
    });
    $('#dtFamil_parentesco_3').change(function() {
        toggleInputParentesco3();
    });
    $('#ingreEcon_parentesco_1').change(function() {
        toggleInputParentesco4();
    });
    $('#ingreEcon_parentesco_2').change(function() {
        toggleInputParentesco5();
    });
    $('#ingreEcon_parentesco_3').change(function() {
        toggleInputParentesco6();
    });
});

function toggleInput() {
    const select = document.getElementById('dtFamil_ocupacion_1');
    const input = document.getElementById('input_ocupacion_1');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInput2() {
    const select = document.getElementById('dtFamil_ocupacion_2');
    const input = document.getElementById('input_ocupacion_2');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInput3() {
    const select = document.getElementById('dtFamil_ocupacion_3');
    const input = document.getElementById('input_ocupacion_3');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInput4() {
    const select = document.getElementById('dtFamil_ocupacion_4');
    const input = document.getElementById('input_ocupacion_4');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInput5() {
    const select = document.getElementById('ingreEcon_ocupacion_1');
    const input = document.getElementById('input_ingreEconocupacion_1');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInput6() {
    const select = document.getElementById('ingreEcon_ocupacion_2');
    const input = document.getElementById('input_ingreEconocupacion_2');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInput7() {
    const select = document.getElementById('ingreEcon_ocupacion_3');
    const input = document.getElementById('input_ingreEconocupacion_3');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}

function toggleInputParentesco() {
    const select = document.getElementById('numEmergencia_parentesco');
    const input = document.getElementById('input_numEmergencia_parentesco');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInputParentesco1() {
    const select = document.getElementById('dtFamil_parentesco_1');
    const input = document.getElementById('input_dtFamil_parentesco_1');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInputParentesco2() {
    const select = document.getElementById('dtFamil_parentesco_2');
    const input = document.getElementById('input_dtFamil_parentesco_2');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInputParentesco3() {
    const select = document.getElementById('dtFamil_parentesco_3');
    const input = document.getElementById('input_dtFamil_parentesco_3');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInputParentesco4() {
    const select = document.getElementById('ingreEcon_parentesco_1');
    const input = document.getElementById('input_ingreEcon_parentesco_1');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInputParentesco5() {
    const select = document.getElementById('ingreEcon_parentesco_2');
    const input = document.getElementById('input_ingreEcon_parentesco_2');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}
function toggleInputParentesco6() {
    const select = document.getElementById('ingreEcon_parentesco_3');
    const input = document.getElementById('input_ingreEcon_parentesco_3');
    
    if (select.value === 'OTROS') {
        input.style.display = 'block'; 
    } else {
        input.style.display = 'none'; 
        input.value = ''; 
    }
}

function updateSelectValue(value, selectId) {
    const select = document.getElementById(selectId);
    select.value = value; 
}
function updateSelectValueParentesco(value, selectId) {
    const select = document.getElementById(selectId);
    select.value = value; 
}
document.getElementById('seguSalud').addEventListener('change', function() {
    var inputField = document.getElementById('seguSalud_si');
    if (this.value === 'NO') {
        inputField.value = 'NINGUNO';
        inputField.readOnly = true;
    } else {
        inputField.value = '';
        inputField.readOnly = false;
    }
});

document.getElementById('cambioCarrera').addEventListener('change', function() {
    var inputField = document.getElementById('cambioCarrera_si');
    if (this.value === 'NO') {
        inputField.value = 'NINGUNO';
        inputField.readOnly = true;
    } else {
        inputField.value = '';
        inputField.readOnly = false;
    }
});

document.getElementById('tieneDescuento').addEventListener('change', function() {
    var inputField = document.getElementById('tieneDescuento_si');
    if (this.value === 'NO') {
        inputField.value = 'NINGUNO';
        inputField.readOnly = true;
    } else {
        inputField.value = '';
        inputField.readOnly = false;
    }
});

document.getElementById('sidoSancionado').addEventListener('change', function() {
    var inputField = document.getElementById('sidoSancionado_si');
    if (this.value === 'NO') {
        inputField.value = 'NINGUNO';
        inputField.readOnly = true;
    } else {
        inputField.value = '';
        inputField.readOnly = false;
    }
});

document.getElementById('realizaPracticas').addEventListener('change', function() {
    var inputField = document.getElementById('realizaPracticas_si');
    if (this.value === 'NO') {
        inputField.value = 'NINGUNO';
        inputField.readOnly = true;
    } else {
        inputField.value = '';
        inputField.readOnly = false;
    }
});

document.getElementById('probleVivienda').addEventListener('change', function() {
    var inputField = document.getElementById('probleVivienda_si');
    if (this.value === 'NO') {
        inputField.value = 'NINGUNO';
        inputField.readOnly = true;
    } else {
        inputField.value = '';
        inputField.readOnly = false;
    }
});
function buscarListaSocioEconomico(){
    var codigo = $("#codigo").val().split(' ')[0];

    if ($.fn.DataTable.isDataTable('#tablaListado')) {
        $('#tablaListado').DataTable().clear().destroy();
    }

    tablaListado = $("#tablaListado").DataTable({
        autoWidth: false,
        ordering: false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
        ],
        lengthMenu: [
            [25, 50, -1], 
            [25, 50, 'TODO']
        ],
        ajax: {
            url: path + "socioEconomico/fichaSocioeconomica",
            type: "POST",
            data: {
                codigo: codigo,
                opcion: 'listar'
            },
            dataSrc: function(data) {
                if (data.respuesta == "success" && data.lista !== "vacio") {
                    return data.lista;
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
        columns: [
            { data: 'id' },
            { data: 'Cod_Alumno' },
            { data: 'Alumno' },
            { data: 'Especialidad' },
            { data: 'ciclo' },
            { data: 'TipoDocumento' },
            { data: 'Documento' },
            { data: 'Direccion' },
            { data: 'Distrito' },
            { data: 'Correo' },
            { data: 'Numero' },
            { data: 'Fecha' },
            { data: null, render: function(data, type, row) {
                // Primer grupo: Servicios
                var serviceFieldsGroup1 = [
                    'servi_luz', 'servi_agua', 'servi_desague', 'servi_cable', 
                    'servi_telefono', 'servi_celular', 'servi_internet'
                ];
        
                // Segundo grupo: Bienes
                var serviceFieldsGroup2 = [
                    'bienes_refrige', 'bienes_tele', 'bienes_soni', 'bienes_compu',
                    'bienes_licuadora', 'bienes_plancha', 'bienes_micro', 
                    'bienes_lavadora', 'bienes_laptop'
                ];
        
                // Tercer grupo: Egresos Económicos
                var serviceFieldsGroup3 = [
                    'egreEcon_vivi', 'egreEcon_alimen', 'egreEcon_educa', 
                    'egreEcon_luz', 'egreEcon_agua', 'egreEcon_salud', 'egreEcon_otr_ser'
                ];
        
                // Campos requeridos
                var requiredFields = [
                    'Fecha', 'Especialidad', 'Cod_Alumno', 'Alumno', 'TipoDocumento', 
                    'Documento', 'Fnacimiento', 'ProvNacimiento', 'DistriNacimiento', 
                    'Direccion', 'Distrito', 'SegSalud', 'Si_SegSalud', 'Correo', 
                    'Numero', 'EmergNombre', 'EmergParentesco', 'EmergNum', 'ciclo', 
                    'codEstudiante', 'aula', 'turno', 'cambioCarrera', 'cambioCarrera_si',
                    'tieneDescuento', 'tieneDescuento_si', 'sidoSancionado', 
                    'sidoSancionado_si', 'realizaPracticas', 'realizaPracticas_si', 
                    'nombre_apellido_1', 'parentesco_1', 'edad_1', 'discapacidad_1',
                    'ocupacion_1', 'estado_civil_1', 'contacto_1', 'vive_1',
                    'nombre_apellido_2', 'parentesco_2', 'edad_2', 'discapacidad_2', 
                    'ocupacion_2', 'estado_civil_2', 'contacto_2', 'vive_2', 
                    'nombre_apellido_3', 'parentesco_3', 'edad_3', 'discapacidad_3', 
                    'ocupacion_3', 'estado_civil_3', 'contacto_3', 'vive_3', 'tenencia', 
                    'montoMensual', 'numPersonasViven', 'tipoVivienda', 'materPredomina',
                    'cocina', 'probleVivienda', 'probleVivienda_si','ingreEcon_nombre_1', 
                    'ingreEcon_parentesco_1','ingreEcon_ocupacion_1', 'ingreEcon_ingresoMensual_1', 
                    'ingreEcon_nombre_2', 'ingreEcon_parentesco_2', 
                    'ingreEcon_ocupacion_2', 'ingreEcon_ingresoMensual_2', 
                    'ingreEcon_nombre_3', 'ingreEcon_parentesco_3', 
                    'ingreEcon_ocupacion_3', 'ingreEcon_ingresoMensual_3'
                ];
        
                var allRequiredFieldsComplete = requiredFields.every(function(field) {
                    return row[field] != null && row[field] !== '';
                });
        
                var anyServiceFieldGroup1Complete = serviceFieldsGroup1.some(function(field) {
                    return String(row[field]) === '1';
                });
        
                var anyServiceFieldGroup2Complete = serviceFieldsGroup2.some(function(field) {
                    return String(row[field]) === '1';
                });
        
                var anyServiceFieldGroup3Complete = serviceFieldsGroup3.some(function(field) {
                    return String(row[field]) === '1';
                });
                var statusText;
                var backgroundColor;
                var textColor;
                if (allRequiredFieldsComplete && anyServiceFieldGroup1Complete && anyServiceFieldGroup2Complete && anyServiceFieldGroup3Complete) {
                    statusText = "COMPLETO";
                    backgroundColor = "#6ddb86"; 
                    textColor = "#155724";
                } else {
                    statusText = "INCOMPLETO";
                    backgroundColor = "#ffc107";
                    textColor = "#856404"; 
                }
                return `<span onclick="EditarSocioEconomico(${row.id});" style="background-color: ${backgroundColor}; color: ${textColor}; padding: 5px; border-radius: 5px; cursor: pointer; display: inline-block;"><strong>${statusText}</strong></span>`;
                
            }, createdCell: function(td) {
                $(td).css('padding', '8px');
            }}
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
$('#formAgregarFichaSocioEconomica').submit(function (e) {
    e.preventDefault();

    var primaryFields = [
        'numEmergencia_parentesco',
        'dtFamil_parentesco_1',
        'dtFamil_ocupacion_1',
        'dtFamil_parentesco_2',
        'dtFamil_parentesco_3',
        'dtFamil_ocupacion_2',
        'dtFamil_ocupacion_3',
        'ingreEcon_parentesco_1',
        'ingreEcon_parentesco_2',
        'ingreEcon_parentesco_3',
        'ingreEcon_ocupacion_1',
        'ingreEcon_ocupacion_2',
        'ingreEcon_ocupacion_3'
    ];
    var secondaryFields = [
        'input_numEmergencia_parentesco',
        'input_dtFamil_parentesco_1',
        'input_dtFamil_parentesco_2',
        'input_dtFamil_parentesco_3',
        'input_ocupacion_1',
        'input_ocupacion_2',
        'input_ocupacion_3',
        'input_ingreEcon_parentesco_1',
        'input_ingreEcon_parentesco_2',
        'input_ingreEcon_parentesco_3',
        'input_ingreEconocupacion_1',
        'input_ingreEconocupacion_2',
        'input_ingreEconocupacion_3'
    ];

    var emptyPrimaryFields = primaryFields.filter(function(fieldName) {
        var value = $(`[name="${fieldName}"]`).val();
        return value === null || value.trim() === ''; 
    });

    if (emptyPrimaryFields.length > 0) {
        var emptySecondaryFields = secondaryFields.filter(function(fieldName) {
            var value = $(`[name="${fieldName}"]`).val();
            return value === null || value.trim() === ''; 
        });
        var total = (secondaryFields.length - emptyPrimaryFields.length) - emptySecondaryFields.length;
        if (total !== 0) {
            Notiflix.Notify.Failure('Por favor, complete todos los campos obligatorios');
            return;
        }
    }

    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrar" });
    console.log("data", form);

    $.ajax({
        url: path + "socioEconomico/fichaSocioeconomica",
        type: "POST",
        data: form,
        beforeSend: function () {
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function (data) {
            $("#modalLoader").modal("hide");
            console.log(data);
            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {
                $("#modalFichaSocioEconomica").modal("hide");   
                Notiflix.Notify.Success('Guardado correctamente');
                tablaListado.ajax.reload(null, false);
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al guardar, recargue la pagina');
            }
        }
    });
});

function EditarSocioEconomico(id) {
    limpiarFormulario(true)
    
    $.ajax({
        url: path + "socioEconomico/fichaSocioeconomica",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "editar",
            id: id
        },
        success: function(data) {
            if (data.respuesta === "success") {
                console.log(data);
                const info = data.lista[0];
                $('#id').val(info.id);
                $('#codigo_alumno').val(info.Cod_Alumno);
                $("#codigo_alumno").next('i').removeClass('glyphicon-remove');
                $("#codigo_alumno").next('i').addClass('glyphicon-ok');
                $("#codigo_alumno").parent().removeClass('has-error');
                $("#codigo_alumno").parent().addClass('has-success');
                $('#nombres-apellidos').val(info.Alumno);
                $('#tip-documento').val(info.TipoDocumento);
                $('#num-documento').val(info.Documento);
                $('#fnacimiento').val(info.Fnacimiento);
                $('#provinNacimiento').val(info.ProvNacimiento);
                $('#distriNacimiento').val(info.DistriNacimiento);
                $('#direccion').val(info.Direccion);
                $('#distrito').val(info.Distrito);
                $('#seguSalud').val(info.SegSalud);
                if ($('#seguSalud').val() === "NO") {
                    $('#seguSalud_si').val(info.Si_SegSalud);
                    $('#seguSalud_si').prop('readonly', true);
                } else {
                    $('#seguSalud_si').val(info.Si_SegSalud);
                    $('#seguSalud_si').prop('readonly', false);
                }
                $('#email').val(info.Correo);
                $('#numContacto').val(info.Numero);
                $('#numEmergencia').val(info.EmergNombre);
                $('#numEmergencia_parentesco').val(info.EmergParentesco.toUpperCase());
                var selectnumEmergencia_parentesco = document.getElementById('numEmergencia_parentesco');
                if (selectnumEmergencia_parentesco.value === 'OTROS' || selectnumEmergencia_parentesco.value === '' || selectnumEmergencia_parentesco.value === null) {
                    document.getElementById("input_numEmergencia_parentesco").style.display = "block"; 
                    $('#input_numEmergencia_parentesco').val(info.EmergParentesco); 
                } else {
                    document.getElementById("input_numEmergencia_parentesco").style.display = "none"; 
                }
                $('#numEmergencia_num').val(info.EmergNum);
                
                $('#filtrar__area').val(info.Especialidad);
                $('#ciclo').val(info.ciclo);
                $('#aula').val(info.aula);
                $('#turno').val(info.turno);
                $('#cambioCarrera').val(info.cambioCarrera);
                if ($('#cambioCarrera').val() === "NO") {
                    $('#cambioCarrera_si').val(info.Si_SegSalud);
                    $('#cambioCarrera_si').prop('readonly', true);
                } else {
                    $('#cambioCarrera_si').val(info.Si_SegSalud);
                    $('#cambioCarrera_si').prop('readonly', false);
                }
                $('#tieneDescuento').val(info.tieneDescuento);
                if ($('#tieneDescuento').val() === "NO") {
                    $('#tieneDescuento_si').val(info.Si_SegSalud);
                    $('#tieneDescuento_si').prop('readonly', true);
                } else {
                    $('#tieneDescuento_si').val(info.Si_SegSalud);
                    $('#tieneDescuento_si').prop('readonly', false);
                }
                $('#sidoSancionado').val(info.sidoSancionado);
                if ($('#sidoSancionado').val() === "NO") {
                    $('#sidoSancionado_si').val(info.Si_SegSalud);
                    $('#sidoSancionado_si').prop('readonly', true);
                } else {
                    $('#sidoSancionado_si').val(info.Si_SegSalud);
                    $('#sidoSancionado_si').prop('readonly', false);
                }
                $('#realizaPracticas').val(info.realizaPracticas);
                if ($('#realizaPracticas').val() === "NO") {
                    $('#realizaPracticas_si').val(info.Si_SegSalud);
                    $('#realizaPracticas_si').prop('readonly', true);
                } else {
                    $('#realizaPracticas_si').val(info.Si_SegSalud);
                    $('#realizaPracticas_si').prop('readonly', false);
                }
                $('#dtFamil_nombre_1').val(info.nombre_apellido_1);
                $('#dtFamil_nombre_2').val(info.nombre_apellido_2);
                $('#dtFamil_nombre_3').val(info.nombre_apellido_3);
                $('#dtFamil_parentesco_1').val(info.parentesco_1.toUpperCase());
                var selectdtFamil_parentesco_1 = document.getElementById('dtFamil_parentesco_1');
                if (selectdtFamil_parentesco_1.value === 'OTROS' || selectdtFamil_parentesco_1.value === '' || selectdtFamil_parentesco_1.value === null) {
                    document.getElementById("input_dtFamil_parentesco_1").style.display = "block"; 
                    $('#input_dtFamil_parentesco_1').val(info.parentesco_1); 
                } else {
                    document.getElementById("input_dtFamil_parentesco_1").style.display = "none"; 
                }
                $('#dtFamil_parentesco_2').val(info.parentesco_2.toUpperCase());
                var selectdtFamil_parentesco_2 = document.getElementById('dtFamil_parentesco_2');
                if (selectdtFamil_parentesco_2.value === 'OTROS' || selectdtFamil_parentesco_2.value === '' || selectdtFamil_parentesco_2.value === null) {
                    document.getElementById("input_dtFamil_parentesco_2").style.display = "block"; 
                    $('#input_dtFamil_parentesco_2').val(info.parentesco_2); 
                } else {
                    document.getElementById("input_dtFamil_parentesco_2").style.display = "none"; 
                }
                $('#dtFamil_parentesco_3').val(info.parentesco_3.toUpperCase());
                var selectdtFamil_parentesco_3 = document.getElementById('dtFamil_parentesco_3');
                if (selectdtFamil_parentesco_3.value === 'OTROS' || selectdtFamil_parentesco_3.value === '' || selectdtFamil_parentesco_3.value === null) {
                    document.getElementById("input_dtFamil_parentesco_3").style.display = "block"; 
                    $('#input_dtFamil_parentesco_3').val(info.parentesco_3); 
                } else {
                    document.getElementById("input_dtFamil_parentesco_3").style.display = "none"; 
                }
                $('#dtFamil_edad_1').val(info.edad_1);
                $('#dtFamil_edad_2').val(info.edad_2);
                $('#dtFamil_edad_3').val(info.edad_3);
                $('#dtFamil_discapacidad_1').val(info.discapacidad_1);
                $('#dtFamil_discapacidad_2').val(info.discapacidad_2);
                $('#dtFamil_discapacidad_3').val(info.discapacidad_3);
                $('#dtFamil_ocupacion_1').val(info.ocupacion_1.toUpperCase());
                var selectdtFamil_ocupacion_1 = document.getElementById('dtFamil_ocupacion_1');
                if (selectdtFamil_ocupacion_1.value === 'OTROS' || selectdtFamil_ocupacion_1.value === '' || selectdtFamil_ocupacion_1.value === null) {
                    document.getElementById("input_ocupacion_1").style.display = "block"; 
                    $('#input_ocupacion_1').val(info.ocupacion_1); 
                } else {
                    document.getElementById("input_ocupacion_1").style.display = "none"; 
                }
                $('#dtFamil_ocupacion_2').val(info.ocupacion_2.toUpperCase());
                var selectdtFamil_ocupacion_2 = document.getElementById('dtFamil_ocupacion_2');
                if (selectdtFamil_ocupacion_2.value === 'OTROS' || selectdtFamil_ocupacion_2.value === '' || selectdtFamil_ocupacion_2.value === null) {
                    document.getElementById("input_ocupacion_2").style.display = "block"; 
                    $('#input_ocupacion_2').val(info.ocupacion_2); 
                } else {
                    document.getElementById("input_ocupacion_2").style.display = "none"; 
                }
                $('#dtFamil_ocupacion_3').val(info.ocupacion_3.toUpperCase());
                var selectdtFamil_ocupacion_3 = document.getElementById('dtFamil_ocupacion_3');
                if (selectdtFamil_ocupacion_3.value === 'OTROS' || selectdtFamil_ocupacion_3.value === '' || selectdtFamil_ocupacion_3.value === null) {
                    document.getElementById("input_ocupacion_3").style.display = "block"; 
                    $('#input_ocupacion_3').val(info.ocupacion_3); 
                } else {
                    document.getElementById("input_ocupacion_3").style.display = "none"; 
                }
                $('#dtFamil_estadoCivil_1').val(info.estado_civil_1);
                $('#dtFamil_estadoCivil_2').val(info.estado_civil_2);
                $('#dtFamil_estadoCivil_3').val(info.estado_civil_3);
                $('#dtFamil_contacto_1').val(info.contacto_1);
                $('#dtFamil_contacto_2').val(info.contacto_2);
                $('#dtFamil_contacto_3').val(info.contacto_3);
                $('#dtFamil_viveEstudiante_1').val(info.vive_1);
                $('#dtFamil_viveEstudiante_2').val(info.vive_2);
                $('#dtFamil_viveEstudiante_3').val(info.vive_3);
                $('#tenencia').val(info.tenencia);
                $('#montoMensual').val(info.montoMensual);
                $('#numPersonasViven').val(info.numPersonasViven);
                $('#tipoVivienda').val(info.tipoVivienda);
                $('#materPredomina').val(info.materPredomina);
                $('#cocina').val(info.cocina);
                if (info.servi_luz === 1) {
                    $('#servi_luz').prop('checked', true);
                } else {
                    $('#servi_luz').prop('checked', false);
                }
                if (info.servi_agua === 1) {
                    $('#servi_agua').prop('checked', true);
                } else {
                    $('#servi_agua').prop('checked', false);
                }
                if (info.servi_desague === 1) {
                    $('#servi_desague').prop('checked', true);
                } else {
                    $('#servi_desague').prop('checked', false);
                }
                if (info.servi_cable === 1) {
                    $('#servi_cable').prop('checked', true);
                } else {
                    $('#servi_cable').prop('checked', false);
                }
                if (info.servi_telefono === 1) {
                    $('#servi_telefono').prop('checked', true);
                } else {
                    $('#servi_telefono').prop('checked', false);
                }
                if (info.servi_celular === 1) {
                    $('#servi_celular').prop('checked', true);
                } else {
                    $('#servi_celular').prop('checked', false);
                }
                if (info.servi_internet === 1) {
                    $('#servi_internet').prop('checked', true);
                } else {
                    $('#servi_internet').prop('checked', false);
                }
                if (info.bienes_refrige === 1) {
                    $('#bienes_refrige').prop('checked', true);
                } else {
                    $('#bienes_refrige').prop('checked', false);
                }
                if (info.bienes_tele === 1) {
                    $('#bienes_tele').prop('checked', true);
                } else {
                    $('#bienes_tele').prop('checked', false);
                }
                if (info.bienes_soni === 1) {
                    $('#bienes_soni').prop('checked', true);
                } else {
                    $('#bienes_soni').prop('checked', false);
                }
                if (info.bienes_compu === 1) {
                    $('#bienes_compu').prop('checked', true);
                } else {
                    $('#bienes_compu').prop('checked', false);
                }
                if (info.bienes_licuadora === 1) {
                    $('#bienes_licuadora').prop('checked', true);
                } else {
                    $('#bienes_licuadora').prop('checked', false);
                }
                if (info.bienes_plancha === 1) {
                    $('#bienes_plancha').prop('checked', true);
                } else {
                    $('#bienes_plancha').prop('checked', false);
                }
                if (info.bienes_micro === 1) {
                    $('#bienes_micro').prop('checked', true);
                } else {
                    $('#bienes_micro').prop('checked', false);
                }
                if (info.bienes_lavadora === 1) {
                    $('#bienes_lavadora').prop('checked', true);
                } else {
                    $('#bienes_lavadora').prop('checked', false);
                }
                if (info.bienes_laptop === 1) {
                    $('#bienes_laptop').prop('checked', true);
                } else {
                    $('#bienes_laptop').prop('checked', false);
                }
                $('#probleVivienda').val(info.probleVivienda);
                if ($('#probleVivienda').val() === "NO") {
                    $('#probleVivienda_si').val(info.probleVivienda_si);
                    $('#probleVivienda_si').prop('readonly', true);
                } else {
                    $('#probleVivienda_si').val(info.probleVivienda_si);
                    $('#probleVivienda_si').prop('readonly', false);
                }




                $('#ingreEcon_nombre_1').val(info.ingreEcon_nombre_1);
                $('#ingreEcon_nombre_2').val(info.ingreEcon_nombre_2);
                $('#ingreEcon_nombre_3').val(info.ingreEcon_nombre_3);
                $('#ingreEcon_parentesco_1').val(info.ingreEcon_parentesco_1.toUpperCase());
                var selectingreEcon_parentesco_1 = document.getElementById('ingreEcon_parentesco_1');
                if (selectingreEcon_parentesco_1.value === 'OTROS' || selectingreEcon_parentesco_1.value === '' || selectingreEcon_parentesco_1.value === null) {
                    document.getElementById("input_ingreEcon_parentesco_1").style.display = "block"; 
                    $('#input_ingreEcon_parentesco_1').val(info.ingreEcon_parentesco_1); 
                } else {
                    document.getElementById("input_ingreEcon_parentesco_1").style.display = "none"; 
                }
                $('#ingreEcon_parentesco_2').val(info.ingreEcon_parentesco_2.toUpperCase());
                var selectingreEcon_parentesco_2 = document.getElementById('ingreEcon_parentesco_2');
                if (selectingreEcon_parentesco_2.value === 'OTROS' || selectingreEcon_parentesco_2.value === '' || selectingreEcon_parentesco_2.value === null) {
                    document.getElementById("input_ingreEcon_parentesco_2").style.display = "block"; 
                    $('#input_ingreEcon_parentesco_2').val(info.ingreEcon_parentesco_2); 
                } else {
                    document.getElementById("input_ingreEcon_parentesco_2").style.display = "none"; 
                }
                $('#ingreEcon_parentesco_3').val(info.ingreEcon_parentesco_3.toUpperCase());
                var selectingreEcon_parentesco_3 = document.getElementById('ingreEcon_parentesco_3');
                if (selectingreEcon_parentesco_3.value === 'OTROS' || selectingreEcon_parentesco_3.value === '' || selectingreEcon_parentesco_3.value === null) {
                    document.getElementById("input_ingreEcon_parentesco_3").style.display = "block"; 
                    $('#input_ingreEcon_parentesco_3').val(info.ingreEcon_parentesco_3); 
                } else {
                    document.getElementById("input_ingreEcon_parentesco_3").style.display = "none"; 
                }
                $('#ingreEcon_ocupacion_1').val(info.ingreEcon_ocupacion_1.toUpperCase());
                var selectingreEcon_ocupacion_1 = document.getElementById('ingreEcon_ocupacion_1');
                if (selectingreEcon_ocupacion_1.value === 'OTROS' || selectingreEcon_ocupacion_1.value === '' || selectingreEcon_ocupacion_1.value === null) {
                    document.getElementById("input_ingreEconocupacion_1").style.display = "block"; 
                    $('#input_ingreEconocupacion_1').val(info.ingreEcon_ocupacion_1); 
                } else {
                    document.getElementById("input_ingreEconocupacion_1").style.display = "none"; 
                }
                $('#ingreEcon_ocupacion_2').val(info.ingreEcon_ocupacion_2.toUpperCase());
                var selectingreEcon_ocupacion_2 = document.getElementById('ingreEcon_ocupacion_2');
                if (selectingreEcon_ocupacion_2.value === 'OTROS' || selectingreEcon_ocupacion_2.value === '' || selectingreEcon_ocupacion_2.value === null) {
                    document.getElementById("input_ingreEconocupacion_2").style.display = "block"; 
                    $('#input_ingreEconocupacion_2').val(info.ingreEcon_ocupacion_2); 
                } else {
                    document.getElementById("input_ingreEconocupacion_2").style.display = "none"; 
                }
                $('#ingreEcon_ocupacion_3').val(info.ingreEcon_ocupacion_3.toUpperCase());
                var selectingreEcon_ocupacion_3 = document.getElementById('ingreEcon_ocupacion_3');
                if (selectingreEcon_ocupacion_3.value === 'OTROS' || selectingreEcon_ocupacion_3.value === '' || selectingreEcon_ocupacion_3.value === null) {
                    document.getElementById("input_ingreEconocupacion_3").style.display = "block"; 
                    $('#input_ingreEconocupacion_3').val(info.ingreEcon_ocupacion_3); 
                } else {
                    document.getElementById("input_ingreEconocupacion_3").style.display = "none"; 
                }
                $('#ingreEcon_ingresoMensual_1').val(info.ingreEcon_ingresoMensual_1);
                $('#ingreEcon_ingresoMensual_2').val(info.ingreEcon_ingresoMensual_2);
                $('#ingreEcon_ingresoMensual_3').val(info.ingreEcon_ingresoMensual_3);
                if (info.egreEcon_vivi === 1) {
                    $('#egreEcon_vivi').prop('checked', true);
                } else {
                    $('#egreEcon_vivi').prop('checked', false);
                }
                if (info.egreEcon_alimen === 1) {
                    $('#egreEcon_alimen').prop('checked', true);
                } else {
                    $('#egreEcon_alimen').prop('checked', false);
                }
                if (info.egreEcon_educa === 1) {
                    $('#egreEcon_educa').prop('checked', true);
                } else {
                    $('#egreEcon_educa').prop('checked', false);
                }
                if (info.egreEcon_luz === 1) {
                    $('#egreEcon_luz').prop('checked', true);
                } else {
                    $('#egreEcon_luz').prop('checked', false);
                }
                if (info.egreEcon_agua === 1) {
                    $('#egreEcon_agua').prop('checked', true);
                } else {
                    $('#egreEcon_agua').prop('checked', false);
                }
                if (info.egreEcon_salud === 1) {
                    $('#egreEcon_salud').prop('checked', true);
                } else {
                    $('#egreEcon_salud').prop('checked', false);
                }
                if (info.egreEcon_otr_ser === 1) {
                    $('#egreEcon_otr_ser').prop('checked', true);
                } else {
                    $('#egreEcon_otr_ser').prop('checked', false);
                }
                $('#estudAportante').val(info.estudAportante);
                $('#estudAportante_si').val(info.estudAportante_si);
                $('#modalFichaSocioEconomica').modal('show');
            } else {
                console.error("Error: " + data.error);
            }
        }
    });
}

function limpiarFormulario(valor) {
    $('#formAgregarFichaSocioEconomica').find('input[type=text], input[type=number]').val('');
    document.getElementById("formAgregarFichaSocioEconomica").reset();
        const selects = document.querySelectorAll("#formAgregarFichaSocioEconomica select");

        selects.forEach(function(select) {
            if (select.querySelector('option[value=""]')) {
                select.value = ""; 
            } else {
                select.selectedIndex = 0;
            }
        });
            document.getElementById("input_numEmergencia_parentesco").style.display = "none";
            document.getElementById("input_dtFamil_parentesco_1").style.display = "none";
            document.getElementById("input_dtFamil_parentesco_2").style.display = "none";
            document.getElementById("input_dtFamil_parentesco_3").style.display = "none";
            document.getElementById("input_ocupacion_1").style.display = "none";
            document.getElementById("input_ocupacion_2").style.display = "none";
            document.getElementById("input_ocupacion_3").style.display = "none";
            document.getElementById("input_ingreEcon_parentesco_1").style.display = "none";
            document.getElementById("input_ingreEcon_parentesco_2").style.display = "none";
            document.getElementById("input_ingreEcon_parentesco_3").style.display = "none";
            document.getElementById("input_ingreEconocupacion_1").style.display = "none";
            document.getElementById("input_ingreEconocupacion_2").style.display = "none";
            document.getElementById("input_ingreEconocupacion_3").style.display = "none";
            document.getElementById("seguSalud_si").removeAttribute("readonly");
            document.getElementById("cambioCarrera_si").removeAttribute("readonly");
            document.getElementById("tieneDescuento_si").removeAttribute("readonly");
            document.getElementById("sidoSancionado_si").removeAttribute("readonly");
            document.getElementById("realizaPracticas_si").removeAttribute("readonly");
            document.getElementById("probleVivienda_si").removeAttribute("readonly");
            $('#formAgregarFichaSocioEconomica').find('input[type=hidden]').val("");
    if(valor === true){
        $("#guardarFicha").addClass("btn-warning").removeClass("btn-primary")
        $("#guardarFicha").html("Actualizar");
        $("#tituloModal").html("ACTUALIZAR FICHA SOCIOECONÓMICA");
        $('#codigo_alumno').prop('readonly', true);
    }else{
        $("#guardarFicha").addClass("btn-primary").removeClass("btn-warning")
        $("#guardarFicha").html("Registrar");
        $("#tituloModal").html("AGREGAR FICHA SOCIOECONÓMICA");
        $('#formAgregarFichaSocioEconomica').find('#id').val('0');
        $('#codigo_alumno').prop('readonly', false);
    }
}
