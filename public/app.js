const db = firebase.firestore();
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();

const form = document.getElementById('form');
const tasksData = document.getElementById('datosCompletos');

let editTask = false;
let id = '';

/*const animation = document.getElementsById('single_animation');*/

/*
Debo lograr que el capitalRestante se envíe al contador que acabo de crear. Este contador debe registrar el último capital restante 
de la última operación
*/
/*const counter = document.getElementById('counter');*/

function createTask(tipoIngreso, ingresos, tipoGastos, gastos, capitalRestante) {
    db.collection('presupuestos').doc().set({       
        tipoIngreso,
        ingresos,
        tipoGastos,
        gastos,
        capitalRestante
    });
}

const deleteTask = id => db.collection('presupuestos').doc(id).delete(); //Elimina usuario

const getTaskId = (id) => db.collection('presupuestos').doc(id).get();

const updateTask = (id, updatedTask) => db.collection('presupuestos').doc(id).update(updatedTask); 

const getTask = () => db.collection('presupuestos').get(); //Muestra los presupuestos

const onAddition = (callback) => db.collection('presupuestos').onSnapshot(callback);
/**Esta funcion proviene de firebase la cual hace que los datos se actualicen al instante en la página sin necesidad de apretar F5 */


window.addEventListener('DOMContentLoaded', async (e) =>{

    onAddition((querySnapshot) =>{
        tasksData.innerHTML = '';
        querySnapshot.forEach(doc => {
            const tasks = doc.data();
            tasks.id = doc.id;

            tasksData.innerHTML += `
                <div class="form-group" >
                    <table class="table-1" cellpadding="10" width="700px" >
                    <tr>

                    <td>${tasks.tipoIngreso}</td>
                    <td>$${tasks.ingresos}</td>
                    <td>${tasks.tipoGastos}</td>
                    <td>$${tasks.gastos}</td>
                    <td>$${tasks.capitalRestante}</td>

                    </tr>
                    </table>
                    <div class="btn-group">
                    <button class="btn-delete" data-id='${tasks.id}'>Eliminar</button>
                    <button class="btn-edit" data-id='${tasks.id}'>Actualizar</button>
                    </div>
                </div>
                
            `     
            
            const btnDelete = document.querySelectorAll('.btn-delete');
            btnDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    await deleteTask(e.target.dataset.id);
                })
            });

            const btnEdit = document.querySelectorAll('.btn-edit');
            btnEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getTaskId(e.target.dataset.id);
                    const taskId = doc.data();

                    editTask = true;
                    id = doc.id;
                    
                    form['tipo_ingreso'].value = taskId.tipoIngreso;
                    form['ingresos_netos'].value = taskId.ingresos;
                    form['tipo_gastos'].value = taskId.tipoGastos;
                    form['gastos'].value = taskId.gastos;
                    
                })
            })
        })
    })

    
})

form.addEventListener('submit', async e => {
    e.preventDefault();

    let tipoIngreso = form['tipo_ingreso'].value;
    let ingresos = form['ingresos_netos'].value;
    let tipoGastos = form['tipo_gastos'].value;
    let gastos = form['gastos'].value;
    let capitalRestante = ingresos - gastos;

    if(!editTask){
        await createTask( tipoIngreso, ingresos, tipoGastos, gastos, capitalRestante);

        /*
        if(ingresos == null){
            return capitalRestante - gastos;
        }else if(gastos == null){
            return capitalRestante + ingresos;
        }*/
    }else{
        await updateTask(id, {
            tipoIngreso,
            ingresos,
            tipoGastos,
            gastos,
            capitalRestante
        });
        editTask = false;
        id = '';
    }
    
    form.reset();
});


