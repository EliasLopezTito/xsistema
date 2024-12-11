let inputFile = document.getElementById('inputFilePagos');
let result;
const reader = new FileReader;
let estado = true;
let codigos = [];
let verListado = false;

$(document).ready(function () {

    pagos = []
    datosExcel = [];
    length = 0

    Notiflix.Loading.Init({
        clickToClose: true
    });

});

document.addEventListener('change', (e) => {

    if (e.target.matches('#fecha_pago')) {
        consultarPagos();
    }

})

document.addEventListener('click', (e) => {

    if (e.target.matches('#btnProcesar')) {
        verListado = false;
        validarArchivo();
    }

    if (e.target.matches('#btnCancelarVerReporte')) {
        $("#modalReportePagosFallidos").modal("hide");
    }

    if (e.target.matches('#btnActualizar')) {
        consultarPagos();
    }

    if (e.target.matches('#btnVerArchivo')) {
        verListado = true;
        datosExcel = []
        validarArchivo();
        $('#seccion_ver_archivo').show();
    }

    if (e.target.matches('#btn_ver_boleta')) {
        //verListado = true;
        verBoleta();
    }

    if (e.target.matches('#btn_generar_boleta')) {
        //verListado = true;
        generarBoleta();
    }
    

})

document.getElementById('download').addEventListener('click', function () {
    // Crear un libro de trabajo y una hoja
    console.log("datosExcel", datosExcel);
    ws_datax = [['Fecha', 'Codigo Alumno', 'Monto Deuda', 'Estado']]

    resultArray = [...ws_datax, ...datosExcel]
    // datosExcel.push([ws_datax])
    console.log("datosExcel", resultArray);

    // for (let index = 0; index < datosExcel.length; index++) {
    //     const element = datosExcel[index];
        
    // }

    const wb = XLSX.utils.book_new();
    // const ws_data = [
    //   ['Fecha', 'Codigo Alumno', 'Monto Deuda', 'Estado'],
    //   datosExcel[0]
    // ];

    

    ws_data = resultArray.map(e => 
         [[e[0]], [e[1]], [e[2]], [e[3]]]
    )
    

     console.log("ws_data", ws_data);
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generar el archivo y desencadenar la descarga
    XLSX.writeFile(wb, 'Informacion Archivo.xlsx');
  });

