$(document).ready(function(){

    //setFechaInputDate();
    
});

$('#btn_apicuotas').click(function(){
    $.ajax({
        url: path + "caja/consultaCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            opcion: "updateApiCu"
        },
        success: function(data){
            datax = data.id_alumno;
            datax.forEach(function(valor, index, array) {
                setTimeout(function(){
                    id = datax[index];
                    cod_alumno = id.cod_alumno;
                    $.ajax({
                        url: path + "caja/consultaCuotas",
                        method: "POST",
                        dataType: 'json',
                        data: {
                            id: cod_alumno,
                            opcion: "updateApiCu_foreach"
                        },
                        success: function(data){
                            
                            console.log((index+1) , "Alumno", cod_alumno , "->", data.respuesta)
                        }
                    });

                    //self.insertDesignJsonObject(obj, index);
                }, index * 500);
            });

                  
        }
    });
})

let checkPago = false;

const meses = {
    '01' : 'ENERO',
    '02' : 'FEBRERO',
    '03' : "MARZO",
    '04' : "ABRIL",
    '05' : "MAYO",
    '06' : "JUNIO",
    '07' : "JULIO",
    '08' : "AGOSTO",
    '09' : "SEPTIEMBRE",
    '10' : "OCTUBRE",
    '11' : "NOVIEMBRE",
    '12' : "DICIEMBRE"
};

$("#modalPagarCuota").on("hidden.bs.modal", function () {
    checkPago = false;
    $('#alertaPago').hide();
});

document.addEventListener('click', e => {
    if (e.target.matches('#btnConsultar')) {
        serverSide();
    }

    if(e.target.matches('#btnAceptarVerPago')) {
        $("#modalVerPago").modal("hide");
    }

    if(e.target.matches('#btnCancelar_anular')) {
        $("#modalEliminarCuota").modal("hide");
    }

    if(e.target.matches('#btnCancelar_habilitar')) {
        $("#modalHabilitarCuota").modal("hide");
    }

    if(e.target.matches('#btnCancelarPagarCuota')) {
        $("#modalPagarCuota").modal("hide");
    }

    if(e.target.matches('#btnAnularCuota_anular')) {

        Notiflix.Confirm.Show(
            'Confirmación',
            '¿Desea anular la cuota seleccionada?',
            'Si',
            'No',
            function(){
                let id = document.getElementById('baja_idCuota').value;
                modificarCuota(0, id);
                $("#modalEliminarCuota").modal("hide");
            },
            function(){

            }
        );

    }

    if(e.target.matches('#btnHabilitarCuota_anular')) {

        Notiflix.Confirm.Show(
            'Confirmación',
            '¿Desea habilitar la cuota seleccionada?',
            'Si',
            'No',
            function(){
                let id = document.getElementById('alta_idCuota').value;
                modificarCuota(1, id);
                $("#modalHabilitarCuota").modal("hide");
            },
            function(){

            }
        );

    }

    if(e.target.matches('#btnPagarCuota')) {
        
        if (!checkPago) {
            $('#alertaPago').show('500');
            checkPago = true;
        } else{

            Notiflix.Confirm.Show(
                'Confirmación',
                '¿Desea cancelar la cuota seleccionada?',
                'Si',
                'No',
                function(){
                    pagarCuota();
                },
                function(){
                   
                }
            );

        }

    }
})

document.addEventListener('keydown', (e) => {

    if (e.target.matches('#inputAlumnoCodigo')) {
        if (e.key === 'Enter') {
            serverSide();
        }
    }

})

document.addEventListener('change', (e) => {
    if (e.target.matches('#selectEstado') || e.target.matches('#selectEstadoCuota')) {
        serverSide();
    }
})

