import { useEffect } from 'react'
import { Button, Form, message, Input, Checkbox } from 'antd'
import Top from '../../components/Top'
import { useMutation } from '@apollo/client'
import { useUser } from '../../utils/hooks'
import { CREATE_ONE_ADMIN_ROLE } from '../../gqls/roles'
const { TextArea } = Input
const requiredRule = { required: true, message: 'Обязательное поле' }
const initialValues = {
  canViewRoute: false,
  canViewRoutePage: false,
  canCreateRoute: false,
  canUpdateRoute: false,
  canAddBooking: false,
  canDeleteBooking: false,
  canViewRouteHistory: false,
  canCreateRole: false,
  canUpdateRole: false,
  canViewRole: false,
  canViewArrived: false,
  canAddArrived: false,
}

const CreateRole = ({ history }) => {
  const { user, loading: loadingMe } = useUser()

  useEffect(() => {
    if (!user?.role?.canCreateRole) history.goBack()
  })

  const [createOneAdminRole, { loading }] = useMutation(CREATE_ONE_ADMIN_ROLE, {
    onCompleted: () => history.goBack(),
    onError: (err) => {
      console.error(err)
      message.error('Не удалось выполнить запрос')
    },
  })

  const handleCreate = (v) => {
    createOneAdminRole({ variables: { data: v } })
  }

  if (loadingMe) return 'Загрузка...'
  if (!user?.role?.canCreateRole) return 'Ошибка'
  return (
    <>
      <Top title='Добавить роль' />
      <div style={{ maxWidth: 500 }}>
        <Form onFinish={handleCreate} layout='vertical' initialValues={initialValues}>
          <Form.Item name='title' label='Название' rules={[requiredRule]}>
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
      </div>
    </>
  )
}

export default CreateRole
