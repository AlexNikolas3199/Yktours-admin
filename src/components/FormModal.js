import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'
import { useState } from 'react'
const { Option } = Select
const FormModal = ({ visible, setModVis, passengers, setPass, kids = false }) => {
  const [docType, setDocType] = useState('Паспорт')
  const [form] = Form.useForm()
  const visToggle = () => setModVis(!visible)

  const handleAdd = (v) => {
    const arr = [...passengers]
    arr.push({
      name: v.name,
      surname: v.surname,
      patronymic: v.patronymic,
      dateOfBirth: v.date.toISOString(),
      documentType: v.docType,
      documentNumber: v.docNumber,
      food: v.food,
    })
    setPass(arr)
    visToggle()
    form.resetFields()
  }
  const onDocTypeChange = (e) => {
    form.setFieldsValue({ docNumber: '' })
    setDocType(e)
  }

  const getLength = () => {
    if (docType === 'Паспорт') return 10
    if (docType === 'Свидетельство о рождении') return 9
    return null
  }

  return (
    <Modal title='Добавление пассажира' visible={visible} footer={null} onCancel={visToggle}>
      <Form form={form} onFinish={handleAdd} labelCol={{ span: 8 }}>
        <Form.Item name='surname' rules={[{ required: true }]} label='Фамилия'>
          <Input />
        </Form.Item>
        <Form.Item name='name' rules={[{ required: true }]} label='Имя'>
          <Input />
        </Form.Item>
        <Form.Item name='patronymic' rules={[{ required: true }]} label='Отчество'>
          <Input />
        </Form.Item>
        <Form.Item name='date' rules={[{ required: true }]} label='Дата рождения'>
          <DatePicker />
        </Form.Item>
        <Form.Item name='docType' rules={[{ required: true }]} label='Документ'>
          <Select onChange={(e) => onDocTypeChange(e)} placeholder='Выберите документ'>
            {!kids && <Option value='Паспорт'>Паспорт</Option>}
            <Option value='Свидетельство о рождении'>Свидетельство о рождении</Option>
            <Option value='Заграничный паспорт'>Заграничный паспорт</Option>
            <Option value='Иностранный документ'>Иностранный документ</Option>
          </Select>
        </Form.Item>
        <Form.Item name='docNumber' rules={[{ required: true }]} label='Серия, номер'>
          <Input minLength={getLength()} maxLength={getLength()} />
        </Form.Item>
        <Form.Item name='food' rules={[{ required: true }]} label='Питание'>
          <Select placeholder='Выберите питание'>
            <Option value='Шведский стол'>Шведский стол</Option>
            <Option value='Завтрак'>Завтрак</Option>
            <Option value='Обед'>Обед</Option>
            <Option value='Ужин'>Ужин</Option>
          </Select>
        </Form.Item>
        <div className='flex' style={{ justifyContent: 'flex-end' }}>
          <Button htmlType='submit' type='primary'>
            Добавить
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
export default FormModal