function serverSide(){
    let f_inicio = document.getElementById('fechaDesde').value;
    let f_final = document.getElementById('fechaHasta').value;
    let alumno_codigo = document.getElementById('inputAlumnoCodigo').value;
    let estado = document.getElementById('selectEstado').value;
    let estadoCuota = document.getElementById('selectEstadoCuota').value;
    $('#tablaCuotas').dataTable().fnDestroy();
    $("#tablaCuotas").DataTable({
        searching: false,
        serverSide: true,
        // processing: true,
        ordering:  true,
        order: [[2,'desc']],
        lengthMenu: [
            [10, 25, 50, 100], 
            [10, 25, 50, 100]
        ],
        ajax: {
            url: path + "Caja/consultaCuotas",
            type: 'post',
            data: {
                f_inicio: f_inicio,
                f_final: f_final,
                alumno_codigo: alumno_codigo,
                estado: estado,
                estadoCuota: estadoCuota,
                opcion: 'consultaCuotas'
            },
            beforeSend: function(){
                $('.text-loader').text('Consultando datos, por favor espere...');
                $("#modalLoader").modal();
            },
            dataSrc: function(data){
                // console.log(data);
                return data.data;
            },
            complete: function(){
                $("#modalLoader").modal("hide");
            }
        },
        columnDefs: [
            {
                targets: [0,1,3,4,5,6,7,8,9,10],
                orderable: false
            },
            // {
            //     targets: [0, 1, 4, 5],
            //     searchable: false,
            //     className: 'celda-centrada'
            // }
        ],
        columns: [
            // { data: 'ID' },
            { 
                data: 'id',
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: 'codigoAlumno' },
            { data: 'nombreAlumno' },
            { data: 'dni'},
            { data: 'concepto' },
            { 
                data: 'periodoDeuda',
                className: 'celda-centrada',
                render: function(data){
                    return meses[data];
                }
            },
            { 
                data: 'anioDeuda',
                className: 'celda-centrada' 
            },
            { 
                data: 'fechaEmision',
                render: function(data){
                    fecha = data.substring(0,2) + '-' + data.substring(2,4) + '-' + data.substring(4,8);
                    return fecha;
                } 
            },
            { 
                data: 'fechaVencimiento',
                render: function(data){
                    fecha = data.substring(0,2) + '-' + data.substring(2,4) + '-' + data.substring(4,8);
                    return fecha;
                } 
            },
            {
                data: 'monto', 
                className: 'celda-centrada',               
            },
            { 
                data: {},
                className: 'celda-centrada',
                render: function(data){
                    
                    if(data.estadoPago === '1'){
                        clase = 'success';
                        texto = 'PAGADO';
                    } else{
                        clase = 'default';
                        texto = 'PENDIENTE';
                    }

                    if(data.cuotaActivo === 0){
                        clase = 'danger';
                        texto = 'ELIMINADO'
                    }
                    
                    return `<span class="label label-${clase}">${texto}</span>`;

                }
            },
            { 
                data: {},
                className: 'celda-centrada',
                render: function(data){
                    
                    if (data.estadoPago === '1') {
                        // dar de baja/alta, modificar, ver detalle de pagos
                        // return `<button class='btn boton-tabla boton-verde' data-id='${data.id}' type='button' onclick='verReportePDF(this)'><span class='icon-eye'></span></button>`;
                        return `<a class='btn boton-tabla boton-verde' data-id='${data.id}' title='Ver detalles pago' onclick='verPago(this)'><span class="icon-eye"></span></a>`;
                    } else{
                        let botones = '';
                        if (data.cuotaActivo === 1) {
                            // botones = `<a class='btn boton-tabla boton-rojo' data-id='${data.id}' title='Desactivar Cuota' onclick='verModalEliminarCuota(this)'><span class="icon-arrow-down"></span></a>
                            // <a class='btn boton-tabla boton-verde' data-id='${data.id}' title='Pagar Cuota' onclick='verModalPagarCuota(this)'><span class="icon-credit-card"></span></a>`;
                            botones = `<a class='btn boton-tabla boton-rojo' data-id='${data.id}' title='Desactivar Cuota' onclick='verModalEliminarCuota(this)'><span class="icon-arrow-down"></span></a>`;
                        } else{
                            botones = `<a class='btn boton-tabla boton-rojo' data-id='${data.id}' title='Activar Cuota'  onclick='verModalHabilitarCuota(this)'><span class="icon-arrow-up"></span></a>`;
                        }

                        return botones;
                        // return `<a class='btn boton-tabla boton-verde' data-id='${data.id}' onclick='verReportePDF(this)'><span class="icon-credit-card"></span></a>
                        //         <a class='btn boton-tabla boton-rojo' data-id='${data.id}' onclick='verAnularCuota(this)'><span class="icon-bin"></span></a>`;
                        
                    }

                }
            },

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

function pagarCuota(){
    let id = document.getElementById('pago-idCuota').value;
    let monto = parseInt(document.getElementById('pago-monto').value.substring(4));
    let mora = parseInt(document.getElementById('pago-mora').value.substring(4));
    
    $.ajax({
        url: path + "caja/consultaCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            id: id,
            monto: monto,
            mora: mora,
            opcion: "pagarCuota"
        },
        success: function(data){
            console.log(data);
            if (data.respuesta === 'success') {
                $("#tablaCuotas").DataTable().ajax.reload();
                $("#modalPagarCuota").modal("hide");
                Notiflix.Notify.Success('Cuota Pagada con éxito!');
            }else{
                Notiflix.Notify.Failure('Ocurrió un error al realizar el pago de la cuota, por favor recargue y vuelva a intentarlo.');
            }
            
        }
    });

}

function setFechaInputDate(){
    let date = new Date();
    let fecha_inicio = `${date.getFullYear()}-0${date.getMonth() + 1}-01`;
    let fecha_fin = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString().split('/');
    fecha_fin = `${fecha_fin[2]}-${fecha_fin[1].padStart(2,'0')}-${fecha_fin[0]}`;

    document.getElementById('fechaDesde').value = fecha_inicio;
    document.getElementById('fechaHasta').value = fecha_fin;
    // document.getElementById('fechaDesde').value = '2021-07-01';
    // document.getElementById('fechaHasta').value = '2021-07-30';
}

function verPago(btn){
    let id = btn.getAttribute('data-id'),
        alumno = document.getElementById('alumno'),
        feccha_pago = document.getElementById('fechaPago'),
        empresa = document.getElementById('banco'),
        periodo = document.getElementById('periodoPago'),
        monto_pago = document.getElementById('montoPago');
    
    $.ajax({
        url: path + "caja/consultaCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            id: id,
            opcion: "selectCuotaPagada"
        },
        success: function(data){
            
            let cuota = data.cuota[0];
            if(data.respuesta === "success" && data.cuota !== "vacio"){
                
                alumno.value = cuota.nombreAlumno;
                feccha_pago.value = cuota.fechaPago.substring(0,2) + '-' + cuota.fechaPago.substring(2,4) + '-' + cuota.fechaPago.substring(4,8);
                empresa.value = cuota.empresa;
                periodo.value = meses[cuota.periodo] + '-' + cuota.anio;
                monto_pago.value = `S/. ${cuota.total}.00`;

                $("#modalVerPago").modal({
                    backdrop: 'static',
                    keyboard: false
                });

            }else{
                Notiflix.Notify.Failure('Ocurrió un error al cargar el pago');
            }
        }
    });
}

function verModalEliminarCuota(btn){

    let id = btn.getAttribute('data-id');
    let codigo = $(btn).parents("tr").find("td").eq(1).text();
    let alumno = $(btn).parents("tr").find("td").eq(2).text();
    let periodo = $(btn).parents("tr").find("td").eq(4).text();

    let baja_codigo = document.getElementById('baja-codigo'),
        baja_alumno = document.getElementById('baja-alumno'),
        baja_periodo = document.getElementById('baja-periodo'),
        baja_idCuota = document.getElementById('baja_idCuota');

    baja_codigo.value = codigo;
    baja_alumno.value = alumno;
    baja_periodo.value = periodo;
    baja_idCuota.value = id;

    $("#modalEliminarCuota").modal({
        backdrop: 'static',
        keyboard: false
    });
    
}

function verModalHabilitarCuota(btn){

    let id = btn.getAttribute('data-id');
    let codigo = $(btn).parents("tr").find("td").eq(1).text();
    let alumno = $(btn).parents("tr").find("td").eq(2).text();
    let periodo = $(btn).parents("tr").find("td").eq(4).text();

    let alta_codigo = document.getElementById('alta-codigo'),
        alta_alumno = document.getElementById('alta-alumno'),
        alta_periodo = document.getElementById('alta-periodo'),
        alta_idCuota = document.getElementById('alta_idCuota');

    alta_codigo.value = codigo;
    alta_alumno.value = alumno;
    alta_periodo.value = periodo;
    alta_idCuota.value = id;

    $("#modalHabilitarCuota").modal({
        backdrop: 'static',
        keyboard: false
    });
    
}

function verModalPagarCuota(btn){

    let id = btn.getAttribute('data-id');

    $.ajax({
        url: path + "caja/consultaCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            id: id,
            opcion: "selectCuota"
        },
        success: function(data){
            let cuota = data.cuota[0];
            console.log(cuota);
            let pago_codigo = document.getElementById('pago-codigo'),
                pago_alumno = document.getElementById('pago-alumno'),
                pago_concepto = document.getElementById('pago-concepto'),
                pago_periodo = document.getElementById('pago-periodo'),
                pago_monto = document.getElementById('pago-monto'),
                pago_total = document.getElementById('pago-total'),
                pago_mora = document.getElementById('pago-mora'),
                pago_fEmision = document.getElementById('pago-fEmision'),
                pago_fVencimiento = document.getElementById('pago-fVencimiento'),
                pago_documento = document.getElementById('pago-documento');
                pago_idCuota = document.getElementById('pago-idCuota');

            pago_codigo.value = cuota.codigoAlumno;
            pago_alumno.value = cuota.nombreAlumno;
            pago_concepto.value = cuota.concepto;
            pago_periodo.value = `${meses[cuota.periodo]} - ${cuota.anio}`;
            
            /******** Calculo de la Mora *********/
            let string_vencimiento = cuota.fechaVencimiento.substring(4,8) + '-' + cuota.fechaVencimiento.substring(2,4) + '-' + cuota.fechaVencimiento.substring(0,2);
            let string_emision = cuota.fechaEmision.substring(4,8) + '-' + cuota.fechaEmision.substring(2,4) + '-' + cuota.fechaEmision.substring(0,2);
            let fecha_vencimiento = new Date(string_vencimiento);
            let hoy = new Date();

            (hoy > fecha_vencimiento) ? mora = cuota.mora : mora = 0;
            /******** Fin cálculo de la Mora *********/
            pago_monto.value = `S/. ${cuota.monto}.00`;
            pago_total.value = `S/. ${cuota.monto + mora}.00`;
            pago_mora.value = `S/. ${mora}.00`;
            pago_fEmision.value = string_emision;
            pago_fVencimiento.value = string_vencimiento;
            pago_documento.value = cuota.numDocumento;
            pago_idCuota.value = cuota.id;

        }
    });

    $("#modalPagarCuota").modal({
        backdrop: 'static',
        keyboard: false
    });

}

function modificarCuota(nuevo_estado, id_cuota){

    $.ajax({
        url: path + "caja/consultaCuotas",
        method: "POST",
        dataType: 'json',
        data: {
            id: id_cuota,
            estado: nuevo_estado,
            opcion: "modificarCuota"
        },
        success: function(data){
            if (data.respuesta === 'success') {
                Notiflix.Notify.Success('Cuota modificada correctamente!');
                serverSide();
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al desactivar la cuota!');
            }

        }
    });
}
