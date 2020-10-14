const TikTokScraper = require('tiktok-scraper')

exports.gcpservice = (req, res) => {
  (async () => {
    try {
      const url = req.body.data.videoUrl
      const videoData = await TikTokScraper.getVideoMeta(url, null)
      const response = {
        data: {
          result: videoData.diggCount
        },
        status: 'completed'
      }

      res.status(200).send({
        jobRunID: 1,
        data: response.data,
        result: response.data.result,
        statusCode: 200
      })
    } catch (error) {
      callback(500, Requester.errored(jobRunID, error))
      res.status(500).send({
        jobRunID: 1,
        status: 'errored',
        error: new AdapterError(error),
        statusCode: 500
      })
    }
  })()
}

