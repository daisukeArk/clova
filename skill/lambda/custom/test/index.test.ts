import { Conversation, IConversationCondition, IRequestCondition } from '@daisukeark/clova-conversation-model-assert';
import * as CEK from '@line/clova-cek-sdk-nodejs';
import * as Handlers from '../src/handlers/intent-handlers';

const clovaHandler = CEK.Client
  .configureSkill()
  .onLaunchRequest(Handlers.launchRequestHandler)
  .onIntentRequest(Handlers.intentHandler)
  .onSessionEndedRequest(Handlers.sessionEndedRequestHandler)
  .handle();

const condition: IConversationCondition = {
  handler: clovaHandler,
  description: 'テストフレームワーク テスト'
};

Conversation.init(condition)
  .launchRequest()
  .equal('ようこそ')
  .sessionEndedRequest()
  .end();

Conversation.init(condition)
  .launchRequest()
  .requestIntent('HelloWorldIntent')
  .equal('こんにちは')
  .end();

Conversation.init(condition)
  .launchRequest()
  .requestIntent('PlayIntent')
  .equal('サンプルを再生します。')
  .end();

Conversation.init(condition)
  .launchRequest()
  .requestIntent('NotFoundIntent')
  .equal('再生して、と言ってください。')
  .sessionEndedRequest()
  .end();
