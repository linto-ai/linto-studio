const debug = require('debug')('linto:components:WebServer:controller:transcriptorHandler')
const request = require(`${process.cwd()}/lib/utility/request`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const ConvoModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)


const DEFAULT_INTERVAL_TIMER = 1000 // 10 sec

async function getTranscriptionResult(conversation){
  const result_id = conversation.job.result_id

  let url = `${process.env.STT_HOST}/results/${result_id}`
  const options = {
    headers : {
      accept : 'application/json'
    }
  }
  if(process.env.STT_RESULT_CONVERT_NUMBERS === 'true' || process.env.STT_RESULT_RETURN_RAW === 'true'){
    url += `?`
    if(process.env.STT_RESULT_CONVERT_NUMBERS === 'true')
      url +=`convert_numbers=${process.env.STT_RESULT_CONVERT_NUMBERS}&`
    if(process.env.STT_RESULT_RETURN_RAW === 'true')
      url +=`return_raw=${process.env.STT_RESULT_RETURN_RAW}&`
  }
  
  const result_buffer = await request.get(url, options)
  if(result_buffer){
    const result = JSON.parse(result_buffer)
    conversation = SttWrapper.sttToConversation(result, conversation)
    ConvoModel.update(conversation)
  }
}

async function createJobInterval(conversation){
  const job_id = conversation.job.job_id
  let interval = setInterval(async function() {
    try{
      const job_buffer = await request.get(`${process.env.STT_HOST}/job/${job_id}`)
      const job = JSON.parse(job_buffer)

      conversation.job = {
        ...job,
        job_id : job_id
      }

      if(job.state === 'done' && job.result_id){  //triger last request
        ConvoModel.updateJob(conversation)
        getTranscriptionResult(conversation)

        clearInterval(interval)
      }else {
        ConvoModel.updateJob(conversation)
      }
  
    }catch(err){
      
      conversation.job = {
        job_id : job_id,
        state : 'error',
        err : err
      }

      ConvoModel.updateJob(conversation)
      clearInterval(interval)
      throw new Error(err)
    }
  }, DEFAULT_INTERVAL_TIMER)
}

module.exports = { createJobInterval }