function generarBoleta() {

    fechaa = document.getElementById('fecha_pago').value.replace(/-/g, '');

    bancoa = document.getElementById('id_banco').value;

    console.log("fecha", fechaa);
    console.log("bancoa", bancoa);

    $.ajax({
        // async: false,
        url: path + "caja/procesarConciliacion",
        type: 'POST',
        dataType: 'json',
        data: {
            opcion: 'generarBoletaFecha',
            banco: bancoa,
            fecha: fechaa
        },
        beforeSend: function () {
            $('.text-loader').text('Procesando archivo, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function (data) {
            console.log(data);
            if (data.respuesta === 'success') {

                data.resp == true ? Notiflix.Report.Success("Felicidades", "Las boletas fueron generadas con exito.", "Aceptar") : Notiflix.Notify.Failure('Ocurrio un error en el proceso, vuelva a GENERAR BOLETAS!');
                
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al procesar el archivo, por favor intentar nuevamente!');
            }

        },
        error: function (e) {

            Notiflix.Notify.Failure('Ocurrió un error: ' + e);
        },
        complete: function () {
            $("#modalLoader").modal('hide');
        }
    });
}

function verBoleta(){

    fechaa = document.getElementById('fecha_pago').value.replace(/-/g,'');
    
    bancoa = document.getElementById('id_banco').value;

    console.log("fecha", fechaa);
    console.log("bancoa", bancoa);

    $.ajax({
        // async: false,
        url: path + "caja/procesarConciliacion",
        type: 'POST',
        dataType: 'json',
        data: {
            opcion: 'listaBoletaFecha',
            banco: bancoa,
            fecha: fechaa
        },
        beforeSend: function(){
            Notiflix.Loading.Hourglass('Cargando...');
        },
        success: function (data) {
            console.log(data);
            if (data.respuesta === 'success') {
                if (data.registros !== 'vacio') {
                    $('#tablaListadoBoleta').show();
                    $('#btn_generar_boleta').prop('disabled', false);
                    //Notiflix.Report.Success("Registro exitoso","El archivo fue procesado correctamente.", "Aceptar");

                    data.registros.forEach((val, key2) => {

                        const tr = `<tr>
                                <td class="text-center">${val.pago_id}</td>   
                                <td class="text-center">${val.fecha_pago}</td>
                                <td class="text-center">${val.codigo_alumno}</td>
                                <td class="text-center">${val.Alumno}</td>
                                <td class="text-center">${val.Banco}</td>
                                <td class="text-center">${val.Monto}</td>
                                <td class="text-center">${val.Mora}</td>
                                <td class="text-center">${val.NumReceive}</td>
                                <td class="text-center">${val.NumOperacion}</td>
                                <td class="text-center">${val.canal_id}</td>
                                <td class="text-center">${val.SinBo}</td>
                            </tr>`;

                        $("#tablaListadoBoleta tbody").append(tr);

                    });
                }else{
                    Notiflix.Notify.Failure('¡No hay boletas en la fecha: ' + fechaa +' para ver!');
                    $("#tablaListadoBoleta tbody").html(`<tr><td class='text-center' colspan="10">NO SE ENCONTRÓ INFORMACIÓN</td></tr>`);
                    return;
                }
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al procesar el archivo, por favor intentar nuevamente!');
            }

        },
        error: function (e) {

            Notiflix.Notify.Failure('Ocurrió un error: ' + e);
        },
        complete: function () {
            $("#NotiflixLoadingWrap").trigger("click");
        }
    });
}

function validarArchivo() {

    result = '';

    banco = document.getElementById('id_banco').value;
    fecha = document.getElementById('fecha_pago').value.replace(/-/g,'');

    if (banco !== '' && fecha !== '') {
        banco === '01' ? validarIBK(fecha) : validarBBVA(fecha);
    } else{
        Notiflix.Notify.Failure('Seleccione la fecha y el banco!');
        // inputFile.value = '';
    }
}

function consultarPagos() {

    let fecha = document.getElementById('fecha_pago').value;
    fecha = fecha.replace(/-/g, '');

    $.ajax({
        // async: false,
        url: path + "caja/procesarConciliacion",
        type: 'POST',
        dataType: 'json',
        data: {
            opcion: 'consultarPagosProcesados',
            fecha: fecha
        },
        beforeSend: function() {
            $('.text-loader').text('Consultando información, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function(data) {

            console.log(data);
            
            if (data.respuesta === 'success') {

                tr = '';
                let tbody = $("#tablaRegistros tbody");
                tbody.find('tr').remove();

                if (data.registros !== 'vacio') {

                    $.each(data.registros, function(index, listado) {

                        let empresa = listado.empresa_id === '1' ? 'INTERBANK' : 'BBVA';
                        let estado, clase;

                        if (listado.Registrado === listado.Conciliacion && listado.Conciliacion === listado.Generado) {
                            estado = '<span class="icon-checkmark"></span>';
                            clase = 'td-ok';
                        } else{
                            estado = `<a class='btn boton-tabla boton-rojo' data-id='${listado.empresa_id}' title='Ver Reporte'  onclick='verModalReportePagosFallidos(this)'><span class="icon-list2"></span></a>`;
                            clase = 'td-error';
                        }
                        
                        tr += `<tr>
                            <td class='celda-centrada'>${empresa}</td>
                            <td class='celda-centrada'>${listado.Registrado}</td>
                            <td class='celda-centrada'>${listado.Generado}</td>
                            <td class='celda-centrada'>${listado.Conciliacion}</td>
                            <td class='celda-centrada ${clase}'>${estado}</td>
                        </tr>`;

                    });

                } else{
                    tr = "<tr><td colspan='5' class='celda-centrada'>No hay informacion que mostrar</td></tr>";
                }
                tbody.append(tr);
            } else{

                Notiflix.Notify.Failure('Ocurrió un error al cargar los registros!');

            }

        },
        error: function(e) {
            
        },
        complete: function() {
            $("#modalLoader").modal("hide");
        }
    });

}

function validarIBK(fecha) {

    file = document.getElementById('inputFilePagos').files[0];

    reader.readAsText(file);

    reader.onload = () => {

        result = reader.result;

        fechaArchivo = result.substring(82,90);

        if (fechaArchivo === fecha) {
            cuotas = result.split(/\r\n|\n/);
            cuotas = cuotas.filter(el => el.trim() !== '' );
            result = cuotas;
            // Notiflix.Notify.Success('Archivo correcto!', {
            //     // timeout: 10
            // });
            procesarIBK();
        } else{
            Notiflix.Notify.Failure('Archivo incorrecto, por favor asegurarse de seleccionar el archivo correcto!');
            // inputFile.value = '';

        }

    };

}

function validarBBVA(fecha) {

    file = document.getElementById('inputFilePagos').files[0];

    if(file){
        reader.readAsText(file);

        reader.onload = () => {

            result = reader.result;
            fechaArchivo = result.substring(19, 27);

            if (fechaArchivo === fecha) {
                cuotas = result.split(/\r\n|\n/);
                cuotas = cuotas.filter(el => el.trim() !== '');
                cuotas.shift();
                cuotas.pop();
                result = cuotas;

                pagos = construirCuotasBBVA();
                length = pagos.length;

                procesarBBVA();
                Notiflix.Loading.Hourglass('Cargando...');
                // Notiflix.Notify.Success('Archivo correcto!', {
                //     // timeout: 10
                // });

            } else {
                Notiflix.Notify.Failure('Archivo incorrecto, por favor asegurarse de seleccionar el archivo correcto!');
                // inputFile.value = '';

            }

        };
    }else{
        Notiflix.Notify.Failure('Seleccione un archivo por favor!');
    } 

}

function procesarIBK() {
    if (inputFile.files.length > 0) {
        
        $('.text-loader').text('Procesando archivo, por favor espere...');
        $("#modalLoader").modal();

        pagos = construirCuotasIBK();

        if (verListado == true) {
            $('#total_listado').html("");
            $('#tablaListadoTxt tbody').html("");
            let fecha = document.getElementById('fecha_pago').value;
            fecha = fecha.replace(/-/g, '');
            data_new = [];

            pagos.forEach(element => {
                if (element.fecha == fecha) {
                    let dia = element.fecha.substr(6, 8);
                    resulta = element.fecha.substr(2, 6);
                    let mes = resulta.substr(2, 2);
                    let ano = element.fecha.substr(0, 4);
                    data_new.push({ "fecha": dia + "-" + mes + "-" + ano, "codigoAlumno": element.codigo_alumno })
                }
            });
            console.log("INTERNAK", data_new)                
            planilla = data_new.map(e =>
                `<tr>
                    <td>${e.fecha}</td>
                    <td>${e.codigoAlumno}</td>
                </tr>`
            )

            console.log("Fecha ->", Number(fecha), "Cantidad ->", data_new.length);

            $('#total_listado').append("CANTIDAD TOTAL INTERBANK: " + data_new.length)

            $('#tablaListadoTxt tbody').append(planilla);
            $("#modalLoader").modal("hide");
            return
        }

        $.ajax({
            // async: false,
            url: path + "caja/procesarConciliacion",
            type: 'POST',
            dataType: 'json',
            data: {
                opcion: 'registrarConciliacionIBK',
                registros: JSON.stringify(pagos) 
            },
            success: function(data) {

                console.log(data);

                if (data.respuesta === 'success') {

                    consultarPagos();
                    Notiflix.Report.Success("Registro exitoso","El archivo fue procesado correctamente.", "Aceptar");

                } else{
                    Notiflix.Notify.Failure('Ocurrió un error al procesar el archivo, por favor intentar nuevamente!');
                }
    
            },
            error: function(e) {
                Notiflix.Notify.Failure('Ocurrió un error: ' + e);
            },
            complete: function() {
                $("#modalLoader").modal("hide");
            }
        });
        
} else{
    Notiflix.Report.Failure("Ocurrió un error",'Por favor seleccione el archivo de conciliación!', "Aceptar");
}
}

function procesarBBVA() {
        if (inputFile.files.length > 0) {
            
            // $('.text-loader').text('Procesando archivo, por favor espere...');
            // $("#modalLoader").modal();
            //pagos = construirCuotasBBVA();
            
            if(verListado == true){
                $('#total_listado').html("");
                $('#tablaListadoTxt tbody').html("");
                let fecha = document.getElementById('fecha_pago').value;
                fecha = fecha.replace(/-/g, '');
                data_new = [];

                var datax = pagos.reduce((x, y) => {

                    (x[y.fecha] = x[y.fecha] || []).push(y);

                    return x;

                }, {});

                // datax =  Object.groupBy(pagos, (num, index) => {
                //     return [num.fecha]
                // })

                data_new.push(datax)

                data_newa = Object.values(data_new)

                data_new_2 = Object.values(data_newa[0]);

                let data_alumnos = data_new_2.flatMap(row => row.map(obj => obj.codigo_alumno));

                $.ajax({
                    // async: false,
                    url: path + "caja/procesarConciliacion",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        opcion: 'verificarPorAlumno',
                        alumno: data_alumnos,
                        fecha: $('#fecha_pago').val().replaceAll('-', '')
                    },
                    beforeSend: function () {
                        $('.text-loader').text('Comparando los pagos entre el archivo y la base de datos, por favor espere...');
                        $("#modalLoader").modal();
                    },
                    // complete: function() {
                    //     $("#modalLoader").modal("hide");
                    // },
                    success: function(data) {   
                        $("#modalLoader").modal("hide");                     
                        arrayFinal = [];
                        array2 = data.resp;
                        // const idsArray2 = new Set(array2.map(item => item.cod_alumno));

                        // console.log("idsArray2", idsArray2);
                        // updatedArray = data_new_2.map(innerArray => 
                        //     innerArray.map(item => ({
                        //         ...item, 
                        //         pago: idsArray2.has(item.codigo_alumno) ? "si" : "no encontrado"
                        //         })
                                
                        //         )                            
                        // )           
                        
                        // const idsArray2 = new Set(data_new_2.map(innerArray =>
                        //     innerArray.map(item => item.codigo_alumno)))

                        for (let index = 0; index < data_new_2.length; index++) {

                            const map2 = new Map(data_new_2[index].map(item => [item.codigo_alumno, item]));
                            const mergedArray = array2.map(item => ({
                            ...item,
                            ...(map2.get(item.cod_alumno) || {})
                            }));

                            casiTermina = mergedArray.filter(item => Object.keys(item).length > 2)

                            arrayFinal.push(casiTermina)

                        }
                        console.log("arrayFinal", arrayFinal);        

                        arrayFinal.forEach((val, index) => {              
                    
                            let dia = val[0].fecha.substr(6, 8);
                            resulta = val[0].fecha.substr(2, 6);
                            let mes = resulta.substr(2, 2);
                            let ano = val[0].fecha.substr(0, 4);
                            
                            const trcolspan = `<tr class="info" > <td class="text-center" colspan="4" ><b>FECHA: ${dia + '-' + mes + '-' + ano} --- CANTIDAD TOTAL: ${val.length}</b></td> </tr>`;
                            
                            // data_new.push({ "fecha": dia + "-" + mes + "-" + ano, "codigoAlumno": element.codigo_alumno })
        
                            $("#tablaListadoTxt tbody").append(trcolspan);
        
                            val.forEach((val2, key2) => {

                                    if (val2.pago == 1){
                                        resp = "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #198754\">PAGO</span>";
                                        pago = "PAGO" 
                                    }else{
                                        resp = "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #dc3545\">NO PAGO</span>"   
                                        pago = "NO PAGO"  
                                    }

                                        const tr = `<tr>
                                                        <td class="text-center">${dia+'-'+mes+'-'+ano}</td>   
                                                        <td class="text-center">${val2.codigo_alumno}</td>
                                                        <td class="text-center">${val2.montoDeuda}</td>
                                                        <td class="text-center">${resp}</td>
                                                    </tr>`;

                                                $("#tablaListadoTxt tbody").append(tr);

                                                datosExcel.push([dia+'-'+mes+'-'+ano, val2.codigo_alumno, val2.montoDeuda.toString(), pago])
                            });                           
            
                        });
            
                    },
                    error: function(e) {
                        
                        Notiflix.Notify.Failure('Ocurrió un error: ' + e);
                    },
                    complete: function() {
                        //$("#modalLoader").modal("hide");
                    }
                });

                // pagos.forEach(element => {
                //     if (element.fecha == fecha) {
                //         let dia = element.fecha.substr(6, 8);
                //         resulta = element.fecha.substr(2, 6);
                //         let mes = resulta.substr(2, 2);
                //         let ano = element.fecha.substr(0, 4);
                //         data_new.push({ "fecha": dia + "-" + mes +"-"+ano, "codigoAlumno" : element.codigo_alumno})
                //     }
                // });

                // console.log(data_new)
                // planilla = data_new.map(e =>
                //     `<tr>
                //         <td>${e.fecha}</td>
                //         <td>${e.codigoAlumno}</td>
                //     </tr>`
                // )

                //$('#total_listado').append("CANTIDAD TOTAL BBVA: " + data_new_2.length)
                
                // $('#tablaListadoTxt tbody').append(planilla);
                setTimeout(() => {
                    $("#NotiflixLoadingWrap").trigger("click");
                }, 200);
                
                return
            }

            if (pagos.length) {
                
                pagos_new = pagos[0];
                
            
                $.ajax({
                    // async: false,
                    url: path + "caja/procesarConciliacion",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        opcion: 'registrarConciliacionBBVA',
                        registros: JSON.stringify(pagos_new) 
                    },
                    success: function(data) {
                        console.log(data);
                        if (data.respuesta === 'success') {

                            console.log((length - pagos.length) + 1, "DE", length, "->", "success")
                            pagos.shift();
                            procesarBBVA();

                            //consultarPagos();
                            //Notiflix.Report.Success("Registro exitoso","El archivo fue procesado correctamente.", "Aceptar");

                        } else{
                            Notiflix.Notify.Failure('Ocurrió un error al procesar el archivo, por favor intentar nuevamente!');
                        }
            
                    },
                    error: function(e) {
                        
                        Notiflix.Notify.Failure('Ocurrió un error: ' + e);
                    },
                    complete: function() {
                        //$("#modalLoader").modal("hide");
                    }
                });
            } else {
                $("#NotiflixLoadingWrap").trigger("click");
                console.log("PROCESO COMPLETADO CON EXITO")
                Notiflix.Report.Success("Registro exitoso", "El archivo fue procesado correctamente.", "Aceptar");
                consultarPagos();
            }

            // $.ajax({
            //     // async: false,
            //     url: path + "caja/procesarConciliacion",
            //     type: 'POST',
            //     dataType: 'json',
            //     data: {
            //         opcion: 'registrarConciliacionBBVA',
            //         registros: JSON.stringify(pagos)
            //     },
            //     success: function (data) {
            //         console.log(data);
            //         if (data.respuesta === 'success') {

            //             consultarPagos();
            //             Notiflix.Report.Success("Registro exitoso", "El archivo fue procesado correctamente.", "Aceptar");

            //         } else {
            //             Notiflix.Notify.Failure('Ocurrió un error al procesar el archivo, por favor intentar nuevamente!');
            //         }

            //     },
            //     error: function (e) {

            //         Notiflix.Notify.Failure('Ocurrió un error: ' + e);
            //     },
            //     complete: function () {
            //         $("#modalLoader").modal("hide");
            //     }
            // });
            
    } else{
        Notiflix.Report.Failure("Ocurrió un error",'Por favor seleccione el archivo de conciliación!', "Aceptar");
    }
}

