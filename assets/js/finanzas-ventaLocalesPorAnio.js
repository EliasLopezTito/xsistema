$(document).ready(function(){
    cargarTablas($("#anioBusqueda").val());
})

$("#anioBusqueda").change(function(){
    cargarTablas($(this).val())
})

function cargarTablas(anio){

    $.ajax({
        url: path + "finanzas/ventaLocalesPorAnio",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarBusqueda",
            anio : anio
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {

            cargarTablaVentasPorDocuemnto(response.data)
            cargarTablaVentasPorAnioGeneral(response.data3)
            cargarGrafico1(response.data2);
            Notiflix.Notify.Success('Operación éxitosa.');
    
        }
    })
}

function cargarTablaVentasPorDocuemnto(data){
    $("#tablaVentaLocalesPorAnio tbody").html("")
    let enero = 0;
    let febrero = 0;
    let marzo = 0;
    let abril = 0;
    let mayo = 0;
    let junio = 0;
    let julio = 0;
    let agosto = 0;
    let setiembre = 0;
    let octubre = 0;
    let noviembre = 0;
    let diciembre = 0;
    let totalgeneral = 0;
    let grupo = "";
    data.forEach(function(value,key){
        
        let newarray = [value.M1 , value.M2 , value.M3 , value.M4 , value.M5 , value.M6 , value.M7 , value.M8 ,value.M9 , value.M10 , value.M11 , value.M12];

        enero = (value.M1) + enero
        febrero = (value.M2) + febrero
        marzo = (value.M3) + marzo
        abril = (value.M4) + abril
        mayo = (value.M5) + mayo
        junio = (value.M6) + junio
        julio = (value.M7) + julio
        agosto = (value.M8) + agosto
        setiembre = (value.M9) + setiembre
        octubre = (value.M10) + octubre
        noviembre = (value.M11) + noviembre
        diciembre = (value.M12) + diciembre

        const total = newarray.reduce((acc,el) => acc + el , 0);
        totalgeneral = totalgeneral + total

        let td = newarray.map(function(val){
            if( val.toString().substring(0,1) === "-" ){
                return `<span style="color:red" >${new Intl.NumberFormat('en-US').format(val)}</span>`
            }else{
                return new Intl.NumberFormat('en-US').format(val)
            }
        })

        if(key === 0){
            grupo = value.Locales;
            let trtittle = `<tr><td colspan="14"><b>${value.Locales}</b></td></tr>`;
            $("#tablaVentaLocalesPorAnio tbody").append(trtittle);
        }else{
            if(grupo !== value.Locales){
                grupo = value.Locales;
                let trtittle = `<tr><td colspan="14"><b>${value.Locales}</b></td></tr>`;
                $("#tablaVentaLocalesPorAnio tbody").append(trtittle);
            }
        }

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Documento}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[0]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[1]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[2]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[3]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[4]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[5]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[6]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[7]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[8]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[9]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[10]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[11]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada"><b>${ Math.sign(total) === 1 ? new Intl.NumberFormat('en-US').format(total) : "<span style='color:red' >"+new Intl.NumberFormat('en-US').format(total)+"</span>" }</b></td>                       
                </tr>`;

        $("#tablaVentaLocalesPorAnio tbody").append(tr);

    });
   
    let tr2 = `<tr style="background:#326299;color:#ffffff">                      
                <td style="padding:5px 7px;" class="celda-centrada"><b>TOTAL GENERAL</b></td>                      
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(enero) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(febrero) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(marzo) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(abril) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(mayo) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(junio) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(julio) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(agosto) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(setiembre) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(octubre) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(noviembre) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(diciembre) }</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${  new Intl.NumberFormat('en-US').format(totalgeneral) }</b></td>                       
            </tr>`;
        
    $("#tablaVentaLocalesPorAnio tbody").append(tr2);

}

function cargarTablaVentasPorAnioGeneral(data){
    console.log(data)
    $("#tablaVentaLocales tbody").html("")
    let totalgeneral = 0;
    let enero = 0;
    let febrero = 0;
    let marzo = 0;
    let abril = 0;
    let mayo = 0;
    let junio = 0;
    let julio = 0;
    let agosto = 0;
    let setiembre = 0;
    let octubre = 0;
    let noviembre = 0;
    let diciembre = 0;
    data.forEach(function(element){
        const elementarray = Object.values(element);
        const elementtotales = elementarray.filter( (val,key) => key !== 0 && key !== 1 && key !== 14);
        const total = elementtotales.reduce((acc , el) => Number(acc) + Number(el) , 0);
        totalgeneral = (Number(totalgeneral)) + (Number(total));

        enero = (elementtotales[0]) + enero
        febrero = (elementtotales[1]) + febrero
        marzo = (elementtotales[2]) + marzo
        abril = (elementtotales[3]) + abril
        mayo = (elementtotales[4]) + mayo
        junio = (elementtotales[5]) + junio
        julio = (elementtotales[6]) + julio
        agosto = (elementtotales[7]) + agosto
        setiembre = (elementtotales[8]) + setiembre
        octubre = (elementtotales[9]) + octubre
        noviembre = (elementtotales[10]) + noviembre
        diciembre = (elementtotales[11]) + diciembre

        const td = elementtotales.map(function(val){
            if( val.toString().substring(0,1) === "-" ){
                return `<span style="color:red" >${new Intl.NumberFormat('en-US').format(val)}</span>`
            }else{
                return new Intl.NumberFormat('en-US').format(val)
            }
        })

        let tr = `<tr>
                <td class="celda-centrada"><b>${element.Locales}</b></td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="01" onclick='detalleVenPorAnioGen(this)'> ${td[0]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="02" onclick='detalleVenPorAnioGen(this)'> ${td[1]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="03" onclick='detalleVenPorAnioGen(this)'> ${td[2]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="04" onclick='detalleVenPorAnioGen(this)'> ${td[3]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="05" onclick='detalleVenPorAnioGen(this)'> ${td[4]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="06" onclick='detalleVenPorAnioGen(this)'> ${td[5]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="07" onclick='detalleVenPorAnioGen(this)'> ${td[6]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="08" onclick='detalleVenPorAnioGen(this)'> ${td[7]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="09" onclick='detalleVenPorAnioGen(this)'> ${td[8]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="10" onclick='detalleVenPorAnioGen(this)'> ${td[9]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="11" onclick='detalleVenPorAnioGen(this)'> ${td[10]} </a> </td>
                <td class="celda-centrada"> <a href="javascript:void(0)" style="font-size:13px" cod_local="${element.Cod_local}" mes="12" onclick='detalleVenPorAnioGen(this)'> ${td[11]} </a> </td>
                <td class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(total)}</b></td>                       
            </tr>`;
        $("#tablaVentaLocales tbody").append(tr);

    })

    let tr = `<tr style="background:#326299;color:#ffffff">
                <td class="celda-centrada"><b>Total</b></td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(enero)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(febrero)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(marzo)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(abril)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(mayo)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(junio)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(julio)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(agosto)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(setiembre)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(octubre)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(noviembre)}</td>
                <td class="celda-centrada">${new Intl.NumberFormat('en-US').format(diciembre)}</td>
                <td class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(totalgeneral)}</b></td>                       
            </tr>`;
    $("#tablaVentaLocales tbody").append(tr);
    
};

function detalleVenPorAnioGen(btn){

    $("#modalDetalleVentaLocalesPorAnio").modal({backdrop: 'static', keyboard: false}, 'show');
    const cod_local = $(btn).attr("cod_local")
    const mes = $(btn).attr("mes")
    
    $("#tablaListadoDetalle").DataTable({
        ordering:  false,
        dom: 'lBfrtip',
        buttons: [
            { "extend": 'excel', 
                "text":'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename' : 'Reporte'}
        ],
        ajax : {
            url: path + "finanzas/ventaLocalesPorAnio",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion : "generarDetalleListado",
                cod_local : cod_local,
                mes : mes,
                anio : $("#anioBusqueda").val()
            },
            beforeSend : function(){
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete : function(){
                $("#modalLoader").modal("hide");
            },
            dataSrc: function(dat){

                console.log(dat)
                return dat.data
            },
        },       
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [18,20,50,75,100], 
            [18,20,50,75,100]
        ],
        columns: [
            {data: null,
                render: function (data,type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {data: null,
                render: function (data) {
                    return data.Codigo_Alumno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Alumno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Especialidad;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.Ciclo;
                }
            },
            {data: null,
                render: function (data) {
                    if(data.Doc === "BV"){
                        return "Boleta";
                    }else{
                        return "Factura";
                    }
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Transaccion;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.Importe;
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

function cargarGrafico1(data){

    $("#divGraficoAlumnosNoPagantes").html("<canvas id='graficoAlumnoNoPagantes' width='600' height='380'></canvas>")
    const ctx = $('#graficoAlumnoNoPagantes');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.Locales.trim() );
        datachart.push( value.Importe.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: 'VENTA DE LOCALES POR AÑO'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

$("#close__modal").click(function(){

    $('#tablaListadoDetalle').empty();
    $('#tablaListadoDetalle').dataTable().fnDestroy();
    $("#modalDetalleVentaLocalesPorAnio").modal("hide")

})