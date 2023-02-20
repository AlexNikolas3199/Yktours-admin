import { useEffect } from 'react'
import { Button, Form, message, Input, Checkbox } from 'antd'
import Top from '../../components/Top'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../utils/hooks'
import { DELETE_ONE_ADMIN_ROLE, FIND_UNIQUE_ADMIN_ROLE, UPDATE_ONE_ADMIN_ROLE } from '../../gqls/roles'
const { TextArea } = Input

const UpdateRole = ({ match, history }) => {
  const { id } = match.params
  const { user, loading: loadingMe } = useUser()

  useEffect(() => {
    if (!user?.role?.canUpdateRole) history.goBack()
  })

  const { data, loading: loadingRole } = useQuery(FIND_UNIQUE_ADMIN_ROLE, {
    fetchPolicy: 'network-only',
    variables: { where: { id } },
  })

  const onCompleted = () => history.goBack()

  const onError = (err) => {
    console.error(err)
    message.error('Не удалось выполнить запрос')
  }

  const [updateOneAdminRole, { loading }] = useMutation(UPDATE_ONE_ADMIN_ROLE, {
    onCompleted,
    onError,
  })

  const [deleteOneAdminRole, { loading: loadingDel }] = useMutation(DELETE_ONE_ADMIN_ROLE, {
    onCompleted,
    onError,
  })

  const handleCreate = (v) => {
    const getData = (name) => {
      return { set: v[name] ? v[name] : role[name] }
    }
    const obj = {}
    for (let key of Object.keys(v)) {
      obj[key] = getData(key)
    }
    updateOneAdminRole({
      variables: {
        where: { id },
        data: obj,
      },
    })
  }

  const deleteAdminRole = () => {
    let isRight = window.confirm('Вы уверены, что хотите удалить данные?')
    if (isRight) deleteOneAdminRole({ variables: { where: { id } } })
  }

  if (loadingMe || loadingRole) return 'Загрузка...'
  if (!user?.role?.canUpdateRole) return 'Ошибка'
  const role = data?.findUniqueAdminRole

  return (
    <>
      <Top title='Добавить роль' />
      <div style={{ maxWidth: 500 }}>
        <Form onFinish={handleCreate} layout='vertical' initialValues={role}>
          <Form.Item name='title' label='Название'>
            <Input />
          </Form.Item>
          <Form.Item name='description' label='Описание'>
            <TextArea rows={4} />
          </Form.Item>
          <h3>Права:</h3>
          <Form.Item name='canViewRoute' valuePropName='checked'>
            <Checkbox>К списку круизов</Checkbox>
          </Form.Item>
          <Form.Item name='canViewRoutePage' valuePropName='checked'>
            <Checkbox>К каютам круизов</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canViewRouteHistory'>
            <Checkbox>К истории круизов</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canViewArrived'>
            <Checkbox>К списку пассажиров круиза</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canAddArrived'>
            <Checkbox>Отметить пассажира</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canCreateRoute'>
            <Checkbox>Создать круиз</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canUpdateRoute'>
            <Checkbox>Изменить круиз</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canAddBooking'>
            <Checkbox>Бронировать каюту</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canDeleteBooking'>
            <Checkbox>Снять бронирование каюты</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canViewRole'>
            <Checkbox>К списку ролей</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canCreateRole'>
            <Checkbox>Создать роль</Checkbox>
          </Form.Item>
          <Form.Item valuePropName='checked' name='canUpdateRole'>
            <Checkbox>Изменить роль</Checkbox>
          </Form.Item>

          <Button loading={loading} htmlType='submit' type='primary'>
            Добавить
          </Button>
        </Form>
        <div style={{ paddingTop: 30 }}>
          <hr />
          <Button danger ghost loading={loading || loadingDel} onClick={deleteAdminRole} type='primary'>
            Удалить
          </Button>
        </div>
      </div>
    </>
  )
}

export default UpdateRole
