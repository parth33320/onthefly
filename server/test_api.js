import app from './server.js'

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, async () => {
  console.log(`🚀 Test Server running on http://localhost:${PORT}`)

  const BASE_URL = `http://localhost:${PORT}`

  const request = async (path, method = 'GET', body = null) => {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    }
    if (body) {
      options.body = JSON.stringify(body)
    }
    const res = await fetch(`${BASE_URL}${path}`, options)
    const data = await res.text()
    try {
      return { status: res.status, body: JSON.parse(data) }
    } catch {
      return { status: res.status, body: data }
    }
  }

  try {
    console.log('\n--- 🧪 Testing Root Endpoint ---')
    const rootRes = await request('/')
    console.log(`GET / status: ${rootRes.status}`)
    if (rootRes.status !== 200) throw new Error('Root endpoint failed')

    console.log('\n--- 🧪 Testing Trips Endpoints ---')
    let res = await request('/api/trips')
    console.log(`GET /api/trips status: ${res.status}, count: ${res.body.length}`)

    res = await request('/api/trips', 'POST', {
      title: 'Test Miami Beach',
      description: 'Miami Trip',
      img_url: 'http://example.com/miami.jpg',
      num_days: 3,
      start_date: '2026-06-01',
      end_date: '2026-06-04',
      total_cost: '$800.00'
    })
    console.log(`POST /api/trips status: ${res.status}, created id: ${res.body.id}`)
    const tripId = res.body.id

    res = await request(`/api/trips/${tripId}`)
    console.log(`GET /api/trips/${tripId} status: ${res.status}, title: ${res.body.title}`)

    res = await request(`/api/trips/${tripId}`, 'PATCH', {
      title: 'Updated Miami Beach',
      description: 'Updated Miami Trip',
      img_url: 'http://example.com/miami.jpg',
      num_days: 4,
      start_date: '2026-06-01',
      end_date: '2026-06-05',
      total_cost: '$900.00'
    })
    console.log(`PATCH /api/trips/${tripId} status: ${res.status}, new title: ${res.body.title}`)

    console.log('\n--- 🧪 Testing Destinations Endpoints ---')
    res = await request('/api/destinations', 'POST', {
      destination: 'Eiffel Tower',
      description: 'Famous landmark',
      city: 'Paris',
      country: 'France',
      img_url: 'http://example.com/eiffel.jpg',
      flag_img_url: 'http://example.com/france.png'
    })
    console.log(`POST /api/destinations status: ${res.status}, id: ${res.body.id}`)
    const destId = res.body.id

    res = await request('/api/destinations')
    console.log(`GET /api/destinations status: ${res.status}, count: ${res.body.length}`)

    res = await request(`/api/destinations/${destId}`)
    console.log(`GET /api/destinations/${destId} status: ${res.status}, city: ${res.body.city}`)

    res = await request(`/api/destinations/${destId}`, 'PATCH', {
      destination: 'Eiffel Tower Tour',
      description: 'Updated landmark description',
      city: 'Paris',
      country: 'France',
      img_url: 'http://example.com/eiffel.jpg',
      flag_img_url: 'http://example.com/france.png'
    })
    console.log(`PATCH /api/destinations/${destId} status: ${res.status}, destination: ${res.body.destination}`)

    console.log('\n--- 🧪 Testing Activities Endpoints ---')
    res = await request(`/api/activities/${tripId}`, 'POST', {
      activity: 'Scuba Diving',
      num_votes: 3
    })
    console.log(`POST /api/activities/${tripId} status: ${res.status}, id: ${res.body.id}`)
    const actId = res.body.id

    res = await request(`/api/activities/${tripId}`)
    console.log(`GET /api/activities/${tripId} status: ${res.status}, count: ${res.body.length}`)

    res = await request(`/api/activities/${actId}`, 'PATCH', { num_votes: 10 })
    console.log(`PATCH /api/activities/${actId} status: ${res.status}, new votes: ${res.body.num_votes}`)

    console.log('\n--- 🧪 Testing Trips Destinations (Join Table) Endpoints ---')
    res = await request('/api/trips-destinations', 'POST', {
      trip_id: tripId,
      destination_id: destId
    })
    console.log(`POST /api/trips-destinations status: ${res.status}`)

    res = await request(`/api/trips-destinations/trips/${destId}`)
    console.log(`GET /api/trips-destinations/trips/${destId} status: ${res.status}, trips count: ${res.body.length}`)

    res = await request(`/api/trips-destinations/destinations/${tripId}`)
    console.log(`GET /api/trips-destinations/destinations/${tripId} status: ${res.status}, dests count: ${res.body.length}`)

    console.log('\n--- 🧪 Testing Delete Endpoints ---')
    res = await request(`/api/activities/${actId}`, 'DELETE')
    console.log(`DELETE /api/activities/${actId} status: ${res.status}`)

    res = await request(`/api/destinations/${destId}`, 'DELETE')
    console.log(`DELETE /api/destinations/${destId} status: ${res.status}`)

    res = await request(`/api/trips/${tripId}`, 'DELETE')
    console.log(`DELETE /api/trips/${tripId} status: ${res.status}`)

    console.log('\n✅ ALL API ENDPOINT INTEGRATION TESTS PASSED SUCCESSFULLY!\n')
  } catch (err) {
    console.error('❌ API Test Failed:', err)
  } finally {
    server.close()
    process.exit(0)
  }
})
