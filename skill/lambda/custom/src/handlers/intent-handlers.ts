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
            dialogRequestId: (<any>responseHelper.requestObject.request).requestId,
            messageId: uuid.v4(),
            name: 'Play',
            namespace: 'AudioPlayer'
          },
          payload: {
            audioItem: {
              audioItemId: uuid.v4(),
              stream: {
                beginAtInMilliseconds: 0,
                token: 'audioToken',
                url: process.env.AUDIO_URL,
                urlPlayable: true
              },
              titleSubText1: 'subText1',
              titleSubText2: 'subText2',
              titleText: 'titleText'
            },
            playBehavior: 'REPLACE_ALL',
            source: { name: 'audioPlayerTest' }
          }
        }
      ];
      responseHelper.responseObject.response.shouldEndSession = false;
      break;
    case 'DelayPlayIntent':
      responseHelper.setSimpleSpeech(
        Clova.SpeechBuilder.createSpeechText('遅れてサンプルを再生します。')
      );

      // 型定義が無いのでanyで回避
      responseHelper.responseObject.response.directives = <any>[
        {
          header: {
            dialogRequestId: (<any>responseHelper.requestObject.request).requestId,
            messageId: uuid.v4(),
            name: 'Play',
            namespace: 'AudioPlayer'
          },
          payload: {
            audioItem: {
              audioItemId: uuid.v4(),
              stream: {
                beginAtInMilliseconds: 0,
                url: 'clova:Test',
                urlPlayable: false
              }
            },
            source: {
              name: 'sample'
            },
            playBehavior: 'REPLACE_ALL'
          }
        }
      ];
      responseHelper.responseObject.response.shouldEndSession = true;
      break;
    default:
      responseHelper.setSimpleSpeech(
        Clova.SpeechBuilder.createSpeechText('再生して、と言ってください。')
      );
      responseHelper.setReprompt(
        Clova.SpeechBuilder.createSpeechText('再生して、と言ってください。')
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
        case 'StreamRequested':
          responseHelper.setSimpleSpeech(
            Clova.SpeechBuilder.createSpeechText('追加再生します。')
          );
          // tslint:disable-next-line:no-suspicious-comment
          // TODO: 動かない ドキュメント通り
          responseHelper.responseObject.response.directives = <any>[
            {
              header: {
                namespace: 'AudioPlayer',
                name: 'StreamDeliver',
                dialogRequestId: (<any>responseHelper.requestObject.request).requestId,
                messageId: uuid.v4()
              },
              payload: {
                audioItemId: uuid.v4(),
                stream: {
                  token: (<any>responseHelper.requestObject.request).event.payload.audioStream.token,
                  url: process.env.AUDIO_URL
                }
              }
            }

            // tslint:disable-next-line:no-suspicious-comment
            // TODO: 動かない audioItemの入れ子にしてみる
            // {
            //   header: {
            //     dialogRequestId: (<any>responseHelper.requestObject.request).requestId,
            //     messageId: uuid.v4(),
            //     name: 'StreamDeliver',
            //     namespace: 'AudioPlayer'
            //   },
            //   payload: {
            //     audioItem: {
            //       audioItemId: (<any>responseHelper.requestObject.request).event.payload.audioItemId,
            //       stream: {
            //         token: (<any>responseHelper.requestObject.request).event.payload.audioStream.token,
            //         url: process.env.AUDIO_URL
            //       }
            //     }
            //   }
            // }
          ];
          responseHelper.responseObject.response.shouldEndSession = true;
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
