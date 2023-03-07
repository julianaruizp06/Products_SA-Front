import  sw from 'sweetalert2'
const elimi = ({title , text, icon} = {}) => {
  return(
    sw.fire({
      title: 'Estas seguro?',
      text: "no podrás arrepentirte!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, elimina!'
    }).then((result) => {
      if (result.isConfirmed) {
        sw.fire(
          'Eliminar!',
          'Esta seguro de eliminar.',
          'success'
        )
      }
    })
)
}

  export default elimi;