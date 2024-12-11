let tablaPersonal;
let codigoPersonalSeleccionado = '';
$(document).ready(function() {
    Notiflix.Loading.Init({
        clickToClose: true
    });
    $("#modal__agregar__empleador").on('shown.bs.modal', function () {
        document.body.style.overflow = 'hidden';
    });

    $("#modal__agregar__empleador").on('hidden.bs.modal', function () {
        document.body.style.overflow = 'revert-layer';
        $('body').css('padding-right', '0');
        /* location.reload(); */
    });
    
});

function toggleCheckbox(checkbox, otherCheckboxId) {
    if (checkbox.checked) {
        document.getElementById(otherCheckboxId).checked = false;
    }
    toggleDependentFields();
}

function toggleDependentFields() {
    const isAFPChecked = document.getElementById('checkPensionJ2').checked;
    document.getElementById('nombreAseguradoraAFP').disabled = !isAFPChecked;
    document.getElementById('tipoComis').disabled = !isAFPChecked;
    document.getElementById('checkEssalud').disabled = !isAFPChecked;
    document.getElementById('checkEps').disabled = !isAFPChecked;
    document.getElementById('checkVidaLeyAnual').disabled = !isAFPChecked;
    document.getElementById('checkVidaLeyBiMensual').disabled = !isAFPChecked;
}

function toggleCheckbox2(checkbox) {
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach((cb) => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
}

document.addEventListener('click', (e) => {

    if (e.target.matches('#btn__agregar__empleador')) {
        $("#modal__agregar__empleador").modal("show")
    }
});

$("#btn__agregar__empleador").click(function () {
    limpiarFormulario(true)
    $("#btn_modal").addClass("btn-primary").removeClass("btn-warning")
    $("#btn_modal").html("REGISTRAR PERSONAL");
    $("#tituloModal").html("AGREGAR PERSONAL");
    $("#modal__agregar__empleador").modal({ backdrop: 'static', keyboard: false });
});

$("#buscarEmpleador").click(function () {
    listadoPersonal()
});

function listadoPersonal() {
    const tipoPlanilla = $("#filtplanilla").val();
    const filtempleador = $("#filtempleador").val();
    const filtEmpleado = $("#filtEmpleado").val();
    const filtArea = $("#filtArea").val();

    if ($.fn.DataTable.isDataTable('#tablaPersonal')) {
        $('#tablaPersonal').DataTable().destroy();
    }

    tablaPersonal = $('#tablaPersonal').DataTable({
        destroy: true,
        searching: true,
        processing: false,
        responsive: true,
        ordering: false,
        lengthMenu: [
            [20, 100, -1],
            [20, 100, 'TODO']
        ],
        ajax: {
            url: path + 'planilla/personal',
            type: 'POST',
            data: {
                tipoPlanilla: tipoPlanilla,
                filtempleador: filtempleador,
                filtEmpleado: filtEmpleado,
                filtArea: filtArea,
                opcion: 'listar'
            },
            beforeSend: function() {
                $('.text-loader').text('Consultando datos, por favor espere...');
                $("#modalLoader").modal();
            },
            dataSrc: function (data) {
                return data.res;
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            }
        },
        columnDefs: [
            { targets: '_all', className: 'celda-centrada' }
        ],
        columns: [
            { data: 'Empleador' },
            { data: 'CodEmpleado' },
            { data: 'Empleado' },
            { data: 'Area' },
            { data: 'FNacimiento' },
            { data: 'Edad' },
            { data: 'DNI' },
            { data: 'Sexo' },
            { data: 'Cargo' },
            { data: 'FIngreso' },
            { data: 'Telefonos' },
            { data: 'Planilla' },
            { data: 'RazonSocial' },
            { data: 'Distrito' },
            { data: 'Direccion' },
            { data: 'CuentaSueldo' },
            { data: 'EstadoCivil' },
            { data: 'Email' },
            { data: 'BancoSueldo' },
            { data: 'CondicionLaboral' },
            { data: 'Sede' },
            { data: 'MotivoCese' },
            {
                data: null,
                render: function (data) {
                    return "<button class='btn boton-tabla btn-warning' type='button' id='btn__editar__empleador' onclick='editarPersonal(\"" + data.CodEmpleado + "\");' title='Ver solicitud'><span class='icon-pencil'></span></button>&nbsp;&nbsp;&nbsp;";
                }
            }
        ],
        language: {
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ registros",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "No se encontraron registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            search: "Buscar:",
            infoThousands: ",",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            },
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros"
        }
    });
}

