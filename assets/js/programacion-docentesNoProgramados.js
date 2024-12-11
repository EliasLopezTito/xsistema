$(document).ready(function () {

    tablaEgresados = $("#tablaListaFaltaDocentes").DataTable({
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
            
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
    })

    // $("#docente").autocomplete({
    //     source: function(request, response){
    //         $.ajax({
    //             url: path + "Notas/verRegistro",
    //             dataType: "json",
    //             data: {
    //                 term: request.term,
    //                 opcion: 'buscarDocente'
    //             },
    //             success: function(data){
    //                 $("#docente").removeAttr("data-code");
    //                 $("#docente").next('i').removeClass('glyphicon-ok');
    //                 $("#docente").next('i').addClass('glyphicon-remove');
    //                 $("#docente").parent().removeClass('has-success');
    //                 $("#docente").parent().addClass('has-error');
    //                 let tbody = $("#tablaCursosProgramados tbody");
    //                 tbody.find('tr').remove();
    //                 $("#panel_notas").css("display", "none");     
    //                 tbody = $("#tablaNotasProgramacion tbody");
    //                 tbody.find('tr').remove();

    //                 let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;

    //                 response(result);
    //             }
    //         });
    //     },
    //     minLength: 3,
    //     select: function(event, ui){
    //         if (ui.item.vacio) {
    //             event.preventDefault();
    //         } else{
    //             $("#docente").val(ui.item.nombre);
    //             $("#docente").attr('data-code', ui.item.cod_emp);
    //             $("#docente").next('i').removeClass('glyphicon-remove');
    //             $("#docente").next('i').addClass('glyphicon-ok');
    //             $("#docente").parent().removeClass('has-error');
    //             $("#docente").parent().addClass('has-success');
    //         }
    //         return false;
    //     }
    // })
    // .autocomplete( "instance" )._renderItem = function( ul, item ) {
    //     if (item.vacio) {
    //         return $( "<li>" )
    //         .append( "<div>No se encontraron resultados</div>" )
    //         .appendTo( ul );
    //     }

    //     return $( "<li>" )
    //         .append( "<div>" + item.cod_emp + " - " +item.nombre + "</div>" )
    //         .appendTo( ul );
    // };

    $("#docente").focus();
    
});

document.addEventListener('click', (e) => {

    if (e.target.matches('#btnProgramacion')) {
            
    
            $("#panel_notas").css("display", "none");
    
            var tbody = $("#tablaCursosProgramados tbody");
            tbody.find('tr').remove();

            verListaDocentesNoProgramados();
    }

    if (e.target.matches('#docente')) {
        document.getElementById('docente').select();
    }

});

function verListaDocentesNoProgramados() {

	let anioProg = $("#anioProg").val();
    let mesProg = $("#mesProg").val();
    let codDocente = $("#docente").val();

    let miFecha = new Date();
    fecha = miFecha.setMonth(mesProg - 1);
    mesFecha = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(fecha).toUpperCase()
    $(".fechaConsulta").text(mesFecha+" DEL "+anioProg);

    $('#tablaCursosProgramados').dataTable().fnDestroy();
    tablaEgresados = $("#tablaCursosProgramados").DataTable({
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        ajax: {
            url: path + "programacion/docentesNoProgramados",
            type: 'POST',
            beforeSend: function(){
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
            },
            data: {
                anioProg: anioProg,
        	    mesProg: mesProg,
                codDocente: codDocente,
        	    opcion: "verListaDocentes",
            },
            dataSrc: function(response){      
                console.log(response);    
                if(response.data == "vacio"){ 
                    Notiflix.Report.Warning("Aviso","No existe docentes en este mes o año.", "Cerrar"); 
                    return [];
                }else{
                    return response.data;
                }     
                
            },
            complete: function(data){
                $("#modalLoader").modal("hide");
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
            [20 ,25, 50, 75 , 100],
            [20 ,25, 50, 75 , 100]
        ],
        columns: [
            { 
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: null,
                render: function (data, type, row, meta) {
                    return data.Empleador;
                } 
            },
            { data: null,
                render: function (data, type, row, meta) {
                    return data.cod_prof;
                } 
            },
            { 
                data: null,
                render: function (data, type, row, meta) {
                    return data.Docente;
                } 
            },
            { 
                data: null,
                render: function(data){
                    return data.Cargo;
                }
            },
            {  data: null,
                render: function(data){
                    return data.Profesion;
                }
            },
            { 
                data: null ,
                render: function(data){
                    return data.Telefonos;
                }

            },
            { 
                data: null ,
                render: function(data){
                    return data.Correo;
                }

            },
            { 
                data: null ,
                render: function(data){
                    return data.Turno;
                }

            },
            { 
                data: null ,
                render: function(data){
                    return data.Hora;
                }

            },
            { 
                data: null ,
                render: function(data){
                    return data.Ingreso;
                }

            }
            //,
            // {
            //     data: null,
            //     render: function (data) {                 
            //         return `
            //             <button class='btn boton-tabla btn-warning verProgramacionDocente' type='button' onclick="cargarAlumnosProgramacion('${data.codDocente.trim()}','${data.ciclo}','${data.codTipoEspecialidad}','${data.codEspecialidad}','${data.codLocal}','${data.codCursoM}','${data.aula}','${data.semestre}','${anioProg}','${mesProg}','${data.turno}')"><span class='icon-pencil2'></span></button>                       
            //         `;                               
            //     }
            // }
            
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