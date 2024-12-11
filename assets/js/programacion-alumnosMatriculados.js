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

$(document).on("click","#close__modal",function(){
    
    $('#tablaDetalles').empty();
    $('#tablaDetalles').dataTable().fnDestroy();
    $("#modalLoader").modal("hide");
    $("#modalDetalleAlumnosMatriculados").modal("hide")
    
})

$("#formCargarAlumnosMatriculados").on("submit",function(e){
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({name: "opcion", value: "buscar"});
    $.ajax({
        url: path + "programacion/alumnosMatriculados",
        type: "POST",
        dataType: "JSON",
        data: $.param(form),
        beforeSend: function () {
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function (response) {
            
            if(response.respuesta === "success"){
                
                if(response.data.length > 0){

                    $("#tablaListadoAlumnosMatriculados tbody").html("");
                    
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
                    const rgb = [ 
                        ['rgba(54, 162, 235, 0.7)','rgb(54, 162, 235)',],
                        ['rgba(75, 192, 192, 0.7)','rgb(75, 192, 192)'],
                        ['rgba(255, 205, 86, 0.7)','rgb(255, 205, 86)'],
                        ['rgba(255, 99, 132, 0.7)','rgb(255, 99, 132)'],
                        ['rgba(201, 203, 207, 0.7)','rgb(201, 203, 207)'] 
                    ]
                    response.data.forEach(function(value,index){
                        
                        if( value.length > 0 ){  

                            let total_especialidad = value.filter( x => x !== false).reduce( ( acc , el ) => acc + el.Total , 0 );
                            
                            let espe_ = ""
                            value.forEach(function( val_ ){
                                if(val_ !== false){
                                    espe_ = val_.Especialidad.toUpperCase().trim();
                                    return;
                                }
                            });

                            plantilla = `<tr>   
                                <td class="text-center" style="font-size:15px"><b>${espe_} </b></td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" anio="${form[1].value}" local="${form[0].value}" mes="${(value[0]!==false?value[0].Mes:null)}" cod="${(value[0]!==false?value[0].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[0] === false ? 0 : value[0].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[1]!==false?value[1].Mes:null)}" cod="${(value[1]!==false?value[1].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[1] === false ? 0 : value[1].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[2]!==false?value[2].Mes:null)}" cod="${(value[2]!==false?value[2].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[2] === false ? 0 : value[2].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[3]!==false?value[3].Mes:null)}" cod="${(value[3]!==false?value[3].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[3] === false ? 0 : value[3].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[4]!==false?value[4].Mes:null)}" cod="${(value[4]!==false?value[4].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[4] === false ? 0 : value[4].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[5]!==false?value[5].Mes:null)}" cod="${(value[5]!==false?value[5].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[5] === false ? 0 : value[5].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[6]!==false?value[6].Mes:null)}" cod="${(value[6]!==false?value[6].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[6] === false ? 0 : value[6].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[7]!==false?value[7].Mes:null)}" cod="${(value[7]!==false?value[7].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[7] === false ? 0 : value[7].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[8]!==false?value[8].Mes:null)}" cod="${(value[8]!==false?value[8].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[8] === false ? 0 : value[8].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[9]!==false?value[9].Mes:null)}" cod="${(value[9]!==false?value[9].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[9] === false ? 0 : value[9].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[10]!==false?value[10].Mes:null)}" cod="${(value[10]!==false?value[10].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[10] === false ? 0 : value[10].Total) } </a></b> </td>
                                <td class="text-center" style="font-size:15px"><b><a href="javascript:void(0)" anio="${form[1].value}" local="${form[0].value}" mes="${(value[11]!==false?value[11].Mes:null)}" cod="${(value[11]!==false?value[11].cod_espe:null)}" onclick='verDetalles(this)' > ${ new Intl.NumberFormat("en-US").format(value[11] === false ? 0 : value[11].Total) } </a></b> </td>
            
                            </tr>`;                

                            $("#tablaListadoAlumnosMatriculados tbody").append(plantilla);   

                            total_general += total_especialidad;
                            enero += value[0] === false ? 0 : value[0].Total;
                            febrero += value[1] === false ? 0 : value[1].Total;
                            marzo += value[2] === false ? 0 : value[2].Total;
                            abril += value[3] === false ? 0 : value[3].Total;
                            mayo += value[4] === false ? 0 : value[4].Total;
                            junio += value[5] === false ? 0 : value[5].Total;
                            julio += value[6] === false ? 0 : value[6].Total;
                            agosto += value[7] === false ? 0 : value[7].Total
                            septiembre += value[8] === false ? 0 : value[8].Total;
                            octubre += value[9] === false ? 0 : value[9].Total;
                            noviembre += value[10] === false ? 0 : value[10].Total;
                            diciembre += value[11] === false ? 0 : value[11].Total;

                            let simbolos = "0123456789ABCDEF";
                            let color = "#";

                            for(var i = 0; i < 6; i++){
                                color = color + simbolos[Math.floor(Math.random() * 16)];
                            }

                            datasets.push({
                                label : espe_ ,
                                data: [ 
                                    value[0] === false ? 0 : value[0].Total,
                                    value[1] === false ? 0 : value[1].Total,
                                    value[2] === false ? 0 : value[2].Total,
                                    value[3] === false ? 0 : value[3].Total,
                                    value[4] === false ? 0 : value[4].Total,
                                    value[5] === false ? 0 : value[5].Total,
                                    value[6] === false ? 0 : value[6].Total,
                                    value[7] === false ? 0 : value[7].Total,
                                    value[8] === false ? 0 : value[8].Total,
                                    value[9] === false ? 0 : value[9].Total,
                                    value[10] === false ? 0 : value[10].Total,
                                    value[11] === false ? 0 : value[11].Total,
                                ],
                                datalabels: {
                                    align: 'end',
                                    anchor: 'start'
                                },
                                backgroundColor: [
                                    color                           
                                ],
                                borderColor: [
                                    color                   
                                ],
                                borderWidth: 1,
                                hoverBorderWidth: 0
                            })
                        }
                    });

                    const plantilla2 = `<tr>
                            <td class="text-center" style="font-size:15px"> <b> TOTALES </b></td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(enero) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(febrero) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(marzo) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(abril) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(mayo) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(junio) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(julio) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(agosto) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(septiembre) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(octubre) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(noviembre) } </b> </td>
                            <td class="text-center" style="font-size:16px"> <b>${ new Intl.NumberFormat("en-US").format(diciembre) } </b> </td>
                        </tr>`;

                    $("#tablaListadoAlumnosMatriculados tbody").append(plantilla2);

                    $("#divGraficoAlumnosMatriculados").html("<canvas id='graficoAlumnosMatriculados' height='400'></canvas>");
                    const ctx = $('#graficoAlumnosMatriculados');
              
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

                    $("#tablaListadoAlumnosMatriculados tbody").html("<tr><td colspan='14' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
                    Notiflix.Notify.Warning('NO HAY INFORMACIÓN PARA CARGAR');
                    $("#divGraficoAlumnosMatriculados").html("")
                    $("#modalLoader").modal("hide");

                }     

            }else{

                $("#tablaListadoAlumnosMatriculados tbody").html("<tr><td colspan='14' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
                $("#modalLoader").modal("hide");
                Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL CARGAR LA INFORMACIÓN!');              
            
            }
    
        },error: function(error){

            $("#tablaListadoAlumnosMatriculados tbody").html("<tr><td colspan='14' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");
            $("#modalLoader").modal("hide");
            Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL CARGAR LA INFORMACIÓN!');
        
        }
    })
})

function verDetalles(btn){

    $("#modalLoader").modal();
    $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');

    const mes = $(btn).attr("mes").trim();
    const cod_espe = $(btn).attr("cod").trim();
    const local = $(btn).attr("local").trim();
    const anio = $(btn).attr("anio").trim();

    if(mes === "null" || cod_espe === "null"){
        Notiflix.Notify.Warning("NO HAY INFORMACIÓN PARA CARGAR."); 
        $("#modalLoader").modal("hide");
        return;
    }

    $("#modalDetalleAlumnosMatriculados").modal({backdrop: 'static', keyboard: false}, 'show')

    $("#tablaDetalles").DataTable({
        ordering:  false,
        dom: 'lBfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        ajax : {
            url: path + "programacion/alumnosMatriculados",
            type: "POST",
            dataType: "JSON",
            data: {   
                opcion : "cargarDetalles",
                local : local,
                anio : anio,
                mes : mes,
                cod : cod_espe
            },
            dataSrc: function(dat){
                console.log(dat);
                if(dat.respuesta === "success"){
                    $("#especialidadModal").html(dat.data[0].Especialidad.toUpperCase());
                    $("#anioModal").html(dat.data[0].AnoProg);
                    $("#mesModal").html(dat.data[0].MesProg);
                    return dat.data;
                }else{
                    $("#especialidadModal").html("");
                    $("#anioModal").html("");
                    $("#mesModal").html("");
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
                    return data.cod_turno;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.semestre;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.telefono;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.email;
                }
            }
        ],
        language : language
    });

}