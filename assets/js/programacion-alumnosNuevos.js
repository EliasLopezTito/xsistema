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

$("#descargar").click(function(){

    generarReporteExcel($("#instituto").val(),$("#anio").val());

})

function generarReporteExcel(instituto,anio) {

    $.ajax({
        type:'POST',
        url: path + "programacion/alumnosNuevos",
        data: {
            opcion : "generarListado",
            anio : anio,
            instituto : instituto
        },
        dataType:'json',
        beforeSend: function(){
            $('.text-loader').text('ESTAMOS CREANDO TU REPORTE, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function(response){

            if(response.respuesta === "success"){

                console.log(response)

                if(response.data.length > 0){

                    $("#tablaListado tbody").html("");
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
                    let datasets = [];
                    let rgb = [ 
                        ['rgba(54, 162, 235, 0.7)','rgb(54, 162, 235)',],
                        ['rgba(75, 192, 192, 0.7)','rgb(75, 192, 192)'],
                        ['rgba(255, 205, 86, 0.7)','rgb(255, 205, 86)'],
                        ['rgba(255, 99, 132, 0.7)','rgb(255, 99, 132)'],
                        ['rgba(201, 203, 207, 0.7)','rgb(201, 203, 207)'] 
                    ]

                    response.data.forEach(function(value,index){
                        
                        if( value !== "error" ){   

                            let plantilla = `<tr>
                                <td class="text-center" style="font-size:15px"> <b>  ${value.especialidad.toUpperCase()} </b></td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.enero[1]}")' > ${ new Intl.NumberFormat("en-US").format(value.enero[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.febrero[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.febrero[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.marzo[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.marzo[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.abril[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.abril[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.mayo[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.mayo[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.junio[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.junio[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.julio[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.julio[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.agosto[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.agosto[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.setiembre[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.setiembre[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.octubre[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.octubre[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.noviembre[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.noviembre[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" onclick='verDetalleAlumnosMatriculados("${value.codigo.trim()}","${value.diciembre[1]}")' > ${ new Intl.NumberFormat("en-US").format( value.diciembre[0]) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"> <b>  ${new Intl.NumberFormat("en-US").format(value.total)} </b></td>
                            </tr>`;

                            $("#tablaListado tbody").append(plantilla);
                            total_general += value.total
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

                            datasets.push({
                                label : value.especialidad.toUpperCase() ,
                                data: [ 
                                    value.enero[0],
                                    value.febrero[0],
                                    value.marzo[0],
                                    value.abril[0],
                                    value.mayo[0],
                                    value.junio[0],
                                    value.julio[0],
                                    value.agosto[0],
                                    value.setiembre[0],
                                    value.octubre[0],
                                    value.noviembre[0],
                                    value.diciembre[0],
                                ],
                                datalabels: {
                                    align: 'end',
                                    anchor: 'start'
                                },
                                backgroundColor: [
                                    rgb[index][0]                           
                                  ],
                                  borderColor: [
                                    rgb[index][1]                   
                                ],
                                borderWidth: 1,
                                hoverBorderWidth: 0
                            })

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

                    $("#tablaListado tbody").append(plantilla2);

                    $("#divGraficoAlumnosNuevos").html("")
                    $("#divGraficoAlumnosNuevos").html("<canvas id='graficoAlumnosNuevos' height='400'></canvas>");
                    const ctx = $('#graficoAlumnosNuevos');
              
                    const data_grafico = {
                        labels: ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"],
                        datasets: datasets
                    }

                    const opciones = {
                        scales: {
                            y: {
                              beginAtZero: true
                            }
                        },                                           
                        reponsive : false,
                        maintainAspectRatio : false
                    }

                    new Chart( ctx ,  {
                        type: 'bar',
                        data: data_grafico,
                        options: opciones
                    });


                    $("#modalLoader").modal("hide");
                
                }else{

                    $("#tablaListado tbody").html("<tr><td colspan='14' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
                    Notiflix.Notify.Warning('NO HAY INFORMACIÓN PARA CARGAR!');
                    $("#modalLoader").modal("hide");

                }     
   
            }else{

                $("#tablaListado tbody").html("<tr><td colspan='14' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
                $("#modalLoader").modal("hide");
                Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL REPORTE!'); 

            }
        },
        error: function(error){

            $("#tablaListado tbody").html("<tr><td colspan='14' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
            $("#modalLoader").modal("hide");
            Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL REPORTE!');
        
        }    
    });

}


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
}

function verDetalleAlumnosMatriculados(cod_espe,mes){

    $("#modalDetalleAlumnosMatriculados").modal({backdrop: 'static', keyboard: false}, 'show');
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
            url: path + "programacion/alumnosNuevos",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion : "generarDetalleListado",
                anio : $("#anio").val(),
                local : $("#instituto").val(),
                mes : mes,
                cod_espe : cod_espe
            },
            beforeSend : function(){
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            dataSrc: function(dat){
                if(dat.respuesta === "success"){
                    if( dat.data.length > 0 ){
                        $("#especialidadModal").html(dat.data[0].Especialidad);
                        $("#mesModal").html(meses[mes]);
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
            complete: function(){
                $("#modalLoader").modal("hide");
                //Notiflix.Notify.Success("INFORMACIÓN CARGADA CON ÉXITO."); 
            }
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
                    return data.cod_alumno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Alumno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Turno;
                } 
            },
            {data: null,
                render: function(data){
                    return data.FechaI.substring(0,10);
                }
            },     
            {data: null,
                render: function(data){
                    return data.Semestre;
                }
            }
        ],
        language : language
    });

    /**$.ajax({
        type:'POST',
        url: path + "programacion/alumnosNuevos",
        data: {
            opcion : "generarDetalleListado",
            anio : $("#anio").val(),
            local : $("#instituto").val(),
            mes : mes,
            cod_espe : cod_espe
        },
        dataType:'json',
        beforeSend: function(){
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function(response){

            if(response.respuesta === "success"){

                if(response.data.length > 0){

                    $("#especialidadModal").html(response.data[0].Especialidad)

                    $("#tablaListadoDetalle tbody").html("");

                    response.data.forEach(function(value,index){
                                    
                        let plantilla = `<tr>
                        
                            <td class="text-center">  ${index+1} </td>
                            <td class="text-center">  ${value.cod_alumno} </td>
                            <td class="text-center">  ${value.Alumno} </td>
                            <td class="text-center">  ${value.Turno} </td>
                            <td class="text-center">  ${value.FechaI.substring(0,10)} </td>
                            <td class="text-center">  ${value.Semestre} </td>
                            
                        </tr>`;
                        
                        $("#tablaListadoDetalle tbody").append(plantilla);
                        $("#modalLoader").modal("hide");

                    });

                    $("#modalDetalleAlumnosMatriculados").modal()
                
                }else{

                    $("#tablaListadoDetalle tbody").html("<tr><td colspan='6' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
                    Notiflix.Notify.Warning('NO HAY INFORMACIÓN PARA CARGAR!');
                    $("#modalLoader").modal("hide");
                }

            }else{

                $("#tablaListadoDetalle tbody").html("<tr><td colspan='6' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
                $("#modalLoader").modal("hide");
                Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL REPORTE!');

            }
            
        },
        error: function(error){
            $("#tablaListadoDetalle tbody").html("<tr><td colspan='6' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
            $("#modalLoader").modal("hide");
            Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL REPORTE!');
        }    
        });
    **/
}

$(document).on("click","#close__modal",function(){
    
    $('#tablaListadoDetalle').empty();
    $('#tablaListadoDetalle').dataTable().fnDestroy();
    //$("#modalLoader").modal("hide");
    $("#modalDetalleAlumnosMatriculados").modal("hide")

})