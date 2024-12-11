let codigoPersonalSeleccionado = '';
let tablaPersonalPolicial;

document.addEventListener("DOMContentLoaded", () => {
    cargarUbicacion("new");
    actualizarEstadoFechaCese();
});

$(document).ready(function() {
    Notiflix.Loading.Init({
        clickToClose: true
    });
    $("#modalPersonalPolicial").on('shown.bs.modal', function () {
        document.body.style.overflow = 'hidden';
    });

    $("#modalPersonalPolicial").on('hidden.bs.modal', function () {
        document.body.style.overflow = 'revert-layer';
        $('body').css('padding-right', '0');
        if(tablaPersonalPolicial){
            tablaPersonalPolicial.ajax.reload(null, false)
        }else{
            console.log('')
        }
    });
    
});

document.addEventListener('click', (e) => {

    if (e.target.matches('#buscarPersonalPolicial')) {
        document.getElementById('btnGenerarContrato').disabled = false;
        listadoPersonal()
    }
    if (e.target.matches('#btnGenerarContrato')) {
        descargarPersonalPolicialWord()
    }
    if (e.target.matches('#agregarContrato')) {
        limpiarFormulario2(true)
        $("#modalAgregarContratos").modal("show")
    }
    if (e.target.matches('#btnAgregarPersonalPolicial')) {
        limpiarFormulario(true)
        $("#modalPersonalPolicial").modal("show")
    }
    if (e.target.matches('#cerrar__modal__agregar')) {        
        $("#seccionContratos").hide();
        $('#modalPersonalPolicial')[0].reset();        
    }
});

function actualizarEstadoFechaCese() {
    var checkFechaCese = document.getElementById('checkFechaCese');
    var fechaCese = document.getElementById('fechaCese');
    
    if (checkFechaCese.checked) {
        fechaCese.disabled = true;
    } else {
        fechaCese.disabled = false;  
    }
}
document.getElementById('checkFechaCese').addEventListener('change', actualizarEstadoFechaCese);