function construirCuotasIBK() {

    let pagos = new Array();

    result.forEach(element => {
        fecha_pago = element.substring(82, 90);
        codigo_alumno = element.substring(9,18);
        numDocumento = element.substring(37,52);

        let pago = {
            'fecha' : fecha_pago,
            'codigo_alumno' : codigo_alumno,
            'numDocumento' : numDocumento
        }

        pagos.push(pago);

    });

    return pagos;

}


function construirCuotasBBVA() {

    let pagos = new Array();
        /**
         * El BBVA no envia la mora por lo cual se debe calcular si el pago tiene la mora incluida
         *  En caso se modifique la mora esta linea debera ser modificada para el nuevo valor, al
         *  momento de construir el código la mora tiene un valor de 6
        */
    result.forEach(element => {
        fecha_pago = element.substring(135, 143);
        codigo_alumno = element.substring(32,41);
        montoDeuda = (element.substring(80,93).substr(-1) === '6') ? parseInt(element.substring(80,93)) - 6 : parseInt(element.substring(80,93));
        mora = (element.substring(80,93).substr(-1) === '6') ? 6 : 0;
        numeroOperacionReceive = element.substring(129,135);
        numeroOperacion = element.substring(71,80);
        numero_documento = element.substring(41,59);
        canal_id = element.substring(145,147);
        canal = (canal_id === '01') ? 'TF' : (canal_id === '04' ? 'CN' : 'RD');

        let pago = {
            'fecha' : fecha_pago,
            'codigo_alumno' : codigo_alumno,
            'montoDeuda' : montoDeuda,
            'mora' : mora,
            'numeroOperacionReceive' : numeroOperacionReceive,
            'numeroOperacion' : numeroOperacion,
            'numero_documento' : numero_documento,
            'canal' : canal
        }

        pagos.push(pago);

    });

    return pagos;

}

