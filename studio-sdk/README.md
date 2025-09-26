# LinTO Studio SDK

## Install

**Python**

```sh
pip install linto-studio-sdk
```

**node**

```
npm install linto-studio-sdk
```

**Browser**

```
<script src="https://unpkg.com/linto-studio-sdk@1.0.0/dist/linto-studio-sdk.min.js"></script>
```

## Usage

**Javascript**

```js
import LinTO from "linto-studio-sdk"
// or in browser
const Linto = window.LinTO
```

```js
linto = new LinTO()
// login with a user
await linto.loginAsUser("email@example.com", "password")
// or login with a machine token
await linto.loginAsMachine("token")

await linto.fetchOrganisations() // return organizations list
await linto.fetchASRServices() // return ASR services

linto.uploadFile(yourFile, {
  config: { diarization: true, speaker: 3, lang: "en" },
}) // By default will be upload to your first organization with the first ASR service and his 1st endpoint

// you can specify the organization and the service, plus a complete service config if needed
await linto.uploadFile(yourFile, {
  organizationId: "your-organization-id",
  ASRServiceName: "service-name",
  ASRendpoint: 'endpoint-name'
  ASRPlainConfig: {
    language: "*",
    punctuationConfig: { enablePunctuation: false, serviceName: null },
    diarizationConfig: {
      enableDiarization: false,
      numberOfSpeaker: null,
      maxNumberOfSpeaker: null,
      serviceName: null,
    },
    enableNormalization: true,
    modelType: "whisper",
    vadConfig: { enableVAD: true, methodName: "WebRTC", minDuration: 30 },
  },
})

const status = await linto.getStatus() // use by default the last file you upload
await linto.getStatus({ mediaId: "your-media-id" })

if (status === "done") {
  const result = linto.getResult()
}
```