function editarPersonal(cod_emp) {
    limpiarFormulario(false)
    almacenarCodigoPersonal(cod_emp)
    $.ajax({
        url: path + 'planilla/personal',
        method: "POST",
        dataType: 'json',
        data: {
            cod_emp: cod_emp,
            opcion: "actualizar"
        },
        success: function(data){

            /* console.log(data) */
            if (data.respuesta == "success") {

                const info = data.info[0];
                /* console.log("info: ",info) */
                $("#codigoPersonal").val(info.cod_emp.trim());
                $("#apPaterno").val(info.apellidoP.trim());
                $("#apMaterno").val(info.apellidoM.trim());
                $("#nombres").val(info.nombres.trim());
                $("#direccion").val(info.direccion.trim());
                $("#distrito").val(info.cod_dist.trim());
                $("#fechaNacimiento").val(info.fecnaci ? info.fecnaci.substr(0, 10) : "");
                $("#lugNacimiento").val(info.lugnaci.trim());
                $("#tipoDoc").val(info.TipoDoc.trim());
                $("#numDoc").val(info.dni.trim());
                $("#sede").val(info.sede ? info.sede.trim() : "00");
                $("#sexo").val(info.sexo.trim());
                $("#telf").val(info.Telefonos.trim());
                $("#email").val(info.Correo ? info.Correo.trim() : "");
                $("#estadoCivil").val(info.estadocivi.trim());
                $("#carnetExt").val(info.carnetextr.trim());
                $("#cuspp").val(info.Cuspp ? info.Cuspp : "");
                $("#pasaporte").val(info.pasaporte.trim());
                $("#nacionalidad").val(info.nacionalid.trim());

                const valorTipoJub = info.tippenjub.trim();
                if (valorTipoJub === "ONP") {
                    $("#checkPensionJ1").prop("checked", true); 
                    $("#checkPensionJ2").prop("checked", false);
                    toggleCheckbox('<input class="form-check-input" type="checkbox" id="checkPensionJ1" name="checkPensionJ1" onclick="toggleCheckbox(this, "checkPensionJ2"); toggleDependentFields();">', 'checkPensionJ1') 
                } else if (valorTipoJub === "AFP") {
                    $("#checkPensionJ1").prop("checked", false);
                    $("#checkPensionJ2").prop("checked", true);
                    toggleCheckbox('<input class="form-check-input" type="checkbox" id="checkPensionJ2" name="checkPensionJ2" onclick="toggleCheckbox(this, "checkPensionJ1"); toggleDependentFields();">', 'checkPensionJ2') 
                }

                if (info.CodAfp !== null && info.CodAfp !== undefined && info.CodAfp !== "") {
                    $("#nombreAseguradoraAFP").val(info.CodAfp.trim());
                } else {
                    $("#nombreAseguradoraAFP").val('6');
                }
                $("#tipoComis").val(info.tipComision ? info.tipComision.trim() : "");
                $("#checkEssalud").prop('checked', info.seguroEssalud === '1');
                $("#checkEps").prop('checked', info.EPS === '1');
                $("#checkVidaLeyAnual").prop('checked', info.svl === '1');
                $("#checkVidaLeyBiMensual").prop('checked', info.svlm === '1');
                $("#carnetEssalud").val(info.carnesalud.trim());
                $("#fechaEssalud").val(info.fecinsalud ? info.fecinsalud.substr(0, 10) : "");
                $("#brevete").val(info.brevete.trim());
                $("#profesion").val(info.cod_profesion ? info.cod_profesion.trim() : "");
                $("#bachiller").prop('checked', info.Bachiller === 'S');
                $("#titulado").prop('checked', info.Titulado === 'S');
                $("#maestria").prop('checked', info.Maetria === 'S');
                $("#doctorado").prop('checked', info.Doctorado === 'S');
                $("#especializacion").prop('checked', info.Especializacion === 'S');


                $("#fechaIngreso").val(info.fecingreso ? info.fecingreso.substr(0, 10) : "");
                $("#fechaIngCorp").val(info.fecIngresoCorp ? info.fecIngresoCorp.substr(0, 10) : "");
                $("#fecPlanillaReal").val(info.fecplanilla ? info.fecplanilla.substr(0, 10) : "");
                $("#fechaCese").val(info.feccese ? info.feccese.substr(0, 10) : "");
                $("#fechaInicioContrato").val(info.feciniContrato ? info.feciniContrato.substr(0, 10) : "");
                $("#fechaFinalContrato").val(info.fecfinContrato ? info.fecfinContrato.substr(0, 10) : "");
                $("#motivoCese").val(info.motivoCese ? info.motivoCese.trim() : "");
                $("#empAreas").val(info.cod_ofi ? info.cod_ofi.trim() : "");
                $("#cargoOcu").val(info.cod_cargo ? info.cod_cargo.trim() : "");
                $("#empleadorIns").val(info.cod_local ? info.cod_local.trim() : "");
                $("#empleadorIns_pre").val(info.cod_local_pre ? info.cod_local_pre.trim() : "");
                $("#planilla").val(info.cod_planilla ? info.cod_planilla.trim() : "");
                $("#situacion").val(info.cod_situacion ? info.cod_situacion.trim() : "");
                $("#grupos").val(info.codGrupo ? info.codGrupo.trim() : "");
                $("#condicion").val(info.condicion ? info.condicion.trim() : "");
                $("#bancoCTS").val(info.codbancoCTS ? info.codbancoCTS.trim() : "");
                $("#ctaCTS").val(info.ctaCts ? info.ctaCts.trim() : "");
                $("#bancoSueldo").val(info.codBancoSueldo ? info.codBancoSueldo.trim() : "");
                $("#ctaSueldo").val(info.CtaCte ? info.CtaCte.trim() : "");
                $("#valorXhora").val(info.valhora ? info.valhora.trim() : "");


                $("#btn_modal").addClass("btn-warning").removeClass("btn-primary")
                $("#btn_modal").html("EDITAR PERSONAL");
                $("#tituloModal").html("ACTUALIZAR PERSONAL");
                $("#modal__agregar__empleador").modal({ backdrop: 'static', keyboard: false });
            }else{

            }
        },
        error: function(error){
            /* console.log('Hay un error: ');
            console.log(error); */
        }
    });

}
$('#form__agregar__empleador').submit(function(e) {
    e.preventDefault();
    
    const cod_emp = $("#codigoPersonal").val();
    const apellidoP = $("#apPaterno").val();
    const apellidoM = $("#apMaterno").val();
    const nombres = $("#nombres").val();
    const fecnaci = $("#fechaNacimiento").val();
    const lugnaci = $("#lugNacimiento").val();
    const dni = $("#numDoc").val();
    const carnesalud = $("#carnetEssalud").val();
    const fecinsalud = $("#fechaEssalud").val();
    const tippenjub = $("#checkPensionJ1").is(":checked") ? "ONP" : "AFP";
    const codafp = tippenjub === "ONP" ? "5" : $("#nombreAseguradoraAFP").val();
    const cuspp = $("#cuspp").val();
    const seguroEssalud = (tippenjub === "ONP") ? 0 : ($("#checkEssalud").is(":checked") ? 1 : 0);
    const eps = (tippenjub === "ONP") ? 0 : ($("#checkEps").is(":checked") ? 1 : 0);
    const tipComision = tippenjub === "ONP" ? null : $("#tipoComis").val();
    const carnetextr = $("#carnetExt").val();
    const pasaporte = $("#pasaporte").val();
    const nacionalid = $("#nacionalidad").val();
    const telfonos = $("#telf").val();
    const correo = $("#email").val();
    const brevete = $("#brevete").val();
    const sexo = $("#sexo").val();
    const estadocivil = $("#estadoCivil").val();
    const direccion = $("#direccion").val();
    const cod_dist = $("#distrito").val();
    const tipoDoc = $("#tipoDoc").val();
    const cod_profesion = $("#profesion").val();
    const bachiller = $("#bachiller").is(":checked") ? "S" : "N";
    const titulado = $("#titulado").is(":checked") ? "S" : "N";
    const maestria = $("#maestria").is(":checked") ? "S" : "N";
    const doctorado = $("#doctorado").is(":checked") ? "S" : "N";
    const especializacion = $("#especializacion").is(":checked") ? "S" : "N";
    const sede = $("#sede").val();
    const svl = (tippenjub === "ONP") ? 0 : ($("#checkVidaLeyAnual").is(":checked") ? 1 : 0);
    const svlm = (tippenjub === "ONP") ? 0 : ($("#checkVidaLeyBiMensual").is(":checked") ? 1 : 0);
    const fecingreso = $("#fechaIngreso").val();
    const cod_cargo = $("#cargoOcu").val();
    const cod_ofi = $("#empAreas").val();
    const cod_local = $("#empleadorIns").val();
    const verificarPreLocal = $("#empleadorIns_pre").val();
    const cod_local_pre = (cod_emp === "0" || verificarPreLocal === null) ? $("#empleadorIns").val() : $("#empleadorIns_pre").val();
    const condicion = $("#condicion").val();
    const feccese = $("#fechaCese").val();
    const fecplanilla = $("#fecPlanillaReal").val();
    const fechaIngCorp = $("#fechaIngCorp").val();
    const cod_planilla = $("#planilla").val();
    const cod_situacion = $("#situacion").val();
    const ruc = null;
    const feciniContrato = $("#fechaInicioContrato").val();
    const fecfinContrato = $("#fechaFinalContrato").val();
    const motivoCese = $("#motivoCese").val();
    const codbancoCTS = $("#bancoCTS").val();
    const ctaCTS = $("#ctaCTS").val();
    const codbancoSueldo = $("#bancoSueldo").val();
    const codGrupo = $("#grupos").val();
    const ctaCte = $("#ctaSueldo").val();
    const valhora = $("#valorXhora").val();
    
    $.ajax({
        type: 'POST',
        url: path + "planilla/personal",
        data: {
            opcion: "RegistrarPersonal",
            cod_emp: cod_emp,
            apellidoP: apellidoP,
            apellidoM: apellidoM,
            nombres: nombres,
            fecnaci: fecnaci,
            lugnaci: lugnaci,
            dni: dni,
            carnesalud: carnesalud,
            fecinsalud: fecinsalud,
            tippenjub: tippenjub,
            codafp: codafp,
            cuspp: cuspp,
            seguroEssalud: seguroEssalud,
            eps: eps,
            tipComision: tipComision,
            carnetextr: carnetextr,
            pasaporte: pasaporte,
            nacionalid: nacionalid,
            telfonos: telfonos,
            correo: correo,
            brevete: brevete,
            sexo: sexo,
            estadocivil: estadocivil,
            direccion: direccion,
            cod_dist: cod_dist,
            tipoDoc: tipoDoc,
            cod_profesion: cod_profesion,
            bachiller: bachiller,
            titulado: titulado,
            maestria: maestria,
            doctorado: doctorado,
            especializacion: especializacion,
            sede: sede,
            svl: svl,
            svlm: svlm,
            fecingreso: fecingreso,
            cod_cargo: cod_cargo,
            cod_ofi: cod_ofi,
            cod_local: cod_local,
            cod_local_pre: cod_local_pre,
            condicion: condicion,
            feccese: feccese,
            fecplanilla: fecplanilla,
            fechaIngCorp: fechaIngCorp,
            cod_planilla: cod_planilla,
            cod_situacion: cod_situacion,
            ruc: ruc,
            feciniContrato: feciniContrato,
            fecfinContrato: fecfinContrato,
            motivoCese: motivoCese,
            codbancoCTS: codbancoCTS,
            ctaCTS: ctaCTS,
            codbancoSueldo: codbancoSueldo,
            codGrupo: codGrupo,
            ctaCte: ctaCte,
            valhora: valhora
        },
        success: function(response) {
            Notiflix.Notify.Success('Se registró correctamente el personal.');
            document.getElementById("seccionDatosFamiliares").style.display = "block";
            document.body.style.overflow = 'hidden';
            almacenarCodigoPersonal(cod_emp)
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
});
function limpiarFormulario(valor) {
    $('#form__agregar__empleador').find('input[type=text], input[type=email], input[type=hidden], input[type=number]').val('');
    if(valor === true){
        $('#form__agregar__empleador').find('input[type=hidden]').val('0');
        document.getElementById("seccionDatosFamiliares").style.display = "none";
        document.getElementById('fechaCese').disabled = true;
    }else{
        $('#form__agregar__empleador').find('input[type=hidden]').val("");
        document.getElementById("seccionDatosFamiliares").style.display = "block";
        document.getElementById('fechaCese').disabled = false;
    }
    
    var today = new Date();
    var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDay());
    var formattedDate = firstDayOfMonth.toISOString().slice(0, 10);
    $('#form__agregar__empleador').find('input[type="date"]').val(formattedDate);
    $('#form__agregar__empleador').find('input[type=checkbox]').prop('checked', false);
    $('#form__agregar__empleador').find('#checkPensionJ2').prop('checked', true);
    toggleCheckbox('<input class="form-check-input" type="checkbox" id="checkPensionJ2" name="checkPensionJ2" onclick="toggleCheckbox(this, "checkPensionJ1"); toggleDependentFields();">', 'checkPensionJ2') 
    $('#form__agregar__empleador').find('#distrito').val('01');
    $('#form__agregar__empleador').find('#empleadorIns_pre').val('');
    $('#form__agregar__empleador').find('#tipoDoc').val('00');
    $('#form__agregar__empleador').find('#sede').val('L009');
    $('#form__agregar__empleador').find('#sexo').val('F');
    $('#form__agregar__empleador').find('#estadoCivil').val('Soltero');
    $('#form__agregar__empleador').find('#nacionalidad').val('Peruano');
    $('#form__agregar__empleador').find('#nombreAseguradoraAFP').val('1');
    $('#form__agregar__empleador').find('#tipoComis').val('Flujo');
    $('#form__agregar__empleador').find('#profesion').val('10');
    $('#form__agregar__empleador').find('#motivoCese').val('Ninguno');
    $('#form__agregar__empleador').find('#empAreas').val('1');
    $('#form__agregar__empleador').find('#cargoOcu').val('1');
    $('#form__agregar__empleador').find('#empleadorIns').val('01');
    $('#form__agregar__empleador').find('#planilla').val('1');
    $('#form__agregar__empleador').find('#situacion').val('1');
    $('#form__agregar__empleador').find('#grupos').val('Ninguno');
    $('#form__agregar__empleador').find('#condicion').val('Plazo Indet.');
    $('#form__agregar__empleador').find('#bancoCTS').val('1');
    $('#form__agregar__empleador').find('#bancoSueldo').val('1');
}

function almacenarCodigoPersonal(cod_emp) {
    if(cod_emp === '0'){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: path + "planilla/personal",
            data: {opcion: 'ObtenerEmp'},
            beforeSend: function () {
            },
            success: function(response) {
                codigoPersonalSeleccionado = response.data
                listadoFamiliar(codigoPersonalSeleccionado)
            }
        });
    }else{
        codigoPersonalSeleccionado = cod_emp;
        listadoFamiliar(codigoPersonalSeleccionado)
    }
    
}