function verModalReportePagosFallidos(btn) {
    let banco_id = btn.getAttribute('data-id');

    banco_id === '1' ? consultarPagosFallidosIBK() : consultarPagosFallidosBBVA();

}

function consultarPagosFallidosBBVA() {

    let fecha = document.getElementById('fecha_pago').value;
    fecha = fecha.replace(/-/g, '');

    $.ajax({
        // async: false,
        url: path + "caja/procesarConciliacion",
        type: 'POST',
        dataType: 'json',
        data: {
            opcion: 'consultarPagosFallidosBBVA',
            fecha: fecha 
        },
        beforeSend: function() {
            //$('.text-loader').text('Consultando información, por favor espere...');
            //$("#modalLoader").modal();
        },
        success: function(data) {
            
            if (data.respuesta === 'success') {
                tr = '';
                let tbody = $("#tablaReporteCuotasBBVA tbody");
                tbody.find('tr').remove();

                if (data.pagos !== 'vacio') {

                    $.each(data.pagos, function(index, el) {

                        tr=`<tr>
                            <td class='celda-centrada'>BBVA</td>
                            <td class='celda-centrada'>${el.fecha_pago}</td>
                            <td class='celda-centrada'>${el.codigo_alumno}</td>
                            <td class='celda-centrada'>S/. ${el.montoDeuda + el.mora}.00</td>
                            <td class='celda-centrada'>${el.numeroOperacion}</td>
                            <td class='celda-centrada'><a class='btn boton-tabla boton-rojo' data-id='${el.id}' title='Registrar Pago'  onclick='registrarPagoBBVA(this)'><span class="icon-ticket"></span></a></td>
                        </tr>`;

                        tbody.append(tr);
                    });

                    $("#modalReportePagosFallidos").modal({
                        backdrop: 'static',
                        keyboard: true
                    });

                } else{
                    $("#modalReportePagosFallidos").modal("hide");
                    Notiflix.Notify.Success('No se encontraron pagos para corregir!');
                }

            } else{
                Notiflix.Notify.Failure('Ocurrió un error al cargar el reporte, por favor intentar nuevamente!');
            }

        },
        error: function(e) {
            
        },
        complete: function() {
            //$("#modalLoader").modal("hide");
        }
    });

}

