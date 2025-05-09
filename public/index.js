const updateStatusElement = ({ isLoading, isRunning, isStopped, isUnknown }) => {
  const element = document.querySelector('.status-badge')
  if (isRunning) {
    element.classList.add('success')
    element.innerText = 'Running'
  }
}

const updateStatus = async () => {
  try {
    const response = await fetch('/api/service', {
      method: 'GET',
    })
    const data = await response.json()
    const status = data.data.data.serviceInstance.latestDeployment.status
    const loading = ['INITIALIZING', 'PENDING', 'IN_PROGRESS', 'DEPLOYING', 'ROLLING_BACK']
    const running = ['SUCCESS', 'SUCCEEDED']
    const stopped = ['CRASHED', 'FAILED', 'FAILURE', 'TIMEOUT', 'CANCELED', 'CANCELLED']
    const isLoading = loading.includes(status)
    const isRunning = running.includes(status)
    const isStopped = stopped.includes(status)
    const isUnknown = status === 'UNKNOWN'
    console.log('🔮', status, { isLoading, isRunning, isStopped, isUnknown })
    updateStatusElement({ isLoading, isRunning, isStopped, isUnknown })
    // updateActionButton({ isLoading, isRunning, isStopped, isUnknown })
  } catch (error) {
    console.error('🚒 status', error)
    updateStatusElement({ isUnknown: true })
  }
}


updateStatus()
setInterval(() => {
  updateStatus()
}, 2000) // 2 seconds