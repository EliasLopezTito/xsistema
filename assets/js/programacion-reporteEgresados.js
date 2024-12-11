$(document).ready(function(){
        
    tablaEgresados = $("#tablaReporteEgresados").DataTable({
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

})

$('#filtrarEspecialidades').on( 'change', function () {
	tablaEgresados
			.column(5)
			.search( this.value )
			.draw();
	});

$("#frmReporteEgresados").submit(function(e){

    e.preventDefault();
    var form = $(this).serializeArray();
    
    $('#tablaReporteEgresados').dataTable().fnDestroy();
    tablaEgresados = $("#tablaReporteEgresados").DataTable({
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        ajax: {
            url: path + "Programacion/reporteEgresados",
            type: 'POST',
            beforeSend: function(){
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
            },
            data: {
                opcion : "consultar",
                anio : form[0].value,
                mes : form[1].value,
            },
            dataSrc: function(response){                  
                return response.data;
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
            [50, 100], 
            [50, 100]
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
                    return data.ApellidoAlumno+" "+data.NombreAlumno;
                } 
            },
            { data: null,
                render: function (data, type, row, meta) {
                    return data.TipoDoc;
                } 
            },
            { 
                data: null,
                render: function (data, type, row, meta) {
                    return data.Documento;
                } 
            },
            { 
                data: null,
                render: function(data){
                    return data.cod_alumno;
                }
            },
            {  data: null,
                render: function(data){
                    return data.Especialidad;
                }
            },
            { 
                data: null ,
                render: function(data){
                    return data.Provincia;
                }

            },
            { 
                data: null ,
                render: function(data){
                    return data.Distrito;
                }

            },
            { 
                data: null ,
                render: function(data){
                    return data.Direccion;
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
                    return data.Telefono;
                }
            },
            { 
                data: null ,
                render: function(data){
                    return data.FechaNacimiento;
                }

            },
            {
                data: null ,
                render: function(data){
                    /**if( data.acceso === "true") {
                        return `<td>
                            <button class='btn boton-tabla btn-warning' type='button' onclick='editarRegistro(this)' data-id='${data.id}' data-desc="${data.especialidad}" data-local="${data.local}" data-cod-espe="${data.cod_espe}" data-mes="${meses[data.mes]}" data-nombre='${data.nombre}' title='Editar Registro'><span class='icon-pencil2'></span></button>
                        
                            <button class='btn boton-tabla btn-danger' type='button' onclick='eliminarRegistro(this)' data-id='${data.id}' title='Eliminar Registro'><span class='icon-bin'></span></button>
                        </td>`;
                    }else{
                        return "";

                    }**/
                    return "-";
                }
            }
        ],
        /**createdRow : function( row, data, dataIndex ) {
            if ( data.acceso == "true" ) {
                $( row ).addClass( "success" );
            }
        },**/
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

})