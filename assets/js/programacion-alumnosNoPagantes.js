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

const meses = {
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
    '12' : 'DICIEMBRE'
};

$("#buscar").click(function(){

    listadoNoPagantes($("#anio").val())

})

function listadoNoPagantes(anio) {

    $.ajax({
        type:'POST',
        url: path + "programacion/alumnosNoPagantes",
        data: {
            opcion : "listadoNoPagantes",
            anio : anio,
            local : $("#instituto").val(),
        },
        dataType:'json',
        beforeSend: function(){
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function(response){
            console.log(response)
            if(response.respuesta === "success"){
                
                if(response.data.length > 0){

                    $("#tablaListadoNoPagantes tbody").html("");
                    
                    let total_general = 0;
                    let enero = 0;
                    let febrero = 0;
                    let marzo = 0;
                    let abril = 0;
                    let mayo = 0;
                    let junio = 0;
                    let julio = 0;
                    let agosto = 0;
                    let septiembre = 0;
                    let octubre = 0;
                    let noviembre = 0;
                    let diciembre = 0;

                    let labelsGrafico = [];
                    let datasetsDataGrafico = [];

                    response.data.forEach(function(value,index){
                        
                        if( value !== "error" ){  
                                      
                            plantilla = `<tr>
                                <td class="text-center" style="font-size:15px"> <b> ${value.especialidad.toUpperCase()} </b></td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.enero[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.enero[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.febrero[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.febrero[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.marzo[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.marzo[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.abril[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.abril[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.mayo[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.mayo[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.junio[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.junio[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.julio[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.julio[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.agosto[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.agosto[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.setiembre[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.setiembre[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.octubre[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.octubre[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.noviembre[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.noviembre[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosNoPagantes("${value.codigo.trim()}","${value.diciembre[1]}")' > ${  new Intl.NumberFormat("en-US").format(value.diciembre[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> ${  new Intl.NumberFormat("en-US").format(value.total) } </b></td>
                            </tr>`;
                            $("#tablaListadoNoPagantes tbody").append(plantilla);
                            
                            total_general += value.total;

                            enero += value.enero[0];
                            febrero += value.febrero[0];
                            marzo += value.marzo[0];
                            abril += value.abril[0];
                            mayo += value.mayo[0];
                            junio += value.junio[0];
                            julio += value.julio[0];
                            agosto += value.agosto[0];
                            septiembre += value.setiembre[0];
                            octubre += value.octubre[0];
                            noviembre += value.noviembre[0];
                            diciembre += value.diciembre[0];

                            labelsGrafico.push(value.especialidad.toUpperCase().trim());
                            datasetsDataGrafico.push(value.total);
                        }
          
                    });

                    const plantilla2 = `<tr>
                            <td class="text-center" style="font-size:15px"> <b> TOTALES </b></td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(enero) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(febrero) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(marzo) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(abril) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(mayo) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(junio) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(julio) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(agosto) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(septiembre) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(octubre) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(noviembre) } </b> </td>
                            <td class="text-center" style="font-size:15px"> <b>${ new Intl.NumberFormat("en-US").format(diciembre) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(total_general) } </b> </td>
                        </tr>`;

                    $("#tablaListadoNoPagantes tbody").append(plantilla2);

                    //gráfico
                    $("#divGraficoAlumnosNoPagantes").html("<canvas id='graficoAlumnoNoPagantes' width='600' height='380'></canvas>")
                    const ctx = $('#graficoAlumnoNoPagantes');
                    const dataGrafico = {
                        labels: labelsGrafico,
                        datasets: [{
                            label: 'Gráfico alumnos no pagantes',
                            data: datasetsDataGrafico,
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(112, 173, 70)',
                                'rgb(230, 148, 92)'
                            ],
                            hoverOffset: 15,
                            borderColor: "white",
                            borderWidth: 1
                        }]
                        
                    }
                    const opcionesGrafico = {
                         plugins: {
                            legend: {
                                display: true,
                                position : "left",
                                //align : "center",
                                labels: {
                                    //color: 'rgb(255, 99, 132)'
                                }
                            },
                            datalabels: {
                                //anchor puede ser "start", "center" o "end"
                                anchor: "center",
                                //Podemos modificar el texto a mostrar
                                formatter: (dato) => dato,
                                /* Color del texto */
                                color: "white",
                                /* Formato de la fuente */
                                font: {
                                  family: '"Arial"',
                                  size: "15",
                                  weight: "700",
                                },
                                //Formato de la caja contenedora
                                //padding: "2",
                                //borderWidth: 1,
                                //borderColor: "darkblue",
                                //borderRadius: 8,
                                //backgroundColor: "lightblue"
                            }
                        },
                        layout: {
                            padding: 40
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

                    $("#modalLoader").modal("hide");
                
                }else{

                    $("#tablaListadoNoPagantes tbody").html("<tr><td colspan='14' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
                    Notiflix.Notify.Warning('NO HAY INFORMACIÓN PARA CARGAR');
                    $("#divGraficoAlumnosNoPagantes").html("")
                    $("#modalLoader").modal("hide");

                }     
   
            }else{

                $("#tablaListadoNoPagantes tbody").html("<tr><td colspan='14' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
                $("#modalLoader").modal("hide");
                Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL REPORTE!');              
            
            }

        },
        error: function(error){

            $("#tablaListadoNoPagantes tbody").html("<tr><td colspan='8' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
            $("#modalLoader").modal("hide");
            Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL REPORTE!');
        
        }    
    });
}

$(document).on("click","#close__modal",function(){
    
    $('#tablaListadoDetalle').empty();
    $('#tablaListadoDetalle').dataTable().fnDestroy();
    $("#modalDetalleAlumnosNoPagantes").modal("hide");

})

function verDetalleAlumnosNoPagantes(codigo,mes){

    $("#modalDetalleAlumnosNoPagantes").modal({backdrop: 'static', keyboard: false}, 'show');
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
            url: path + "programacion/alumnosNoPagantes",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion : "generarDetalleListado",
                anio : $("#anio").val(),
                local : $("#instituto").val(),
                mes : mes,
                cod_espe : codigo
            },
            beforeSend : function(){
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete : function(){
                $("#modalLoader").modal("hide");
            },
            dataSrc: function(dat){
                if(dat.respuesta === "success"){
                    if( dat.data.length > 0 ){
                        $("#especialidadModal").html(dat.data[0].Especialidad);
                        $("#mesModal").html(meses[dat.data[0].Mes]);
                        $("#anioModal").html($("#anio").val());
                        return dat.data;
                    }else{
                        return [];
                    } 
                }else{
                    $("#especialidadModal").html("");
                    $("#mesModal").html("");
                    $("#anioModal").html("");
                    return [];
                }
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
            [20,50,75,100], 
            [20,50,75,100]
        ],
        columns: [
            {data: null,
                render: function (data,type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {data: null,
                render: function (data) {
                    return data.Cod_alumno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.alumno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Turno;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.Semestre;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.dni;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.telefono;
                }
            }
        ],
        language : language
    });
}