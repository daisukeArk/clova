import * as Clova from '@line/clova-cek-sdk-nodejs';
import * as Handlers from '../handlers/intent-handlers';

export class ClovaExtensionLambda {
  /**
   * AWS Lambda 呼出
   * @param body リクエスト本文
   */
  public async lambda(body: string): Promise<Clova.Clova.ResponseBody> {
    // ペイロード本文パース
    const eventBody = JSON.parse(body);

    // コンテキスト作成
    const context = new Clova.Context(eventBody);

    let requestHandler: any;

    switch (<any>context.requestObject.request.type) {
      case 'LaunchRequest':
        requestHandler = Handlers.launchRequestHandler;
        break;
      case 'IntentRequest':
        requestHandler = Handlers.intentHandler;
        break;
      case 'EventRequest':
        requestHandler = Handlers.eventRequestHandler;
        break;
      case 'SessionEndedRequest':
      default:
        requestHandler = Handlers.sessionEndedRequestHandler;
        break;
    }
    if (requestHandler) {
      // ハンドラ呼出
      await requestHandler.call(context, context);

      return context.responseObject;
    } else {
      const error = new Error(`Unable to find requestHandler for '${context.requestObject.request.type}'`);

      throw error;
    }
  }
}
