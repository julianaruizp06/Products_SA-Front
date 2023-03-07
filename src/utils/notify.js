import  sw from 'sweetalert2'

const notify = ({title, icon, timer, position} = {}) => {
    return sw.fire({
        position: position || 'center',
        icon: icon || 'success',
        title:  title || 'Realizado con exito',
        timer: timer || 1500 ,
        showConfirmButton: false,   
    })
}

export default notify