export default {
  async railway (query, options = {}) {
    try {
      const variables = {
        environmentId: process.env.RAILWAY_ENVIRONMENT_ID,
        serviceId: process.env.RAILWAY_SERVICE_ID
      }
      Object.keys(options).forEach(key => {
        variables[key] = options[key]
      })
      const response = await fetch('https://backboard.railway.com/graphql/v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RAILWAY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables
        })
      })
      const data = await response.json()
      console.log('🌺 data', data)
      return data
    } catch (error) {
      console.error('🚒 railway', error)
      throw error
    }
  },

  async service () {
    try {
      const query = `
        query serviceInstance($environmentId: String!, $serviceId: String!) {
          serviceInstance(environmentId: $environmentId, serviceId: $serviceId) {
            __typename
            buildCommand
            builder
            createdAt
            cronSchedule
            deletedAt
            environmentId
            healthcheckPath
            healthcheckTimeout
            id
            isUpdatable
            nextCronRunAt
            nixpacksPlan
            numReplicas
            preDeployCommand
            railpackInfo
            railwayConfigFile
            region
            restartPolicyMaxRetries
            restartPolicyType
            rootDirectory
            serviceId
            serviceName
            sleepApplication
            startCommand
            updatedAt
            upstreamUrl
            watchPatterns
            latestDeployment {
              id
              status
              createdAt
            }
          }
        }
      `
      return this.railway(query)
    } catch (error) {
      throw error
    }
  },
  async start () {
    try {
      const service = await this.service()
      const deploymentId = service.data.serviceInstance.latestDeployment.id
      const query = `
        mutation deploymentRedeploy($id: String!, $usePreviousImageTag: Boolean) {
          deploymentRedeploy(id: $id, usePreviousImageTag: $usePreviousImageTag) {
            __typename
            canRedeploy
            canRollback
            createdAt
            deploymentStopped
            environmentId
            id
            meta
            projectId
            serviceId
            snapshotId
            staticUrl
            status
            suggestAddServiceDomain
            updatedAt
            url
          }
        }
      `
      return this.railway(query, { id: deploymentId, usePreviousImageTag: true })
    } catch (error) {
      throw error
    }
  },
  async stop () {
    const service = await this.service()
    const deploymentId = service.data.serviceInstance.latestDeployment.id
    const query = `
      mutation deploymentStop($id: String!) {
        deploymentStop(id: $id)
      }
    `
    return this.railway(query, { id: deploymentId })
  },
}