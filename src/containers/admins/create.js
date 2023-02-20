import { useEffect } from 'react'
import { Button, Form, message, Input, Select } from 'antd'
import Top from '../../components/Top'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../utils/hooks'
import { CREATE_ONE_ADMIN } from '../../gqls/admin'
import { FIND_MANY_ADMIN_ROLE } from '../../gqls/roles'
const { Option } = Select
const requiredRule = { required: true, message: 'Обязательное поле' }
const emailRule = { type: 'email', message: 'Введите правильный Email' }

const CreateOneFreeTime = ({ history }) => {
  const { user, loading: loadingMe } = useUser()

  useEffect(() => {
    if (!user?.role?.canCreateRole) history.goBack()
  })

  const { data, loading: loadingRole } = useQuery(FIND_MANY_ADMIN_ROLE, {
    fetchPolicy: 'network-only',
  })

  const [createOneAdmin, { loading }] = useMutation(CREATE_ONE_ADMIN, {
    onCompleted: () => history.push('/admins'),
    onError: (err) => {
      console.error(err)
      message.error('Не удалось выполнить запрос')
    },
  })

  const handleCreate = (v) => {
    createOneAdmin({ variables: { data: { ...v, role: { connect: { id: v.role } } } } })
  }

  if (loadingMe || loadingRole) return 'Загрузка...'
  if (!user?.role?.canCreateRole) return 'Ошибка'
  const role = data.findManyAdminRole
  return (
    <>
      <Top title='Добавить админа' />
      <div style={{ maxWidth: 500 }}>
        <Form onFinish={handleCreate} layout='vertical'>
          <Form.Item name='name' label='Имя' required>
            <Input />
          </Form.Item>
          <Form.Item name='surname' label='Фамилия' required>
            <Input />
          </Form.Item>
          <Form.Item name='role' label='Роль' required>
            <Select placeholder='Выберите роль'>
              {role.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='email' label='Email' rules={[requiredRule, emailRule]}>
            <Input />
          </Form.Item>
          <Form.Item name='password' label='Пароль' required>
            <Input.Password />
          </Form.Item>
          <Button loading={loading} htmlType='submit' type='primary'>
            Добавить
          </Button>
        </Form>
      </div>
    </>
  )
}

export default CreateOneFreeTime
