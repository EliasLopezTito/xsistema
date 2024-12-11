$(document).ready(function(){
    
    cargarInstituciones(false);  
    cargarListado();      
    cargarInstitucionesModal();

})

$("#institucion").change(function(){

    $("#tablaListado").empty();
    $('#tablaListado').dataTable().fnDestroy();
    cargarListado( $(this).val().trim() )

})

function cargarListado( local = 10 ){

    $("#tablaListado").DataTable({        
        //ordering:  false,    
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [15,20,50,75,100], 
            [15,20,50,75,100]
        ],      
        ajax: {
            url: path + "programacion/aulasProgramacion",
            type: 'POST',
            dataType: "JSON",
            data: {                
                opcion: 'listado',
                local : local
            },
            beforeSend: function(){
                $('.text-loader').text('CARGANDO LISTADO, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
            },
            dataSrc: function(data){
                if(data.respuesta === "success"){
                    return data.data;
                }else{
                    return {};
                }
            },
            complete: function(){
                $("#modalLoader").modal("hide");
            }
        },
        columns: [
            { 
                data: {},
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                },
                className : "text-center"
            },
            { data: 'descripcionM' , className : "text-center" },
            { data: 'Descripcion' , className : "text-center" },
            { data: 'cod_nivel' , className : "text-center" },
            { data: 'cod_aula' , className : "text-center" },
            { data: 'capacidad' , className : "text-center" },
            { data: 'Oculado' , className : "text-center" }
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

$("#btnNuevo").click(function(){

    $("#modalAgregarAula").modal({backdrop: 'static', keyboard: false})

})

function cargarInstitucionesModal(){
    $.ajax({
        url: path + "institucion/getInstituciones",
        dataType: "JSON",
        type: "POST",                   
        success: function (data) {            
            $("#localModal").append("<option disabled selected>-- Seleccione --</option>");
            data.instituciones.forEach( val => {                
                $("#localModal").append(`
                    <option value="${val.cod_local}">${val.cod_local} - ${val.descripcion}</option>
                `)
            });              
        }
    })
}

$("#localModal").change(function(){

    $.ajax({
        type:'POST',
        dataType:'JSON',
        url: path + "programacion/aulasProgramacion",
        data: {
            opcion : "cargarPabellones",
            local : $(this).val().trim()
        },        
        beforeSend: function(){         
            $("#pabellonModal").html("");
            $("#nivelModal").val("");
            $("#aulaModal").val("");
            $("#capacidadModal").val("");
            $("#ocupadoModal").val("");   
        },        
        success: function(response){

            if(response.respuesta === "success"){

                $("#pabellonModal").append("<option value='' selected>-- Seleccione --</option>")                
                response.data.forEach( pabellon => {

                    $("#pabellonModal").append(`
                        <option value="${pabellon.Pabellon.trim()}/${pabellon.cod_nivel.trim()}/${pabellon.cod_aula.trim()}/${pabellon.capacidad}/${pabellon.flagocupado.trim()} "> 
                            ${pabellon.Pabellon.trim()} --- ${pabellon.cod_nivel.trim()} --- ${pabellon.cod_aula.trim()} --- ${pabellon.capacidad} --- ${pabellon.flagocupado.trim()} 
                        </option>`
                    );

                });
                
                Notiflix.Notify.Success('Pabellones cargados');
   
            }else{

                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO : ' + response.error , {
                    timeout : 4000
                });

            }

        } 
    });

})

$("#pabellonModal").change(function(){

    const data = $(this).val().trim();
    const valores = data.split( "/" , 5 );
    $("#nivelModal").val( valores[1] );
    $("#aulaModal").val( valores[2] );
    $("#capacidadModal").val( valores[3] );
    $("#ocupadoModal").val( valores[4] );

})

$("#formAgregarAulaProgramacion").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"agregarAula"});

    $.ajax({
        type:'POST',
        dataType:'JSON',
        url: path + "programacion/aulasProgramacion",
        data: data,                      
        success: function(response){

            if(response.respuesta === "success"){
               
                Notiflix.Notify.Success('EL AULA SE REGISTRO CON ÉXITO.' , { timeout:3000 } );
                $("#pabellonModal").html("");
                $("#nivelModal").val("");
                $("#aulaModal").val("");
                $("#capacidadModal").val("");
                $("#ocupadoModal").val("");
                $("#modalAgregarAula").modal("hide")

                $("#tablaListado").empty();
                $('#tablaListado').dataTable().fnDestroy();
                cargarListado( $("#institucion").val().trim() );                

            }else{

                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO : ' + response.error , {
                    timeout : 4000
                });

            }

        } 
    });

})