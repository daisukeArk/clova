import * as Clova from '@line/clova-cek-sdk-nodejs';
import * as uuid from 'uuid';

export const launchRequestHandler = async (responseHelper: Clova.Context) => {
  responseHelper.setSimpleSpeech(
    Clova.SpeechBuilder.createSpeechText('ようこそ')
  );
  responseHelper.setSimpleSpeech(
    Clova.SpeechBuilder.createSpeechText('再生して、と言ってください。'),
    true
  );
};

export const intentHandler = async (responseHelper: Clova.Context) => {
  const intent = responseHelper.getIntentName();

  switch (intent) {
    case 'HelloWorldIntent':
      responseHelper.setSimpleSpeech(
        Clova.SpeechBuilder.createSpeechText('こんにちは')
      );
      responseHelper.setSimpleSpeech(
        Clova.SpeechBuilder.createSpeechText('再生して、と言ってください。'),
        true
      );
      break;
    case 'PlayIntent':
      responseHelper.setSimpleSpeech(
        Clova.SpeechBuilder.createSpeechText('サンプルを再生します。')
      );

      // 型定義が無いのでanyで回避
      responseHelper.responseObject.response.directives = <any>[
        {
          header: {
            namespace: 'AudioPlayer',
            name: 'Play',
            dialogRequestId: (<any>responseHelper.requestObject.request).requestId,
            messageId: uuid.v4()
          },
          payload: {
            audioItem: {
              audioItemId: uuid.v4(),
              stream: {
                beginAtInMilliseconds: 0,
                url: process.env.AUDIO_URL,
                urlPlayable: true
              }
            },
            source: {
              name: 'sample'
            },
            playBehavior: 'REPLACE_ALL'
          }
        }
      ];
      break;
    default:
      responseHelper.setSimpleSpeech(
        Clova.SpeechBuilder.createSpeechText('再生して、と言ってください。')
      );
      responseHelper.setSimpleSpeech(
        Clova.SpeechBuilder.createSpeechText('再生して、と言ってください。'),
        true
      );
      break;
  }
};

export const eventRequestHandler = async (responseHelper: Clova.Context) => {
  // 型定義が無いのでanyで回避
  const namespace = (<any>responseHelper.requestObject.request).event.namespace;
  const name = (<any>responseHelper.requestObject.request).event.name;

  switch (namespace) {
    case 'AudioPlayer':

      switch (name) {
        case 'PlayFinished':
          responseHelper.setSimpleSpeech(
            Clova.SpeechBuilder.createSpeechText('再生終了しました。')
          );
          responseHelper.setSimpleSpeech(
            Clova.SpeechBuilder.createSpeechText('再生して、と言ってください。'),
            true
          );
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
};

export const sessionEndedRequestHandler = async (responseHelper: Clova.Context) => {
  responseHelper.endSession();
};
