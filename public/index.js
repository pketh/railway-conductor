let currentStatus

const updateStatusElement = ({ isLoading, isRunning, isStopped, isUnknown }) => {
  const element = document.querySelector('.status-badge')
  if (isRunning) {
    element.classList.add('running')
    element.innerText = 'Running'
  } else if (isLoading) {
    element.classList.add('loading')
    element.innerText = 'Deploying…'
  } else if (isStopped) {
    element.classList.add('stopped')
    element.innerText = 'Stopped'
  } else if (isLoading) {
    element.classList.add('unknown')
    element.innerText = 'Could not determine status'
  }
}

const updateActionButton = ({ isLoading, isRunning, isStopped, isUnknown }) => {
  const element = document.querySelector('.action-button')
  if (isLoading) {
    element.classList.add('loading')
    element.innerHTML = '<img src="loading.svg"/>'
    return
  }
  element.classList.remove('loading')
  if (isRunning) {
    element.classList.add('stop')
    element.innerHTML = '<img src="stop.svg"/>'
  } else {
    element.classList.add('play')
    element.innerHTML = '<img src="play.svg"/>'
  }
}

const updateStatus = async () => {
  try {
    const response = await fetch('/api/service', {
      method: 'GET',
    })
    const data = await response.json()
    const statusName = data.data.data.serviceInstance.latestDeployment.status
    const loading = ['INITIALIZING', 'PENDING', 'IN_PROGRESS', 'DEPLOYING', 'ROLLING_BACK']
    const running = ['SUCCESS', 'SUCCEEDED']
    const stopped = ['CRASHED', 'FAILED', 'FAILURE', 'TIMEOUT', 'CANCELED', 'CANCELLED']
    const isLoading = loading.includes(statusName)
    const isRunning = running.includes(statusName)
    const isStopped = stopped.includes(statusName)
    const isUnknown = statusName === 'UNKNOWN'
    const status = { isLoading, isRunning, isStopped, isUnknown }
    console.log('🔮', statusName, status)
    updateStatusElement(status)
    updateActionButton(status)
    currentStatus = status
  } catch (error) {
    console.error('🚒 status', error)
    updateStatusElement({ isUnknown: true })
  }
}

const stopService = async () => {
  try {
    const response = await fetch('/api/stop', {
      method: 'GET',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('🚒 stopService', error)
  }
}

const startService = async () => {
  try {
    const response = await fetch('/api/start', {
      method: 'GET',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('🚒 startService', error)
  }
}

const deploymentAction = async () => {
  console.log('🌺',currentStatus)
  const { isLoading, isRunning, isStopped, isUnknown } = currentStatus
  if (isLoading) {
    // do nothing, is already deploying
    return
  } else if (isRunning) {
    updateActionButton({ isLoading: true })
    await stopService()
  } else {
    updateActionButton({ isLoading: true })
    await startService()
  }
  updateStatus()
}

updateStatus()
setInterval(() => {
  updateStatus()
}, 2000) // 2 seconds
