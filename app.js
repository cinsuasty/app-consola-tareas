require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { 
    inquirerMenu, 
    pausa, 
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist
} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');

const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) { // cargas tareas
        tareas.cargarTareasFromArray(tareasDB);
    }
    do{
        // Imprimir el menú
        opt = await inquirerMenu();
        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
            break;
            case '2':
                tareas.listadoCompleto();
            break;
            case '3':
                tareas.listadoPendientesCompletadas(true);
            break;
            case '4':
                tareas.listadoPendientesCompletadas(false);
            break;
            case '5':
                const ids = await mostrarListadoChecklist(tareas.listadoArr); 
                tareas.toggleCompletadas(ids);
            break;
            case '6':
                const idsd = await listadoTareasBorrar(tareas.listadoArr);
                if (idsd.length !== 0) {
                    const ok = await confirmar('¿Estás seguro?')
                    if (ok) {
                        tareas.borrarTareas(idsd);
                        console.log('Tareas borrada'.green);
                    }else{
                        console.log('Tareas no borradas'.blue);
                    }   
                }else{
                    console.log('No se selecciono ninguna tarea para borrar'.yellow);
                }
            break;
        }
        guardarDB(tareas.listadoArr);
        await pausa();
    }while(opt !== '0');
}
main();