import { useQuery } from '@apollo/client'
import Top from '../components/Top'
import { DatePicker, Col, Row, Statistic } from 'antd'
import { useState } from 'react'
import { FIND_MANY_TICKETS } from '../gqls/tickets'
const { RangePicker } = DatePicker
const TodayDate = new Date()

const Main = () => {
  const [dates, setDates] = useState(['2021-11-02T04:07:23.708Z', TodayDate])

  const { data, loading } = useQuery(FIND_MANY_TICKETS, {
    fetchPolicy: 'network-only',
    variables: {
      where: {
        createdAt: dates[0] && { gte: new Date(dates[0]).toISOString(), lte: new Date(dates[1]).toISOString() },
      },
    },
  })

  const getTotal = () => {
    let total = 0
    let appCount = 0
    let webserviceCount = 0
    data?.findManyTicket.forEach((element) => {
      total += element.amount
      if (element.purchasedIn === 'APP') appCount += 1
      if (element.purchasedIn === 'WEBSERVICE') webserviceCount += 1
    })
    const length = data?.findManyTicket.length ? data?.findManyTicket.length : 1
    return { total: total / 100, appCount, webserviceCount, appCountP: (appCount / length) * 100, webserviceCountP: (webserviceCount / length) * 100 }
  }
  return (
    <>
      <Top title='Главная' />
      <RangePicker onChange={(dates, dateStrings) => setDates(dateStrings)} />
      <div style={{ marginTop: 20 }}>
        {loading ? (
          'Загрузка...'
        ) : (
          <div>
            <Row>
              <Col span={12}>
                <Statistic title='Выручка' value={getTotal().total} suffix=' ₽' precision={2} />
              </Col>
              <Col span={12}>
                <Statistic title='Путёвок продано' value={data?.findManyTicket.length} />
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={12}>
                <Statistic title='Куплено в приложении' value={getTotal().appCount} suffix={`/ ${getTotal().appCountP}%`} />
              </Col>
              <Col span={12}>
                <Statistic title='Куплено на сайте' value={getTotal().webserviceCount} suffix={`/ ${getTotal().webserviceCountP}%`} />
              </Col>
            </Row>
          </div>
        )}
      </div>
    </>
  )
}

export default Main