function listadoFamiliar(cod_emp) {
    if ($.fn.DataTable.isDataTable('#tablaFamiliar')) {
        $('#tablaFamiliar').DataTable().destroy();
    }

    tablaFamiliar = $('#tablaFamiliar').DataTable({
        destroy: true,
        searching: true,
        processing: false,
        responsive: true,
        ordering: false,
        lengthMenu: [
            [20, 100, -1],
            [20, 100, 'TODO']
        ],
        ajax: {
            url: path + 'planilla/personal',
            type: 'POST',
            data: {
                cod_emp: cod_emp,
                opcion: 'listarFamilia'
            },
            beforeSend: function() {
                $('.text-loader').text('Consultando datos, por favor espere...');
                $("#modalLoader").modal();
            },
            dataSrc: function (data) {
                return data.listar;
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            }
        },
        columnDefs: [
            { targets: '_all', className: 'celda-centrada' }
        ],
        columns: [
            { data: 'Orden' },
            { data: 'Nombre' },
            { data: 'parentesco' },
            { data: 'FechaNac' },
            { data: 'ocupacion' },
            { data: 'Documento' },
            {
                data: null,
                render: function (data) {
                    return "<button class='btn boton-tabla btn-warning' id='editarDatosFamiliar' type='button' onclick=\"editarFamiliar('" + data.cod_emp.trim() + "', '" + data.Orden.trim() + "');\"' title='Editar Familiar'><span class='icon-pencil'></span></button>&nbsp;&nbsp;&nbsp;";
                }
            }
        ],
        language: {
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ registros",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "No se encontraron registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            search: "Buscar:",
            infoThousands: ",",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            },
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros"
        }
    });
}

