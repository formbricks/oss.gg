export const sendInstallationDetails = async (
  installationId: number,
  appId: number,
  repos: unknown
): Promise<unknown> => {
  try {
    console.log("sendInstallationDetails", installationId, appId, repos)

    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(postData),
    // })

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }

    // const data = await response.json()
    return { data: "data" }
  } catch (error) {
    throw new Error(`Failed to post installation details: ${error}`)
  }
}

export const getUser = async (userId: string): Promise<unknown> => {
  //   const url = `${WEB_API}/api/users/${userId}`

  try {
    // const response = await fetch(url)
    // const data = await response.json()
    return { data: "data" }
  } catch (error) {
    throw new Error(`Failed to get user: ${error}`)
  }
}
