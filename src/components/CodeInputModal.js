import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { DELETE_ONE_TICKET, REFUND_INPUT } from '../gqls/tickets'
import { Button, Input, Modal, notification } from 'antd'
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'

const CodeInputModal = ({ ticket, date }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [code, setCode] = useState(0)
  const [inCode, setInCode] = useState(0)
  const [func, setFunc] = useState(() => {})
  const [isLoading, setIsLoading] = useState(false)
  const toggleModal = () => setModalVisible(!modalVisible)

  //удаление билета
  const [deleteTicket] = useMutation(DELETE_ONE_TICKET)

  //возврат билета
  const [refund] = useMutation(REFUND_INPUT, {
    onCompleted: (data) => {
      if (data.refundInput.errorCode === '0') {
        Modal.confirm({
          title: 'Билет возвращен.',
          icon: <CheckCircleOutlined />,
          content: 'Вы успешно произвели возврат. Денежные средства поступят на карту в течение 7-14 дней.',
          onOk: () => window.location.reload(),
          okText: 'Ок',
          cancelButtonProps: { style: { display: 'none' } },
        })
        deleteTicket({ variables: { where: { orderId: ticket?.orderId } } })
      } else {
        setIsLoading(false)
        notification.open({
          message: 'Ошибка',
          description: 'Что-то пошло не так. Попробуйте позже.',
          icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
        })
      }
    },
  })

  //Когда возврат подтвержден
  const onSubmit = () => {
    if (code === Number(inCode)) {
      toggleModal()
      setIsLoading(true)
      func()
    } else {
      setIsLoading(false)
      notification.open({
        message: 'Неверный код',
        description: 'Код неверен. Попробуйте еще раз.',
        icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
      })
    }
  }

  //вернуть процент
  const doChoose = (procent) =>
    Modal.confirm({
      title: 'Вернуть билет.',
      icon: <ExclamationCircleOutlined />,
      content:
        procent > 0 ? `Вернется ${(ticket?.amount * procent) / 100} ₽. Вы уверены что хотите вернуть билет?` : 'Вы уверены что хотите вернуть билет?',
      onOk: () => {
        setCode(Math.round(Math.random() * 10000))
        let func
        if (procent > 0) {
          func = () =>
            refund({
              variables: {
                data: {
                  orderId: ticket?.orderId,
                  amount: ticket?.amount * procent,
                },
              },
            })
        } else {
          func = () =>
            deleteTicket({
              variables: { where: { orderId: ticket?.orderId } },
            })
        }
        setFunc(() => func)
        toggleModal()
      },
      okText: 'Вернуть билет',
    })

  const onReturnTicket = () => {
    const days = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    // const days = 12;
    if (days > 15) doChoose(1)
    if (days > 10 && days <= 15) doChoose(0.8)
    if (days > 5 && days <= 10) doChoose(0.4)
    if (days === 5) doChoose(0.2)
    if (days < 5) doChoose(0)
  }

  return (
    <>
      {Date.now() < Date.parse(date) && (
        <Button loading={isLoading} onClick={onReturnTicket} style={{ paddingVertical: 15, color: 'red' }}>
          Вернуть билет
        </Button>
      )}
      <Modal title='Возврат билета' visible={modalVisible} onOk={onSubmit} onCancel={toggleModal}>
        <div>
          <div style={styles.modText}>Введите код: {code}</div>
          <Input onChange={(p) => setInCode(p.target.value)} style={styles.input} />
        </div>
      </Modal>
    </>
  )
}
const styles = {
  modText: {
    fontSize: 18,
    padding: 15,
  },
  input: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'gray',
    marginHorizontal: 15,
  },
}
export default CodeInputModal