function registrarPagoBBVA(btn) {
    
    let id = btn.getAttribute('data-id');

    $.ajax({
        // async: false,
        url: path + "caja/procesarConciliacion",
        type: 'POST',
        dataType: 'json',
        data: {
            opcion: 'registrarPagoBBVA',
            id: id
        },
        beforeSend: function() {
            $('.text-loader').text('Registrando pago, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function(data) {
                        
            if (data.respuesta === 'success') {
                Notiflix.Notify.Success('Pago registrado correctamente!');
                consultarPagosFallidosBBVA();

            } else{
                Notiflix.Notify.Failure('Ocurrió un error al cargar el reporte, por favor intentar nuevamente!');
            }

        },
        error: function(e) {
            
        },
        complete: function() {
            $("#modalLoader").modal("hide");
        }
    });

}

function consultarPagosFallidosIBK() {
    Notiflix.Notify.Failure('Si se presentan problemas con pagos realizados a través de INTERBANK, por favor contactar inmediatamente al departamento de sistemas!', {
        timeout: 10000,
        messageMaxLength: 500
    });
}

$("#btnProcesarJob").click(function(){

    $.ajax({      
        url: path + "caja/procesarConciliacion",
        type: 'POST',
        dataType: 'JSON',
        data: {
            opcion: 'procesarJob'
        },
        beforeSend: function () {
            $('.text-loader').text('REGULARIZANDO DOCUMENTOS...');
            $("#modalLoader").modal();
        },
        complete: function () {
            $("#modalLoader").modal("hide");
        },
        success: function (data) {

            if (data.respuesta === 'success') {
                
                Notiflix.Notify.Success('DOCUMENTOS ACTUALIZADOS.');

            } else {

                Notiflix.Notify.Failure('Ocurrió un error inesperado, por favor intentar nuevamente!');

            }

        }
    });

})
