import { useEffect, useState } from 'react'
import { Button, Form, Input, message, DatePicker, InputNumber, Select } from 'antd'
import { useMutation } from '@apollo/client'
import Top from '../../components/Top'
import { CREATE_ONE_ROUTE } from '../../gqls/tours'
import { UPLOAD } from '../../gqls/upload'
import { useUser } from '../../utils/hooks'
const { TextArea } = Input
const { Option } = Select

const CreateOneRoute = ({ history }) => {
  const { user, loading: loadingMe } = useUser()

  useEffect(() => {
    if (!user?.role?.canCreateRoute) history.goBack()
  })

  const [ship, setShip] = useState(null)
  const [route1, setRoute1] = useState('')
  const [route2, setRoute2] = useState('')
  const [route3, setRoute3] = useState('')
  const [route1Eng, setRoute1Eng] = useState('')
  const [route2Eng, setRoute2Eng] = useState('')
  const [route3Eng, setRoute3Eng] = useState('')
  const [date, setDate] = useState(null)
  const [duration, setDuration] = useState(1)
  const [desc, setDesc] = useState('')
  const [descEng, setDescEng] = useState('')
  const [food1, setFood1] = useState(null)
  const [food2, setFood2] = useState(null)
  const [food3, setFood3] = useState(null)
  const [food4, setFood4] = useState(null)
  const [foodKid1, setFoodKid1] = useState(null)
  const [foodKid2, setFoodKid2] = useState(null)
  const [foodKid3, setFoodKid3] = useState(null)
  const [foodKid4, setFoodKid4] = useState(null)
  const [cabin4, setCabin4] = useState(null)
  const [cabin3, setCabin3] = useState(null)
  const [cabin2, setCabin2] = useState(null)
  const [cabin1, setCabin1] = useState(null)
  const [halfLux, setHalfLux] = useState(null)
  const [lux, setLux] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)

  const [upload, { loading: loading1 }] = useMutation(UPLOAD)

  const getUpload = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    if (validity.valid) setUploadFile(file)
  }

  const [createOneRoute, { loading }] = useMutation(CREATE_ONE_ROUTE, {
    onCompleted: () => {
      window.location.href = `/routes`
    },
    onError: (err) => {
      console.error(err)
      message.error('Не удалось выполнить запрос')
    },
  })
  const handleCreate = () => {
    if (!route1 || !route2) return message.warning('Введите маршрут')
    if (!route1Eng || !route2Eng) return message.warning('Введите маршрут на английском')
    if (!date) return message.warning('Введите дату')
    if (!duration) return message.warning('Введите длительность')
    if (!ship) return message.warning('Выберите судно')
    if (!desc) return message.warning('Введите описание')
    if (!descEng) return message.warning('Введите описание на английском')
    if (!food1 || !food2 || !food3 || !food4) return message.warning('Заполните цены на еду')
    if (!foodKid1 || !foodKid2 || !foodKid3 || !foodKid4) return message.warning('Заполните цены на еду для детей до 2х лет')
    if (!cabin4 || !cabin3 || !cabin2 || !cabin2 || !cabin1 || !halfLux || !lux) return message.warning('Заполните цены на еду для детей до 2х лет')
    if (!uploadFile) return message.warning('Загрузите изображение')
    let routes = [route1.trim(), route2.trim()]
    if (route3 && route3.trim() !== '') routes.push(route3.trim())
    let routesEng = [route1Eng.trim(), route2Eng.trim()]
    if (route3Eng && route3Eng.trim() !== '') routesEng.push(route3Eng.trim())
    const doCreate = (upload) =>
      createOneRoute({
        variables: {
          data: {
            date,
            duration,
            Desc: desc,
            DescEng: descEng,
            image: upload,
            ship: ship,
            route: routes,
            routeEng: routesEng,
            food: [food1, food2, food3, food4],
            foodKids: [foodKid1, foodKid2, foodKid3, foodKid4],
            Pricing: [cabin4, cabin3, cabin2, cabin1, halfLux, lux],
          },
        },
      })
    upload({
      variables: { upload: uploadFile },
      onCompleted: (data) => doCreate('https://yaktors.ru/image/' + data.singleUpload),
      onError: (er) => {
        console.log(er)
      },
    })
  }

  if (loading || loadingMe) return null
  if (!user?.role?.canCreateRoute) return 'Ошибка'
  return (
    <>
      <Top title='Создать круиз' />
      <div style={{ maxWidth: 500 }}>
        <Form layout='vertical'>
          <Form.Item label='Маршрут' required>
            <div className='flex'>
              <Input onChange={(e) => setRoute1(e.target.value)} />
              <Input onChange={(e) => setRoute2(e.target.value)} />
              <Input onChange={(e) => setRoute3(e.target.value)} />
            </div>
            <div>*3 поле - необязательное</div>
          </Form.Item>
          <Form.Item label='Маршрут (Eng)' required>
            <div className='flex'>
              <Input onChange={(e) => setRoute1Eng(e.target.value)} />
              <Input onChange={(e) => setRoute2Eng(e.target.value)} />
              <Input onChange={(e) => setRoute3Eng(e.target.value)} />
            </div>
            <div>*3 поле - необязательное</div>
          </Form.Item>
          <Form.Item label='Дата отплытия' required>
            <DatePicker showTime onChange={(date) => setDate(date.toISOString())} />
          </Form.Item>
          <Form.Item label='Длительность в часах' required>
            <InputNumber min={1} max={200} onChange={setDuration} />
          </Form.Item>
          <Form.Item name='ship' label='Судно' required>
            <Select onChange={(ship) => setShip(ship)} placeholder='Выберите судно'>
              <Option value={1}>МИХАИЛ СВЕТЛОВ</Option>
              <Option value={2}>ДЕМЬЯН БЕДНЫЙ</Option>
            </Select>
          </Form.Item>
          <Form.Item label='Описание' required>
            <TextArea rows={4} onChange={(e) => setDesc(e.target.value)} />
          </Form.Item>
          <Form.Item label='Описание (Eng)' required>
            <TextArea rows={4} onChange={(e) => setDescEng(e.target.value)} />
          </Form.Item>
        </Form>
        <Form labelCol={{ span: 7 }} layout='horizontal'>
          <h3>Цены на еду</h3>
          <Form.Item label='Шведский стол' required>
            <InputNumber min={1} onChange={setFood1} />
          </Form.Item>
          <Form.Item label='Завтрак' required>
            <InputNumber min={1} onChange={setFood2} />
          </Form.Item>
          <Form.Item label='Обед' required>
            <InputNumber min={1} onChange={setFood3} />
          </Form.Item>
          <Form.Item label='Ужин' required>
            <InputNumber min={1} onChange={setFood4} />
          </Form.Item>
          <h3>Цены на еду для детей с 2-11 лет</h3>
          <Form.Item label='Шведский стол' required>
            <InputNumber min={1} onChange={setFoodKid1} />
          </Form.Item>
          <Form.Item label='Завтрак' required>
            <InputNumber min={1} onChange={setFoodKid2} />
          </Form.Item>
          <Form.Item label='Обед' required>
            <InputNumber min={1} onChange={setFoodKid3} />
          </Form.Item>
          <Form.Item label='Ужин' required>
            <InputNumber min={1} onChange={setFoodKid4} />
          </Form.Item>
          <h3>Цены на каюты</h3>
          <Form.Item label='4-местная каюта' required>
            <InputNumber min={1} onChange={setCabin4} />
          </Form.Item>
          <Form.Item label='3-местная каюта' required>
            <InputNumber min={1} onChange={setCabin3} />
          </Form.Item>
          <Form.Item label='2-местная каюта' required>
            <InputNumber min={1} onChange={setCabin2} />
          </Form.Item>
          <Form.Item label='1-местная каюта' required>
            <InputNumber min={1} onChange={setCabin1} />
          </Form.Item>
          <Form.Item label='Полулюкс' required>
            <InputNumber min={1} onChange={setHalfLux} />
          </Form.Item>
          <Form.Item label='Люкс' required>
            <InputNumber min={1} onChange={setLux} />
          </Form.Item>
        </Form>
        <Form layout='vertical'>
          <Form.Item label='Изображение' required>
            <input onChange={getUpload} accept='.png, .jpg, .jpeg' name='myFile' type='file' />
          </Form.Item>
          <Button onClick={handleCreate} loading={loading || loading1} type='primary'>
            Добавить
          </Button>
        </Form>
      </div>
    </>
  )
}

export default CreateOneRoute
