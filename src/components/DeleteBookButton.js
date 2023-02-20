import { Button, Popconfirm } from 'antd'
import { useState } from 'react'

const DeleteBookButton = ({ title, onConfirm, closeModal, disabled }) => {
  const [visible, setVisible] = useState(false)
  const visibleToggle = () => setVisible(!visible)
  const handler = () => {
    onConfirm()
    visibleToggle()
    setTimeout(closeModal, 100)
  }
  return (
    <Popconfirm title={title} visible={visible} onCancel={visibleToggle} onConfirm={handler}>
      <Button disabled={disabled} danger ghost type='primary' onClick={visibleToggle}>
        Удалить
      </Button>
    </Popconfirm>
  )
}
export default DeleteBookButton