$("#agregarDatosFamiliar").click(function() {
    limpiarFormulario2(true)
    $("#btn_modalFamiliar").addClass("btn-primary").removeClass("btn-warning");
    $("#btn_modalFamiliar").html("REGISTRAR FAMILIAR");
    $("#tituloModalFamiliar").html("AGREGAR FAMILIAR");
    $("#modalAgregarDatosFamiliar").modal({ backdrop: 'static', keyboard: false });
});


$('#formRegistrarFamiliar').submit(function(e) {
    e.preventDefault();

    var cod_empFamiliar = $("#cod_empFamiliar").val();
    
    var cod_emp = (cod_empFamiliar === "0") ? codigoPersonalSeleccionado : $("#cod_empFamiliar").val()
    
    const formData = {
        opcion: "RegistrarFamiliar",
        cod_emp: cod_emp, 
        orden:$("#ordenFamiliar").val(),
        nomFamiliar: $("#nomFamiliar").val(),
        apFamiliar: $("#apFamiliar").val(),
        fnFamiliar: $("#fnFamiliar").val(),
        ocupacionFamiliar: $("#ocupacionFamiliar").val(),
        numDocFamiliar: $("#numDocFamiliar").val(),
        parentesco: $("#parentesco").val()
    };

    $.ajax({
        type: 'POST',
        url: path + "planilla/personal",
        data: formData,
        beforeSend: function () {
        },
        success: function(response) {
            $("#modalAgregarDatosFamiliar").modal("hide");
            almacenarCodigoPersonal(cod_emp)
            Notiflix.Notify.Success('Se registró correctamente el familiar.');
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
});

function editarFamiliar(cod_emp,orden){
    limpiarFormulario2(false)
    $.ajax({
        type: 'POST',
        url: path + "planilla/personal",
        dataType: 'json',
        data: {
            opcion: 'ObtenerDatos',
            cod_emp: cod_emp,
            orden: orden
        },
        beforeSend: function () {
        },
        success: function(response) {
            
            if (response.respuesta == "success") {
                /* console.log(response) */
                const info = response.data[0];
                /* console.log(info) */
                $("#cod_empFamiliar").val(info.cod_emp.trim());
                $("#ordenFamiliar").val(info.Orden.trim());
                $("#numDocFamiliar").val(info.dni ? info.dni.trim() : "");
                $("#nomFamiliar").val(info.nombres.trim());
                $("#apFamiliar").val(info.Apellidos.trim());
                $("#parentesco").val(info.parentesco.trim());
                $("#ocupacionFamiliar").val(info.ocupacion.trim());
                $("#fnFamiliar").val(info.fecnaci ? info.fecnaci.substr(0, 10) : "");
                $("#btn_modalFamiliar").addClass("btn-warning").removeClass("btn-primary");
                $("#btn_modalFamiliar").html("EDITAR FAMILIAR");
                $("#tituloModalFamiliar").html("EDITAR FAMILIAR");
                $("#modalAgregarDatosFamiliar").modal({ backdrop: 'static', keyboard: false });
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

function limpiarFormulario2(valor) {
    $('#formRegistrarFamiliar').find('input[type=text], input[type=email], input[type=hidden], input[type=number]').val('');
    if(valor === true){
        $('#formRegistrarFamiliar').find('#ordenFamiliar').val('0');
        almacenarCodigoPersonal('0')
        $('#formRegistrarFamiliar').find('#cod_empFamiliar').val(codigoPersonalSeleccionado);
    }else{
        $('#formRegistrarFamiliar').find('input[type=hidden]').val("");
    }
    var today = new Date();
    var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDay());
    var formattedDate = firstDayOfMonth.toISOString().slice(0, 10);
    $('#formRegistrarFamiliar').find('input[type="date"]').val(formattedDate);
    $('#formRegistrarFamiliar').find('#parentesco').val('1');
}