function listadoPersonal() {

    var filtPersonalPolicial = $("#filtPersonalPolicial").val();

    if ($.fn.DataTable.isDataTable('#tablaPersonal')) {
        $('#tablaPersonalPolicial').DataTable().destroy();
    }

    tablaPersonalPolicial = $('#tablaPersonalPolicial').DataTable({
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
            url: path + 'egresos/personalPolicial',
            type: 'POST',
            data: {
                filtPersonalPolicial: filtPersonalPolicial,
                opcion: 'listar'
            },
            beforeSend: function() {
                $('.text-loader').text('Consultando datos, por favor espere...');
                $("#modalLoader").modal();
            },
            dataSrc: function (data) {
                return data.listarEmpleados;
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            }
        },
        columnDefs: [
            { targets: '_all', className: 'celda-centrada' }
        ],
        columns: [
            { data: 'cod_emp' },
            { data: 'TipoDoc' },
            { data: 'NumeroDoc' },
            { data: 'Empleado' },
            { data: 'Pais' },
            { data: 'Departamento' },
            { data: 'Provincia' },
            { data: 'Distrito' },
            { data: 'Direccion' },
            { data: 'FechaNacimiento' },
            { data: 'fechaIngreso' },
            {
                data: null,
                render: function (data) {
                    return "<button class='btn boton-tabla btn-warning' type='button' id='btn__editar__empleador' onclick='editarPersonal(\"" + data.cod_emp + "\");' title='Ver solicitud'><span class='icon-pencil'></span></button>&nbsp;&nbsp;&nbsp;" +
                        "<button class='btn boton-tabla btn-primary' type='button' onclick='descargarWord(\"" + data.cod_emp + "\");' title='Descargar Word'><span class='icon-file-word'></span></button>";
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

function descargarPersonalPolicialWord() {
    var filtPersonalPolicial = $("#filtPersonalPolicial").val();
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de generar los contratos?',
        'Si',
        'No',
        function(){
            $.ajax({
                url: path + "egresos/personalPolicial",
                type: "POST",
                dataType:"JSON",
                data: {
                    opcion: "generarContratoPersonalPolicialWord",
                    cod_emp: filtPersonalPolicial
                },
                beforeSend: function () {
                    $('.text-loader').text('GENERANDO CONTRATOS, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                complete : function(){
                    $("#modalLoader").modal("hide"); 
                },
                success: function (response) {
                    console.log(response)
                    if(response.respuesta === "success"){

                        let $a = $("<a>");
                        $a.attr("href",response.word);
                        $("body").append($a);
                        $a.attr("download","contratos.docx");
                        $a[0].click();
                        $a.remove();

                        Notiflix.Notify.Success("OPERACIÓN ÉXITOSA.");
                       
                    }else if(response.respuesta === "warning"){

                        $("#modalLoader").modal("hide"); 
                        Notiflix.Notify.Warning(response.error.toUpperCase());  
                        
                    }else{

                        $("#modalLoader").modal("hide"); 
                        Notiflix.Report.Failure('ERROR INESPERADO',response.error,"Cerrar"); 

                    }
                                                 
                },
            });
        }
        ,function(){ 
        }
    );
}

function descargarWord(cod_emp) {
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de generar el contrato?',
        'Si',
        'No',
        function(){
            $.ajax({
                url: path + "egresos/personalPolicial",
                type: "POST",
                dataType:"JSON",
                data: {
                    opcion: "generarContratoWord",
                    cod_emp: cod_emp
                },
                beforeSend: function () {
                    $('.text-loader').text('GENERANDO CONTRATOS, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                complete : function(){
                    $("#modalLoader").modal("hide"); 
                },
                success: function (response) {
                    console.log(response)
                    if(response.respuesta === "success"){

                        let $a = $("<a>");
                        $a.attr("href",response.word);
                        $("body").append($a);
                        $a.attr("download","contratos.docx");
                        $a[0].click();
                        $a.remove();

                        Notiflix.Notify.Success("OPERACIÓN ÉXITOSA.");
                       
                    }else if(response.respuesta === "warning"){

                        $("#modalLoader").modal("hide"); 
                        Notiflix.Notify.Warning(response.error.toUpperCase());  
                        
                    }else{

                        $("#modalLoader").modal("hide"); 
                        Notiflix.Report.Failure('ERROR INESPERADO',response.error,"Cerrar"); 

                    }
                                                 
                },
            });
        }
        ,function(){ 
        }
    );
}

function editarPersonal(cod_emp) {
    limpiarFormulario(false)
    almacenarCodigoPersonal(cod_emp)
    $.ajax({
        url: path + 'egresos/personalPolicial',
        method: "POST",
        dataType: 'json',
        data: {
            cod_emp: cod_emp,
            opcion: "ObtenerDatos"
        },
        success: function(data){

            /* console.log(data) */
            if (data.respuesta == "success") {
                const info = data.data[0];
                /* console.log("info: ",info) */
                $("#codigoPersonal").val(info.cod_emp.trim());
                $("#apPaterno").val(info.ApellidoPaterno ? info.ApellidoPaterno.trim() : "");
                $("#apMaterno").val(info.ApellidoMaterno ? info.ApellidoMaterno.trim() : "");
                $("#nombres").val(info.Nombres ? info.Nombres.trim() : "");
                $("#fechaNacimiento").val(info.FechaNacimiento ? info.FechaNacimiento.substr(0, 10) : "");
                $("#tipoDoc").val(info.TipoDoc ? info.TipoDoc.trim() : "");
                $("#numDoc").val(info.NumeroDoc ? info.NumeroDoc.trim() : "");

                cargarUbicacion('new', true).then((result) => {
                    if(result == true){
                        $("#paisM").val(info.idPais.trim());
                        cargarUbicacion('new', false, true).then((result) => {
                            if(result == true){
                                $("#departamentoM").val(info.iddepartamento.trim());     
                                cargarUbicacion('new', false, false, true).then((result) => {
                                    if(result == true){
                                        $("#provinciaM").val(info.idProvincia.trim());   
                                        cargarUbicacion('new', false, false, false, true).then((result) => {
                                            if(result == true){
                                                $("#distritosM").val(info.idDistrito.trim());
                                            }
                                        });               
                                    }
                                });                   
                            }
                        });          
                    }
                });

                $("#direccion").val(info.Direccion ? info.Direccion.trim() : "");
                $("#fechaIngreso").val(info.FechaIngreso ? info.FechaIngreso.substr(0, 10) : "");
                $("#fechaCese").val(info.FechaCese ? info.FechaCese.substr(0, 10) : "");
                if(info.FechaCese !=null){
                    var checkFechaCese2 = document.getElementById('checkFechaCese');
                    checkFechaCese2.checked = false;
                    document.getElementById('fechaCese').disabled = false;
                }
                $("#modalPersonalPolicial").modal({ backdrop: 'static', keyboard: false });
            }else{

            }
        },
        error: function(error){
            /* console.log('Hay un error: ');
            console.log(error); */
        }
    });

}

$('#formAgregarPersonalPolicial').submit(function (e) {
    e.preventDefault();
    const checkVerificar = $("#checkFechaCese").is(":checked") ? 0 : 1;
    var form = $(this).serializeArray();
    form.push({ name: "checkVerificar", value: checkVerificar });
    form.push({ name: "opcion", value: "RegistrarPersonal" });
    console.log("data", form)

    $.ajax({
        url: path + "egresos/personalPolicial",
        type: "POST",
        data: form,
        beforeSend: function () {
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function (data) {
            $("#modalLoader").modal("hide");
            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {
                Notiflix.Notify.Success(datos.msj);
                var cod_emp = $('#codigoPersonal').val()
                almacenarCodigoPersonal(cod_emp)
                $("#seccionContratos").show();
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

function almacenarCodigoPersonal(cod_emp) {
    if(cod_emp === '0'){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: path + "egresos/personalPolicial",
            data: {opcion: 'ObtenerEmp'},
            beforeSend: function () {
            },
            success: function(response) {
                codigoPersonalSeleccionado = response.data
                listadoContrato(codigoPersonalSeleccionado)
            }
        });
    }else{
        codigoPersonalSeleccionado = cod_emp;
        listadoContrato(codigoPersonalSeleccionado)
    }
    
}

function listadoContrato(cod_emp) {
    if ($.fn.DataTable.isDataTable('#tablaContrato')) {
        $('#tablaContrato').DataTable().destroy();
    }

    tablaContrato = $('#tablaContrato').DataTable({
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
            url: path + 'egresos/personalPolicial',
            type: 'POST',
            data: {
                cod_emp: cod_emp,
                opcion: 'listarContratos'
            },
            beforeSend: function() {
                /* $('.text-loader').text('Consultando datos, por favor espere...');
                $("#modalLoader").modal(); */
            },
            dataSrc: function (data) {
                return data.listar;
            },
            complete: function () {
                /* $("#modalLoader").modal("hide"); */
            }
        },
        columnDefs: [
            { targets: '_all', className: 'celda-centrada' }
        ],
        columns: [
            { data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                } 
            },
            { data: 'cod_emp' },
            { data: 'Moneda' },
            { data: 'Monto' },
            { data: 'FechaInicio' },
            { data: 'FechaTermino' },
            { data: 'ObjetoContrato' },
            {
                data: null,
                render: function (data) {
                    return "<button class='btn boton-tabla btn-warning' id='editarContrato' type='button' onclick=\"editarContrato('" + data.Op.trim() + "');\"' title='Editar Contrato'><span class='icon-pencil'></span></button>&nbsp;&nbsp;&nbsp;";
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

$('#formRegistrarContrato').submit(function(e) {
    e.preventDefault();

    var cod_empContrato = $("#cod_empContrato").val();
    
    var cod_emp = (cod_empContrato === "0") ? codigoPersonalSeleccionado : $("#cod_empContrato").val()
    
    const formData = {
        opcion: "RegistrarContrato",
        op: $("#op").val(),
        cod_emp: cod_emp, 
        idMoneda: $("#tipoMoneda").val(),
        monto: $("#monto").val(),
        FechaIncio: $("#fechaInicioContrato").val(),
        FechaTermino: $("#fechaTerminoContrato").val(),
        ObjetoContrato: $("#objetoContrato").val()
    };

    if ($("#monto").val().trim() === "") {
        Notiflix.Notify.Failure('Por favor, complete el campo monto.');
        return;
    }

    $.ajax({
        type: 'POST',
        url: path + "egresos/personalPolicial",
        data: formData,
        beforeSend: function () {
        },
        success: function(response) {
            $("#modalAgregarContratos").modal("hide");
            almacenarCodigoPersonal(cod_emp);
            Notiflix.Notify.Success('Se registró correctamente el contrato.');
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
});


function editarContrato(op){
    limpiarFormulario2(false)
    $.ajax({
        type: 'POST',
        url: path + "egresos/personalPolicial",
        dataType: 'json',
        data: {
            opcion: 'ObtenerDatosDetalle',
            op: op
        },
        beforeSend: function () {
        },
        success: function(response) {
            
            if (response.respuesta == "success") {
                const info = response.data[0];
                $("#op").val(info.Op.trim());
                $("#cod_empContrato").val(info.cod_emp.trim());
                $("#tipoMoneda").val(info.idMoneda);
                $("#monto").val(info.monto.trim());
                $("#objetoContrato").val(info.ObjetoContrato.trim());
                $("#fechaInicioContrato").val(info.FechaInicio ? info.FechaInicio.substr(0, 10) : "");
                $("#fechaTerminoContrato").val(info.FechaTermino ? info.FechaTermino.substr(0, 10) : "");
                $("#modalAgregarContratos").modal({ backdrop: 'static', keyboard: false });
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
$("#paisM").change(function () {
    cargarUbicacion("new", false);
})

$("#departamentoM").change(function () {
    cargarUbicacion("new", false, false);
})

$("#provinciaM").change(function () {
    cargarUbicacion("new", false, false, false);
})

$("#distritosM").change(function () {
    cargarUbicacion("new", false, false, false, false);
})
/////////////////////////////////////////////////////////////////////////
$("#editar_cod_pais").change(function () {
    cargarUbicacion("edit", false);
})

$("#editar_cod_departamento").change(function () {
    cargarUbicacion("edit", false, false);
})

$("#editar_provincia").change(function () {
    cargarUbicacion("edit", false, false, false);
})

$("#editar_distrito").change(function () {
    cargarUbicacion("edit", false, false, false, false);
})

function limpiarFormulario(valor) {
    if(valor === true){
        $("#codigoPersonal").val('0');
        document.getElementById("seccionContratos").style.display = "none";
        document.getElementById('fechaCese').disabled = true;
        var checkFechaCese = document.getElementById('checkFechaCese');
        checkFechaCese.checked = true;
        checkFechaCese.disabled = true;
        $("#paisM").val("20");
        cargarUbicacion("new", false);
        $("#btn_modal").addClass("btn-primary").removeClass("btn-warning");
        $("#btn_modal").html("REGISTRAR PERSONAL");
        $("#tituloModal").html("REGISTRAR NUEVO PERSONAL");
    }else{
        $("#codigoPersonal").val('');
        document.getElementById("seccionContratos").style.display = "block";
        var checkFechaCese2 = document.getElementById('checkFechaCese');
        checkFechaCese2.checked = true;
        checkFechaCese2.disabled = false;
        document.getElementById('fechaCese').disabled = true;
        $("#btn_modal").addClass("btn-warning").removeClass("btn-primary");
        $("#btn_modal").html("EDITAR PERSONAL");
        $("#tituloModal").html("ACTUALIZAR PERSONAL");
    }
    var today = new Date();
    var formattedDate = today.toISOString().slice(0, 10);
    $("#tipoDoc").val('01');
    $("#apPaterno").val('');
    $("#apMaterno").val('');
    $("#nombres").val('');
    $("#fechaNacimiento").val(formattedDate);
    $("#numDoc").val('');
    $("#direccion").val('');
    $("#fechaIngreso").val(formattedDate);
    $("#fechaCese").val(formattedDate);
}
function limpiarFormulario2(valor) {
    if(valor === true){
        $("#op").val('0');
        almacenarCodigoPersonal('0')
        $("#cod_empContrato").val(codigoPersonalSeleccionado);
        $("#btn_modalContrato").addClass("btn-primary").removeClass("btn-warning");
        $("#btn_modalContrato").html("REGISTRAR CONTRATO");
        $("#tituloModalContrato").html("REGISTRAR CONTRATO");
    }else{
        $("#op").val('');
        $("#cod_empContrato").val('');
        $("#btn_modalContrato").addClass("btn-warning").removeClass("btn-primary");
        $("#btn_modalContrato").html("EDITAR CONTRATO");
        $("#tituloModalContrato").html("ACTUALIZAR CONTRATO");
    }
    var today = new Date();
    var formattedDate = today.toISOString().slice(0, 10);
    $("#fechaInicioContrato").val(formattedDate);
    $("#fechaTerminoContrato").val(formattedDate);
    $("#tipoMoneda").val('1');
    $("#monto").val('');
    $("#objetoContrato").val('');
}



//FUNCIONES PAISES - DEPARTAMENTO - PROVINCIA - DISTRITOS
async function cargarUbicacion(tipo_, pais_ = true, departamento_ = true, provincia_ = true, distrito_ = true) {

    const headers = { "Content-Type": "application/json", 'Accept': 'application/json' };

    //PAISES
    if (pais_) {
        let paises = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarPaises" })
        });
        paises = await paises.json();
        $("#paisM").html("");
        $("#editar_cod_pais").html("");
        paises.paises.forEach(pais => {
            $("#paisM").append(`<option value="${pais.ID}" ${pais.ID === "20" ? "selected" : ""} > ${pais.Nombre.toUpperCase()} </option>`);
            $("#editar_cod_pais").append(`<option value="${pais.ID}" ${pais.ID === "20" ? "selected" : ""} > ${pais.Nombre.toUpperCase()} </option>`);
        });
    }

    //DEPARTAMENTOS
    if (departamento_) {

        pais_ = tipo_ === "new" ? $("#paisM").val() : $("#editar_cod_pais").val();

        let departamentos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDepartamentos", pais: pais_ })
        });
        departamentos = await departamentos.json();
        $("#departamentoM").html("");
        $("#editar_cod_departamento").html("");
            departamentos.departamentos.forEach(departamento => {
                $("#departamentoM").append(`<option value="${departamento.ID}" ${departamento.ID === "23" ? "selected" : ""} > ${departamento.Nombre.toUpperCase()} </option>`);
                $("#editar_cod_departamento").append(`<option value="${departamento.ID}" ${departamento.ID === "23" ? "selected" : ""} > ${departamento.Nombre.toUpperCase()} </option>`);
            });
    }

    //PROVINCIAS
    if (provincia_) {

        departamento_ = tipo_ === "new" ? $("#departamentoM").val() : $("#editar_cod_departamento").val();

        let provincias = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarProvincias", departamento: departamento_ })
        });
        provincias = await provincias.json();
        $("#provinciaM").html("");
        $("#editar_provincia").html("");
        provincias.provincias.forEach(provincia => {
            $("#provinciaM").append(`<option value="${provincia.ID}" ${provincia.ID === "20" ? "selected" : ""} > ${provincia.Nombre.toUpperCase()} </option>`);
            $("#editar_provincia").append(`<option value="${provincia.ID}" ${provincia.ID === "20" ? "selected" : ""} > ${provincia.Nombre.toUpperCase()} </option>`);
        });
    }

    //DISTRITOS
    if (distrito_) {

        provincia_ = tipo_ === "new" ? $("#provinciaM").val() : $("#editar_provincia").val();

        let distritos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDistritos", provincia: provincia_ })
        });
        distritos = await distritos.json();
        $("#distritosM").html("");
        $("#editar_distrito").html("");
        distritos.distritos.forEach(distrito => {
            $("#distritosM").append(`<option value="${distrito.ID}" > ${distrito.Nombre.toUpperCase()} </option>`);
            $("#editar_distrito").append(`<option value="${distrito.ID}" > ${distrito.Nombre.toUpperCase()} </option>`);
        });
    }

    return true;

}