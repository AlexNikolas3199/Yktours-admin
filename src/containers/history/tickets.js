import { useQuery } from '@apollo/client'
import Top from '../../components/Top'
import { Button, Modal, Tabs } from 'antd'
import { FIND_MANY_ROUTE } from '../../gqls/tours'
import MidPlace from '../../components/MidPlace'
import BotPlace from '../../components/BotPlace'
import LegendWrap from '../../components/Legend'
import { useEffect, useState } from 'react'
import PassengerItem from '../../components/PassengerItemHistory'
import FormModal from '../../components/FormModal'
import { useUser } from '../../utils/hooks'
const { TabPane } = Tabs

const Tickets = ({ match, history }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modVis, setModVis] = useState(false)
  const [passengers, setPassengers] = useState([])
  const [number, setNumber] = useState(null)
  const [isBooked, setIsBooked] = useState(null)
  const [isBookedAdmin, setIsBookedAdmin] = useState(null)

  const modalToggle = () => setIsModalVisible(!isModalVisible)

  const { user, loading: loadingMe } = useUser()
  const { id } = match.params

  useEffect(() => {
    if (!user?.role?.canViewRouteHistory) history.goBack()
  })

  const { data, loading } = useQuery(FIND_MANY_ROUTE, {
    fetchPolicy: 'network-only',
    variables: { where: { id: { equals: id } } },
  })

  if (loading || loadingMe) return 'Загрузка...'
  if (!data) return 'Ошибка'
  const routeTur = data?.findManyRoute[0]

  const onTapHandler = (number, isBooked, isBookedAdmin) => {
    setNumber(number)
    setIsBooked(isBooked)
    setIsBookedAdmin(isBookedAdmin)
    modalToggle()
  }

  return (
    <>
      <Top title='Каюты' />
      <Tabs type='card'>
        <TabPane tab='Нижняя палуба' key='1'>
          <LegendWrap routeTur={routeTur}>
            <BotPlace onTap={onTapHandler} routeTur={routeTur} />
          </LegendWrap>
        </TabPane>
        <TabPane tab='Средняя палуба' key='2'>
          <LegendWrap routeTur={routeTur}>
            <MidPlace onTap={onTapHandler} routeTur={routeTur} />
          </LegendWrap>
        </TabPane>
      </Tabs>
      {isBooked ? (
        <Modal
          title={'Каюта ' + number}
          visible={isModalVisible}
          onCancel={modalToggle}
          footer={[
            <Button key='close' type='primary' onClick={modalToggle}>
              Закрыть
            </Button>,
          ]}
        >
          <h3>Пассажиры:</h3>
          {isBooked?.passengers.map((item) => (
            <PassengerItem key={item.id} item={item} />
          ))}
        </Modal>
      ) : (
        <Modal
          title={'Каюта ' + number}
          visible={isModalVisible}
          onCancel={modalToggle}
          footer={[
            <Button key='close' type='primary' onClick={modalToggle}>
              Закрыть
            </Button>,
          ]}
        >
          <FormModal visible={modVis} setModVis={setModVis} passengers={passengers} setPass={setPassengers} />
          <h3>Прошедший тур</h3>
          {isBookedAdmin?.passengers.map((item, index) => (
            <PassengerItem key={`${index}`} item={item} />
          ))}
        </Modal>
      )}
    </>
  )
}
export default Tickets
