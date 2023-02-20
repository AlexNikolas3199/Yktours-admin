import { ExclamationCircleOutlined } from '@ant-design/icons'
import { UPDATE_ONE_ROUTE } from '../gqls/tours'
import { useMutation } from '@apollo/client'
import { Checkbox, Modal, message } from 'antd'
import { useState } from 'react'
import { useUser } from '../utils/hooks'

const VisibleCheckbox = ({ rvisible, id }) => {
  const { user, loading: loadingMe } = useUser()
  const [visible, setvisible] = useState(rvisible)
  const [updateOneRoute, { loading }] = useMutation(UPDATE_ONE_ROUTE, {
    onError: (err) => {
      console.error(err)
      message.error('Не удалось выполнить запрос')
    },
  })

  const doChoose = () => {
    if (!loading && !loadingMe && user?.role?.canUpdateRoute) {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        title: 'Изменить видимость?',
        onOk: doUpdate,
        okText: 'Изменить',
      })
    }
  }

  const doUpdate = () => {
    updateOneRoute({
      variables: {
        where: { id },
        data: { visible: { set: !visible } },
      },
    })
    setvisible(!visible)
  }
  return (
    <Checkbox checked={visible} onChange={doChoose}>
      Видимость
    </Checkbox>
  )
}

export default VisibleCheckbox
