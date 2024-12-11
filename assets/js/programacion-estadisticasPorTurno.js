
$("#btnBuscar").click(function(){

    const mes = $("#mesBusqueda").val()
    const anio = $("#anioBusqueda").val()

    $.ajax({
        url: path + "programacion/estadisticasPorTurno",
        type: "POST",
        dataType : "JSON",
        data: {
            opcion: "consultar",
            mes : mes,
            anio : anio
        },
        beforeSend : function(){
            $('.text-loader').text('Cargando información, por favor espere..');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function(response){

            $("#tablaConsulta tbody").html("")
            if(response.respuesta ==="success"){

                if(response.data.length < 1){
                    $("#tablaConsulta tbody").html('<tr><td class="text-center" colspan="8"> <b>REALICE UNA BÚSQUEDA</b> </td></tr>');
                    $("#divGrafico").html('<b style="font-size:13px">No se encontro información disponible</b>');
                    return;
                }

                grafico(response.data);
         
                let totalgeneral = 0;
                response.data.forEach( ( val , key ) => {
                     
                    const manana = Number(val.A) + Number(val.B) + Number(val.M);
                    const tarde = Number(val.T) + Number(val.U);
                    const noche = Number(val.N);

                   const plantilla = `
                        <tr>
                            <td class="text-center" >${val.Especialidad}</td>
                            <td class="text-center" >${ new Intl.NumberFormat('en-US').format(manana) }</td>
                            <td class="text-center" >${  ((manana * 100) / ( manana + tarde + noche )).toFixed(2)  } %</td>
                            <td class="text-center" >${ new Intl.NumberFormat('en-US').format(tarde) }</td>
                            <td class="text-center" >${  ((tarde * 100) / ( manana + tarde + noche )).toFixed(2)  } %</td>
                            <td class="text-center" >${ new Intl.NumberFormat('en-US').format(noche) }</td>
                            <td class="text-center" >${  ((noche * 100) / ( manana + tarde + noche )).toFixed(2)  } %</td>
                            <td class="text-center" style="font-size:13px"><b>${ new Intl.NumberFormat('en-US').format( manana + tarde + noche ) }</b></td>
                        </tr>
                    `

                    totalgeneral = totalgeneral + manana + tarde + noche ;        
                    $("#tablaConsulta tbody").append(plantilla)
                    
                });
                
                const plantilla2 = `
                    <tr>
                        <td class="text-center" colspan="7"></td>                        
                        <td class="text-center" style="font-size:13px" ><b>${ new Intl.NumberFormat('en-US').format(totalgeneral) }</b></td>
                    </tr>
                `;
                
                $("#tablaConsulta tbody").append(plantilla2)
                Notiflix.Notify.Success("INFORMACIÓN CARGADA CORRECTAMENTE.");

            }else{

                Notiflix.Notify.Faliure("Ocurrio un error inesperado, por favor vuelva a intentarlo");
                $("#tablaConsulta tbody").html("");
                $("#divGrafico").html('<b style="font-size:13px">No se encontro información disponible</b>');

            }

        }

    })

})

function grafico(data){

    if(data.length > 0){

        $("#divGrafico").html("<canvas id='grafico_' height='400'></canvas>");
        const ctx = $('#grafico_');

        let rgb = [ 
            ['rgba(54, 162, 235, 0.7)','rgb(54, 162, 235)',],
            ['rgba(75, 192, 192, 0.7)','rgb(75, 192, 192)'],
            ['rgba(255, 205, 86, 0.7)','rgb(255, 205, 86)'],
            ['rgba(255, 99, 132, 0.7)','rgb(255, 99, 132)'],
            ['rgba(201, 203, 207, 0.7)','rgb(201, 203, 207)'],
            ['rgba(83, 211, 87, 0.7)','rgb(83, 211, 87)']
        ]

        let datachart = {};
        let labels = ["MAÑANA" , "TARDE" , "NOCHE"];
        let datasets = [];
        
        data.forEach(function( val , key ){
            datasets.push( {
                backgroundColor: generarRGBA() ,                           
                data : [ (val.A+val.B+val.M) , (val.T+val.U) , val.N ],
                label: val.Especialidad.toUpperCase().split(' ')[0].substring(0,3)+"."+val.Especialidad.toUpperCase().replace(val.Especialidad.toUpperCase().split(' ')[0],"")
            } );
        });

        datachart.labels = labels;
        datachart.datasets = datasets;

        const options = {
            scales: {
                y: {
                beginAtZero: false
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'ALUMNOS MATRICULADOS POR TURNO'
                },
                legend: {
                    display: true            
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: function( value , context ) {
                        return new Intl.NumberFormat('en-US').format(value)
                        //return "C"+(context.dataIndex+1)+" : "+new Intl.NumberFormat('en-US').format(value)
                    },
                    font: {
                        weight: 'bold'
                    }
                }
            },                                    
            reponsive : false,
            maintainAspectRatio : false
        }

        new Chart( ctx ,  {
            plugins : [ChartDataLabels],
            type: 'bar',
            data: datachart,
            options: options
        });

    }else{

        $("#divGrafico").html('<b style="font-size:13px">No se encontro información disponible</b>');

    }

}

function generarRGBA( borde = false ){
	let color = "(" + (Math.random() * 255).toFixed() + "," + (Math.random() * 255).toFixed() + "," + (Math.random() * 255).toFixed() + ",0.5)";
	return "rgb" + color;
}